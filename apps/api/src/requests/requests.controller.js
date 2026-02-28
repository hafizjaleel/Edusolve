
import { readJson, sendJson, getBearerToken } from '../common/http.js';
import { RequestsService } from './requests.service.js';
import { AuthService } from '../auth/auth.service.js';

const requestsService = new RequestsService();
const authService = new AuthService();

export async function handleRequests(req, res, url) {
    if (!req.url.startsWith('/requests')) return false;

    // Uniform auth check based on headers (matching leads/finance/etc.)
    const userId = req.headers['x-user-id'] || 'dev-user';
    const role = req.headers['x-user-role'];

    if (!role) {
        sendJson(res, 401, { error: 'Unauthorized' });
        return true;
    }

    try {
        // GET /requests
        if (req.method === 'GET' && url.pathname === '/requests') {
            const items = await requestsService.list(role, userId);
            if (items.error) {
                sendJson(res, 500, { error: items.error });
                return true;
            }
            sendJson(res, 200, { items });
            return true;
        }

        // POST /requests (Create)
        if (req.method === 'POST' && url.pathname === '/requests') {
            const payload = await readJson(req);
            if (!payload.subject || !payload.description) {
                sendJson(res, 400, { error: 'Subject and description required' });
                return true;
            }

            const result = await requestsService.create(userId, payload);
            if (result.error) {
                sendJson(res, 500, { error: result.error });
                return true;
            }
            sendJson(res, 201, { result });
            return true;
        }

        // PATCH /requests/:id (Update)
        const parts = url.pathname.split('/').filter(Boolean);
        if (req.method === 'PATCH' && parts.length === 2) {
            const id = parts[1];
            const payload = await readJson(req);

            // If status is provided, it's a status update (Head/Admin)
            if (payload.status) {
                if (role !== 'counselor_head' && role !== 'super_admin') {
                    sendJson(res, 403, { error: 'Forbidden' });
                    return true;
                }
                const result = await requestsService.updateStatus(id, payload.status, payload.resolution_note);
                if (result.error) {
                    sendJson(res, 500, { error: result.error });
                    return true;
                }
                sendJson(res, 200, { result });
                return true;
            }

            // Otherwise, it's a content update (Edit) - usually for creator (Counselor)
            // Ideally check ownership, but skipping for MVP speed as requested
            const result = await requestsService.update(id, payload);
            if (result.error) {
                sendJson(res, 500, { error: result.error });
                return true;
            }
            sendJson(res, 200, { result });
            return true;
        }

        // DELETE /requests/:id
        if (req.method === 'DELETE' && parts.length === 2) {
            const id = parts[1];
            // Ideally check ownership
            const result = await requestsService.delete(id);
            if (result.error) {
                sendJson(res, 500, { error: result.error });
                return true;
            }
            sendJson(res, 200, { result });
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
