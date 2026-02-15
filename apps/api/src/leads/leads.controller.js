import { readJson, sendJson } from '../common/http.js';
import { LeadsService } from './leads.service.js';

const leadsService = new LeadsService();

function getUserFromHeader(req) {
  const rawRole = req.headers['x-user-role'];
  const rawId = req.headers['x-user-id'];
  return {
    userId: typeof rawId === 'string' && rawId ? rawId : 'dev-user',
    role: typeof rawRole === 'string' ? rawRole : 'counselor'
  };
}

export async function handleLeads(req, res, url) {
  if (!req.url.startsWith('/leads')) return false;

  const actor = getUserFromHeader(req);

  try {
    if (req.method === 'GET' && url.pathname === '/leads') {
      const scope = url.searchParams.get('scope') || 'all';
      const items = await leadsService.list({ scope, actor });
      if (items?.error) {
        sendJson(res, 403, { ok: false, error: items.error });
        return true;
      }
      sendJson(res, 200, { ok: true, items });
      return true;
    }

    if (req.method === 'GET' && url.pathname === '/leads/outcomes') {
      const items = await leadsService.listOutcomes(actor);
      if (items?.error) {
        sendJson(res, 403, { ok: false, error: items.error });
        return true;
      }
      sendJson(res, 200, { ok: true, items });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/leads') {
      const payload = await readJson(req);
      if (!payload.student_name) {
        sendJson(res, 400, { ok: false, error: 'student_name is required' });
        return true;
      }
      const lead = await leadsService.create(payload, actor);
      if (lead?.error) {
        sendJson(res, 403, { ok: false, error: lead.error });
        return true;
      }
      sendJson(res, 201, { ok: true, lead });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/leads/assign') {
      const payload = await readJson(req);
      const result = await leadsService.bulkAssign(payload.lead_ids, payload.counselor_id, actor);
      if (result.error) {
        sendJson(res, 403, { ok: false, error: result.error });
        return true;
      }
      sendJson(res, 200, { ok: true, count: result.count });
      return true;
    }

    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      sendJson(res, 404, { ok: false, error: 'route not found' });
      return true;
    }
    const leadId = parts[1];

    if (req.method === 'GET' && parts.length === 2) {
      const lead = await leadsService.get(leadId, actor);
      if (!lead) {
        sendJson(res, 404, { ok: false, error: 'lead not found' });
        return true;
      }
      if (lead.error) {
        sendJson(res, 403, { ok: false, error: lead.error });
        return true;
      }
      sendJson(res, 200, { ok: true, lead });
      return true;
    }

    if (req.method === 'GET' && parts.length === 3 && parts[2] === 'history') {
      const history = await leadsService.getHistory(leadId, actor);
      if (!history) {
        sendJson(res, 404, { ok: false, error: 'lead not found' });
        return true;
      }
      if (history.error) {
        sendJson(res, 403, { ok: false, error: history.error });
        return true;
      }
      sendJson(res, 200, { ok: true, items: history });
      return true;
    }

    if (req.method === 'PATCH' && parts.length === 2) {
      const payload = await readJson(req);
      const updated = await leadsService.update(leadId, payload, actor);
      if (!updated) {
        sendJson(res, 404, { ok: false, error: 'lead not found' });
        return true;
      }
      if (updated.error) {
        sendJson(res, 403, { ok: false, error: updated.error });
        return true;
      }
      sendJson(res, 200, { ok: true, lead: updated });
      return true;
    }

    if (req.method === 'DELETE' && parts.length === 2) {
      const payload = await readJson(req).catch(() => ({}));
      const deleted = await leadsService.softDelete(leadId, actor, payload.reason);
      if (!deleted) {
        sendJson(res, 404, { ok: false, error: 'lead not found' });
        return true;
      }
      if (deleted.error) {
        sendJson(res, 403, { ok: false, error: deleted.error });
        return true;
      }
      sendJson(res, 200, { ok: true, lead: deleted });
      return true;
    }

    if (req.method === 'POST' && parts.length === 3 && parts[2] === 'demo-request') {
      const payload = await readJson(req);
      const result = await leadsService.createDemoRequest(leadId, actor, payload.scheduled_at);
      if (!result) {
        sendJson(res, 404, { ok: false, error: 'lead not found' });
        return true;
      }
      if (result.error) {
        sendJson(res, 403, { ok: false, error: result.error });
        return true;
      }
      sendJson(res, 201, { ok: true, demo_request: result });
      return true;
    }

    if (req.method === 'POST' && parts.length === 3 && parts[2] === 'payment-request') {
      const payload = await readJson(req);
      const result = await leadsService.submitPaymentRequest(leadId, actor, payload);
      if (!result) {
        sendJson(res, 404, { ok: false, error: 'lead not found' });
        return true;
      }
      if (result.error) {
        sendJson(res, 403, { ok: false, error: result.error });
        return true;
      }
      sendJson(res, 201, { ok: true, payment_request: result });
      return true;
    }

    if (req.method === 'POST' && parts.length === 3 && parts[2] === 'assign') {
      const payload = await readJson(req);
      const result = await leadsService.assignCounselor(leadId, payload.counselor_user_id, actor);
      if (!result) {
        sendJson(res, 404, { ok: false, error: 'lead not found' });
        return true;
      }
      if (result.error) {
        sendJson(res, 403, { ok: false, error: result.error });
        return true;
      }
      sendJson(res, 200, { ok: true, lead: result.lead });
      return true;
    }

    sendJson(res, 404, { ok: false, error: 'route not found' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
