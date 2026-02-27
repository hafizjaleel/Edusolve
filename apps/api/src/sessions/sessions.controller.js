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

function isAC(actor) {
  return actor.role === 'academic_coordinator';
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

      let query = adminClient
        .from('academic_sessions')
        .select('*, students(student_code,student_name,academic_coordinator_id), users!academic_sessions_teacher_id_fkey(id,full_name,email), session_verifications(id,type,status,reason,verified_at,new_date,new_time,created_at)')
        .eq('status', 'completed')
        .order('session_date', { ascending: false })
        .limit(120);
      const { data, error } = await query;
      if (error) throw new Error(error.message);

      // Only show sessions with pending approval-type verification
      let pending = (data || []).filter((item) => {
        const sv = item.session_verifications;
        if (!sv) return false;
        if (Array.isArray(sv)) return sv.some(v => v.status === 'pending' && v.type === 'approval');
        return sv.status === 'pending' && sv.type === 'approval';
      });
      // Coordinator filtering: only show sessions for their assigned students
      if (isAC(actor)) {
        pending = pending.filter(s => s.students?.academic_coordinator_id === actor.userId);
      }
      sendJson(res, 200, { ok: true, items: pending });
      return true;
    }

    // ── Reschedule Queue (pending reschedule requests) ──
    if (req.method === 'GET' && url.pathname === '/sessions/reschedule-queue') {
      if (!canViewSessionPages(actor)) {
        sendJson(res, 403, { ok: false, error: 'reschedule queue access is not allowed for this role' });
        return true;
      }

      const { data, error } = await adminClient
        .from('session_verifications')
        .select('*, academic_sessions:session_id(*, students(student_code,student_name,academic_coordinator_id), users!academic_sessions_teacher_id_fkey(id,full_name,email))')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(120);
      if (error) throw new Error(error.message);

      // Filter for reschedule type client-side (avoids schema cache issues with new column)
      let items = (data || []).filter(v => v.type === 'reschedule');
      // Coordinator filtering
      if (isAC(actor)) {
        items = items.filter(v => v.academic_sessions?.students?.academic_coordinator_id === actor.userId);
      }
      sendJson(res, 200, { ok: true, items });
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

    if (req.method === 'GET' && url.pathname === '/sessions/all') {
      if (!canViewSessionPages(actor)) {
        sendJson(res, 403, { ok: false, error: 'session list access is not allowed for this role' });
        return true;
      }

      const qs = url.searchParams;
      const startDate = qs.get('start_date');
      const endDate = qs.get('end_date');
      const teacherId = qs.get('teacher_id');
      const studentId = qs.get('student_id');
      const statusStr = qs.get('status');

      let query = adminClient
        .from('academic_sessions')
        .select('*, students(student_code,student_name), users!academic_sessions_teacher_id_fkey(id,full_name,email), session_verifications(status,reason,verified_at)');

      if (startDate) query = query.gte('session_date', startDate);
      if (endDate) query = query.lte('session_date', endDate);
      if (teacherId) query = query.eq('teacher_id', teacherId);
      if (studentId) query = query.eq('student_id', studentId);
      if (statusStr && statusStr !== 'pending') {
        query = query.eq('status', statusStr);
      }

      const { data, error } = await query
        .order('session_date', { ascending: false })
        .limit(500);

      if (error) throw new Error(error.message);

      let items = (data || []).map((item) => ({
        ...item,
        verification_status: verificationStatusOf(item)
      }));

      // In app/db, academic_sessions status is historically 'upcoming', 'scheduled', 'completed' etc. 
      // User asked for "pending" status, which usually means scheduled but not taken, or taken but not verified.
      // We will map 'scheduled' to 'upcoming' if it's future, or leave it as is, and filter by pending verification if statusStr === 'pending'
      if (statusStr === 'pending') {
        items = items.filter(i => i.verification_status === 'pending');
      }

      sendJson(res, 200, { ok: true, items });
      return true;
    }

    const parts = url.pathname.split('/').filter(Boolean);

    if (req.method === 'PUT' && parts.length === 3 && parts[0] === 'sessions' && parts[2] === 'reschedule') {
      if (!['academic_coordinator', 'super_admin'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'Not allowed to reschedule' });
        return true;
      }
      const sessionId = parts[1];
      const payload = await readJson(req);
      const { session_date, started_at, duration_hours } = payload;
      if (!session_date || !started_at || !duration_hours) {
        sendJson(res, 400, { ok: false, error: 'Missing required rescheduling fields' });
        return true;
      }

      const { data, error } = await adminClient
        .from('academic_sessions')
        .update({
          session_date,
          started_at: started_at.includes('T') ? started_at : `${session_date}T${started_at}:00+05:30`,
          duration_hours: Number(duration_hours),
          updated_at: nowIso()
        })
        .eq('id', sessionId)
        .select('*');

      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, session: data });
      return true;
    }

    if (req.method === 'POST' && parts.length === 3 && parts[0] === 'sessions' && parts[2] === 'verify') {
      if (!canVerifySessions(actor)) {
        sendJson(res, 403, { ok: false, error: 'only academic coordinator can verify sessions' });
        return true;
      }

      const sessionId = parts[1];
      const payload = await readJson(req);
      const approved = payload.approved !== false;
      const verifyType = payload.type || 'approval'; // 'approval' or 'reschedule'

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
        .eq('type', verifyType)
        .eq('status', 'pending')
        .maybeSingle();
      if (existingError) throw new Error(existingError.message);
      if (!existing) {
        sendJson(res, 400, { ok: false, error: 'no pending request found for this session' });
        return true;
      }

      const status = approved ? 'approved' : 'rejected';

      const { error: updateError } = await adminClient
        .from('session_verifications')
        .update({
          verifier_id: actor.userId,
          status,
          reason: payload.reason || existing.reason,
          verified_at: nowIso()
        })
        .eq('id', existing.id);
      if (updateError) throw new Error(updateError.message);

      // Handle approval-type verification
      if (verifyType === 'approval') {
        const newSessionStatus = approved ? 'verified' : 'scheduled';

        let durationObj = { status: newSessionStatus };
        const duration = payload.override_duration ? Number(payload.override_duration) : Number(session.duration_hours || 0);

        if (approved && payload.override_duration) {
          durationObj.duration_hours = duration;
        }

        await adminClient.from('academic_sessions').update(durationObj).eq('id', sessionId);

        if (approved) {
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
      }

      // Handle reschedule-type verification
      if (verifyType === 'reschedule') {
        if (approved) {
          const updates = { status: 'rescheduled' };

          let targetDate = existing.new_date || session.session_date;

          if (existing.new_date) updates.session_date = existing.new_date;

          if (existing.new_time) {
            // Must convert to proper Postgres ISO timestamp using the requested date and time
            try {
              const dt = new Date(`${targetDate}T${existing.new_time}:00+05:30`);
              if (!isNaN(dt.getTime())) {
                updates.started_at = dt.toISOString();
              }
            } catch (err) {
              console.error("Time Parse Error:", err);
            }
          }

          // To support new_duration, check if it's available in the payload or via the DB row
          if (existing.new_duration) {
            updates.duration_hours = Number(existing.new_duration);
          } else if (payload.new_duration) {
            updates.duration_hours = Number(payload.new_duration);
          }

          await adminClient.from('academic_sessions').update(updates).eq('id', sessionId);
        }
        // If rejected, no change to session
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
