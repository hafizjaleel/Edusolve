import http from 'node:http';
import { handleAuth } from './auth/auth.controller.js';
import { sendJson } from './common/http.js';
import { env } from './config/env.js';
import { handleDashboard } from './dashboard/dashboard.controller.js';
import { handleFinance } from './finance/finance.controller.js';
import { handleLeads } from './leads/leads.controller.js';
import { handleSessions } from './sessions/sessions.controller.js';
import { handleStudents } from './students/students.controller.js';
import { handleTeachers } from './teachers/teachers.controller.js';
import { handleUpload } from './common/upload.js';
import { handleCounselors } from './counselors/counselors.controller.js';
import { handleRequests } from './requests/requests.controller.js';
import { handleTeacherLeads } from './teacher-leads/teacher-leads.controller.js';
import { handleUsers } from './users/users.controller.js';

import { AuthService } from './auth/auth.service.js';
import { getBearerToken } from './common/http.js';

const authService = new AuthService();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  if (await handleAuth(req, res)) return;

  if (req.method === 'POST' && url.pathname === '/upload/screenshot') {
    const token = getBearerToken(req);
    if (!token) return sendJson(res, 401, { error: 'Unauthorized' });
    const user = await authService.me(token);
    if (!user.ok) return sendJson(res, 401, { error: 'Invalid token' });
    return handleUpload(req, res);
  }

  if (await handleDashboard(req, res)) return;
  if (await handleLeads(req, res, url)) return;
  if (await handleSessions(req, res, url)) return;
  if (await handleStudents(req, res, url)) return;
  if (await handleFinance(req, res, url)) return;
  if (await handleTeachers(req, res, url)) return;
  if (await handleCounselors(req, res, url)) return;
  if (await handleRequests(req, res, url)) return;
  if (await handleTeacherLeads(req, res, url)) return;
  if (await handleUsers(req, res)) return;

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, { ok: true, service: 'ehms-api' });
  }

  return sendJson(res, 404, { ok: false, error: 'route not found' });
});

server.listen(env.port, () => {
  console.log(`EHMS API running on :${env.port}`);
});
