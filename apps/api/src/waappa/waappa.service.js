import { env } from '../config/env.js';
import { s3, R2_BUCKET } from '../common/s3.js';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'crypto';

export class WaappaService {
    constructor() {
        this.baseUrl = env.waappaBaseUrl || process.env.WAAPPA_BASE_URL || 'http://localhost:3001';
        this.masterKey = env.waappaMasterKey || process.env.WAAPPA_MASTER_KEY;
    }

    getHeaders(apiKey = null) {
        // Waappa uses Authorization for BOTH master key and session api key
        return {
            'Content-Type': 'application/json',
            'Authorization': apiKey || this.masterKey,
            'Accept': 'application/json',
        };
    }

    // --- Helpers ---

    async fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return res;
        } catch (e) {
            clearTimeout(id);
            if (e.name === 'AbortError') throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
            throw e;
        }
    }

    // --- Admin Methods (Uses Master Key) ---

    async createSession(name, webhookUrl) {
        const res = await this.fetchWithTimeout(`${this.baseUrl}/admin/sessions`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ name, webhook_url: webhookUrl }),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Waappa createSession failed (${res.status}): ${errText}`);
        }
        return await res.json();
    }

    async startSession(name) {
        const res = await this.fetchWithTimeout(`${this.baseUrl}/admin/sessions/${name}/start`, {
            method: 'POST',
            headers: this.getHeaders(),
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Waappa startSession failed (${res.status}): ${errText}`);
        }
    }

    async stopSession(name) {
        const res = await this.fetchWithTimeout(`${this.baseUrl}/admin/sessions/${name}/stop`, {
            method: 'POST',
            headers: this.getHeaders(),
        });
        if (!res.ok) throw new Error(`Waappa stopSession failed: ${res.statusText}`);
    }

    async deleteSession(name) {
        const res = await this.fetchWithTimeout(`${this.baseUrl}/admin/sessions/${name}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        if (!res.ok) throw new Error(`Waappa deleteSession failed: ${res.statusText}`);
    }

    async configureWebhookEvents(name, webhookUrl) {
        // PATCH the session config — matches exact Waappa API format
        const res = await this.fetchWithTimeout(`${this.baseUrl}/admin/sessions/${name}/config`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({
                webhook_url: webhookUrl,
                config: {
                    webhooks: [
                        {
                            url: webhookUrl,
                            events: ['session.status', 'message.any', 'message.ack']
                        }
                    ],
                    ignore: {
                        status: true,     // ignore WhatsApp status updates
                        channels: true,   // ignore channel/newsletter messages
                        broadcast: true,  // ignore broadcast lists
                        groups: false     // keep group messages (handled by skip logic)
                    }
                }
            })
        });
        if (!res.ok) {
            const errText = await res.text().catch(() => res.statusText);
            console.warn(`[Waappa] configureWebhookEvents failed (${res.status}): ${errText}`);
        } else {
            console.log(`[Waappa] webhook events configured for session: ${name}`);
        }
    }

    async getQR(name) {
        const res = await fetch(`${this.baseUrl}/admin/sessions/${name}/qr`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (!res.ok) throw new Error(`Waappa getQR failed (${res.status}): ${res.statusText}`);
        return res;
    }

    async getProfile(name) {
        const res = await this.fetchWithTimeout(`${this.baseUrl}/admin/sessions/${name}/profile`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (!res.ok) return null; // Non-fatal
        return await res.json(); // { name, phone, profilePicUrl, status }
    }

    async getPhoneNumberByLid(session, lid, apiKey) {
        // Enforce using the full lid as requested (e.g., 225112255148212@lid)
        const encodedLid = encodeURIComponent(lid);
        const res = await fetch(`${this.baseUrl}/api/${session}/lids/${encodedLid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': apiKey,
            },
        });
        if (!res.ok) {
            const errText = await res.text().catch(() => '');
            console.error(`[Waappa] getPhoneNumberByLid failed [${res.status}]: ${errText}`);
            if (res.status === 404) return null;
            throw new Error(`Waappa getPhoneNumberByLid failed: ${res.statusText}`);
        }
        return await res.json(); // { lid, pn }
    }

    // --- Actions Methods (Uses Session API Key) ---

    async sendText(session, apiKey, chatId, text) {
        const res = await fetch(`${this.baseUrl}/api/sendText`, {
            method: 'POST',
            headers: this.getHeaders(apiKey),
            body: JSON.stringify({ session, chatId, text })
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Waappa sendText failed: ${res.statusText} - ${errText}`);
        }
        return await res.json();
    }

    async sendMedia(session, apiKey, chatId, mediaUrl, mimetype, caption = '') {
        let endpoint = 'sendImage';
        if (mimetype?.startsWith('video/')) endpoint = 'sendVideo';
        else if (mimetype?.startsWith('audio/')) endpoint = 'sendVoice';
        else if (!mimetype?.startsWith('image/')) endpoint = 'sendFile';

        // Waappa body: { session, chatId, file: { url, mimetype, filename }, caption }
        const filename = caption || `media.${mimetype?.split('/')[1] || 'bin'}`;
        const body = {
            session,
            chatId,
            caption,
            file: {
                url: mediaUrl,
                mimetype: mimetype || 'application/octet-stream',
                filename
            }
        };
        if (endpoint === 'sendVoice') body.convert = true; // Required for some audio formats

        const res = await fetch(`${this.baseUrl}/api/${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(apiKey),
            body: JSON.stringify(body)
        });
        const responseText = await res.text();
        if (!res.ok) {
            throw new Error(`Waappa sendMedia failed: ${res.statusText} - ${responseText}`);
        }
        return JSON.parse(responseText);
    }

    async downloadAndStoreMedia(messageId) {
        // 1. Get temporary decrypted URL from Waappa
        const res = await fetch(`${this.baseUrl}/api/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId })
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Waappa media decrypt failed: ${res.statusText} - ${errText}`);
        }

        const responseJson = await res.json();
        const { media_url: tempUrl } = responseJson;
        if (!tempUrl) throw new Error('No temporary URL returned from Waappa');

        // 2. Download the file as a stream
        const mediaRes = await fetch(tempUrl);
        if (!mediaRes.ok) throw new Error(`Failed to download decrypted media from ${tempUrl}`);

        // Detect mimetype: prefer Content-Type header, then URL extension
        let mimetype = mediaRes.headers.get('content-type')?.split(';')[0]?.trim();
        if (!mimetype || mimetype === 'application/octet-stream') {
            // Try to guess from the URL extension
            const urlPath = new URL(tempUrl).pathname;
            const urlExt = urlPath.split('.').pop()?.toLowerCase();
            const extMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', mp4: 'video/mp4', mov: 'video/quicktime', avi: 'video/x-msvideo', mp3: 'audio/mpeg', ogg: 'audio/ogg', opus: 'audio/opus', aac: 'audio/aac', pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
            mimetype = extMap[urlExt] || 'application/octet-stream';
        }

        const ext = mimetype.split('/')[1]?.split(';')[0]?.replace('jpeg', 'jpg') || 'bin';
        const safeFilename = `media.${ext}`;
        const key = `whatsapp/${randomUUID()}-${safeFilename}`;

        // 3. Upload stream to R2
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: R2_BUCKET,
                Key: key,
                Body: mediaRes.body,
                ContentType: mimetype
            },
        });

        await upload.done();

        const publicUrl = process.env.R2_PUBLIC_URL
            ? `${process.env.R2_PUBLIC_URL}/${key}`
            : key;

        return { url: publicUrl, key, mimetype };
    }
}
