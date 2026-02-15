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

function canViewSessionPages(actor) {
  return ['academic_coordinator', 'finance', 'super_admin'].includes(actor.role);
}

function canVerifySessions(actor) {
  return actor.role === 'academic_coordinator';
}

function verificationStatusOf(session) {
  const row = Array.isArray(session.session_verifications) ? session.session_verifications[0] : session.session_verifications;
  return row?.status || 'pending';
}

export async function handleSessions(req, res, url) {
  if (!url.pathname.startsWith('/sessions')) return false;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    sendJson(res, 500, { ok: false, error: 'supabase admin is not configured' });
    return true;
  }

  const actor = actorFromHeaders(req);

  try {
    if (req.method === 'GET' && url.pathname === '/sessions/verification-queue') {
      if (!canViewSessionPages(actor)) {
        sendJson(res, 403, { ok: false, error: 'session queue access is not allowed for this role' });
        return true;
      }

      const { data, error } = await adminClient
        .from('academic_sessions')
        .select('*, students(student_code,student_name), users!academic_sessions_teacher_id_fkey(id,full_name,email), session_verifications(status,reason,verified_at)')
        .order('session_date', { ascending: false })
        .limit(120);
      if (error) throw new Error(error.message);

      const pending = (data || []).filter((item) => verificationStatusOf(item) === 'pending');
      sendJson(res, 200, { ok: true, items: pending });
      return true;
    }

    if (req.method === 'GET' && url.pathname === '/sessions/logs') {
      if (!canViewSessionPages(actor)) {
        sendJson(res, 403, { ok: false, error: 'session log access is not allowed for this role' });
        return true;
      }

      const { data, error } = await adminClient
        .from('academic_sessions')
        .select('*, students(student_code,student_name), users!academic_sessions_teacher_id_fkey(id,full_name,email), session_verifications(status,reason,verified_at)')
        .order('session_date', { ascending: false })
        .limit(160);
      if (error) throw new Error(error.message);

      const items = (data || []).map((item) => ({
        ...item,
        verification_status: verificationStatusOf(item)
      }));
      sendJson(res, 200, { ok: true, items });
      return true;
    }

    const parts = url.pathname.split('/').filter(Boolean);
    if (req.method === 'POST' && parts.length === 3 && parts[0] === 'sessions' && parts[2] === 'verify') {
      if (!canVerifySessions(actor)) {
        sendJson(res, 403, { ok: false, error: 'only academic coordinator can verify sessions' });
        return true;
      }

      const sessionId = parts[1];
      const payload = await readJson(req);
      const approved = payload.approved !== false;

      const { data: session, error: sessionError } = await adminClient
        .from('academic_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();
      if (sessionError) throw new Error(sessionError.message);
      if (!session) {
        sendJson(res, 404, { ok: false, error: 'session not found' });
        return true;
      }

      const { data: existing, error: existingError } = await adminClient
        .from('session_verifications')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();
      if (existingError) throw new Error(existingError.message);
      if (existing && existing.status !== 'pending') {
        sendJson(res, 400, { ok: false, error: 'session already processed' });
        return true;
      }

      const status = approved ? 'approved' : 'rejected';

      if (existing) {
        const { error: updateError } = await adminClient
          .from('session_verifications')
          .update({
            verifier_id: actor.userId,
            status,
            reason: payload.reason || null,
            verified_at: nowIso()
          })
          .eq('id', existing.id);
        if (updateError) throw new Error(updateError.message);
      } else {
        const { error: insertError } = await adminClient
          .from('session_verifications')
          .insert({
            session_id: sessionId,
            verifier_id: actor.userId,
            status,
            reason: payload.reason || null,
            verified_at: nowIso()
          });
        if (insertError) throw new Error(insertError.message);
      }

      if (approved) {
        const duration = Number(session.duration_hours || 0);
        if (duration > 0) {
          const { data: student, error: studentError } = await adminClient
            .from('students')
            .select('id, remaining_hours')
            .eq('id', session.student_id)
            .maybeSingle();
          if (studentError) throw new Error(studentError.message);
          if (student) {
            const remaining = Math.max(0, Number(student.remaining_hours || 0) - duration);
            const { error: studentUpdateError } = await adminClient
              .from('students')
              .update({ remaining_hours: remaining, updated_at: nowIso() })
              .eq('id', student.id);
            if (studentUpdateError) throw new Error(studentUpdateError.message);
          }

          await adminClient.from('hour_ledger').insert([
            {
              student_id: session.student_id,
              teacher_id: session.teacher_id,
              session_id: session.id,
              hours_delta: -duration,
              entry_type: 'student_debit',
              created_at: nowIso()
            },
            {
              student_id: session.student_id,
              teacher_id: session.teacher_id,
              session_id: session.id,
              hours_delta: duration,
              entry_type: 'teacher_credit',
              created_at: nowIso()
            }
          ]);
        }
      }

      sendJson(res, 200, { ok: true, status });
      return true;
    }

    sendJson(res, 404, { ok: false, error: 'route not found' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
