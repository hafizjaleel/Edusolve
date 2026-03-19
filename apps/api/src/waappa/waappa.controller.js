import { WaappaService } from './waappa.service.js';
import { sendJson, readJson, getBearerToken } from '../common/http.js';
import { AuthService } from '../auth/auth.service.js';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
// Optionally you can import upload function from S3 if you want to permanently store media.
// import { uploadToS3 } from '../common/upload.js'; // Assuming it's there, if not we'll just store the temporary one or implement upload.

const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
const waappaService = new WaappaService();
const authService = new AuthService();

// Simple in-memory LRU cache to reduce Supabase queries for webhook contacts
const waContactCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache duration

export class WaappaController {

    async handleRequest(req, res, url) {
        // Webhook - No Auth
        if (url.pathname === '/waappa/webhook' && req.method === 'POST') {
            return this.handleWebhook(req, res);
        }

        // QR image - No Auth (img tags can't send Bearer headers)
        if (url.pathname.match(/^\/waappa\/sessions\/([^\/]+)\/qr$/) && req.method === 'GET') {
            const parts = url.pathname.split('/');
            const sessionId = parts[parts.length - 2];
            return this.getQR(req, res, sessionId);
        }

        // Require Auth for all below
        const rawRole = req.headers['x-user-role'];
        if (!rawRole) return sendJson(res, 401, { error: 'Unauthorized' });

        const user = { ok: true, role: rawRole, id: req.headers['x-user-id'] };

        // Session Management Endpoints
        if (url.pathname === '/waappa/sessions' && req.method === 'GET') {
            return this.getSession(req, res, user);
        }
        if (url.pathname === '/waappa/sessions' && req.method === 'POST') {
            return this.createSession(req, res, user);
        }
        if (url.pathname.match(/^\/waappa\/sessions\/([^\/]+)\/(start|stop|delete)$/) && req.method === 'POST') {
            const parts = url.pathname.split('/');
            const action = parts[parts.length - 1];
            const sessionId = parts[parts.length - 2];
            return this.manageSession(req, res, sessionId, action);
        }

        // Chat / Messages Endpoints
        if (url.pathname === '/waappa/contacts' && req.method === 'GET') {
            return this.getContacts(req, res, user);
        }
        if (url.pathname === '/waappa/messages' && req.method === 'GET') {
            const phone = url.searchParams.get('phone');
            return this.getMessages(req, res, user, phone);
        }
        if (url.pathname === '/waappa/messages/send' && req.method === 'POST') {
            return this.sendMessage(req, res, user);
        }
        if (url.pathname === '/waappa/messages/upload' && req.method === 'POST') {
            return this.uploadMedia(req, res);
        }
        if (url.pathname === '/waappa/campaigns/send' && req.method === 'POST') {
            return this.sendCampaign(req, res);
        }
        if (url.pathname.match(/^\/waappa\/messages\/([^\/]+)\/media$/) && req.method === 'GET') {
            const parts = url.pathname.split('/');
            const messageId = parts[parts.length - 2];
            return this.downloadMedia(req, res, messageId);
        }

        return false; // Route not handled here
    }

    // --- Campaign Methods ---

    async sendCampaign(req, res) {
        try {
            const n8nUrl = process.env.N8N_CAMPAIGN_WEBHOOK_URL;
            if (!n8nUrl) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, error: 'N8N_CAMPAIGN_WEBHOOK_URL not set in server env' }));
                return true;
            }
            const body = await readJson(req);
            const webhookRes = await fetch(n8nUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const text = await webhookRes.text();
            res.writeHead(webhookRes.ok ? 200 : 502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: webhookRes.ok, status: webhookRes.status, response: text }));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: e.message }));
        }
        return true;
    }

    // --- Session Methods ---

    async getSession(req, res, user = {}) {
        try {
            let query = supabase.from('whatsapp_sessions').select('*');
            
            // Filter by user_id if provided
            if (user.id) {
                query = query.eq('user_id', user.id);
            }

            const { data, error } = await query
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            if (error) throw error;
            return sendJson(res, 200, { ok: true, session: data });
        } catch (e) {
            console.error(e);
            return sendJson(res, 500, { error: 'Failed to fetch session' });
        }
    }

    async createSession(req, res, user = {}) {
        try {
            const body = await readJson(req);
            const displayName = body.sessionName || 'coordinator'; // Coordinator email slug (for display)
            const webhookUrl = body.webhookUrl || `http://${req.headers.host}/waappa/webhook`;

            const sessionData = await waappaService.createSession(displayName, webhookUrl);
            // Waappa returns the REAL session id (e.g. Q2BQ8RRZ) — this is what webhooks identify sessions by
            const waappaSessionId = sessionData.session_id || sessionData.name || displayName;
            const apiKey = sessionData.api_key;

            console.log('[createSession] Waappa response:', JSON.stringify(sessionData));

            // session_name = real Waappa ID (used in all API calls + webhook matching)
            // display_name = coordinator email (for UI)
            const { data, error } = await supabase.from('whatsapp_sessions').upsert({
                session_name: waappaSessionId,
                display_name: displayName,
                api_key: apiKey,
                status: 'STARTING',
                webhook_url: webhookUrl,
                user_id: user.id || null
            }).select().single();

            if (error) throw error;

            // Configure webhook events using real session id
            await waappaService.configureWebhookEvents(waappaSessionId, webhookUrl);

            // Auto-start
            try {
                await waappaService.startSession(waappaSessionId);
                await supabase.from('whatsapp_sessions').update({ status: 'SCAN_QR_CODE' }).eq('session_name', waappaSessionId);
                data.status = 'SCAN_QR_CODE';
            } catch (startErr) {
                console.error('[createSession] auto-start failed:', startErr.message);
            }

            return sendJson(res, 200, { ok: true, session: data });
        } catch (e) {
            console.error('[createSession]', e.message);
            return sendJson(res, 500, { error: e.message });
        }
    }

    async manageSession(req, res, sessionId, action) {
        try {
            // sessionId from URL is already the real Waappa session ID (session_name in DB)
            if (action === 'start') await waappaService.startSession(sessionId);
            if (action === 'stop') await waappaService.stopSession(sessionId);
            if (action === 'delete') {
                await waappaService.deleteSession(sessionId);
                await supabase.from('whatsapp_sessions').delete().eq('session_name', sessionId);
            }
            return sendJson(res, 200, { ok: true, message: `Session ${action} successful` });
        } catch (e) {
            console.error(e);
            return sendJson(res, 500, { error: e.message });
        }
    }

    async getQR(req, res, sessionId) {
        try {
            // sessionId from URL is already the real Waappa session ID
            const response = await waappaService.getQR(sessionId);
            const buf = Buffer.from(await response.arrayBuffer());

            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Cache-Control': 'no-cache, no-store',
                'Content-Length': buf.length,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(buf);
            return true;
        } catch (e) {
            console.error('[getQR]', e.message);
            return sendJson(res, 500, { error: e.message });
        }
    }

    // --- Messages Methods ---

    async getContacts(req, res, user = {}) {
        try {
            // 1. Find user session first
            let sessionName = null;
            if (user.id) {
                const { data: sess } = await supabase.from('whatsapp_sessions').select('session_name').eq('user_id', user.id).maybeSingle();
                sessionName = sess?.session_name;
            }

            // 2. Fetch messages for that session
            let query = supabase
                .from('whatsapp_messages')
                .select('contact_phone, contact_type, from_jid, to_jid');
            
            if (sessionName) {
                query = query.eq('session_name', sessionName);
            }

            const { data, error } = await query.order('timestamp', { ascending: false });

            if (error) throw error;

            // Manual distinct & formatting
            const map = new Map();
            for (const m of data) {
                if (!m.contact_phone) continue;
                if (!map.has(m.contact_phone)) {
                    // Attempt to find full name in our CRM based on contact type
                    let name = m.contact_phone;
                    if (m.contact_type === 'student') {
                        const { data: st } = await supabase.from('students').select('full_name').eq('phone_number', name).maybeSingle();
                        if (st) name = st.full_name;
                    } else if (m.contact_type === 'teacher') {
                        // Basic fetch just to get user names
                        const { data: tu } = await supabase.from('users').select('full_name').eq('email', `${name}@placeholder.com`).maybeSingle(); // simplified approach
                        // Note: You really need a cleaner cross reference to teacher phones
                    }

                    map.set(m.contact_phone, {
                        id: m.from_jid !== `${m.contact_phone}@c.us` ? m.from_jid : m.to_jid,
                        phone: m.contact_phone,
                        type: m.contact_type,
                        name: name, // Placeholder until joined properly with DB
                    });
                }
            }

            return sendJson(res, 200, { ok: true, contacts: Array.from(map.values()) });
        } catch (e) {
            console.error(e);
            return sendJson(res, 500, { error: e.message });
        }
    }

    async getMessages(req, res, user, chatId) {
        try {
            const url = new URL(req.url, `http://localhost`);
            const phone = url.searchParams.get('phone') || chatId;
            if (!phone) return sendJson(res, 400, { error: 'phone required' });

            // 1. Find user session first
            let sessionName = null;
            if (user.id) {
                const { data: sess } = await supabase.from('whatsapp_sessions').select('session_name').eq('user_id', user.id).maybeSingle();
                sessionName = sess?.session_name;
            }

            const limit = Math.min(parseInt(url.searchParams.get('limit') || '15', 10), 50);
            const offset = parseInt(url.searchParams.get('offset') || '0', 10);

            // Fetch total count
            let countQuery = supabase
                .from('whatsapp_messages')
                .select('*', { count: 'exact', head: true })
                .eq('contact_phone', phone);
            
            if (sessionName) countQuery = countQuery.eq('session_name', sessionName);
            const { count } = await countQuery;

            // Fetch latest `limit` rows, paginated via offset from the END
            let dataQuery = supabase
                .from('whatsapp_messages')
                .select('*')
                .eq('contact_phone', phone)
                .order('timestamp', { ascending: false })
                .range(offset, offset + limit - 1);
            
            if (sessionName) dataQuery = dataQuery.eq('session_name', sessionName);
            const { data, error } = await dataQuery;

            if (error) throw error;

            // Reverse so oldest-first in the response (chat order)
            const messages = (data || []).reverse();
            return sendJson(res, 200, { ok: true, messages, total: count, hasMore: (offset + limit) < count });
        } catch (e) {
            console.error(e);
            return sendJson(res, 500, { error: e.message });
        }
    }

    async sendMessage(req, res, user = {}) {
        try {
            let { chatId, text, sessionName, mediaUrl, mediaName, mimetype, caption } = await readJson(req);
            if (!chatId) throw new Error('chatId required');
            if (!text && !mediaUrl) throw new Error('text or mediaUrl required');

            // Normalize chatId: only replace @s.whatsapp.net with @c.us — leave @lid and @c.us untouched
            if (chatId.endsWith('@s.whatsapp.net')) {
                chatId = chatId.replace('@s.whatsapp.net', '@c.us');
            }

            // Look up the session — use provided sessionName or get the most recent active one for the user
            let query = supabase.from('whatsapp_sessions').select('session_name, api_key').eq('status', 'WORKING');
            if (sessionName) {
                query = query.eq('session_name', sessionName);
            } else if (user.id) {
                query = query.eq('user_id', user.id);
            }
            
            const { data: sessionData, error: sessErr } = await query.order('updated_at', { ascending: false }).limit(1).maybeSingle();

            if (sessErr || !sessionData) throw new Error('No active WhatsApp session found');
            if (!sessionData.api_key) throw new Error('Session api_key is missing in DB — re-create session or update api_key manually');

            if (mediaUrl) {
                const mediaRes = await waappaService.sendMedia(sessionData.session_name, sessionData.api_key, chatId, mediaUrl, mimetype, caption || text || '', mediaName);
                const sentMsgId = mediaRes?.data?.id || mediaRes?.id || mediaRes?.response?.id || mediaRes?.messageId || mediaRes?.[0]?.id;

                if (sentMsgId) {
                    await supabase.from('whatsapp_messages').insert({
                        id: sentMsgId,
                        session_name: sessionData.session_name,
                        from_jid: sessionData.session_name,
                        to_jid: chatId,
                        from_me: true,
                        body: caption || text || '',
                        has_media: true,
                        media_url: mediaUrl,
                        media_name: mediaName,
                        media_type: mimetype,
                        sender_role: 'coordinator',
                        contact_type: 'unknown',
                        contact_phone: chatId.split('@')[0],
                        timestamp: Math.floor(Date.now() / 1000)
                    }).catch(e => console.error('[waappa sendMessage] DB Pre-insert Error:', e.message));
                }
            } else {
                await waappaService.sendText(sessionData.session_name, sessionData.api_key, chatId, text);
            }
            return sendJson(res, 200, { ok: true });
        } catch (e) {
            console.error('[sendMessage]', e.message);
            return sendJson(res, 500, { error: e.message });
        }
    }

    async uploadMedia(req, res) {
        try {
            // Accept base64 encoded file from frontend
            const { base64, filename, mimetype } = await readJson(req);
            if (!base64 || !mimetype) throw new Error('base64 and mimetype required');

            const buffer = Buffer.from(base64, 'base64');
            const ext = mimetype.split('/')[1]?.split(';')[0] || 'bin';
            let safeFilename = (filename || `upload.${ext}`).replace(/[^a-zA-Z0-9.-]/g, '_');
            const key = `whatsapp/sent/${Date.now()}-${safeFilename}`;

            const { Upload } = await import('@aws-sdk/lib-storage');
            const { s3, R2_BUCKET } = await import('../common/s3.js');

            const upload = new Upload({
                client: s3,
                params: { Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: mimetype }
            });
            await upload.done();

            const publicUrl = process.env.R2_PUBLIC_URL ? `${process.env.R2_PUBLIC_URL}/${key}` : key;
            return sendJson(res, 200, { ok: true, url: publicUrl, mimetype });
        } catch (e) {
            console.error('[uploadMedia]', e.message);
            return sendJson(res, 500, { error: e.message });
        }
    }

    async downloadMedia(req, res, messageId) {
        try {
            // Find the message
            const { data: msgRow, error: findErr } = await supabase.from('whatsapp_messages').select('id').eq('id', messageId).maybeSingle();
            if (findErr || !msgRow) throw new Error('Message not found');

            const uploadRes = await waappaService.downloadAndStoreMedia(messageId);
            if (uploadRes && uploadRes.url) {
                // Update DB with the new media info
                await supabase.from('whatsapp_messages').update({
                    media_url: uploadRes.url,
                    media_type: uploadRes.mimetype
                }).eq('id', messageId);

                return sendJson(res, 200, { ok: true, mediaUrl: uploadRes.url, mediaType: uploadRes.mimetype });
            }
            throw new Error('No url returned from Waappa decrypt');
        } catch (e) {
            console.error('[downloadMedia] Error:', e.message);
            return sendJson(res, 500, { error: e.message });
        }
    }

    // --- Webhook Handler ---

    async handleWebhook(req, res) {
        try {
            const body = await readJson(req);
            const { event, session, payload, me } = body;

            if (!event || !payload) return sendJson(res, 400, { error: 'Invalid Payload' });

            // 1. Session Status
            if (event === 'session.status') {
                const status = payload.status;
                let updateData = { session_name: session, status };

                // If WORKING, fetch the profile for name/phone/pic
                if (status === 'WORKING') {
                    try {
                        const profile = await waappaService.getProfile(session);
                        if (profile) {
                            updateData.push_name = profile.name;
                            updateData.connected_phone = profile.phone;
                            updateData.profile_pic_url = profile.profilePicUrl || null;
                        }
                    } catch (e) {
                        console.warn('[webhook] profile fetch failed:', e.message);
                    }
                } else {
                    // For other statuses, use the me field if present
                    const pushName = me?.pushName;
                    const connectedPhone = me?.id?.split('@')[0];
                    if (pushName) updateData.push_name = pushName;
                    if (connectedPhone) updateData.connected_phone = connectedPhone;
                }

                await supabase.from('whatsapp_sessions').upsert(updateData, { onConflict: 'session_name' });
                return sendJson(res, 200, { ok: true });
            }

            // 2. Message Ack
            if (event === 'message.ack') {
                const ackVal = payload.ack;
                const ackName = payload.ackName;

                // _data.MessageIDs may contain multiple messages acknowledged in one batch (e.g. bulk READ)
                // Build the full message IDs from MessageIDs bare IDs + the session/JID prefix from payload.id
                const rawIds = payload?._data?.MessageIDs;
                let idsToUpdate = [];

                if (rawIds && rawIds.length > 0 && payload.id) {
                    // Reconstruct full IDs: "false_57690067845318@lid_<bare_id>"
                    const prefix = payload.id.split('_').slice(0, 2).join('_'); // e.g. "false_57690067845318@lid"
                    idsToUpdate = rawIds.map(bareId => `${prefix}_${bareId}`);
                } else if (payload.id) {
                    idsToUpdate = [payload.id];
                }

                if (idsToUpdate.length > 0) {
                    await supabase.from('whatsapp_messages').update({
                        ack: ackVal,
                        ack_name: ackName
                    }).in('id', idsToUpdate);
                    console.log(`[webhook ack] Updated ${idsToUpdate.length} message(s) to ack=${ackVal} (${ackName})`);
                }
                return sendJson(res, 200, { ok: true });
            }

            // 3. Incoming Message
            if (event === 'message' || event === 'message.any') {
                let { id, timestamp, from, to, fromMe, body: msgBody, hasMedia, ack, ackName, source, media } = payload;

                let mediaUrl = null;
                let mediaType = null;
                let mediaName = media?.filename || payload?._data?.Message?.documentWithCaptionMessage?.message?.documentMessage?.fileName || payload?._data?.Message?.documentWithCaptionMessage?.message?.documentMessage?.title || null;

                // Decrypt Media and Store to R2 (ASYNC - DO NOT AWAIT)
                // If we await this here, Waappa's webhook timeout might trigger and cause fetch ConnectTimeoutError
                if (hasMedia) {
                    waappaService.downloadAndStoreMedia(id).then(async (uploadRes) => {
                        if (uploadRes && uploadRes.url) {
                            console.log(`[webhook async] Successfully downloaded media for ${id}`);
                            await supabase.from('whatsapp_messages').update({
                                media_url: uploadRes.url,
                                media_type: uploadRes.mimetype
                            }).eq('id', id);
                        }
                    }).catch(e => {
                        // If we sent this file via API, Waappa cannot decrypt it. This is expected.
                        if (fromMe && e.message.includes('No decryptable media found')) {
                            // Silently ignore to prevent log spam
                            return;
                        }
                        console.error(`[webhook async media error for ${id}]:`, e.message);
                    });
                }

                let contactJidRaw = payload?._data?.Info?.Chat;
                if (!contactJidRaw) {
                    if (from && from.includes('@g.us')) contactJidRaw = from;
                    else if (to && to.includes('@g.us')) contactJidRaw = to;
                    else contactJidRaw = fromMe ? (to || from) : from;
                }

                if (!contactJidRaw) {
                    return sendJson(res, 200, { ok: true, skipped: 'no JID' });
                }

                // --- Handle LID & Phone Extractor ---
                let finalPhone = null; // The exact @c.us or @g.us
                let skipReason = null;
                let isGroup = false;

                if (contactJidRaw.includes('@g.us')) {
                    // It's a group message
                    finalPhone = contactJidRaw;
                    isGroup = true;
                } else if (contactJidRaw.includes('@lid')) {
                    // It's an @lid. 
                    const { data: cachedContact } = await supabase.from('whatsapp_contacts').select('phone_number').eq('lid', contactJidRaw).maybeSingle();
                    if (cachedContact && cachedContact.phone_number) {
                        finalPhone = cachedContact.phone_number;
                    } else {
                        try {
                            const { data: sessRow } = await supabase.from('whatsapp_sessions').select('api_key').eq('session_name', session).maybeSingle();
                            const resolved = sessRow?.api_key ? await waappaService.getPhoneNumberByLid(session, contactJidRaw, sessRow.api_key) : null;
                            if (resolved && resolved.pn) {
                                finalPhone = resolved.pn;
                                try { await supabase.from('whatsapp_contacts').upsert({ lid: contactJidRaw, phone_number: finalPhone }); } catch (e) { }
                            } else {
                                skipReason = `Waappa could not resolve LID ${contactJidRaw}`;
                            }
                        } catch (lidErr) { skipReason = `LID API error: ${lidErr.message}`; }
                    }
                } else if (contactJidRaw.includes('@c.us') || /^\d+$/.test(contactJidRaw.split('@')[0])) {
                    finalPhone = contactJidRaw.includes('@c.us') ? contactJidRaw : `${contactJidRaw}@c.us`;
                } else {
                    skipReason = "Unknown contact JID format";
                }

                if (!finalPhone) {
                    console.log(`[webhook msg] SKIPPED - ${skipReason}`);
                    return sendJson(res, 200, { ok: true, skipped: skipReason });
                }

                let contactType = null;
                let contactPhoneToStore = null;

                // Cache check
                const cacheKey = `wa_contact_${finalPhone}`;
                const cachedContact = waContactCache.get(cacheKey);

                if (cachedContact && (Date.now() - cachedContact.timestamp) < CACHE_TTL) {
                    contactType = cachedContact.contactType;
                    contactPhoneToStore = cachedContact.contactPhoneToStore;
                } else {
                    if (isGroup) {
                        // Check if it's a student group
                        const { data: stData } = await supabase
                            .from('students')
                            .select('id, group_jid')
                            .eq('group_jid', finalPhone)
                            .maybeSingle();

                        if (stData) {
                            contactType = 'student';
                            contactPhoneToStore = finalPhone; // Store the @g.us as the contact phone
                        }
                    } else {
                        // Check if it's a teacher personal number
                        const cleanDigits = finalPhone.split('@')[0].replace(/[^0-9]/g, '');
                        const last10 = cleanDigits.slice(-10);
                        if (last10 && last10.length >= 10) {
                            const { data: teacherData } = await supabase
                                .from('teacher_profiles')
                                .select('id')
                                .ilike('phone', `%${last10}%`)
                                .limit(1);

                            if (teacherData && teacherData.length > 0) {
                                contactType = 'teacher';
                                contactPhoneToStore = last10;
                            }
                        }
                    }

                    // Save to cache if found
                    if (contactType) {
                        waContactCache.set(cacheKey, { contactType, contactPhoneToStore, timestamp: Date.now() });

                        // Prevent Map from growing indefinitely (basic garbage collection of oldest keys)
                        if (waContactCache.size > 1000) {
                            const firstKey = waContactCache.keys().next().value;
                            if (firstKey) waContactCache.delete(firstKey);
                        }
                    }
                }

                // Strictly skip if it's neither a known student group nor a known teacher
                if (!contactType) {
                    console.log(`[webhook msg] SKIPPED - Contact is neither a known student group nor a teacher: ${finalPhone}`);
                    return sendJson(res, 200, { ok: true, skipped: 'unauthorized contact type' });
                }

                console.log(`[webhook msg] STORING message from/to ${contactPhoneToStore} (${contactType})`);

                // Upsert Message
                const upsertData = {
                    id,
                    session_name: session,
                    timestamp,
                    from_jid: from || '',
                    to_jid: to || '',
                    from_me: fromMe,
                    body: msgBody,
                    has_media: hasMedia,
                    ack: ack,
                    ack_name: ackName || null,
                    source: source,
                    contact_phone: contactPhoneToStore,
                    contact_type: contactType
                };

                // Only include media fields if we actually fetched them or they exist
                // This prevents overwriting pre-populated media_url from send-material with null
                if (mediaUrl) upsertData.media_url = mediaUrl;
                if (mediaType) upsertData.media_type = mediaType;
                if (mediaName) upsertData.media_name = mediaName;

                const { error: upsertErr } = await supabase.from('whatsapp_messages').upsert(upsertData);

                if (upsertErr) {
                    console.error('[webhook msg] DB UPSERT FAILED:', upsertErr);
                } else {
                    console.log(`[webhook msg] DB UPSERT SUCCESS for message ID: ${id}`);
                }

                return sendJson(res, 200, { ok: true });
            }

            return sendJson(res, 200, { ok: true, skipped: true });
        } catch (e) {
            console.error('[Webhook Error]', e);
            return sendJson(res, 500, { error: e.message });
        }
    }

}

export const waappaController = new WaappaController();
