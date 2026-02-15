
import { readJson, sendJson } from '../common/http.js';
import { CounselorsService } from './counselors.service.js';

const counselorsService = new CounselorsService();

export async function handleCounselors(req, res, url) {
    if (!req.url.startsWith('/counselors')) return false;

    // Simple auth check: ensure header role is counselor_head or super_admin
    const role = req.headers['x-user-role'];
    if (role !== 'counselor_head' && role !== 'super_admin') {
        // Allow 'counselor' to view list? Maybe restricted.
        // For now strict.
        sendJson(res, 403, { error: 'Unauthorized' });
        return true;
    }

    try {
        // GET /counselors
        if (req.method === 'GET' && url.pathname === '/counselors') {
            const items = await counselorsService.list();
            if (items.error) {
                sendJson(res, 500, { error: items.error });
                return true;
            }
            sendJson(res, 200, { items });
            return true;
        }

        // GET /counselors/stats
        if (req.method === 'GET' && url.pathname === '/counselors/stats') {
            const from = url.searchParams.get('from');
            const to = url.searchParams.get('to');
            const stats = await counselorsService.getStats({ from, to });
            if (stats.error) {
                sendJson(res, 500, { error: stats.error });
                return true;
            }
            sendJson(res, 200, { stats });
            return true;
        }

        // POST /counselors (Create)
        if (req.method === 'POST' && url.pathname === '/counselors') {
            const payload = await readJson(req);
            if (!payload.email || !payload.password) {
                sendJson(res, 400, { error: 'Email and password required' });
                return true;
            }
            const user = await counselorsService.create(payload);
            if (user.error) {
                sendJson(res, 400, { error: user.error });
                return true;
            }
            sendJson(res, 201, { user });
            return true;
        }

        // PATCH /counselors/:id (Update Status)
        const parts = url.pathname.split('/').filter(Boolean);
        if (req.method === 'PATCH' && parts.length === 2) {
            const id = parts[1];
            const payload = await readJson(req);
            const updated = await counselorsService.updateStatus(id, payload.is_active);
            if (updated.error) {
                sendJson(res, 400, { error: updated.error });
                return true;
            }
            sendJson(res, 200, { updated });
            return true;
        }

        sendJson(res, 404, { error: 'Not found' });
        return true;

    } catch (e) {
        console.error(e);
        sendJson(res, 500, { error: e.message });
        return true;
    }
}
