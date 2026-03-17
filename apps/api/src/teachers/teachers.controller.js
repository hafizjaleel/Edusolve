import { getSupabaseAdminClient } from '../config/supabase.js';
import { readJson, sendJson } from '../common/http.js';
import { WaappaService } from '../waappa/waappa.service.js';

const waappaService = new WaappaService();

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
    // ── GET /teachers/directory — fetch all teachers (AC/Admin) ──
    if (req.method === 'GET' && url.pathname === '/teachers/directory') {
      if (!['super_admin', 'teacher_coordinator'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'forbidden' });
        return true;
      }
      const { data, error } = await adminClient
        .from('teacher_profiles')
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name), coordinator:users!teacher_coordinator_id(id,full_name)')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // ── GET /admin/tcs — list all teacher coordinators (super_admin only) ──
    if (req.method === 'GET' && url.pathname === '/admin/tcs') {
      if (actor.role !== 'super_admin') {
        sendJson(res, 403, { ok: false, error: 'forbidden' });
        return true;
      }
      const { data: { users }, error } = await adminClient.auth.admin.listUsers();
      if (error) throw new Error(error.message);
      const tcs = (users || [])
        .filter(u => (u.user_metadata?.role || u.app_metadata?.role) === 'teacher_coordinator')
        .map(u => ({ id: u.id, full_name: u.user_metadata?.full_name || u.user_metadata?.name || u.email, email: u.email }));
      sendJson(res, 200, { ok: true, items: tcs });
      return true;
    }


    // ── PATCH /teachers/:id/assign-tc — reassign teacher coordinator (super_admin only) ──
    const assignTcMatch = url.pathname.match(/^\/teachers\/([0-9a-fA-F-]+)\/assign-tc$/);
    if (req.method === 'PATCH' && assignTcMatch) {
      if (actor.role !== 'super_admin') {
        sendJson(res, 403, { ok: false, error: 'super_admin role required' });
        return true;
      }
      const teacherId = assignTcMatch[1];
      const body = await readJson(req);
      const teacher_coordinator_id = body?.teacher_coordinator_id ?? null;
      const { data, error } = await adminClient
        .from('teacher_profiles')
        .update({ teacher_coordinator_id, updated_at: nowIso() })
        .eq('id', teacherId)
        .select('*, coordinator:users!teacher_coordinator_id(id,full_name)')
        .single();
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, item: data });
      return true;
    }

    // ── PATCH /teachers/:id/pool-status — toggle is_in_pool ──
    const poolStatusMatch = url.pathname.match(/^\/teachers\/([0-9a-fA-F-]+)\/pool-status$/);
    if (req.method === 'PATCH' && poolStatusMatch) {
      if (!['academic_coordinator', 'super_admin', 'teacher_coordinator'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'forbidden' });
        return true;
      }
      const teacherId = poolStatusMatch[1];
      const body = await readJson(req);
      const is_in_pool = !!body?.is_in_pool;

      const { data, error } = await adminClient
        .from('teacher_profiles')
        .update({ is_in_pool, updated_at: nowIso() })
        .eq('id', teacherId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, item: data });
      return true;
    }
    if (req.method === 'GET' && url.pathname === '/teachers/pool') {
      let query = adminClient
        .from('teacher_profiles')
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name), coordinator:users!teacher_coordinator_id(id,full_name), teacher_availability(day_of_week,start_time,end_time)')
        .eq('is_in_pool', true)
        .order('created_at', { ascending: false });

      const requestedUserId = url.searchParams.get('user_id');
      if (actor.role === 'teacher_coordinator') {
        query = query.eq('teacher_coordinator_id', actor.userId);
      } else if (actor.role === 'super_admin' && requestedUserId) {
        query = query.eq('teacher_coordinator_id', requestedUserId);
      }

      const { data, error } = await query;
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

      const startDate = url.searchParams.get('start_date');
      const endDate = url.searchParams.get('end_date');

      // Fetch upcoming booked demos and active classes for all pool teachers
      const teacherUserIds = items.map(t => t.user_id).filter(Boolean);
      let bookedDemos = [];
      let assignedClasses = [];
      if (teacherUserIds.length) {
        let demosQuery = adminClient
          .from('demo_sessions')
          .select('id, teacher_id, scheduled_at, ends_at, status, leads(student_name, subject)')
          .in('teacher_id', teacherUserIds)
          .in('status', ['scheduled', 'rescheduled']);

        if (startDate && endDate) {
          demosQuery = demosQuery.gte('scheduled_at', `${startDate}T00:00:00+05:30`)
            .lte('scheduled_at', `${endDate}T23:59:59+05:30`);
        } else {
          demosQuery = demosQuery.gte('scheduled_at', new Date().toISOString());
        }

        const { data: demos } = await demosQuery;
        bookedDemos = demos || [];

        let sessionsQuery = adminClient
          .from('academic_sessions')
          .select('id, teacher_id, session_date, started_at, duration_hours, status')
          .in('teacher_id', teacherUserIds)
          .in('status', ['scheduled', 'rescheduled', 'completed']);

        if (startDate && endDate) {
          sessionsQuery = sessionsQuery.gte('session_date', startDate)
            .lte('session_date', endDate);
        } else {
          const todayStr = new Date().toISOString().slice(0, 10);
          sessionsQuery = sessionsQuery.gte('session_date', todayStr);
        }

        const { data: sessions } = await sessionsQuery;
        assignedClasses = sessions || [];
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
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name), coordinator:users!teacher_coordinator_id(id,full_name), teacher_availability(id,day_of_week,start_time,end_time)')
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
        .select('id, student_id, subject, meeting_link, students(student_name, student_code, class_level)')
        .eq('teacher_id', actor.userId);

      if (error) throw new Error(error.message);

      // Group by student
      const studentMap = {};
      (data || []).forEach(row => {
        if (!row.students || !row.students.student_name) return;
        const sid = row.student_id;
        if (!studentMap[sid]) {
          studentMap[sid] = {
            student_id: sid,
            student_name: row.students.student_name,
            student_code: row.students.student_code,
            student_class: row.students.class_level,
            subjects: [],
            meeting_link: row.meeting_link || ''
          };
        }
        if (row.subject && !studentMap[sid].subjects.includes(row.subject)) {
          studentMap[sid].subjects.push(row.subject);
        }
        // Take the first available meeting link if not set
        if (!studentMap[sid].meeting_link && row.meeting_link) {
          studentMap[sid].meeting_link = row.meeting_link;
        }
      });

      const groupedStudents = Object.values(studentMap).sort((a, b) => a.student_name.localeCompare(b.student_name));
      sendJson(res, 200, { ok: true, items: groupedStudents });
      return true;
    }

    // ── PATCH /teachers/my-students/:studentId/meeting-link — update specific meeting link ──
    const studentMatch = url.pathname.match(/^\/teachers\/my-students\/([0-9a-fA-F-]+)\/meeting-link$/);
    if (req.method === 'PATCH' && studentMatch) {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const studentId = studentMatch[1];
      const payload = await readJson(req);

      // Verify the student is assigned to this teacher
      const { data: assignments, error: checkErr } = await adminClient
        .from('student_teacher_assignments')
        .select('id')
        .eq('student_id', studentId)
        .eq('teacher_id', actor.userId)
        .limit(1);

      if (checkErr) throw new Error(checkErr.message);
      if (!assignments || assignments.length === 0) {
        sendJson(res, 404, { ok: false, error: 'Student not found or unauthorized' });
        return true;
      }

      // Update all assignments for this student-teacher pair
      const { error: updateErr } = await adminClient
        .from('student_teacher_assignments')
        .update({ meeting_link: payload.meeting_link || null, updated_at: nowIso() })
        .eq('student_id', studentId)
        .eq('teacher_id', actor.userId);

      if (updateErr) throw new Error(updateErr.message);

      sendJson(res, 200, { ok: true, message: 'Meeting link updated successfully' });
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

    // ── GET /teachers/my-salary — teacher's current month salary summary ──
    if (req.method === 'GET' && url.pathname === '/teachers/my-salary') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }

      // Get teacher profile
      const { data: profile, error: pErr } = await adminClient
        .from('teacher_profiles')
        .select('id, user_id')
        .eq('user_id', actor.userId)
        .maybeSingle();
      if (pErr) throw new Error(pErr.message);
      if (!profile) {
        sendJson(res, 404, { ok: false, error: 'profile not found' });
        return true;
      }

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      // Dynamically calculate total earned from approved sessions
      const { calculateAllTeacherSalaries } = await import('../hr/salary.service.js');
      const report = await calculateAllTeacherSalaries(currentMonth, currentYear);
      const teacherData = report.find(t => t.user_id === actor.userId);
      const totalEarned = teacherData ? teacherData.total_salary : 0;
      const totalHours = teacherData ? teacherData.total_hours : 0;

      // Fetch all payment requests for this teacher (all-time)
      const { data: paymentRequests } = await adminClient
        .from('hr_payment_requests')
        .select('total_amount, status')
        .eq('teacher_id', profile.id);

      let paid = 0;
      let payable = 0;
      (paymentRequests || []).forEach(pr => {
        if (pr.status === 'paid') paid += Number(pr.total_amount || 0);
        if (pr.status === 'pending' || pr.status === 'approved') payable += Number(pr.total_amount || 0);
      });

      sendJson(res, 200, {
        ok: true,
        salary: {
          total_earned: Math.round(totalEarned * 100) / 100,
          total_hours: Math.round(totalHours * 100) / 100,
          paid: Math.round(paid * 100) / 100,
          payable: Math.round(payable * 100) / 100,
          month: currentMonth,
          year: currentYear
        }
      });
      return true;
    }

    // ── GET /teachers/my-invoices — view paid HR payment requests as invoices ──
    if (req.method === 'GET' && url.pathname === '/teachers/my-invoices') {
      if (actor.role !== 'teacher') return sendJson(res, 403, { ok: false, error: 'teacher role required' });

      // Get teacher profile id
      const { data: profile } = await adminClient.from('teacher_profiles').select('id').eq('user_id', actor.userId).single();
      if (!profile) return sendJson(res, 404, { ok: false, error: 'profile not found' });

      // Fetch payment requests for this teacher
      const { data: invoices, error } = await adminClient
        .from('hr_payment_requests')
        .select('*')
        .eq('teacher_id', profile.id)
        .eq('status', 'paid')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, invoices: invoices || [] });
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
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name), coordinator:users!teacher_coordinator_id(id,full_name), teacher_availability(day_of_week,start_time,end_time)')
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
          .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name)')
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
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name)')
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
        .select('id, user_id, onboarding_completed')
        .eq('user_id', actor.userId)
        .maybeSingle();
      if (pErr) throw new Error(pErr.message);
      if (!profile) {
        sendJson(res, 404, { ok: false, error: 'teacher profile not found' });
        return true;
      }

      const payload = await readJson(req);
      
      // Fields allowed for self-edit after onboarding
      const selfAllowedAfterOnboarding = ['gender', 'dob', 'address', 'pincode', 'city', 'place', 'meeting_link'];
      
      // Fields allowed during onboarding (includes professional and bank details)
      const onboardingAllowed = [
        'experience_level', 'per_hour_rate', 'phone', 'qualification',
        'subjects_taught', 'syllabus', 'languages', 'experience_duration',
        'experience_type', 'place', 'city', 'communication_level',
        'account_holder_name', 'account_number', 'ifsc_code',
        'gpay_holder_name', 'gpay_number', 'upi_id',
        'gender', 'dob', 'address', 'pincode', 'meeting_link'
      ];

      const isDuringOnboarding = profile.onboarding_completed === false;
      const allowedFields = isDuringOnboarding ? onboardingAllowed : selfAllowedAfterOnboarding;

      const updates = {};
      for (const k of allowedFields) {
        if (payload[k] !== undefined) updates[k] = payload[k];
      }

      // Handle onboarding completion
      if (payload.is_completing_onboarding === true) {
        updates.onboarding_completed = true;
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
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name), teacher_availability(id,day_of_week,start_time,end_time)')
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

    // ── GET /teachers/materials/:studentId — get material transfer history ──
    const materialHistoryMatch = url.pathname.match(/^\/teachers\/materials\/([0-9a-fA-F-]+)$/);
    if (req.method === 'GET' && materialHistoryMatch) {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'teacher role required' });
        return true;
      }
      const studentId = materialHistoryMatch[1];

      const { data, error } = await adminClient
        .from('material_transfers')
        .select('*')
        .eq('teacher_id', actor.userId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: true }) // Chat order
        .limit(50);

      if (error) throw new Error(error.message);

      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/teachers/send-material') {
      if (actor.role !== 'teacher') {
        sendJson(res, 403, { ok: false, error: 'Only teachers can send materials directly' });
        return true;
      }

      const payload = await readJson(req);
      if (!payload.student_id || !payload.subject) {
        sendJson(res, 400, { ok: false, error: 'Missing student ID or subject' });
        return true;
      }

      // 1. Validate Teacher is assigned to this Student for that subject
      const { data: assignment, error: aErr } = await adminClient
        .from('student_teacher_assignments')
        .select(`
          id, subject,
          students ( id, group_jid, academic_coordinator_id, student_name )
        `)
        .eq('student_id', payload.student_id)
        .eq('teacher_id', actor.userId)
        .eq('subject', payload.subject)
        .eq('is_active', true)
        .maybeSingle();

      if (aErr || !assignment || !assignment.students) {
        sendJson(res, 403, { ok: false, error: 'You are not actively assigned to this student for this subject.' });
        return true;
      }

      const student = assignment.students;
      if (!student.group_jid) {
        sendJson(res, 400, { ok: false, error: 'Student does not have a connected WhatsApp group.' });
        return true;
      }

      // 2. Locate the assigned AC's session by their user_id
      const { data: acSession } = await adminClient
        .from('whatsapp_sessions')
        .select('*')
        .eq('user_id', student.academic_coordinator_id)
        .eq('status', 'WORKING')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // We still log the attempt even if the session is offline, but it's "failed"
      const theSessionName = acSession?.session_name || null;
      const isOnline = !!theSessionName;

      // Ensure teacher name is fetched for the caption footprint
      const { data: teacherMeta } = await adminClient.from('users').select('full_name').eq('id', actor.userId).single();
      const teacherName = teacherMeta ? teacherMeta.full_name : 'Your Teacher';

      // Simple caption: 📚 Subject - Teacher Name (+ optional note)
      let captionStr = `📚 ${payload.subject} - ${teacherName} (Teacher)`;
      if (payload.caption_text) captionStr += `\n${payload.caption_text}`;

      // Insert Row into material_transfers immediately
      const insertRecord = {
        student_id: student.id,
        teacher_id: actor.userId,
        ac_id: student.academic_coordinator_id,
        subject: payload.subject,
        file_url: payload.file_url || null,
        mimetype: payload.mimetype || 'text',
        caption_text: captionStr,
        status: isOnline ? 'pending' : 'failed',
        error_message: isOnline ? null : 'Assigned Coordinator WhatsApp session is offline.'
      };

      const { data: row, error: insErr } = await adminClient.from('material_transfers').insert(insertRecord).select('id').single();
      if (insErr) {
        sendJson(res, 500, { ok: false, error: 'Failed to record transfer in database.' });
        return true;
      }

      if (!isOnline) {
        sendJson(res, 200, {
          ok: true,
          queued: true,
          message: 'AC Controller WhatsApp is offline. The material has been queued for them to send.'
        });
        return true;
      }

      // 3. Assemble Waappa API request
      const WAAPPA_BASE = process.env.WAAPPA_BASE_URL || 'http://main.waappa.com';
      const WAAPPA_KEY = acSession.api_key || process.env.WAAPPA_API_KEY || 'yoursecretkey';

      // Ensure group_jid has the @g.us suffix required by Waappa
      const groupJid = student.group_jid.includes('@') ? student.group_jid : `${student.group_jid}@g.us`;

      try {
        if (!payload.file_url) {
          const textRes = await waappaService.sendText(theSessionName, WAAPPA_KEY, groupJid, captionStr);
          console.log('[send-material] Waappa SendText res:', JSON.stringify(textRes).substring(0, 200));
          const sentMsgId = textRes?.data?.id || textRes?.id || textRes?.response?.id || textRes?.messageId || textRes?.[0]?.id;
          if (sentMsgId) {
            const { error: insertErr } = await adminClient.from('whatsapp_messages').insert({
              id: sentMsgId,
              session_name: theSessionName,
              from_jid: theSessionName,
              to_jid: groupJid,
              from_me: true,
              body: captionStr || '',
              has_media: false,
              sender_role: 'teacher',
              contact_type: 'student',
              contact_phone: groupJid,
              timestamp: Math.floor(Date.now() / 1000)
            });
            if (insertErr) {
              console.error('[send-material] pre-insert text msg error:', insertErr.message);
            }
          } else {
            console.warn('[send-material] Could not extract sent text message ID from Waappa response.');
          }
        } else {
          // For audio, send text caption first since sendVoice doesn't support captions
          if ((payload.mimetype || '').toLowerCase().startsWith('audio/')) {
            await waappaService.sendText(theSessionName, WAAPPA_KEY, groupJid, captionStr);
          }
          const mediaRes = await waappaService.sendMedia(theSessionName, WAAPPA_KEY, groupJid, payload.file_url, payload.mimetype, captionStr, payload.filename);

          console.log('[send-material] Waappa SendMedia res:', JSON.stringify(mediaRes).substring(0, 300));

          // Depending on API version, Waqppa returns { data: { id } }, { response: { id } } or { messageId }
          const sentMsgId = mediaRes?.data?.id || mediaRes?.id || mediaRes?.response?.id || mediaRes?.messageId || mediaRes?.[0]?.id;

          // Pre-populate the whatsapp_messages table so the webhook doesn't try to download it
          if (sentMsgId) {
            const { error: insertErr } = await adminClient.from('whatsapp_messages').insert({
              id: sentMsgId,
              session_name: theSessionName,
              from_jid: theSessionName,
              to_jid: groupJid,
              from_me: true,
              body: captionStr || '',
              has_media: true,
              media_url: payload.file_url,
              media_name: payload.filename,
              media_type: payload.mimetype,
              sender_role: 'teacher',
              contact_type: 'student',
              contact_phone: groupJid,
              timestamp: Math.floor(Date.now() / 1000)
            });
            if (insertErr) {
              console.error('[send-material] pre-insert msg error:', insertErr.message);
            }
          } else {
            console.warn('[send-material] Could not extract sent message ID from Waappa response.');
          }
        }

        // Overwrite status to sent
        await adminClient.from('material_transfers').update({ status: 'sent', error_message: null }).eq('id', row.id);

        sendJson(res, 200, { ok: true, message: 'Material sent successfully' });

      } catch (extError) {
        console.error('Waappa transfer failed:', extError.message);
        await adminClient.from('material_transfers')
          .update({ status: 'failed', error_message: extError.message || 'Waappa Request Error' })
          .eq('id', row.id);

        sendJson(res, 500, { ok: false, error: 'Waappa Delivery failed. Marked as failed.' });
      }

      return true;
    }

    sendJson(res, 404, { ok: false, error: 'route not found' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
