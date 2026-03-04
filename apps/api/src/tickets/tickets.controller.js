
import { readJson, sendJson } from '../common/http.js';
import { TicketsService } from './tickets.service.js';

const ticketsService = new TicketsService();

export async function handleTickets(req, res, url) {
    if (!req.url.startsWith('/tickets') && !req.url.startsWith('/notifications')) return false;

    const userId = req.headers['x-user-id'];
    const role = req.headers['x-user-role'];

    if (!role || !userId) {
        sendJson(res, 401, { error: 'Unauthorized' });
        return true;
    }

    const parts = url.pathname.split('/').filter(Boolean);

    try {
        /* ════════════  TICKETS  ════════════ */

        // GET /tickets/routing — get allowed target roles for this user's role
        if (req.method === 'GET' && url.pathname === '/tickets/routing') {
            const targets = ticketsService.getTargetRolesForRole(role);
            sendJson(res, 200, { targets });
            return true;
        }

        // GET /tickets/stats — dashboard stats
        if (req.method === 'GET' && url.pathname === '/tickets/stats') {
            const result = await ticketsService.getStats(role, userId);
            if (result.error) { sendJson(res, 500, { error: result.error }); return true; }
            sendJson(res, 200, result);
            return true;
        }

        // GET /tickets — list tickets
        if (req.method === 'GET' && url.pathname === '/tickets') {
            const page = parseInt(url.searchParams.get('page')) || 1;
            const limit = parseInt(url.searchParams.get('limit')) || 20;
            const status = url.searchParams.get('status') || 'all';
            const priority = url.searchParams.get('priority') || 'all';
            const category = url.searchParams.get('category') || 'all';
            const scope = url.searchParams.get('scope') || 'all';
            const search = url.searchParams.get('search') || '';

            const result = await ticketsService.list(role, userId, { page, limit, status, priority, category, scope, search });
            if (result.error) { sendJson(res, 500, { error: result.error }); return true; }
            sendJson(res, 200, result);
            return true;
        }

        // POST /tickets — create ticket
        if (req.method === 'POST' && url.pathname === '/tickets') {
            const payload = await readJson(req);
            if (!payload.title || !payload.description || !payload.target_role) {
                sendJson(res, 400, { error: 'Title, description, and target_role are required' });
                return true;
            }

            const result = await ticketsService.create(userId, role, payload);
            if (result.error) { sendJson(res, result.error.includes('cannot send') ? 403 : 500, { error: result.error }); return true; }
            sendJson(res, 201, result);
            return true;
        }

        // GET /tickets/:id — get ticket detail with messages
        if (req.method === 'GET' && parts[0] === 'tickets' && parts.length === 2 && parts[1] !== 'routing' && parts[1] !== 'stats') {
            const ticketId = parts[1];
            const result = await ticketsService.getById(ticketId, userId, role);
            if (result.error) {
                const status = result.error === 'Forbidden' ? 403 : 500;
                sendJson(res, status, { error: result.error });
                return true;
            }
            sendJson(res, 200, result);
            return true;
        }

        // PATCH /tickets/:id/status — update ticket status
        if (req.method === 'PATCH' && parts[0] === 'tickets' && parts.length === 3 && parts[2] === 'status') {
            const ticketId = parts[1];
            const payload = await readJson(req);
            if (!payload.status) {
                sendJson(res, 400, { error: 'Status is required' });
                return true;
            }
            const result = await ticketsService.updateStatus(ticketId, userId, role, payload.status, payload.resolution_note);
            if (result.error) {
                const status = result.error.includes('assigned authority') ? 403 : 500;
                sendJson(res, status, { error: result.error });
                return true;
            }
            sendJson(res, 200, result);
            return true;
        }

        // POST /tickets/:id/messages — add message to thread
        if (req.method === 'POST' && parts[0] === 'tickets' && parts.length === 3 && parts[2] === 'messages') {
            const ticketId = parts[1];
            const payload = await readJson(req);
            if (!payload.message) {
                sendJson(res, 400, { error: 'Message is required' });
                return true;
            }
            const result = await ticketsService.addMessage(ticketId, userId, role, payload.message);
            if (result.error) {
                const status = result.error === 'Forbidden' ? 403 : 500;
                sendJson(res, status, { error: result.error });
                return true;
            }
            sendJson(res, 201, result);
            return true;
        }

        /* ════════════  NOTIFICATIONS  ════════════ */

        // GET /notifications — list user notifications
        if (req.method === 'GET' && url.pathname === '/notifications') {
            const page = parseInt(url.searchParams.get('page')) || 1;
            const limit = parseInt(url.searchParams.get('limit')) || 20;
            const unreadOnly = url.searchParams.get('unread') === 'true';

            const result = await ticketsService.getNotifications(userId, { page, limit, unreadOnly });
            if (result.error) { sendJson(res, 500, { error: result.error }); return true; }
            sendJson(res, 200, result);
            return true;
        }

        // GET /notifications/count — unread count
        if (req.method === 'GET' && url.pathname === '/notifications/count') {
            const result = await ticketsService.getUnreadCount(userId);
            if (result.error) { sendJson(res, 500, { error: result.error }); return true; }
            sendJson(res, 200, result);
            return true;
        }

        // PATCH /notifications/read-all — mark all as read
        if (req.method === 'PATCH' && url.pathname === '/notifications/read-all') {
            const result = await ticketsService.markAllAsRead(userId);
            if (result.error) { sendJson(res, 500, { error: result.error }); return true; }
            sendJson(res, 200, result);
            return true;
        }

        // PATCH /notifications/:id/read — mark single as read
        if (req.method === 'PATCH' && parts[0] === 'notifications' && parts.length === 3 && parts[2] === 'read') {
            const notifId = parts[1];
            const result = await ticketsService.markAsRead(notifId, userId);
            if (result.error) { sendJson(res, 500, { error: result.error }); return true; }
            sendJson(res, 200, result);
            return true;
        }

        // DELETE /notifications/:id — dismiss notification
        if (req.method === 'DELETE' && parts[0] === 'notifications' && parts.length === 2) {
            const notifId = parts[1];
            const result = await ticketsService.deleteNotification(notifId, userId);
            if (result.error) { sendJson(res, 500, { error: result.error }); return true; }
            sendJson(res, 200, result);
            return true;
        }

        sendJson(res, 404, { error: 'Not found' });
        return true;

    } catch (e) {
        console.error('[Tickets Error]', e);
        sendJson(res, 500, { error: e.message });
        return true;
    }
}
