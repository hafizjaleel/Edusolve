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

function canViewStudents(actor) {
  return ['academic_coordinator', 'finance', 'super_admin', 'counselor'].includes(actor.role);
}

function canRequestTopup(actor) {
  return actor.role === 'academic_coordinator';
}

function isAC(actor) {
  return actor.role === 'academic_coordinator';
}

export async function handleStudents(req, res, url) {
  if (!url.pathname.startsWith('/students')) return false;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    sendJson(res, 500, { ok: false, error: 'supabase admin is not configured' });
    return true;
  }

  const actor = actorFromHeaders(req);
  const parts = url.pathname.split('/').filter(Boolean);

  try {
    // ─── GET /students ─────────────────────────────────────
    if (req.method === 'GET' && url.pathname === '/students') {
      if (!canViewStudents(actor)) {
        sendJson(res, 403, { ok: false, error: 'student access is not allowed for this role' });
        return true;
      }

      const { data, error } = await adminClient
        .from('students')
        .select('*, student_teacher_assignments!student_teacher_assignments_student_id_fkey(id, teacher_id, subject, is_active, users!student_teacher_assignments_teacher_id_fkey(id, full_name))')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // ─── GET /students/sessions/today ──────────────────────
    if (req.method === 'GET' && url.pathname === '/students/sessions/today') {
      if (!['academic_coordinator', 'teacher', 'finance', 'super_admin'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'session access is not allowed for this role' });
        return true;
      }
      const today = new Date().toISOString().slice(0, 10);
      let query = adminClient
        .from('academic_sessions')
        .select('*, students(student_code,student_name), users!academic_sessions_teacher_id_fkey(id,full_name,email)')
        .eq('session_date', today)
        .order('started_at', { ascending: true });
      if (actor.role === 'teacher') query = query.eq('teacher_id', actor.userId);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // ─── GET /students/sessions/history ────────────────────
    if (req.method === 'GET' && url.pathname === '/students/sessions/history') {
      if (!['academic_coordinator', 'teacher', 'finance', 'super_admin'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'session access is not allowed for this role' });
        return true;
      }
      let query = adminClient
        .from('academic_sessions')
        .select('*, students(student_code,student_name), users!academic_sessions_teacher_id_fkey(id,full_name,email)')
        .order('session_date', { ascending: false })
        .limit(50);
      if (actor.role === 'teacher') query = query.eq('teacher_id', actor.userId);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // ─── GET /students/sessions/week ───────────────────────
    if (req.method === 'GET' && url.pathname === '/students/sessions/week') {
      if (!['academic_coordinator', 'finance', 'super_admin'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'session access is not allowed for this role' });
        return true;
      }
      const offsetParam = url.searchParams.get('offset') || '0';
      const offset = parseInt(offsetParam, 10);

      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + offset * 7);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const startDate = monday.toISOString().slice(0, 10);
      const endDate = sunday.toISOString().slice(0, 10);

      const { data, error } = await adminClient
        .from('academic_sessions')
        .select('*, students(student_code,student_name), users!academic_sessions_teacher_id_fkey(id,full_name)')
        .gte('session_date', startDate)
        .lte('session_date', endDate)
        .order('session_date', { ascending: true })
        .order('started_at', { ascending: true });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [], weekStart: startDate, weekEnd: endDate });
      return true;
    }

    // ─── GET /students/teacher-availability ─────────────────
    if (req.method === 'GET' && url.pathname === '/students/teacher-availability') {
      if (!['academic_coordinator', 'teacher_coordinator', 'super_admin'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'availability access is not allowed for this role' });
        return true;
      }
      const { data, error } = await adminClient
        .from('teacher_profiles')
        .select('teacher_code, user_id, users(id,full_name), teacher_availability(day_of_week,start_time,end_time)')
        .eq('is_in_pool', true)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);

      const items = (data || []).map((row) => {
        const slotCount = (row.teacher_availability || []).length;
        const utilization = Math.min(95, slotCount * 12 + 15);
        return {
          teacher_code: row.teacher_code,
          teacher_name: row.users?.full_name || row.user_id,
          user_id: row.user_id,
          utilization,
          slot_count: slotCount
        };
      });
      sendJson(res, 200, { ok: true, items });
      return true;
    }

    // ─── GET /students/topup-requests ───────────────────────
    if (req.method === 'GET' && url.pathname === '/students/topup-requests') {
      if (!['academic_coordinator', 'finance', 'super_admin'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'top-up access is not allowed for this role' });
        return true;
      }
      const status = url.searchParams.get('status') || 'all';
      let query = adminClient
        .from('student_topups')
        .select('*, students(student_code,student_name)')
        .order('created_at', { ascending: false });
      if (status !== 'all') query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // ─── GET /students/:id ──────────────────────────────────
    if (req.method === 'GET' && parts.length === 2 && parts[0] === 'students') {
      if (!canViewStudents(actor)) {
        sendJson(res, 403, { ok: false, error: 'student access is not allowed for this role' });
        return true;
      }
      const studentId = parts[1];
      const { data, error } = await adminClient
        .from('students')
        .select('*')
        .eq('id', studentId)
        .is('deleted_at', null)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) {
        sendJson(res, 404, { ok: false, error: 'student not found' });
        return true;
      }

      // Fetch assignments
      const { data: assignments } = await adminClient
        .from('student_teacher_assignments')
        .select('*, users!student_teacher_assignments_teacher_id_fkey(id, full_name, email)')
        .eq('student_id', studentId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Fetch recent sessions
      const { data: sessions } = await adminClient
        .from('academic_sessions')
        .select('*, users!academic_sessions_teacher_id_fkey(id,full_name), session_verifications(status)')
        .eq('student_id', studentId)
        .order('session_date', { ascending: false })
        .limit(30);

      // Fetch messages
      const { data: messages } = await adminClient
        .from('student_messages')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(50);

      sendJson(res, 200, {
        ok: true,
        student: data,
        assignments: assignments || [],
        sessions: sessions || [],
        messages: messages || []
      });
      return true;
    }

    // ─── GET /students/:id/assignments ──────────────────────
    if (req.method === 'GET' && parts.length === 3 && parts[0] === 'students' && parts[2] === 'assignments') {
      if (!canViewStudents(actor)) {
        sendJson(res, 403, { ok: false, error: 'not allowed' });
        return true;
      }
      const studentId = parts[1];
      const { data, error } = await adminClient
        .from('student_teacher_assignments')
        .select('*, users!student_teacher_assignments_teacher_id_fkey(id, full_name, email)')
        .eq('student_id', studentId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // ─── POST /students/:id/assignments ─────────────────────
    if (req.method === 'POST' && parts.length === 3 && parts[0] === 'students' && parts[2] === 'assignments') {
      if (!isAC(actor)) {
        sendJson(res, 403, { ok: false, error: 'only academic coordinator can assign teachers' });
        return true;
      }
      const studentId = parts[1];
      const payload = await readJson(req);
      if (!payload.teacher_id || !payload.subject) {
        sendJson(res, 400, { ok: false, error: 'teacher_id and subject are required' });
        return true;
      }
      const { data, error } = await adminClient
        .from('student_teacher_assignments')
        .upsert({
          student_id: studentId,
          teacher_id: payload.teacher_id,
          subject: payload.subject,
          schedule_note: payload.schedule_note || null,
          is_active: true,
          assigned_by: actor.userId,
          updated_at: nowIso()
        }, { onConflict: 'student_id,teacher_id,subject' })
        .select('*, users!student_teacher_assignments_teacher_id_fkey(id, full_name)')
        .single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, assignment: data });
      return true;
    }

    // ─── DELETE /students/:id/assignments/:aid ──────────────
    if (req.method === 'DELETE' && parts.length === 4 && parts[0] === 'students' && parts[2] === 'assignments') {
      if (!isAC(actor)) {
        sendJson(res, 403, { ok: false, error: 'only academic coordinator can remove assignments' });
        return true;
      }
      const assignmentId = parts[3];
      const { error } = await adminClient
        .from('student_teacher_assignments')
        .update({ is_active: false, updated_at: nowIso() })
        .eq('id', assignmentId);
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true });
      return true;
    }

    // ─── POST /students/:id/sessions ────────────────────────
    if (req.method === 'POST' && parts.length === 3 && parts[0] === 'students' && parts[2] === 'sessions') {
      if (!isAC(actor)) {
        sendJson(res, 403, { ok: false, error: 'only academic coordinator can schedule sessions' });
        return true;
      }
      const studentId = parts[1];
      const payload = await readJson(req);
      if (!payload.teacher_id || !payload.session_date || !payload.duration_hours) {
        sendJson(res, 400, { ok: false, error: 'teacher_id, session_date, and duration_hours are required' });
        return true;
      }
      const { data, error } = await adminClient
        .from('academic_sessions')
        .insert({
          student_id: studentId,
          teacher_id: payload.teacher_id,
          session_date: payload.session_date,
          started_at: payload.started_at || null,
          ended_at: payload.ended_at || null,
          duration_hours: Number(payload.duration_hours),
          subject: payload.subject || null,
          status: 'completed',
          homework: payload.homework || null,
          marks: payload.marks || null,
          created_at: nowIso()
        })
        .select('*, students(student_code,student_name), users!academic_sessions_teacher_id_fkey(id,full_name)')
        .single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, session: data });
      return true;
    }

    // ─── PUT /students/sessions/:id/reschedule ──────────────
    if (req.method === 'PUT' && parts.length === 4 && parts[0] === 'students' && parts[1] === 'sessions' && parts[3] === 'reschedule') {
      if (!isAC(actor)) {
        sendJson(res, 403, { ok: false, error: 'only academic coordinator can reschedule' });
        return true;
      }
      const sessionId = parts[2];
      const payload = await readJson(req);
      const updateFields = {};
      if (payload.session_date) updateFields.session_date = payload.session_date;
      if (payload.started_at) updateFields.started_at = payload.started_at;
      if (payload.ended_at) updateFields.ended_at = payload.ended_at;
      if (payload.status) updateFields.status = payload.status;
      if (Object.keys(updateFields).length === 0) {
        sendJson(res, 400, { ok: false, error: 'no fields to update' });
        return true;
      }
      const { data, error } = await adminClient
        .from('academic_sessions')
        .update(updateFields)
        .eq('id', sessionId)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, session: data });
      return true;
    }

    // ─── GET /students/:id/messages ─────────────────────────
    if (req.method === 'GET' && parts.length === 3 && parts[0] === 'students' && parts[2] === 'messages') {
      if (!canViewStudents(actor)) {
        sendJson(res, 403, { ok: false, error: 'not allowed' });
        return true;
      }
      const studentId = parts[1];
      const { data, error } = await adminClient
        .from('student_messages')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: true })
        .limit(100);
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // ─── POST /students/:id/messages/send-reminder ──────────
    if (req.method === 'POST' && parts.length === 4 && parts[0] === 'students' && parts[2] === 'messages' && parts[3] === 'send-reminder') {
      if (!isAC(actor)) {
        sendJson(res, 403, { ok: false, error: 'only academic coordinator can send reminders' });
        return true;
      }
      const studentId = parts[1];
      const payload = await readJson(req);
      const messageContent = payload.message || 'Session reminder: You have an upcoming class today.';

      // Fetch student for contact number
      const { data: student } = await adminClient
        .from('students')
        .select('student_name, contact_number, parent_name')
        .eq('id', studentId)
        .maybeSingle();

      // Log the message
      const { data: msg, error: msgError } = await adminClient
        .from('student_messages')
        .insert({
          student_id: studentId,
          sent_by: actor.userId,
          direction: 'outgoing',
          channel: 'whatsapp',
          message_type: payload.type || 'reminder',
          content: messageContent,
          delivery_status: 'sent',
          metadata: {
            session_id: payload.session_id || null,
            contact_number: student?.contact_number || null,
            student_name: student?.student_name || null
          },
          created_at: nowIso()
        })
        .select('*')
        .single();
      if (msgError) throw new Error(msgError.message);

      // TODO: In production, call n8n webhook here for actual WhatsApp delivery
      // const webhookUrl = process.env.N8N_REMINDER_WEBHOOK;
      // if (webhookUrl) { await fetch(webhookUrl, { method: 'POST', body: JSON.stringify({ ... }) }); }

      sendJson(res, 201, { ok: true, message: msg });
      return true;
    }

    // ─── POST /students/:id/topup-requests ──────────────────
    if (req.method === 'POST' && parts.length === 3 && parts[0] === 'students' && parts[2] === 'topup-requests') {
      if (!canRequestTopup(actor)) {
        sendJson(res, 403, { ok: false, error: 'only academic coordinator can request top-up' });
        return true;
      }
      const studentId = parts[1];
      const payload = await readJson(req);
      const hoursAdded = Number(payload.hours_added);
      const amount = Number(payload.amount);
      if (!Number.isFinite(hoursAdded) || hoursAdded <= 0) {
        sendJson(res, 400, { ok: false, error: 'hours_added must be positive number' });
        return true;
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        sendJson(res, 400, { ok: false, error: 'amount must be positive number' });
        return true;
      }
      const { data: student, error: studentError } = await adminClient
        .from('students')
        .select('id')
        .eq('id', studentId)
        .maybeSingle();
      if (studentError) throw new Error(studentError.message);
      if (!student) {
        sendJson(res, 404, { ok: false, error: 'student not found' });
        return true;
      }
      const { data, error } = await adminClient
        .from('student_topups')
        .insert({
          student_id: studentId,
          hours_added: hoursAdded,
          amount,
          payment_verified: false,
          status: 'pending_finance',
          screenshot_url: payload.screenshot_url || null,
          requested_by: actor.userId,
          created_at: nowIso()
        })
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, topup: data });
      return true;
    }

    sendJson(res, 404, { ok: false, error: 'route not found' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
