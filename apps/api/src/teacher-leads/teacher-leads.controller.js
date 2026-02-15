import { getSupabaseAdminClient } from '../config/supabase.js';
import { readJson, sendJson } from '../common/http.js';

const nowIso = () => new Date().toISOString();

function actorFromHeaders(req) {
    const rawRole = req.headers['x-user-role'];
    const rawId = req.headers['x-user-id'];
    return {
        role: typeof rawRole === 'string' ? rawRole : 'unknown',
        userId: typeof rawId === 'string' ? rawId : ''
    };
}

const TC_ROLES = ['teacher_coordinator', 'super_admin'];

export async function handleTeacherLeads(req, res, url) {
    if (!url.pathname.startsWith('/teacher-leads')) return false;

    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
        sendJson(res, 500, { ok: false, error: 'supabase admin is not configured' });
        return true;
    }

    const actor = actorFromHeaders(req);
    if (!TC_ROLES.includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'teacher coordinator role required' });
        return true;
    }

    const parts = url.pathname.split('/').filter(Boolean);

    try {
        // GET /teacher-leads — list all
        if (req.method === 'GET' && parts.length === 1) {
            const { data, error } = await adminClient
                .from('teacher_leads')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            sendJson(res, 200, { ok: true, items: data || [] });
            return true;
        }

        // GET /teacher-leads/:id — get single
        if (req.method === 'GET' && parts.length === 2) {
            const id = parts[1];
            if (id === 'stats') {
                // GET /teacher-leads/stats
                const { data, error } = await adminClient
                    .from('teacher_leads')
                    .select('status');
                if (error) throw new Error(error.message);
                const stats = {};
                (data || []).forEach(r => { stats[r.status] = (stats[r.status] || 0) + 1; });
                sendJson(res, 200, { ok: true, stats });
                return true;
            }
            const { data, error } = await adminClient
                .from('teacher_leads')
                .select('*')
                .eq('id', id)
                .maybeSingle();
            if (error) throw new Error(error.message);
            if (!data) {
                sendJson(res, 404, { ok: false, error: 'teacher lead not found' });
                return true;
            }
            sendJson(res, 200, { ok: true, lead: data });
            return true;
        }

        // GET /teacher-leads/:id/history
        if (req.method === 'GET' && parts.length === 3 && parts[2] === 'history') {
            const id = parts[1];
            const { data, error } = await adminClient
                .from('teacher_lead_history')
                .select('*')
                .eq('teacher_lead_id', id)
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            sendJson(res, 200, { ok: true, items: data || [] });
            return true;
        }

        // POST /teacher-leads — create
        if (req.method === 'POST' && parts.length === 1) {
            const payload = await readJson(req);
            if (!payload.full_name) {
                sendJson(res, 400, { ok: false, error: 'full_name is required' });
                return true;
            }
            const { data, error } = await adminClient
                .from('teacher_leads')
                .insert({
                    full_name: payload.full_name,
                    email: payload.email || null,
                    phone: payload.phone || null,
                    subject: payload.subject || null,
                    experience_level: payload.experience_level || 'fresher',
                    qualification: payload.qualification || null,
                    status: 'sourced',
                    coordinator_id: actor.userId,
                    notes: payload.notes || null,
                    created_at: nowIso(),
                    updated_at: nowIso()
                })
                .select('*')
                .single();
            if (error) throw new Error(error.message);

            // Insert history
            await adminClient.from('teacher_lead_history').insert({
                teacher_lead_id: data.id,
                old_status: null,
                new_status: 'sourced',
                changed_by: actor.userId,
                note: 'Lead created',
                created_at: nowIso()
            });

            sendJson(res, 201, { ok: true, lead: data });
            return true;
        }

        // PATCH /teacher-leads/:id — update status or details
        if (req.method === 'PATCH' && parts.length === 2) {
            const id = parts[1];
            const payload = await readJson(req);

            const { data: current, error: fetchError } = await adminClient
                .from('teacher_leads')
                .select('*')
                .eq('id', id)
                .maybeSingle();
            if (fetchError) throw new Error(fetchError.message);
            if (!current) {
                sendJson(res, 404, { ok: false, error: 'teacher lead not found' });
                return true;
            }

            const updates = { updated_at: nowIso() };
            if (payload.full_name) updates.full_name = payload.full_name;
            if (payload.email !== undefined) updates.email = payload.email;
            if (payload.phone !== undefined) updates.phone = payload.phone;
            if (payload.subject !== undefined) updates.subject = payload.subject;
            if (payload.experience_level) updates.experience_level = payload.experience_level;
            if (payload.qualification !== undefined) updates.qualification = payload.qualification;
            if (payload.notes !== undefined) updates.notes = payload.notes;
            if (payload.status) updates.status = payload.status;

            const { data, error } = await adminClient
                .from('teacher_leads')
                .update(updates)
                .eq('id', id)
                .select('*')
                .single();
            if (error) throw new Error(error.message);

            // Log status change
            if (payload.status && payload.status !== current.status) {
                await adminClient.from('teacher_lead_history').insert({
                    teacher_lead_id: id,
                    old_status: current.status,
                    new_status: payload.status,
                    changed_by: actor.userId,
                    note: payload.reason || `Status changed to ${payload.status}`,
                    created_at: nowIso()
                });
            }

            sendJson(res, 200, { ok: true, lead: data });
            return true;
        }

        // POST /teacher-leads/:id/convert — convert to teacher in pool
        if (req.method === 'POST' && parts.length === 3 && parts[2] === 'convert') {
            const id = parts[1];
            const payload = await readJson(req);

            const { data: lead, error: leadError } = await adminClient
                .from('teacher_leads')
                .select('*')
                .eq('id', id)
                .maybeSingle();
            if (leadError) throw new Error(leadError.message);
            if (!lead) {
                sendJson(res, 404, { ok: false, error: 'teacher lead not found' });
                return true;
            }

            if (!payload.user_id) {
                sendJson(res, 400, { ok: false, error: 'user_id required (the auth user id for this teacher)' });
                return true;
            }

            // Generate teacher code
            const { data: existing } = await adminClient
                .from('teacher_profiles')
                .select('teacher_code')
                .not('teacher_code', 'is', null)
                .order('created_at', { ascending: false })
                .limit(200);
            let maxNum = 0;
            for (const row of existing || []) {
                const num = Number((row.teacher_code || '').replace(/^TCR/i, ''));
                if (Number.isFinite(num) && num > maxNum) maxNum = num;
            }
            const teacherCode = `TCR${String(maxNum + 1).padStart(6, '0')}`;

            // Check if profile exists
            const { data: existingProfile } = await adminClient
                .from('teacher_profiles')
                .select('*')
                .eq('user_id', payload.user_id)
                .maybeSingle();

            let teacherProfile;
            if (existingProfile) {
                const { data: updated, error: ue } = await adminClient
                    .from('teacher_profiles')
                    .update({
                        is_in_pool: true,
                        experience_level: lead.experience_level || existingProfile.experience_level,
                        per_hour_rate: payload.per_hour_rate ?? existingProfile.per_hour_rate,
                        updated_at: nowIso()
                    })
                    .eq('id', existingProfile.id)
                    .select('*')
                    .single();
                if (ue) throw new Error(ue.message);
                teacherProfile = updated;
            } else {
                const { data: created, error: ce } = await adminClient
                    .from('teacher_profiles')
                    .insert({
                        user_id: payload.user_id,
                        teacher_code: teacherCode,
                        experience_level: lead.experience_level || null,
                        per_hour_rate: payload.per_hour_rate ?? null,
                        is_in_pool: true,
                        created_at: nowIso(),
                        updated_at: nowIso()
                    })
                    .select('*')
                    .single();
                if (ce) throw new Error(ce.message);
                teacherProfile = created;
            }

            // Mark lead as onboarded + link to teacher profile
            await adminClient
                .from('teacher_leads')
                .update({ status: 'onboarded', converted_teacher_id: teacherProfile.id, updated_at: nowIso() })
                .eq('id', id);

            await adminClient.from('teacher_lead_history').insert({
                teacher_lead_id: id,
                old_status: lead.status,
                new_status: 'onboarded',
                changed_by: actor.userId,
                note: `Converted to teacher ${teacherProfile.teacher_code || teacherProfile.id}`,
                created_at: nowIso()
            });

            sendJson(res, 200, { ok: true, teacher: teacherProfile });
            return true;
        }

        sendJson(res, 404, { ok: false, error: 'route not found' });
        return true;
    } catch (error) {
        sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
        return true;
    }
}
