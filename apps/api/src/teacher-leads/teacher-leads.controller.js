import { getSupabaseAdminClient, getSupabaseAuthClient } from '../config/supabase.js';
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

// ─── Helper: Generate Teacher Code ───
async function generateTeacherCode(adminClient) {
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2);
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const mmm = monthNames[date.getMonth()];

    // Get exact count of existing teachers for sequential numbering
    const { count, error } = await adminClient
        .from('teacher_profiles')
        .select('*', { count: 'exact', head: true });
    
    if (error) throw new Error(error.message);
    const sequence = (count || 0) + 1;
    return `T${yy}${mmm}${String(sequence).padStart(3, '0')}`; // e.g., T26FEB042
}

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

        // GET /teacher-leads/rejection-reasons
        if (req.method === 'GET' && parts.length === 2 && parts[1] === 'rejection-reasons') {
            const { data, error } = await adminClient
                .from('rejection_reasons')
                .select('*')
                .order('reason', { ascending: true });
            if (error) throw new Error(error.message);
            sendJson(res, 200, { ok: true, items: data || [] });
            return true;
        }

        // GET /teacher-leads/next-teacher-code
        if (req.method === 'GET' && parts.length === 2 && parts[1] === 'next-teacher-code') {
            const code = await generateTeacherCode(adminClient);
            sendJson(res, 200, { ok: true, teacherCode: code });
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
            if (!payload.full_name || !payload.phone) {
                sendJson(res, 400, { ok: false, error: 'full_name and phone are required' });
                return true;
            }
            const { data, error } = await adminClient
                .from('teacher_leads')
                .insert({
                    full_name: payload.full_name,
                    email: payload.email || null,
                    phone: payload.phone,
                    subjects: Array.isArray(payload.subjects) ? JSON.stringify(payload.subjects) : '[]',
                    boards: Array.isArray(payload.boards) ? JSON.stringify(payload.boards) : '[]',
                    mediums: Array.isArray(payload.mediums) ? JSON.stringify(payload.mediums) : '[]',
                    experience_level: payload.experience_level || 'fresher',
                    experience_type: payload.experience_type || null,
                    experience_duration: payload.experience_duration || null,
                    qualification: payload.qualification || null,
                    place: payload.place || null,
                    city: payload.city || null,
                    status: 'new',
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
                new_status: 'new',
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
            if (payload.subjects !== undefined) updates.subjects = Array.isArray(payload.subjects) ? JSON.stringify(payload.subjects) : payload.subjects;
            if (payload.boards !== undefined) updates.boards = Array.isArray(payload.boards) ? JSON.stringify(payload.boards) : payload.boards;
            if (payload.mediums !== undefined) updates.mediums = Array.isArray(payload.mediums) ? JSON.stringify(payload.mediums) : payload.mediums;
            if (payload.experience_level) updates.experience_level = payload.experience_level;
            if (payload.experience_type !== undefined) updates.experience_type = payload.experience_type;
            if (payload.experience_duration !== undefined) updates.experience_duration = payload.experience_duration;
            if (payload.qualification !== undefined) updates.qualification = payload.qualification;
            if (payload.place !== undefined) updates.place = payload.place;
            if (payload.city !== undefined) updates.city = payload.city;
            if (payload.notes !== undefined) updates.notes = payload.notes;
            // Interview Schedule
            if (payload.interview_date !== undefined) updates.interview_date = payload.interview_date;
            if (payload.interview_time !== undefined) updates.interview_time = payload.interview_time;
            if (payload.second_interview_date !== undefined) updates.second_interview_date = payload.second_interview_date;
            if (payload.second_interview_time !== undefined) updates.second_interview_time = payload.second_interview_time;
            // Account details
            if (payload.account_holder_name !== undefined) updates.account_holder_name = payload.account_holder_name;
            if (payload.account_number !== undefined) updates.account_number = payload.account_number;
            if (payload.ifsc_code !== undefined) updates.ifsc_code = payload.ifsc_code;
            if (payload.gpay_holder_name !== undefined) updates.gpay_holder_name = payload.gpay_holder_name;
            if (payload.gpay_number !== undefined) updates.gpay_number = payload.gpay_number;
            if (payload.upi_id !== undefined) updates.upi_id = payload.upi_id;
            if (payload.rejection_reason !== undefined) updates.rejection_reason = payload.rejection_reason;
            if (payload.communication_level !== undefined) updates.communication_level = payload.communication_level;
            if (payload.status) updates.status = payload.status;

            // Validate required fields when approving
            if (payload.status === 'approved') {
                const merged = { ...current, ...updates };
                if (!merged.communication_level) {
                    sendJson(res, 400, { ok: false, error: 'communication_level is required for approval' });
                    return true;
                }
            }

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

            if (!payload.email || !payload.password) {
                sendJson(res, 400, { ok: false, error: 'email and password are required to create teacher login' });
                return true;
            }

            // Helper to format Postgres Array literal: {val1,val2}
            const toPgArray = (arr) => {
                if (typeof arr === 'string' && arr.trim().startsWith('[')) {
                    try { arr = JSON.parse(arr); } catch (e) { }
                }
                if (!Array.isArray(arr) || arr.length === 0) return '{}';
                return `{${arr.map(s => `"${(s || '').replace(/"/g, '\\"')}"`).join(',')}}`;
            };

            // Create Auth User
            // Reuse adminClient if it has service role (it should)
            const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
                email: payload.email,
                password: payload.password,
                email_confirm: true,
                user_metadata: { role: 'teacher', full_name: lead.full_name }
            });

            if (userError) {
                // If user exists, we cannot proceed as easy (or we link existing user)? 
                // Assumption: New email implies new user. If exists, show error.
                sendJson(res, 400, { ok: false, error: `Failed to create login: ${userError.message}` });
                return true;
            }
            const newUserId = userData.user.id;

            // Ensure public.users record exists (Trigger might be missing or delayed)
            const { error: publicUserError } = await adminClient
                .from('users')
                .insert({
                    id: newUserId,
                    email: payload.email,
                    full_name: lead.full_name,
                    is_active: true,
                    created_at: nowIso(),
                    updated_at: nowIso()
                });
            
            if (publicUserError) {
                // Ignore if already exists (dublicate key) but log if other error
                if (!publicUserError.message.includes('duplicate key')) {
                     console.error('Failed to create public user:', publicUserError);
                }
            }

            // Generate Teacher Code
            const teacherCode = await generateTeacherCode(adminClient);

            // Create Teacher Profile
            // Create Teacher Profile
            const payloadInsert = {
                user_id: newUserId,
                teacher_code: teacherCode,
                experience_level: lead.experience_level || null,
                per_hour_rate: payload.per_hour_rate ?? null,
                is_in_pool: true,
                phone: lead.phone || null,
                qualification: lead.qualification || null,
                subjects_taught: toPgArray(lead.subjects),
                syllabus: toPgArray(lead.boards),
                languages: toPgArray(lead.mediums),
                experience_duration: lead.experience_duration || null,
                experience_type: lead.experience_type || null,
                place: lead.place || null,
                city: lead.city || null,
                communication_level: lead.communication_level || null,
                account_holder_name: lead.account_holder_name || null,
                account_number: lead.account_number || null,
                ifsc_code: lead.ifsc_code || null,
                gpay_holder_name: lead.gpay_holder_name || null,
                gpay_number: lead.gpay_number || null,
                upi_id: lead.upi_id || null,
                created_at: nowIso(),
                updated_at: nowIso()
            };
            console.log('Insert Payload:', payloadInsert);

            const { data: teacherProfile, error: ce } = await adminClient
                .from('teacher_profiles')
                .insert(payloadInsert)
                .select('*')
                .single();
            if (ce) {
                console.error('Error creating teacher profile:', ce);
                throw new Error(ce.message);
            }

            console.log('Converting Lead:', lead.id, lead.full_name);
            console.log('Lead Data:', { subjects: lead.subjects, boards: lead.boards, mediums: lead.mediums });
            
            // Mark lead as converted and closed
            await adminClient
                .from('teacher_leads')
                .update({ 
                    converted_teacher_id: teacherProfile.id, 
                    status: 'closed', // Move to closed tab
                    updated_at: nowIso() 
                })
                .eq('id', id);

            await adminClient.from('teacher_lead_history').insert({
                teacher_lead_id: id,
                old_status: lead.status,
                new_status: 'closed',
                changed_by: actor.userId,
                note: `Converted to teacher ${teacherCode} (Login Created)`,
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
