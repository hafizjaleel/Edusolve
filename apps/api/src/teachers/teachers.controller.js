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

  const DAY_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
        .select('*, users(id,email,full_name), coordinator:users!teacher_coordinator_id(id,full_name), teacher_availability(day_of_week,start_time,end_time)')
        .eq('is_in_pool', true)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);

      const items = (data || []).map(p => {
        if (p.teacher_availability) {
          p.teacher_availability = p.teacher_availability.map(s => ({
            ...s,
            day_of_week: typeof s.day_of_week === 'number' ? DAY_MAP[s.day_of_week] : s.day_of_week
          }));
        }
        return p;
      });

      // Fetch upcoming booked demos and active classes for all pool teachers
      const teacherUserIds = items.map(t => t.user_id).filter(Boolean);
      let bookedDemos = [];
      let assignedClasses = [];
      if (teacherUserIds.length) {
        const { data: demos } = await adminClient
          .from('demo_sessions')
          .select('id, teacher_id, scheduled_at, ends_at, status, leads(student_name, subject)')
          .in('teacher_id', teacherUserIds)
          .eq('status', 'scheduled')
          .gte('scheduled_at', new Date().toISOString());
        bookedDemos = demos || [];

        const { data: assignments } = await adminClient
          .from('student_teacher_assignments')
          .select('id, teacher_id, day, time, students(student_name)')
          .in('teacher_id', teacherUserIds)
          .eq('is_active', true);
        assignedClasses = assignments || [];
      }

      // Attach booked demos and assigned classes to each teacher
      for (const t of items) {
        t.booked_demos = bookedDemos.filter(d => d.teacher_id === t.user_id);
        t.assigned_classes = assignedClasses.filter(a => a.teacher_id === t.user_id);
      }

      sendJson(res, 200, { ok: true, items });
      return true;
    }




    // ── GET /teachers/my-demos — teacher's upcoming demo sessions ──
    if (req.method === 'GET' && url.pathname === '/teachers/my-demos') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const { data, error } = await adminClient
        .from('demo_sessions')
        .select('*, leads(student_name, subject, class_level, contact_number)')
        .eq('teacher_id', actor.userId)
        .in('status', ['scheduled'])
        .order('scheduled_at', { ascending: true });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
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
        .select('*, users(id,email,full_name), coordinator:users!teacher_coordinator_id(id,full_name), teacher_availability(id,day_of_week,start_time,end_time)')
        .eq('user_id', actor.userId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) {
        sendJson(res, 404, { ok: false, error: 'teacher profile not found' });
        return true;
      }
      if (data.teacher_availability) {
        data.teacher_availability = data.teacher_availability.map(s => ({
          ...s,
          day_of_week: typeof s.day_of_week === 'number' ? DAY_MAP[s.day_of_week] : s.day_of_week
        }));
      }
      sendJson(res, 200, { ok: true, teacher: data });
      return true;
    }

    // ── GET /teachers/my-students — teacher's allocated students ──
    if (req.method === 'GET' && url.pathname === '/teachers/my-students') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const { data, error } = await adminClient
        .from('student_teacher_assignments')
        .select('student_id, students(student_name, student_code)')
        .eq('teacher_id', actor.userId);

      if (error) throw new Error(error.message);

      // Deduplicate students
      const map = new Map();
      (data || []).forEach(row => {
        if (row.students && row.students.student_name) {
          map.set(row.student_id, { id: row.student_id, name: row.students.student_name });
        }
      });

      const uniqueStudents = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
      sendJson(res, 200, { ok: true, items: uniqueStudents });
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

    // ── GET /teachers/:id/availability — teacher availability with booked slots ──
    const parts = url.pathname.split('/').filter(Boolean);

    if (req.method === 'GET' && parts.length === 3 && parts[0] === 'teachers' && parts[2] === 'availability') {
      const teacherUserId = parts[1];
      const startDate = url.searchParams.get('start_date');
      const endDate = url.searchParams.get('end_date');

      if (!startDate || !endDate) {
        sendJson(res, 400, { ok: false, error: 'start_date and end_date are required' });
        return true;
      }

      // Get teacher profile and availability
      const { data: profile, error: pErr } = await adminClient
        .from('teacher_profiles')
        .select('id, teacher_availability(day_of_week, start_time, end_time)')
        .eq('user_id', teacherUserId)
        .maybeSingle();

      if (pErr) throw new Error(pErr.message);

      // Get booked classes within range for this teacher
      const { data: classes, error: cErr } = await adminClient
        .from('academic_sessions')
        .select('session_date, started_at, duration_hours')
        .eq('teacher_id', teacherUserId)
        .gte('session_date', startDate)
        .lte('session_date', endDate)
        .in('status', ['completed', 'rescheduled', 'scheduled']); // Using valid enums

      if (cErr) throw new Error(cErr.message);

      // Get booked demos within range
      const { data: demos, error: dErr } = await adminClient
        .from('demo_sessions')
        .select('scheduled_at, ends_at')
        .eq('teacher_id', teacherUserId)
        .gte('scheduled_at', `${startDate}T00:00:00.000Z`)
        .lte('scheduled_at', `${endDate}T23:59:59.999Z`)
        .in('status', ['scheduled', 'rescheduled']);

      if (dErr) throw new Error(dErr.message);

      sendJson(res, 200, {
        ok: true,
        availability: profile ? (profile.teacher_availability || []) : [],
        classes: classes || [],
        demos: demos || []
      });
      return true;
    }

    if (req.method === 'GET' && parts.length === 2 && parts[0] === 'teachers') {
      if (!canViewTeacherProfile(actor)) {
        sendJson(res, 403, { ok: false, error: 'role not allowed for teacher profile' });
        return true;
      }

      const teacherId = parts[1];
      const { data, error } = await adminClient
        .from('teacher_profiles')
        .select('*, users(id,email,full_name), coordinator:users!teacher_coordinator_id(id,full_name), teacher_availability(day_of_week,start_time,end_time)')
        .eq('id', teacherId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) {
        sendJson(res, 404, { ok: false, error: 'teacher profile not found' });
        return true;
      }
      if (data.teacher_availability) {
        data.teacher_availability = data.teacher_availability.map(s => ({
          ...s,
          day_of_week: typeof s.day_of_week === 'number' ? DAY_MAP[s.day_of_week] : s.day_of_week
        }));
      }
      sendJson(res, 200, { ok: true, teacher: data });
      return true;
    }

    // ── PATCH /teachers/:id — update teacher profile ──
    if (req.method === 'PATCH' && parts.length === 2 && parts[0] === 'teachers') {
      try {
        if (!isTeacherCoordinator(actor) && actor.role !== 'super_admin') {
          sendJson(res, 403, { ok: false, error: 'role not allowed to update teacher profile' });
          return true;
        }
        const teacherId = parts[1];
        const payload = await readJson(req);

        // Whitelist allowed fields for update
        const allowed = [
          'experience_level', 'per_hour_rate', 'phone', 'qualification',
          'subjects_taught', 'syllabus', 'languages', 'experience_duration',
          'experience_type', 'place', 'city', 'communication_level',
          'account_holder_name', 'account_number', 'ifsc_code',
          'gpay_holder_name', 'gpay_number', 'upi_id',
          'gender', 'dob', 'address', 'pincode', 'meeting_link'
        ];

        const updates = {};
        for (const k of allowed) {
          if (payload[k] !== undefined) updates[k] = payload[k];
        }

        // Check if full_name is the only thing being updated
        if (Object.keys(updates).length === 0 && !payload.full_name) {
          sendJson(res, 400, { ok: false, error: 'no valid fields to update' });
          return true;
        }

        if (Object.keys(updates).length > 0) {
          updates.updated_at = nowIso();
          const { error: updateError } = await adminClient
            .from('teacher_profiles')
            .update(updates)
            .eq('id', teacherId);
          if (updateError) throw new Error(updateError.message);
        }

        // Also allow updating user full name if provided
        if (payload.full_name) {
          // efficient way: get user_id from profile first? NO, we can do it in one go if we knew user_id
          // But we need to return the updated object anyway.
          const { data: current } = await adminClient.from('teacher_profiles').select('user_id').eq('id', teacherId).single();
          if (current && current.user_id) {
            await adminClient.from('users').update({ full_name: payload.full_name }).eq('id', current.user_id);
          }
        }

        // Return updated profile
        const { data: updatedProfile, error: fetchError } = await adminClient
          .from('teacher_profiles')
          .select('*, users(id,email,full_name)')
          .eq('id', teacherId)
          .single();

        if (fetchError) throw new Error(fetchError.message);

        sendJson(res, 200, { ok: true, teacher: updatedProfile });
        return true;
      } catch (e) {
        sendJson(res, 500, { ok: false, error: e.message });
        return true;
      }
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


    // ── PUT /teachers/me/profile — teacher self-edit allowed fields ──
    if (req.method === 'PUT' && url.pathname === '/teachers/me/profile') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const { data: profile, error: pErr } = await adminClient
        .from('teacher_profiles')
        .select('id, user_id')
        .eq('user_id', actor.userId)
        .maybeSingle();
      if (pErr) throw new Error(pErr.message);
      if (!profile) {
        sendJson(res, 404, { ok: false, error: 'teacher profile not found' });
        return true;
      }

      const payload = await readJson(req);
      const selfAllowed = ['gender', 'dob', 'address', 'pincode', 'city', 'place', 'meeting_link'];
      const updates = {};
      for (const k of selfAllowed) {
        if (payload[k] !== undefined) updates[k] = payload[k];
      }

      if (Object.keys(updates).length > 0) {
        updates.updated_at = nowIso();
        const { error: updateError } = await adminClient
          .from('teacher_profiles')
          .update(updates)
          .eq('id', profile.id);
        if (updateError) throw new Error(updateError.message);
      }

      // Update full_name in users table if provided
      if (payload.full_name) {
        const { error: nameErr } = await adminClient
          .from('users')
          .update({ full_name: payload.full_name })
          .eq('id', profile.user_id);
        if (nameErr) throw new Error(nameErr.message);
      }

      if (Object.keys(updates).length === 0 && !payload.full_name) {
        sendJson(res, 400, { ok: false, error: 'no valid fields to update' });
        return true;
      }

      // Return updated profile
      const { data: updated, error: fetchErr } = await adminClient
        .from('teacher_profiles')
        .select('*, users(id,email,full_name), teacher_availability(id,day_of_week,start_time,end_time)')
        .eq('id', profile.id)
        .single();
      if (fetchErr) throw new Error(fetchErr.message);

      sendJson(res, 200, { ok: true, teacher: updated });
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
      await adminClient.from('teacher_availability').delete().eq('teacher_profile_id', profile.id);

      // Insert new slots
      if (slots.length > 0) {
        const rows = slots.map(s => {
          const dayIndex = DAY_MAP.indexOf(s.day_of_week);
          if (dayIndex === -1) throw new Error(`Invalid day: ${s.day_of_week}`);
          return {
            teacher_profile_id: profile.id,
            day_of_week: dayIndex,
            start_time: s.start_time,
            end_time: s.end_time
          };
        });
        const { error: insertError } = await adminClient.from('teacher_availability').insert(rows);
        if (insertError) throw new Error(insertError.message);
      }

      sendJson(res, 200, { ok: true, message: 'availability updated' });
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
      const { error: updateErr } = await adminClient.from('academic_sessions').update({ status: 'completed' }).eq('id', sessionId);
      if (updateErr) throw new Error('Failed to update session: ' + updateErr.message);

      // Insert verification request as pending
      // First, delete any old, resolved verification requests (approved/rejected) to bypass the UNIQUE session_id constraint
      await adminClient.from('session_verifications').delete().eq('session_id', sessionId).neq('status', 'pending');

      const { error: insertErr } = await adminClient.from('session_verifications').insert({
        session_id: sessionId,
        verifier_id: actor.userId,
        status: 'pending',
        type: 'approval',           // Explicitly tag this as 'approval' so it shows up in Coordinator Tab
        reason: 'Session completed, pending approval',
        verified_at: null
      });
      if (insertErr) throw new Error('Failed to create verification: ' + insertErr.message);

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

      // Check if there's already a pending reschedule request
      const { data: existingReq } = await adminClient
        .from('session_verifications')
        .select('id')
        .eq('session_id', sessionId)
        .eq('type', 'reschedule')
        .eq('status', 'pending')
        .maybeSingle();
      if (existingReq) {
        sendJson(res, 400, { ok: false, error: 'A reschedule request is already pending for this session' });
        return true;
      }

      // Create a pending reschedule verification request
      // First, delete any old, resolved verification requests (approved/rejected) to bypass the UNIQUE session_id constraint
      await adminClient.from('session_verifications').delete().eq('session_id', sessionId).neq('status', 'pending');

      const { error: insertErr } = await adminClient.from('session_verifications').insert({
        session_id: sessionId,
        verifier_id: actor.userId,
        type: 'reschedule',
        status: 'pending',
        reason: payload.reason,
        new_date: payload.new_date || null,
        new_time: payload.new_time || null,
        new_duration: payload.new_duration ? Number(payload.new_duration) : null,
        verified_at: null
      });
      if (insertErr) throw new Error('Failed to create reschedule request: ' + insertErr.message);

      sendJson(res, 200, { ok: true, message: 'Reschedule request sent for coordinator approval' });
      return true;
    }

    sendJson(res, 404, { ok: false, error: 'route not found' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
