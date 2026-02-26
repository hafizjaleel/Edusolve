import { getSupabaseAdminClient } from '../config/supabase.js';
import { readJson, sendJson } from '../common/http.js';

const ALLOWED_ROLES = ['academic_coordinator', 'teacher_coordinator', 'super_admin'];

function actorFromHeaders(req) {
    const rawRole = req.headers['x-user-role'];
    return typeof rawRole === 'string' ? rawRole : 'unknown';
}

export async function handleSubjectsBoards(req, res, url) {
    if (!url.pathname.startsWith('/subjects') && !url.pathname.startsWith('/boards') && !url.pathname.startsWith('/mediums')) return false;

    const adminClient = getSupabaseAdminClient();
    if (!adminClient) { sendJson(res, 500, { ok: false, error: 'supabase not configured' }); return true; }

    const role = actorFromHeaders(req);
    if (!ALLOWED_ROLES.includes(role)) { sendJson(res, 403, { ok: false, error: 'insufficient role' }); return true; }

    // ─── SUBJECTS ───
    if (url.pathname === '/subjects' || url.pathname.startsWith('/subjects/')) {
        const idMatch = url.pathname.match(/^\/subjects\/([^/]+)$/);

        // GET /subjects
        if (req.method === 'GET' && url.pathname === '/subjects') {
            const { data, error } = await adminClient.from('subjects').select('*').order('name');
            if (error) { sendJson(res, 500, { ok: false, error: error.message }); return true; }
            sendJson(res, 200, { ok: true, subjects: data });
            return true;
        }

        // POST /subjects
        if (req.method === 'POST' && url.pathname === '/subjects') {
            const body = await readJson(req);
            if (!body.name?.trim()) { sendJson(res, 400, { ok: false, error: 'name is required' }); return true; }
            const { data, error } = await adminClient.from('subjects').insert({ name: body.name.trim() }).select().single();
            if (error) {
                if (error.code === '23505') { sendJson(res, 409, { ok: false, error: 'Subject already exists' }); return true; }
                sendJson(res, 500, { ok: false, error: error.message }); return true;
            }
            sendJson(res, 201, { ok: true, subject: data });
            return true;
        }

        // PATCH /subjects/:id
        if (req.method === 'PATCH' && idMatch) {
            const body = await readJson(req);
            if (!body.name?.trim()) { sendJson(res, 400, { ok: false, error: 'name is required' }); return true; }
            const { data, error } = await adminClient.from('subjects').update({ name: body.name.trim() }).eq('id', idMatch[1]).select().single();
            if (error) { sendJson(res, 500, { ok: false, error: error.message }); return true; }
            sendJson(res, 200, { ok: true, subject: data });
            return true;
        }

        // DELETE /subjects/:id
        if (req.method === 'DELETE' && idMatch) {
            const { error } = await adminClient.from('subjects').delete().eq('id', idMatch[1]);
            if (error) { sendJson(res, 500, { ok: false, error: error.message }); return true; }
            sendJson(res, 200, { ok: true });
            return true;
        }
    }

    // ─── BOARDS ───
    if (url.pathname === '/boards' || url.pathname.startsWith('/boards/')) {
        const idMatch = url.pathname.match(/^\/boards\/([^/]+)$/);

        // GET /boards
        if (req.method === 'GET' && url.pathname === '/boards') {
            const { data, error } = await adminClient.from('boards').select('*').order('name');
            if (error) { sendJson(res, 500, { ok: false, error: error.message }); return true; }
            sendJson(res, 200, { ok: true, boards: data });
            return true;
        }

        // POST /boards
        if (req.method === 'POST' && url.pathname === '/boards') {
            const body = await readJson(req);
            if (!body.name?.trim()) { sendJson(res, 400, { ok: false, error: 'name is required' }); return true; }
            const { data, error } = await adminClient.from('boards').insert({ name: body.name.trim() }).select().single();
            if (error) {
                if (error.code === '23505') { sendJson(res, 409, { ok: false, error: 'Board already exists' }); return true; }
                sendJson(res, 500, { ok: false, error: error.message }); return true;
            }
            sendJson(res, 201, { ok: true, board: data });
            return true;
        }

        // PATCH /boards/:id
        if (req.method === 'PATCH' && idMatch) {
            const body = await readJson(req);
            if (!body.name?.trim()) { sendJson(res, 400, { ok: false, error: 'name is required' }); return true; }
            const { data, error } = await adminClient.from('boards').update({ name: body.name.trim() }).eq('id', idMatch[1]).select().single();
            if (error) { sendJson(res, 500, { ok: false, error: error.message }); return true; }
            sendJson(res, 200, { ok: true, board: data });
            return true;
        }

        // DELETE /boards/:id
        if (req.method === 'DELETE' && idMatch) {
            const { error } = await adminClient.from('boards').delete().eq('id', idMatch[1]);
            if (error) { sendJson(res, 500, { ok: false, error: error.message }); return true; }
            sendJson(res, 200, { ok: true });
            return true;
        }
    }

    // ─── MEDIUMS ───
    if (url.pathname === '/mediums' || url.pathname.startsWith('/mediums/')) {
        const idMatch = url.pathname.match(/^\/mediums\/([^/]+)$/);

        // GET /mediums
        if (req.method === 'GET' && url.pathname === '/mediums') {
            const { data, error } = await adminClient.from('mediums').select('*').order('name');
            if (error) { sendJson(res, 500, { ok: false, error: error.message }); return true; }
            sendJson(res, 200, { ok: true, mediums: data });
            return true;
        }

        // POST /mediums
        if (req.method === 'POST' && url.pathname === '/mediums') {
            const body = await readJson(req);
            if (!body.name?.trim()) { sendJson(res, 400, { ok: false, error: 'name is required' }); return true; }
            const { data, error } = await adminClient.from('mediums').insert({ name: body.name.trim() }).select().single();
            if (error) {
                if (error.code === '23505') { sendJson(res, 409, { ok: false, error: 'Medium already exists' }); return true; }
                sendJson(res, 500, { ok: false, error: error.message }); return true;
            }
            sendJson(res, 201, { ok: true, medium: data });
            return true;
        }

        // PATCH /mediums/:id
        if (req.method === 'PATCH' && idMatch) {
            const body = await readJson(req);
            if (!body.name?.trim()) { sendJson(res, 400, { ok: false, error: 'name is required' }); return true; }
            const { data, error } = await adminClient.from('mediums').update({ name: body.name.trim() }).eq('id', idMatch[1]).select().single();
            if (error) { sendJson(res, 500, { ok: false, error: error.message }); return true; }
            sendJson(res, 200, { ok: true, medium: data });
            return true;
        }

        // DELETE /mediums/:id
        if (req.method === 'DELETE' && idMatch) {
            const { error } = await adminClient.from('mediums').delete().eq('id', idMatch[1]);
            if (error) { sendJson(res, 500, { ok: false, error: error.message }); return true; }
            sendJson(res, 200, { ok: true });
            return true;
        }
    }

    return false;
}
