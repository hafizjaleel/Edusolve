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

function isTeacherCoordinator(actor) {
  return actor.role === 'teacher_coordinator';
}

function canViewTeacherProfile(actor) {
  return ['teacher_coordinator', 'academic_coordinator', 'finance', 'teacher', 'super_admin'].includes(actor.role);
}

async function generateTeacherCode(adminClient) {
  const { data, error } = await adminClient
    .from('teacher_profiles')
    .select('teacher_code')
    .not('teacher_code', 'is', null)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);

  let maxNum = 0;
  for (const row of data || []) {
    const code = row.teacher_code || '';
    const num = Number(code.replace(/^TCR/i, ''));
    if (Number.isFinite(num) && num > maxNum) maxNum = num;
  }
  return `TCR${String(maxNum + 1).padStart(6, '0')}`;
}

export async function handleTeachers(req, res, url) {
  if (!url.pathname.startsWith('/teachers')) return false;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    sendJson(res, 500, { ok: false, error: 'supabase admin is not configured' });
    return true;
  }

  const actor = actorFromHeaders(req);

  try {
    if (req.method === 'GET' && url.pathname === '/teachers/pool') {
      const { data, error } = await adminClient
        .from('teacher_profiles')
        .select('*, users(id,email,full_name), teacher_availability(day_of_week,start_time,end_time)')
        .eq('is_in_pool', true)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    const parts = url.pathname.split('/').filter(Boolean);
    if (req.method === 'GET' && parts.length === 2 && parts[0] === 'teachers') {
      if (!canViewTeacherProfile(actor)) {
        sendJson(res, 403, { ok: false, error: 'role not allowed for teacher profile' });
        return true;
      }

      const teacherId = parts[1];
      const { data, error } = await adminClient
        .from('teacher_profiles')
        .select('*, users(id,email,full_name), teacher_availability(day_of_week,start_time,end_time)')
        .eq('id', teacherId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) {
        sendJson(res, 404, { ok: false, error: 'teacher profile not found' });
        return true;
      }
      sendJson(res, 200, { ok: true, teacher: data });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/teachers/recruitment/success') {
      if (!isTeacherCoordinator(actor)) {
        sendJson(res, 403, { ok: false, error: 'teacher coordinator role required' });
        return true;
      }

      const payload = await readJson(req);
      if (!payload.user_id) {
        sendJson(res, 400, { ok: false, error: 'user_id is required' });
        return true;
      }

      const { data: existing, error: existingError } = await adminClient
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', payload.user_id)
        .maybeSingle();
      if (existingError) throw new Error(existingError.message);

      let teacherProfile;

      if (existing) {
        const { data: updated, error: updateError } = await adminClient
          .from('teacher_profiles')
          .update({
            is_in_pool: true,
            experience_level: payload.experience_level || existing.experience_level,
            per_hour_rate: payload.per_hour_rate ?? existing.per_hour_rate,
            updated_at: nowIso()
          })
          .eq('id', existing.id)
          .select('*')
          .single();
        if (updateError) throw new Error(updateError.message);
        teacherProfile = updated;
      } else {
        const teacherCode = await generateTeacherCode(adminClient);
        const { data: created, error: createError } = await adminClient
          .from('teacher_profiles')
          .insert({
            user_id: payload.user_id,
            teacher_code: teacherCode,
            experience_level: payload.experience_level || null,
            per_hour_rate: payload.per_hour_rate ?? null,
            is_in_pool: true,
            created_at: nowIso(),
            updated_at: nowIso()
          })
          .select('*')
          .single();
        if (createError) throw new Error(createError.message);
        teacherProfile = created;
      }

      const { data: profileWithRel, error: relError } = await adminClient
        .from('teacher_profiles')
        .select('*, users(id,email,full_name)')
        .eq('id', teacherProfile.id)
        .single();
      if (relError) throw new Error(relError.message);

      sendJson(res, 200, { ok: true, teacher: profileWithRel });
      return true;
    }

    // ── GET /teachers/me — teacher gets own profile ──
    if (req.method === 'GET' && url.pathname === '/teachers/me') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const { data, error } = await adminClient
        .from('teacher_profiles')
        .select('*, users(id,email,full_name), teacher_availability(id,day_of_week,start_time,end_time)')
        .eq('user_id', actor.userId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) {
        sendJson(res, 404, { ok: false, error: 'teacher profile not found' });
        return true;
      }
      sendJson(res, 200, { ok: true, teacher: data });
      return true;
    }

    // ── PUT /teachers/availability — replace all availability slots ──
    if (req.method === 'PUT' && url.pathname === '/teachers/availability') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const { data: profile } = await adminClient
        .from('teacher_profiles')
        .select('id')
        .eq('user_id', actor.userId)
        .maybeSingle();
      if (!profile) {
        sendJson(res, 404, { ok: false, error: 'teacher profile not found' });
        return true;
      }
      const payload = await readJson(req);
      const slots = payload.slots || [];

      // Delete existing slots
      await adminClient.from('teacher_availability').delete().eq('teacher_id', profile.id);

      // Insert new slots
      if (slots.length > 0) {
        const rows = slots.map(s => ({
          teacher_id: profile.id,
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time
        }));
        const { error: insertError } = await adminClient.from('teacher_availability').insert(rows);
        if (insertError) throw new Error(insertError.message);
      }

      sendJson(res, 200, { ok: true, message: 'availability updated' });
      return true;
    }

    // ── GET /teachers/my-hours — teacher's hour ledger summary ──
    if (req.method === 'GET' && url.pathname === '/teachers/my-hours') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const { data, error } = await adminClient
        .from('hour_ledger')
        .select('*')
        .eq('teacher_id', actor.userId)
        .eq('entry_type', 'teacher_credit')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      const totalHours = (data || []).reduce((sum, r) => sum + Number(r.hours_delta || 0), 0);
      sendJson(res, 200, { ok: true, items: data || [], total_hours: totalHours });
      return true;
    }

    // ── POST /teachers/sessions/:id/request-approval ──
    if (req.method === 'POST' && parts.length === 4 && parts[0] === 'teachers' && parts[1] === 'sessions' && parts[3] === 'request-approval') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const sessionId = parts[2];
      const { data: session, error: sErr } = await adminClient
        .from('academic_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('teacher_id', actor.userId)
        .maybeSingle();
      if (sErr) throw new Error(sErr.message);
      if (!session) {
        sendJson(res, 404, { ok: false, error: 'session not found or not yours' });
        return true;
      }

      // Update session status to completed
      await adminClient.from('academic_sessions').update({ status: 'completed', updated_at: nowIso() }).eq('id', sessionId);

      // Insert verification request as pending
      const { data: existing } = await adminClient
        .from('session_verifications')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();
      if (!existing) {
        await adminClient.from('session_verifications').insert({
          session_id: sessionId,
          status: 'pending',
          reason: 'Session completed, pending approval',
          verified_at: null
        });
      }

      sendJson(res, 200, { ok: true, message: 'approval requested' });
      return true;
    }

    // ── POST /teachers/sessions/:id/reschedule ──
    if (req.method === 'POST' && parts.length === 4 && parts[0] === 'teachers' && parts[1] === 'sessions' && parts[3] === 'reschedule') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const sessionId = parts[2];
      const payload = await readJson(req);
      if (!payload.reason) {
        sendJson(res, 400, { ok: false, error: 'reason is required for rescheduling' });
        return true;
      }

      const { data: session, error: sErr } = await adminClient
        .from('academic_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('teacher_id', actor.userId)
        .maybeSingle();
      if (sErr) throw new Error(sErr.message);
      if (!session) {
        sendJson(res, 404, { ok: false, error: 'session not found or not yours' });
        return true;
      }

      const updates = { status: 'rescheduled', updated_at: nowIso() };
      if (payload.new_date) updates.session_date = payload.new_date;
      if (payload.new_time) updates.started_at = payload.new_time;

      await adminClient.from('academic_sessions').update(updates).eq('id', sessionId);

      sendJson(res, 200, { ok: true, message: 'session rescheduled' });
      return true;
    }

    sendJson(res, 404, { ok: false, error: 'route not found' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
