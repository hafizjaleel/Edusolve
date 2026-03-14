import { getSupabaseAdminClient } from '../config/supabase.js';
import { readJson, sendJson } from '../common/http.js';
import { calculateAllTeacherSalaries } from './salary.service.js';

const nowIso = () => new Date().toISOString();

function actorFromHeaders(req) {
  const rawRole = req.headers['x-user-role'];
  const rawId = req.headers['x-user-id'];
  return {
    role: typeof rawRole === 'string' ? rawRole : 'unknown',
    userId: typeof rawId === 'string' ? rawId : ''
  };
}

function isHR(actor) {
  return actor.role === 'hr' || actor.role === 'super_admin';
}

export async function handleHR(req, res, url) {
  if (!url.pathname.startsWith('/hr')) return false;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    sendJson(res, 500, { ok: false, error: 'supabase admin is not configured' });
    return true;
  }

  const actor = actorFromHeaders(req);

  // Allow counselors to access specific endpoints for their dashboard
  const isCounselorPath = [
    '/hr/councilor-profiles',
    '/hr/councilor-levels',
    '/hr/councilors/sales-report',
    '/hr/attendance/report'
  ].some(p => url.pathname.startsWith(p));
  const isCounselorRole = actor.role === 'counselor' || actor.role === 'counselor_head';

  if (!isHR(actor) && !(isCounselorPath && isCounselorRole)) {
    sendJson(res, 403, { ok: false, error: 'HR role required' });
    return true;
  }

  const parts = url.pathname.split('/').filter(Boolean);

  try {
    // ═══════ DASHBOARD STATS ═══════
    if (req.method === 'GET' && url.pathname === '/hr/stats') {
      const today = new Date().toISOString().slice(0, 10);

      // Date helpers
      const todayDate = new Date();
      // Week: Monday–Sunday
      const dayOfWeek = todayDate.getDay(); // 0=Sun
      const diffToMon = (dayOfWeek + 6) % 7;
      const weekStart = new Date(todayDate); weekStart.setDate(todayDate.getDate() - diffToMon);
      const weekStartStr = weekStart.toISOString().slice(0, 10);
      // This month
      const monthStart = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-01`;
      const monthEnd = today;
      // Last month
      const lastMonthDate = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1);
      const lastMonthStart = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
      const lastMonthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0).toISOString().slice(0, 10);

      // Fetch all active staff employees
      const { data: allEmployees } = await adminClient.from('employees').select('id, is_active, employee_type').eq('is_active', true);
      const staffIds = (allEmployees || []).filter(e => e.employee_type === 'staff').map(e => e.id);
      const totalEmployees = (allEmployees || []).length;
      const totalStaff = staffIds.length;

      // Fetch attendance for all needed ranges at once — staff only
      const [todayRec, weekRec, monthRec, lastMonthRec] = await Promise.all([
        adminClient.from('attendance_records').select('employee_id, status').eq('attendance_date', today).in('employee_id', staffIds.length ? staffIds : ['no-match']),
        adminClient.from('attendance_records').select('employee_id, status').gte('attendance_date', weekStartStr).lte('attendance_date', today).in('employee_id', staffIds.length ? staffIds : ['no-match']),
        adminClient.from('attendance_records').select('employee_id, status').gte('attendance_date', monthStart).lte('attendance_date', monthEnd).in('employee_id', staffIds.length ? staffIds : ['no-match']),
        adminClient.from('attendance_records').select('employee_id, status').gte('attendance_date', lastMonthStart).lte('attendance_date', lastMonthEnd).in('employee_id', staffIds.length ? staffIds : ['no-match'])
      ]);

      function summarise(records) {
        const r = records?.data || [];
        return {
          present: r.filter(a => a.status === 'present').length,
          absent: r.filter(a => a.status === 'absent').length,
          half_day: r.filter(a => a.status === 'half_day').length,
        };
      }

      const todaySummary = summarise(todayRec);

      const { data: pendingRequests } = await adminClient.from('hr_payment_requests').select('id').eq('status', 'pending');

      sendJson(res, 200, {
        ok: true,
        stats: {
          totalEmployees,
          totalStaff,
          todayPresent: todaySummary.present,
          todayAbsent: todaySummary.absent,
          todayHalfDay: todaySummary.half_day,
          todayLeave: (todayRec?.data || []).filter(a => a.status === 'leave').length,
          todayMarked: (todayRec?.data || []).length,
          pendingPaymentRequests: (pendingRequests || []).length,
          periods: {
            today: { ...todaySummary, total_staff: totalStaff, label: 'Today' },
            week: { ...summarise(weekRec), total_staff: totalStaff, label: 'This Week' },
            month: { ...summarise(monthRec), total_staff: totalStaff, label: 'This Month' },
            last_month: { ...summarise(lastMonthRec), total_staff: totalStaff, label: 'Last Month' },
          }
        }
      });
      return true;
    }

    // ═══════ EMPLOYEES ═══════
    if (req.method === 'GET' && url.pathname === '/hr/employees') {
      const { data, error } = await adminClient
        .from('employees')
        .select('*, salary_structures(*)')
        .order('full_name');
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/hr/employees') {
      const payload = await readJson(req);
      if (!payload.full_name) {
        sendJson(res, 400, { ok: false, error: 'full_name is required' });
        return true;
      }
      const { data, error } = await adminClient.from('employees').insert({
        full_name: payload.full_name,
        email: payload.email || null,
        phone: payload.phone || null,
        designation: payload.designation || null,
        department: payload.department || null,
        employee_type: payload.employee_type || 'staff',
        user_id: payload.user_id || null,
        is_active: true,
        joined_date: payload.joined_date || new Date().toISOString().slice(0, 10)
      }).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, employee: data });
      return true;
    }

    if (req.method === 'PATCH' && parts.length === 3 && parts[1] === 'employees') {
      const empId = parts[2];
      const payload = await readJson(req);
      const updates = { updated_at: nowIso() };
      if (payload.full_name !== undefined) updates.full_name = payload.full_name;
      if (payload.email !== undefined) updates.email = payload.email;
      if (payload.phone !== undefined) updates.phone = payload.phone;
      if (payload.designation !== undefined) updates.designation = payload.designation;
      if (payload.department !== undefined) updates.department = payload.department;
      if (payload.employee_type !== undefined) updates.employee_type = payload.employee_type;
      if (payload.is_active !== undefined) updates.is_active = payload.is_active;

      const { data, error } = await adminClient.from('employees').update(updates).eq('id', empId).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, employee: data });
      return true;
    }

    // ═══════ USERS LIST (for linking employees to system users) ═══════
    if (req.method === 'GET' && url.pathname === '/hr/users') {
      const { data, error } = await adminClient
        .from('users')
        .select('id, full_name, email')
        .eq('is_active', true)
        .order('full_name');
      if (error) throw new Error(error.message);

      // Exclude super_admin users
      const { data: adminRoles } = await adminClient
        .from('roles')
        .select('id')
        .eq('code', 'super_admin')
        .maybeSingle();

      let filtered = data || [];
      if (adminRoles) {
        const { data: adminUserIds } = await adminClient
          .from('user_roles')
          .select('user_id')
          .eq('role_id', adminRoles.id);
        const adminIds = new Set((adminUserIds || []).map(u => u.user_id));
        filtered = filtered.filter(u => !adminIds.has(u.id));
      }

      sendJson(res, 200, { ok: true, items: filtered });
      return true;
    }

    // ═══════ ATTENDANCE ═══════
    if (req.method === 'GET' && url.pathname === '/hr/attendance') {
      const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);
      const { data: employees } = await adminClient
        .from('employees')
        .select('id, full_name, designation, department, employee_type')
        .eq('is_active', true)
        .order('full_name');

      const { data: records } = await adminClient
        .from('attendance_records')
        .select('*')
        .eq('attendance_date', date);

      // Merge: return employee list with their attendance for that date
      const recordMap = {};
      (records || []).forEach(r => { recordMap[r.employee_id] = r; });

      const merged = (employees || []).map(emp => ({
        ...emp,
        attendance: recordMap[emp.id] || null
      }));

      sendJson(res, 200, { ok: true, date, items: merged });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/hr/attendance') {
      const payload = await readJson(req);
      if (!payload.date || !Array.isArray(payload.records) || payload.records.length === 0) {
        sendJson(res, 400, { ok: false, error: 'date and records[] are required' });
        return true;
      }

      // Resolve marked_by: actor.userId may be an auth UUID — check if it exists in users table
      let markedBy = null;
      if (actor.userId && actor.userId !== 'dev-user') {
        const { data: userRow } = await adminClient.from('users').select('id').eq('id', actor.userId).maybeSingle();
        if (userRow) markedBy = userRow.id;
      }

      const upserts = payload.records.map(r => ({
        employee_id: r.employee_id,
        attendance_date: payload.date,
        status: r.status || 'present',
        check_in: r.check_in || null,
        check_out: r.check_out || null,
        notes: r.notes || null,
        marked_by: markedBy,
        updated_at: nowIso()
      }));

      const { data, error } = await adminClient
        .from('attendance_records')
        .upsert(upserts, { onConflict: 'employee_id,attendance_date' })
        .select('*');
      if (error) throw new Error(error.message);

      sendJson(res, 200, { ok: true, count: (data || []).length });
      return true;
    }

    // ═══════ MONTHLY ATTENDANCE REPORT ═══════
    if (req.method === 'GET' && url.pathname === '/hr/attendance/report') {
      const year = parseInt(url.searchParams.get('year') || new Date().getFullYear(), 10);
      const month = parseInt(url.searchParams.get('month') || (new Date().getMonth() + 1), 10);

      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

      // Get all active employees
      const { data: employees } = await adminClient
        .from('employees')
        .select('id, user_id, full_name, designation, department, employee_type')
        .eq('is_active', true)
        .order('full_name');

      // Get attendance records for the month
      const { data: attendance } = await adminClient
        .from('attendance_records')
        .select('employee_id, status')
        .gte('attendance_date', startDate)
        .lte('attendance_date', endDate);

      // Aggregate attendance per employee
      const attendanceMap = {};
      (attendance || []).forEach(a => {
        if (!attendanceMap[a.employee_id]) {
          attendanceMap[a.employee_id] = { present: 0, absent: 0, half_day: 0 };
        }
        if (a.status !== 'leave') {
          attendanceMap[a.employee_id][a.status]++;
        }
      });

      // Calculate working days (excluding Sundays)
      let workingDays = 0;
      for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0) workingDays++;
      }

      // Merge
      const report = (employees || []).map(emp => ({
        ...emp,
        report: attendanceMap[emp.id] || { present: 0, absent: 0, half_day: 0 }
      }));

      sendJson(res, 200, { ok: true, year, month, workingDays, items: report });
      return true;
    }

    // ═══════ TEACHER SALARY REPORT ═══════
    if (req.method === 'GET' && url.pathname === '/hr/teachers/salary-report') {
      const year = parseInt(url.searchParams.get('year') || new Date().getFullYear(), 10);
      const month = parseInt(url.searchParams.get('month') || (new Date().getMonth() + 1), 10);

      const report = await calculateAllTeacherSalaries(month, year);
      sendJson(res, 200, { ok: true, year, month, items: report });
      return true;
    }

    // ═══════ TEACHER SALARY DETAIL (per-session breakdown) ═══════
    const salaryDetailMatch = url.pathname.match(/^\/hr\/teachers\/([^/]+)\/salary-detail$/);
    if (req.method === 'GET' && salaryDetailMatch) {
      const teacherUserId = salaryDetailMatch[1];
      const year = parseInt(url.searchParams.get('year') || new Date().getFullYear(), 10);
      const month = parseInt(url.searchParams.get('month') || (new Date().getMonth() + 1), 10);
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

      // Fetch teacher profile
      const { data: teacher, error: tErr } = await adminClient
        .from('teacher_profiles')
        .select('*, users!teacher_profiles_user_id_fkey(id, email, full_name)')
        .eq('user_id', teacherUserId)
        .maybeSingle();
      if (tErr) throw new Error(tErr.message);
      if (!teacher) { sendJson(res, 404, { ok: false, error: 'teacher not found' }); return true; }

      // Fetch approved sessions with student info
      const { data: verifications, error: vErr } = await adminClient
        .from('session_verifications')
        .select('session_id, status, verified_at, academic_sessions!inner(id, teacher_id, duration_hours, session_date, subject, status, students(student_name, class_level, board))')
        .eq('type', 'approval')
        .eq('status', 'approved');
      if (vErr) throw new Error(vErr.message);

      const { getRate, classToLevel, getRateConfig } = await import('./salary.service.js');
      const config = await getRateConfig();

      const sessions = [];
      (verifications || []).forEach(sv => {
        const sess = sv.academic_sessions;
        if (!sess || sess.teacher_id !== teacherUserId) return;
        if (sess.session_date < startDate || sess.session_date > endDate) return;

        const level = classToLevel(sess.students?.class_level);
        const studentBoard = sess.students?.board || '';
        const rate = getRate(teacher, studentBoard, sess.subject, level, config);
        const hours = Number(sess.duration_hours || 0);

        sessions.push({
          session_id: sess.id,
          session_date: sess.session_date,
          student_name: sess.students?.student_name || 'Unknown',
          class_level: sess.students?.class_level || '',
          board: sess.students?.board || '',
          salary_level: level,
          subject: sess.subject || 'Not Set',
          duration_hours: hours,
          rate_applied: rate,
          amount: Math.round(hours * rate * 100) / 100,
          verification_status: sv.status,
          verified_at: sv.verified_at
        });
      });

      sessions.sort((a, b) => a.session_date.localeCompare(b.session_date));

      sendJson(res, 200, {
        ok: true,
        teacher: {
          id: teacher.id,
          user_id: teacher.user_id,
          full_name: teacher.users?.full_name || 'Unknown',
          teacher_code: teacher.teacher_code,
          experience_level: teacher.experience_level || 'fresher',
          custom_rates: teacher.custom_rates || {}
        },
        sessions,
        year, month
      });
      return true;
    }

    // ═══════ UPDATE TEACHER CUSTOM RATES ═══════
    const customRatesMatch = url.pathname.match(/^\/hr\/teachers\/([^/]+)\/custom-rates$/);
    if (req.method === 'PUT' && customRatesMatch) {
      const teacherUserId = customRatesMatch[1];
      const payload = await readJson(req);

      const { error } = await adminClient
        .from('teacher_profiles')
        .update({ custom_rates: payload.custom_rates || {}, updated_at: nowIso() })
        .eq('user_id', teacherUserId);

      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true });
      return true;
    }

    // ═══════ SALARY STRUCTURES ═══════
    if (req.method === 'GET' && url.pathname === '/hr/salary-structures') {
      const { data, error } = await adminClient
        .from('salary_structures')
        .select('*, employees(id, full_name, designation, department)')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/hr/salary-structures') {
      const payload = await readJson(req);
      if (!payload.employee_id) {
        sendJson(res, 400, { ok: false, error: 'employee_id is required' });
        return true;
      }

      const record = {
        employee_id: payload.employee_id,
        base_salary: payload.base_salary || 0,
        hra: payload.hra || 0,
        transport_allowance: payload.transport_allowance || 0,
        other_allowance: payload.other_allowance || 0,
        pf_deduction: payload.pf_deduction || 0,
        tax_deduction: payload.tax_deduction || 0,
        other_deduction: payload.other_deduction || 0,
        effective_from: payload.effective_from || new Date().toISOString().slice(0, 10),
        updated_at: nowIso()
      };

      const { data, error } = await adminClient
        .from('salary_structures')
        .upsert(record, { onConflict: 'employee_id' })
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, salary: data });
      return true;
    }

    // ═══════ MASTER SALARY RATE CONFIG ═══════
    if (req.method === 'GET' && url.pathname === '/hr/salary-rate-config') {
      const { data, error } = await adminClient
        .from('salary_rate_config')
        .select('*')
        .order('board')
        .order('subject_key')
        .order('experience_category')
        .order('level');
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    if (req.method === 'PUT' && url.pathname === '/hr/salary-rate-config') {
      const payload = await readJson(req);
      if (!Array.isArray(payload.items)) {
        sendJson(res, 400, { ok: false, error: 'items array is required' });
        return true;
      }

      // We will clear existing and insert new to easily handle replacements
      const { error: delErr } = await adminClient.from('salary_rate_config').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (delErr) throw new Error(delErr.message);

      const itemsToInsert = payload.items.map(item => ({
        board: item.board,
        experience_category: item.experience_category,
        subject_key: item.subject_key,
        level: item.level,
        rate: item.rate,
        updated_at: nowIso()
      }));

      if (itemsToInsert.length > 0) {
        const { error: insErr } = await adminClient.from('salary_rate_config').insert(itemsToInsert);
        if (insErr) throw new Error(insErr.message);
      }

      sendJson(res, 200, { ok: true });
      return true;
    }

    // ═══════ AC INCENTIVE CONFIG ═══════
    if (req.method === 'GET' && url.pathname === '/hr/ac-incentive-config') {
      const { data, error } = await adminClient.from('ac_incentive_config').select('*').maybeSingle();
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, item: data });
      return true;
    }

    if (req.method === 'PATCH' && url.pathname === '/hr/ac-incentive-config') {
      const payload = await readJson(req);
      const { data: existing } = await adminClient.from('ac_incentive_config').select('id').maybeSingle();
      
      let resData;
      if (existing) {
        const { data, error } = await adminClient.from('ac_incentive_config').update({
          incentive_per_student: payload.incentive_per_student,
          revenue_incentive_percentage: payload.revenue_incentive_percentage,
          tax_percentage: payload.tax_percentage,
          updated_at: nowIso()
        }).eq('id', existing.id).select('*').single();
        if (error) throw new Error(error.message);
        resData = data;
      } else {
        const { data, error } = await adminClient.from('ac_incentive_config').insert({
          incentive_per_student: payload.incentive_per_student || 500,
          revenue_incentive_percentage: payload.revenue_incentive_percentage || 5,
          tax_percentage: payload.tax_percentage || 18
        }).select('*').single();
        if (error) throw new Error(error.message);
        resData = data;
      }
      sendJson(res, 200, { ok: true, item: resData });
      return true;
    }

    // ═══════ COUNCILOR LEVELS ═══════
    if (req.method === 'GET' && url.pathname === '/hr/councilor-levels') {
      const { data, error } = await adminClient.from('councilor_levels').select('*').order('level_name');
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/hr/councilor-levels') {
      const payload = await readJson(req);
      const { data, error } = await adminClient.from('councilor_levels').insert({
        level_name: payload.level_name,
        basic_salary: payload.basic_salary || 0,
        target_amount: payload.target_amount || 0,
        incentive_percentage: payload.incentive_percentage || 0
      }).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, item: data });
      return true;
    }

    if (req.method === 'PATCH' && parts.length === 3 && parts[1] === 'councilor-levels') {
      const id = parts[2];
      const payload = await readJson(req);
      const { data, error } = await adminClient.from('councilor_levels').update({
        level_name: payload.level_name,
        basic_salary: payload.basic_salary,
        target_amount: payload.target_amount,
        incentive_percentage: payload.incentive_percentage,
        updated_at: nowIso()
      }).eq('id', id).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, item: data });
      return true;
    }

    if (req.method === 'DELETE' && parts.length === 3 && parts[1] === 'councilor-levels') {
      const id = parts[2];
      const { error } = await adminClient.from('councilor_levels').delete().eq('id', id);
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true });
      return true;
    }

    // ═══════ COUNCILOR PROFILES (link employee to level) ═══════
    if (req.method === 'GET' && url.pathname === '/hr/councilor-profiles') {
      const { data, error } = await adminClient.from('councilor_profiles').select('*, councilor_levels(*), users(full_name, email)');
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/hr/councilor-profiles') {
      const payload = await readJson(req);
      const { data, error } = await adminClient.from('councilor_profiles').upsert({
        user_id: payload.user_id,
        level_id: payload.level_id,
        updated_at: nowIso()
      }).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, item: data });
      return true;
    }

    // ═══════ PER-PERSON SALARY SUBMISSION ═══════
    // -- 1. Teacher Salary Submission --
    if (req.method === 'POST' && url.pathname === '/hr/payment-requests/teacher') {
      const payload = await readJson(req);
      if (!payload.teacherUserId || !payload.year || !payload.month) {
        sendJson(res, 400, { ok: false, error: 'teacherUserId, year, and month required' });
        return true;
      }

      const { calculateAllTeacherSalaries } = await import('./salary.service.js');
      const report = await calculateAllTeacherSalaries(payload.month, payload.year);
      const teacherData = report.find(t => t.user_id === payload.teacherUserId || t.id === payload.teacherUserId);
      if (!teacherData) {
        sendJson(res, 404, { ok: false, error: 'Teacher data not found or no sessions.' });
        return true;
      }

      // Check if already submitted
      const { data: existing } = await adminClient
        .from('hr_payment_requests')
        .select('id')
        .eq('teacher_id', teacherData.id)
        .eq('year', payload.year)
        .eq('month', payload.month)
        .maybeSingle();

      if (existing) {
        sendJson(res, 400, { ok: false, error: 'Payment request already exists for this month.' });
        return true;
      }

      const totalAmount = teacherData.total_salary;
      const adjustment = Number(payload.adjustment) || 0;
      const finalAmount = Math.max(0, totalAmount + adjustment);

      let resolvedUserId2 = null;
      if (actor.userId && actor.userId !== 'dev-user') {
        const { data: userRow } = await adminClient.from('users').select('id').eq('id', actor.userId).maybeSingle();
        if (userRow) resolvedUserId2 = userRow.id;
      }

      const { data, error } = await adminClient.from('hr_payment_requests').insert({
        teacher_id: teacherData.id,
        target_type: 'teacher',
        total_amount: finalAmount,
        year: payload.year,
        month: payload.month,
        status: 'pending',
        requested_by: resolvedUserId2,
        hr_note: payload.hr_note || null,
        breakdown: {
          base_calculated: totalAmount,
          adjustment,
          details: {
            total_hours: teacherData.total_hours,
            breakdown_by_subject: teacherData.breakdown_by_subject,
            breakdown_by_level: teacherData.breakdown_by_level
          }
        }
      }).select('*').single();

      if (error) throw new Error(error.message);

      if (finalAmount > 0) {
        await adminClient.from('ledger_entries').insert([{
          entry_date: new Date().toISOString().slice(0, 10),
          entry_type: 'payable',
          amount: finalAmount,
          description: `Salary Payable (Teacher) — ${payload.year}/${String(payload.month).padStart(2, '0')}`,
          teacher_id: teacherData.id,
          posted_by: resolvedUserId2
        }]);
      }
      sendJson(res, 201, { ok: true, request: data });
      return true;
    }

    // -- 1.5 Counselor Sales Report --
    if (req.method === 'GET' && url.pathname === '/hr/councilors/sales-report') {
      const year = parseInt(url.searchParams.get('year') || new Date().getFullYear(), 10);
      const month = parseInt(url.searchParams.get('month') || (new Date().getMonth() + 1), 10);
      
      // Use broader UTC boundaries to safely catch local timezone offsets
      // e.g. India time is UTC+5:30. A payment verified at 01:00 AM on Mar 1 IST
      // is 19:30 on Feb 28th in UTC.
      
      const start = new Date(year, month - 1, 1);
      // Give a 1 day buffer backwards for timezone 
      start.setDate(start.getDate() - 1);
      const startIso = start.toISOString().split('T')[0] + 'T00:00:00Z';

      const end = new Date(year, month, 0);
      // Give a 1 day buffer forwards for timezone
      end.setDate(end.getDate() + 1);
      const endIso = end.toISOString().split('T')[0] + 'T23:59:59Z';

      const { data: verifiedPayments } = await adminClient
        .from('payment_requests')
        .select('total_amount, amount, leads!inner(counselor_id), verified_at')
        .eq('status', 'verified')
        .gte('verified_at', startIso)
        .lte('verified_at', endIso);

      const salesMap = {};
      (verifiedPayments || []).forEach(p => {
        // Double check it belongs in the requested month exactly using local month matching
        const pDate = new Date(p.verified_at);
        if (pDate.getMonth() + 1 === month && pDate.getFullYear() === year) {
          const cId = p.leads?.counselor_id;
          if (cId) {
            salesMap[cId] = (salesMap[cId] || 0) + Number(p.total_amount || p.amount || 0);
          }
        }
      });


      sendJson(res, 200, { ok: true, report: salesMap });
      return true;
    }

    // -- 2. Employee Salary Submission --
    if (req.method === 'POST' && url.pathname === '/hr/payment-requests/employee') {
      const payload = await readJson(req);
      if (!payload.employeeId || !payload.year || !payload.month) {
        sendJson(res, 400, { ok: false, error: 'employeeId, year, and month required' });
        return true;
      }

      const { data: existing } = await adminClient
        .from('hr_payment_requests')
        .select('id')
        .eq('employee_id', payload.employeeId)
        .eq('year', payload.year)
        .eq('month', payload.month)
        .maybeSingle();

      if (existing) {
        sendJson(res, 400, { ok: false, error: 'Payment request already exists for this month.' });
        return true;
      }

      const startDate = `${payload.year}-${String(payload.month).padStart(2, '0')}-01`;
      const endDate = new Date(payload.year, payload.month, 0).toISOString().slice(0, 10);

      const [salRes, attRes] = await Promise.all([
        adminClient.from('salary_structures').select('*').eq('employee_id', payload.employeeId).maybeSingle(),
        adminClient.from('attendance_records').select('status').eq('employee_id', payload.employeeId).gte('attendance_date', startDate).lte('attendance_date', endDate)
      ]);

      const sal = salRes.data;
      const attList = attRes.data || [];

      // Fetch employee info for counselor check
      const { data: empInfo } = await adminClient.from('employees').select('user_id').eq('id', payload.employeeId).single();

      // Check if employee is a counselor with a level — default to Level 1
      let counselorLevel = null;
      if (empInfo?.user_id) {
        const { data: cProf } = await adminClient
          .from('councilor_profiles')
          .select('*, councilor_levels(*)')
          .eq('user_id', empInfo.user_id)
          .maybeSingle();
        if (cProf?.councilor_levels) {
          counselorLevel = cProf.councilor_levels;
        } else {
          // Default to Level 1 (first level sorted by name)
          const { data: defaultLevels } = await adminClient
            .from('councilor_levels')
            .select('*')
            .order('level_name', { ascending: true })
            .limit(1);
          if (defaultLevels && defaultLevels.length > 0) {
            counselorLevel = defaultLevels[0];
          }
        }
      }

      let workingDays = 0;
      if (payload.workingDays && Number(payload.workingDays) > 0) {
        workingDays = Number(payload.workingDays);
      } else {
        for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
          if (d.getDay() !== 0) workingDays++;
        }
      }

      let present = 0, half_day = 0;
      attList.forEach(a => {
        if (a.status === 'present') present++;
        else if (a.status === 'half_day') half_day++;
      });

      let baseSalary = sal ? Number(sal.base_salary) : 0;
      // Override basic salary from counselor level if applicable
      if (counselorLevel) {
        baseSalary = Number(counselorLevel.basic_salary);
      }

      const totalAllowances = sal ? Number(sal.hra) + Number(sal.transport_allowance) + Number(sal.other_allowance) : 0;
      const totalDeductions = sal ? Number(sal.pf_deduction) + Number(sal.tax_deduction) + Number(sal.other_deduction) : 0;
      const grossSalary = baseSalary + totalAllowances;

      const effectiveDays = present + (half_day * 0.5);
      let proRatedGross = 0;
      let calcNet = 0;

      if (effectiveDays === 0) {
        calcNet = Math.round(grossSalary - totalDeductions);
      } else {
        proRatedGross = workingDays > 0 ? (grossSalary * effectiveDays / workingDays) : 0;
        calcNet = Math.round(proRatedGross - totalDeductions);
      }

      // Add Counselor Incentive
      let achievedSales = 0;
      let incentiveAmount = 0;
      let acStudentIncentive = 0;
      let acRevenueIncentive = 0;
      let acTotalIncentive = 0;
      let acMetrics = null;

      if (empInfo?.user_id) {
        const start = new Date(payload.year, payload.month - 1, 1);
        start.setDate(start.getDate() - 1);
        const startIso = start.toISOString().split('T')[0] + 'T00:00:00Z';

        const end = new Date(payload.year, payload.month, 0);
        end.setDate(end.getDate() + 1);
        const endIso = end.toISOString().split('T')[0] + 'T23:59:59Z';

        // 1. Counselor Incentive
        if (counselorLevel) {
          const { data: verifiedPayments } = await adminClient
            .from('payment_requests')
            .select('total_amount, amount, leads!inner(counselor_id), verified_at')
            .eq('status', 'verified')
            .eq('leads.counselor_id', empInfo.user_id)
            .gte('verified_at', startIso)
            .lte('verified_at', endIso);

          achievedSales = (verifiedPayments || []).reduce((sum, p) => {
             const pDate = new Date(p.verified_at);
             if (pDate.getMonth() + 1 === payload.month && pDate.getFullYear() === payload.year) {
                return sum + Number(p.total_amount || p.amount || 0);
             }
             return sum;
          }, 0);
          
          const extraSales = Math.max(0, achievedSales - Number(counselorLevel.target_amount));
          incentiveAmount = Math.round(extraSales * Number(counselorLevel.incentive_percentage) / 100);
          calcNet += incentiveAmount;
        }

        // 2. Academic Coordinator Incentive
        const { data: userRow } = await adminClient.from('users').select('role').eq('id', empInfo.user_id).single();
        if (userRow?.role === 'academic_coordinator') {
          // Fetch config
          const { data: config } = await adminClient.from('ac_incentive_config').select('*').maybeSingle();
          if (config) {
            // Count new students added by this AC in the month
            const { count } = await adminClient.from('students')
              .select('*', { count: 'exact', head: true })
              .eq('academic_coordinator_id', empInfo.user_id)
              .gte('joined_at', startIso)
              .lte('joined_at', endIso);
            
            const studentsAdded = count || 0;
            acStudentIncentive = studentsAdded * Number(config.incentive_per_student || 0);

            // Sum verified student topups requested by this AC in the month
            const { data: verifiedTopups } = await adminClient.from('student_topups')
              .select('amount, verified_at')
              .eq('status', 'verified')
              .eq('requested_by', empInfo.user_id)
              .gte('verified_at', startIso)
              .lte('verified_at', endIso);

            const totalTopupRevenue = (verifiedTopups || []).reduce((sum, t) => {
              const tDate = new Date(t.verified_at);
              if (tDate.getMonth() + 1 === payload.month && tDate.getFullYear() === payload.year) {
                return sum + Number(t.amount || 0);
              }
              return sum;
            }, 0);

            const taxAmount = totalTopupRevenue * (Number(config.tax_percentage || 0) / 100);
            const netRevenue = Math.max(0, totalTopupRevenue - taxAmount);
            acRevenueIncentive = Math.round(netRevenue * (Number(config.revenue_incentive_percentage || 0) / 100));

            acTotalIncentive = acStudentIncentive + acRevenueIncentive;
            calcNet += acTotalIncentive;

            acMetrics = {
              students_added: studentsAdded,
              student_incentive: acStudentIncentive,
              total_topup_revenue: totalTopupRevenue,
              tax_amount: taxAmount,
              net_revenue: netRevenue,
              revenue_incentive: acRevenueIncentive,
              total_ac_incentive: acTotalIncentive
            };
          }
        }
      }

      const adjustment = Number(payload.adjustment) || 0;
      const finalAmount = Math.max(0, calcNet + adjustment);

      let resolvedUserId2 = null;
      if (actor.userId && actor.userId !== 'dev-user') {
        const { data: userRow } = await adminClient.from('users').select('id').eq('id', actor.userId).maybeSingle();
        if (userRow) resolvedUserId2 = userRow.id;
      }

      const { data, error } = await adminClient.from('hr_payment_requests').insert({
        employee_id: payload.employeeId,
        target_type: 'employee',
        year: payload.year,
        month: payload.month,
        total_amount: finalAmount,
        status: 'pending',
        requested_by: resolvedUserId2,
        hr_note: payload.hr_note || null,
        breakdown: {
          base_calculated: calcNet - acTotalIncentive, // calcNet includes incentive now, so base_calculated is without it
          adjustment,
          details: {
            working_days: workingDays,
            present_days: present,
            half_days: half_day,
            base_salary: baseSalary,
            total_allowances: totalAllowances,
            total_deductions: totalDeductions,
            counselor_level: counselorLevel ? counselorLevel.level_name : null,
            achieved_sales: achievedSales,
            incentive_amount: incentiveAmount,
            ac_incentive: acMetrics || null
          }
        }
      }).select('*').single();

      if (error) throw new Error(error.message);

      if (finalAmount > 0) {
        await adminClient.from('ledger_entries').insert([{
          entry_date: new Date().toISOString().slice(0, 10),
          entry_type: 'payable',
          amount: finalAmount,
          description: `Salary Payable (Employee) — ${payload.year}/${String(payload.month).padStart(2, '0')}`,
          employee_id: payload.employeeId,
          posted_by: resolvedUserId2
        }]);
      }
      sendJson(res, 201, { ok: true, request: data });
      return true;
    }

    // -- 3. View Payment Requests --
    if (req.method === 'GET' && url.pathname === '/hr/payment-requests') {
      const year = parseInt(url.searchParams.get('year') || new Date().getFullYear(), 10);
      const month = parseInt(url.searchParams.get('month') || (new Date().getMonth() + 1), 10);

      const { data, error } = await adminClient
        .from('hr_payment_requests')
        .select('*, employees(id, full_name), teacher_profiles(id, user_id, users!teacher_profiles_user_id_fkey(full_name))')
        .eq('year', year)
        .eq('month', month)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      let items = data || [];
      items.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        return 0;
      });

      sendJson(res, 200, { ok: true, items });
      return true;
    }

    // -- 4. Update Payment Request (Cancel/Reject/Approve) --
    const prUpdateMatch = url.pathname.match(/^\/hr\/payment-requests\/([^/]+)$/);
    if (req.method === 'PATCH' && prUpdateMatch) {
      const prId = prUpdateMatch[1];
      const payload = await readJson(req);

      const updates = { updated_at: nowIso() };
      if (payload.status) updates.status = payload.status;
      if (payload.status === 'approved') updates.approved_at = nowIso();
      if (payload.finance_note !== undefined) updates.finance_note = payload.finance_note;

      const { data, error } = await adminClient
        .from('hr_payment_requests')
        .update(updates)
        .eq('id', prId)
        .select('*')
        .single();

      if (error) throw new Error(error.message);

      // If cancelled/rejected, we should delete the payable ledger entry too
      if (payload.status === 'rejected' || payload.status === 'cancelled') {
        // Optionally delete ledger entries if needed to keep financial records clean
        if (data.employee_id) {
          await adminClient.from('ledger_entries').delete()
            .eq('employee_id', data.employee_id)
            .eq('entry_type', 'payable')
            .like('description', `%${data.year}/${String(data.month).padStart(2, '0')}%`);
        } else if (data.teacher_id) {
          await adminClient.from('ledger_entries').delete()
            .eq('teacher_id', data.teacher_id)
            .eq('entry_type', 'payable')
            .like('description', `%${data.year}/${String(data.month).padStart(2, '0')}%`);
        }
      }

      sendJson(res, 200, { ok: true, request: data });
      return true;
    }


    sendJson(res, 404, { ok: false, error: 'route not found' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
