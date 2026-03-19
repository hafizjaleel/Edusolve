import { getSupabaseAdminClient } from '../config/supabase.js';
import { readJson, sendJson } from '../common/http.js';
import { WaappaService } from '../waappa/waappa.service.js';
import { z } from 'zod';
import { phoneSchema, validatePayload } from '../common/validation.js';

// -- Zod Schemas --
const assignTcSchema = z.object({
  teacher_coordinator_id: z.string().uuid().nullable().optional()
});

const poolStatusSchema = z.object({
  is_in_pool: z.boolean().optional()
});

const meetingLinkSchema = z.object({
  meeting_link: z.string().max(500).optional().or(z.literal(''))
});

const updateTeacherSchema = z.object({
  experience_level: z.string().max(100).nullable().optional(),
  per_hour_rate: z.coerce.number().positive().max(10000).nullable().optional(),
  phone: phoneSchema.nullable().optional(),
  qualification: z.string().max(200).nullable().optional(),
  subjects_taught: z.array(z.string().max(100)).nullable().optional(),
  syllabus: z.array(z.string().max(100)).nullable().optional(),
  languages: z.array(z.string().max(100)).nullable().optional(),
  experience_duration: z.string().max(100).nullable().optional(),
  experience_type: z.string().max(100).nullable().optional(),
  place: z.string().max(100).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  communication_level: z.string().max(50).nullable().optional(),
  account_holder_name: z.string().max(150).nullable().optional(),
  account_number: z.string().max(50).nullable().optional(),
  ifsc_code: z.string().max(20).nullable().optional(),
  gpay_holder_name: z.string().max(150).nullable().optional(),
  gpay_number: phoneSchema.nullable().optional(),
  upi_id: z.string().max(100).nullable().optional(),
  gender: z.string().max(20).nullable().optional(),
  dob: z.string().max(20).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  pincode: z.string().max(20).nullable().optional(),
  meeting_link: z.string().max(500).nullable().optional().or(z.literal('')),
  full_name: z.string().min(2).max(100).nullable().optional()
});

const recruitSuccessSchema = z.object({
  user_id: z.string().uuid(),
  experience_level: z.string().max(100).nullable().optional(),
  per_hour_rate: z.coerce.number().positive().max(10000).nullable().optional()
});

const teacherProfileUpdateSchema = z.object({
  gender: z.string().max(20).nullable().optional(),
  dob: z.string().max(20).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  pincode: z.string().max(20).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  place: z.string().max(100).nullable().optional(),
  meeting_link: z.string().max(500).nullable().optional().or(z.literal('')),
  full_name: z.string().min(2).max(100).nullable().optional()
});

const updateAvailabilitySchema = z.object({
  slots: z.array(z.object({
    day_of_week: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time (HH:MM)'),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time (HH:MM)')
  }))
});

const rescheduleSchema = z.object({
  reason: z.string().min(5).max(500)
});


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
  if (!url.pathname.startsWith('/teachers') && url.pathname !== '/admin/tcs') return false;

  const DAY_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    sendJson(res, 500, { ok: false, error: 'supabase admin is not configured' });
    return true;
  }

  const actor = actorFromHeaders(req);

  try {
    // ─── POST /teachers/import-sheet ───────────────────────────
    if (req.method === 'POST' && url.pathname === '/teachers/import-sheet') {
      if (!['teacher_coordinator', 'super_admin'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'only teacher coordinator or super admin can import teachers' });
        return true;
      }
      const rawPayload = await readJson(req);
      const items = Array.isArray(rawPayload) ? rawPayload : [rawPayload];

      const imported = [];
      const skipped = [];
      const errors = [];

      const { data: { users: authUsers } } = await adminClient.auth.admin.listUsers();
      const existingEmails = new Set(authUsers.map(u => u.email.toLowerCase()));

      for (const item of items) {
        try {
          if (!item.email || !item.full_name) {
            errors.push({ teacher: item, error: 'email and full_name are required' });
            continue;
          }

          let authUser;
          let isNewUser = false;

          if (existingEmails.has(item.email.toLowerCase())) {
            authUser = authUsers.find(u => u.email.toLowerCase() === item.email.toLowerCase());
          } else {
            const { data: authData, error: authErr } = await adminClient.auth.admin.createUser({
              email: item.email,
              password: item.password || 'Teacher@123',
              email_confirm: true,
              app_metadata: { role: 'teacher' }
            });
            if (authErr) throw authErr;
            authUser = authData.user;
            isNewUser = true;
          }

          // Check if teacher profile already exists for this user
          const { data: existingProfile } = await adminClient
            .from('teacher_profiles')
            .select('id')
            .eq('user_id', authUser.id)
            .maybeSingle();

          if (existingProfile && !isNewUser) {
            skipped.push({ teacher: item, reason: 'already exists' });
            continue;
          }

          // Upsert users record
          const { error: userErr } = await adminClient
            .from('users')
            .upsert({ id: authUser.id, full_name: item.full_name, email: item.email, phone: item.phone || null, is_active: true });
          if (userErr) throw userErr;

          // Assign teacher role
          const { data: roleRow } = await adminClient.from('roles').select('id').eq('code', 'teacher').single();
          if (roleRow) {
            await adminClient.from('user_roles').upsert({ user_id: authUser.id, role_id: roleRow.id });
          }

          // Resolve teacher code — if provided code already used by someone else, auto-generate
          let teacherCode = item.teacher_code;
          if (teacherCode) {
            const { data: codeConflict } = await adminClient
              .from('teacher_profiles')
              .select('id')
              .eq('teacher_code', teacherCode)
              .neq('user_id', authUser.id)
              .maybeSingle();
            if (codeConflict) teacherCode = await generateTeacherCode(adminClient);
          } else {
            teacherCode = await generateTeacherCode(adminClient);
          }

          const { data: profile, error: profileErr } = await adminClient
            .from('teacher_profiles')
            .upsert({
              user_id: authUser.id,
              teacher_code: teacherCode,
              teacher_coordinator_id: actor.userId,
              experience_level: item.experience_level || 'Intermediate',
              per_hour_rate: Number(item.per_hour_rate) || 300,
              is_in_pool: true,
              onboarding_completed: true
            }, { onConflict: 'user_id' })
            .select('*')
            .single();

          if (profileErr) throw profileErr;
          imported.push({ ...profile, email: item.email, full_name: item.full_name });

        } catch (e) {
          errors.push({ teacher: item, error: e.message });
        }
      }

      sendJson(res, 200, { ok: true, imported_count: imported.length, skipped_count: skipped.length, errors });
      return true;
    }

    // ── GET /teachers/directory — fetch all teachers (AC/Admin) ──
    if (req.method === 'GET' && url.pathname === '/teachers/directory') {
      if (!['super_admin', 'teacher_coordinator'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'forbidden' });
        return true;
      }
      const { data, error } = await adminClient
        .from('teacher_profiles')
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name,phone), coordinator:users!teacher_coordinator_id(id,full_name,phone)')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // ── GET /admin/tcs — list all teacher coordinators ──
    if (req.method === 'GET' && url.pathname === '/admin/tcs') {
      if (!['super_admin', 'teacher_coordinator'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'forbidden' });
        return true;
      }
      const { data: { users }, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      if (error) throw new Error(error.message);

      const { data: dbRoles } = await adminClient.from('user_roles').select('user_id, roles(code)');
      const dbRoleMap = new Map();
      (dbRoles || []).forEach(r => {
          const code = Array.isArray(r.roles) ? r.roles[0]?.code : r.roles?.code;
          if (code) dbRoleMap.set(r.user_id, code);
      });

      const tcs = (users || [])
        .filter(u => {
             let role = u.app_metadata?.role || u.user_metadata?.role;
             if (!role || role === 'unknown') role = dbRoleMap.get(u.id);
             return role === 'teacher_coordinator';
        })
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
      const rawBody = await readJson(req);
      const body = validatePayload(res, assignTcSchema, rawBody);
      if (!body) return true;
      const teacher_coordinator_id = body.teacher_coordinator_id ?? null;
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

    // ── PATCH /teachers/bulk-pool-status — bulk toggle is_in_pool ──
    if (req.method === 'PATCH' && url.pathname === '/teachers/bulk-pool-status') {
      if (!['academic_coordinator', 'super_admin', 'teacher_coordinator'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'forbidden' });
        return true;
      }
      const rawBody = await readJson(req);
      if (!Array.isArray(rawBody.teacher_ids) || rawBody.teacher_ids.length === 0) {
        sendJson(res, 400, { ok: false, error: 'teacher_ids array required' });
        return true;
      }
      const is_in_pool = !!rawBody.is_in_pool;

      const { data, error } = await adminClient
        .from('teacher_profiles')
        .update({ is_in_pool, updated_at: nowIso() })
        .in('id', rawBody.teacher_ids)
        .select('*');

      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, count: data?.length || 0 });
      return true;
    }

    // ── PATCH /teachers/bulk-assign-tc — bulk assign teacher coordinator ──
    if (req.method === 'PATCH' && url.pathname === '/teachers/bulk-assign-tc') {
      if (actor.role !== 'super_admin') {
        sendJson(res, 403, { ok: false, error: 'super_admin role required' });
        return true;
      }
      const rawBody = await readJson(req);
      if (!Array.isArray(rawBody.teacher_ids) || rawBody.teacher_ids.length === 0) {
        sendJson(res, 400, { ok: false, error: 'teacher_ids array required' });
        return true;
      }
      const teacher_coordinator_id = rawBody.teacher_coordinator_id ?? null;

      const { data, error } = await adminClient
        .from('teacher_profiles')
        .update({ teacher_coordinator_id, updated_at: nowIso() })
        .in('id', rawBody.teacher_ids)
        .select('id, teacher_coordinator_id');

      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, count: data?.length || 0 });
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
      const rawBody = await readJson(req);
      const body = validatePayload(res, poolStatusSchema, rawBody);
      if (!body) return true;
      const is_in_pool = !!body.is_in_pool;

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
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name,phone), coordinator:users!teacher_coordinator_id(id,full_name,phone), teacher_availability(day_of_week,start_time,end_time)')
        .eq('is_in_pool', true)
        .order('created_at', { ascending: false });

      const requestedUserId = url.searchParams.get('user_id');
      if (requestedUserId) {
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
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name,phone), coordinator:users!teacher_coordinator_id(id,full_name,phone), teacher_availability(id,day_of_week,start_time,end_time)')
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
      const rawBody = await readJson(req);
      const payload = validatePayload(res, meetingLinkSchema, rawBody);
      if (!payload) return true;

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
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name,phone), coordinator:users!teacher_coordinator_id(id,full_name,phone), teacher_availability(day_of_week,start_time,end_time)')
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
        const rawBody = await readJson(req);
        const payload = validatePayload(res, updateTeacherSchema, rawBody);
        if (!payload) return true;

        const { full_name, ...updates } = payload;

        // Check if full_name is the only thing being updated
        if (Object.keys(updates).length === 0 && !full_name) {
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
        if (full_name) {
          // efficient way: get user_id from profile first? NO, we can do it in one go if we knew user_id
          // But we need to return the updated object anyway.
          const { data: current } = await adminClient.from('teacher_profiles').select('user_id').eq('id', teacherId).single();
          if (current && current.user_id) {
            await adminClient.from('users').update({ full_name }).eq('id', current.user_id);
          }
        }

        // Return updated profile
        const { data: updatedProfile, error: fetchError } = await adminClient
          .from('teacher_profiles')
          .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name,phone)')
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

      const rawBody = await readJson(req);
      const payload = validatePayload(res, recruitSuccessSchema, rawBody);
      if (!payload) return true;

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
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name,phone)')
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

      const rawBody = await readJson(req);
      const payload = validatePayload(res, teacherProfileUpdateSchema, rawBody);
      if (!payload) return true;

      const { full_name } = payload;
      
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
      if (full_name) {
        const { error: nameErr } = await adminClient
          .from('users')
          .update({ full_name })
          .eq('id', profile.user_id);
        if (nameErr) throw new Error(nameErr.message);
      }

      if (Object.keys(updates).length === 0 && !full_name) {
        sendJson(res, 400, { ok: false, error: 'no valid fields to update' });
        return true;
      }

      // Return updated profile
      const { data: updated, error: fetchErr } = await adminClient
        .from('teacher_profiles')
        .select('*, users!teacher_profiles_user_id_fkey(id,email,full_name,phone), teacher_availability(id,day_of_week,start_time,end_time)')
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
      const rawBody = await readJson(req);
      const payload = validatePayload(res, updateAvailabilitySchema, rawBody);
      if (!payload) return true;
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
      const rawBody = await readJson(req);
      const payload = validatePayload(res, rescheduleSchema, rawBody);
      if (!payload) return true;

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

    // ─── DELETE /teachers/:id ────────────────────────────────────
    if (req.method === 'DELETE' && parts.length === 2 && parts[0] === 'teachers') {
      if (!['teacher_coordinator', 'super_admin'].includes(actor.role)) {
        sendJson(res, 403, { ok: false, error: 'only teacher coordinator or super admin can delete teachers' });
        return true;
      }
      const teacherProfileId = parts[1];

      // Fetch teacher profile to get user_id
      const { data: profile } = await adminClient
        .from('teacher_profiles')
        .select('id, user_id, users!teacher_profiles_user_id_fkey(id, full_name, email)')
        .eq('id', teacherProfileId)
        .maybeSingle();
      if (!profile) {
        sendJson(res, 404, { ok: false, error: 'teacher not found' });
        return true;
      }
      const userId = profile.user_id;
      const teacherName = profile.users?.full_name || 'Unknown';

      // Delete linked data in order
      await adminClient.from('teacher_availability').delete().eq('teacher_profile_id', teacherProfileId);
      await adminClient.from('student_teacher_assignments').delete().eq('teacher_id', userId);
      // Nullify teacher_id on sessions instead of deleting sessions
      await adminClient.from('academic_sessions').update({ teacher_id: null }).eq('teacher_id', userId);
      await adminClient.from('user_roles').delete().eq('user_id', userId);
      await adminClient.from('teacher_profiles').delete().eq('id', teacherProfileId);
      await adminClient.from('users').delete().eq('id', userId);

      // Delete the Supabase Auth account
      await adminClient.auth.admin.deleteUser(userId);

      sendJson(res, 200, { ok: true, deleted: teacherName });
      return true;
    }

    sendJson(res, 404, { ok: false, error: 'route not found' });

    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
