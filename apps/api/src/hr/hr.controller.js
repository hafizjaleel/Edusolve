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
  if (!isHR(actor)) {
    sendJson(res, 403, { ok: false, error: 'HR role required' });
    return true;
  }

  const parts = url.pathname.split('/').filter(Boolean);

  try {
    // ═══════ DASHBOARD STATS ═══════
    if (req.method === 'GET' && url.pathname === '/hr/stats') {
      const [{ data: employees }, { data: attendance }] = await Promise.all([
        adminClient.from('employees').select('id, is_active').eq('is_active', true),
        adminClient.from('attendance_records').select('status').eq('attendance_date', new Date().toISOString().slice(0, 10))
      ]);

      const totalEmployees = (employees || []).length;
      const todayPresent = (attendance || []).filter(a => a.status === 'present').length;
      const todayAbsent = (attendance || []).filter(a => a.status === 'absent').length;
      const todayHalfDay = (attendance || []).filter(a => a.status === 'half_day').length;
      const todayLeave = (attendance || []).filter(a => a.status === 'leave').length;
      const todayMarked = (attendance || []).length;

      const { data: pendingCycles } = await adminClient.from('hr_payroll_cycles').select('id').eq('status', 'draft');
      const { data: pendingRequests } = await adminClient.from('hr_payment_requests').select('id').eq('status', 'pending');

      sendJson(res, 200, {
        ok: true,
        stats: {
          totalEmployees,
          todayPresent,
          todayAbsent,
          todayHalfDay,
          todayLeave,
          todayMarked,
          pendingPayrollCycles: (pendingCycles || []).length,
          pendingPaymentRequests: (pendingRequests || []).length
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

    // ═══════ HR PAYROLL ═══════
    if (req.method === 'GET' && url.pathname === '/hr/payroll') {
      const { data, error } = await adminClient
        .from('hr_payroll_cycles')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/hr/payroll') {
      const payload = await readJson(req);
      if (!payload.year || !payload.month) {
        sendJson(res, 400, { ok: false, error: 'year and month are required' });
        return true;
      }
      const startDate = `${payload.year}-${String(payload.month).padStart(2, '0')}-01`;
      const endDate = new Date(payload.year, payload.month, 0).toISOString().slice(0, 10);

      // Resolve user for FK
      let resolvedUserId = null;
      if (actor.userId && actor.userId !== 'dev-user') {
        const { data: userRow } = await adminClient.from('users').select('id').eq('id', actor.userId).maybeSingle();
        if (userRow) resolvedUserId = userRow.id;
      }

      const { data, error } = await adminClient.from('hr_payroll_cycles').insert({
        year: payload.year,
        month: payload.month,
        start_date: startDate,
        end_date: endDate,
        status: 'draft',
        created_by: resolvedUserId
      }).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, cycle: data });
      return true;
    }

    // View payroll items for a cycle
    if (req.method === 'GET' && parts.length === 3 && parts[1] === 'payroll' && parts[2] !== 'generate') {
      const cycleId = parts[2];
      const { data, error } = await adminClient
        .from('hr_payroll_items')
        .select('*, employees(id, full_name, designation, department)')
        .eq('cycle_id', cycleId)
        .order('net_salary', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // Generate payroll from attendance + salary structures
    if (req.method === 'POST' && url.pathname === '/hr/payroll/generate') {
      const payload = await readJson(req);
      if (!payload.cycle_id) {
        sendJson(res, 400, { ok: false, error: 'cycle_id is required' });
        return true;
      }

      const { data: cycle } = await adminClient
        .from('hr_payroll_cycles')
        .select('*')
        .eq('id', payload.cycle_id)
        .single();
      if (!cycle) {
        sendJson(res, 404, { ok: false, error: 'cycle not found' });
        return true;
      }

      // Get all active employees
      const { data: employees } = await adminClient
        .from('employees')
        .select('id')
        .eq('is_active', true);

      // Get salary structures
      const { data: salaries } = await adminClient
        .from('salary_structures')
        .select('*');
      const salaryMap = {};
      (salaries || []).forEach(s => { salaryMap[s.employee_id] = s; });

      // Get attendance records for the cycle period
      const { data: attendance } = await adminClient
        .from('attendance_records')
        .select('employee_id, status')
        .gte('attendance_date', cycle.start_date)
        .lte('attendance_date', cycle.end_date);

      // Calculate working days in the month
      const start = new Date(cycle.start_date);
      const end = new Date(cycle.end_date);
      let workingDays = 0;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (day !== 0) workingDays++; // Exclude Sundays
      }

      // Aggregate attendance per employee
      const attendanceMap = {};
      (attendance || []).forEach(a => {
        if (!attendanceMap[a.employee_id]) {
          attendanceMap[a.employee_id] = { present: 0, absent: 0, half_day: 0, leave: 0 };
        }
        attendanceMap[a.employee_id][a.status]++;
      });

      // Delete existing items for this cycle
      await adminClient.from('hr_payroll_items').delete().eq('cycle_id', payload.cycle_id);

      // Build payroll items
      let totalAmount = 0;
      const items = (employees || []).map(emp => {
        const sal = salaryMap[emp.id];
        const att = attendanceMap[emp.id] || { present: 0, absent: 0, half_day: 0, leave: 0 };

        const baseSalary = sal ? Number(sal.base_salary) : 0;
        const totalAllowances = sal ? Number(sal.hra) + Number(sal.transport_allowance) + Number(sal.other_allowance) : 0;
        const totalDeductions = sal ? Number(sal.pf_deduction) + Number(sal.tax_deduction) + Number(sal.other_deduction) : 0;
        const grossSalary = baseSalary + totalAllowances;

        // Pro-rate: effective days = present + half_day*0.5, out of working days
        const effectiveDays = att.present + (att.half_day * 0.5);
        const proRatedGross = workingDays > 0 ? (grossSalary * effectiveDays / workingDays) : 0;
        const netSalary = Math.round((proRatedGross - totalDeductions) * 100) / 100;

        totalAmount += Math.max(netSalary, 0);

        return {
          cycle_id: payload.cycle_id,
          employee_id: emp.id,
          working_days: workingDays,
          present_days: att.present,
          half_days: att.half_day,
          leave_days: att.leave,
          absent_days: att.absent,
          base_salary: baseSalary,
          total_allowances: totalAllowances,
          total_deductions: totalDeductions,
          net_salary: Math.max(netSalary, 0),
          adjustment: 0
        };
      });

      if (items.length > 0) {
        const { error: insertError } = await adminClient.from('hr_payroll_items').insert(items);
        if (insertError) throw new Error(insertError.message);
      }

      // Update cycle total
      await adminClient.from('hr_payroll_cycles').update({
        total_amount: Math.round(totalAmount * 100) / 100,
        updated_at: nowIso()
      }).eq('id', payload.cycle_id);

      sendJson(res, 200, { ok: true, count: items.length, totalAmount: Math.round(totalAmount * 100) / 100 });
      return true;
    }

    // Update payroll cycle status
    if (req.method === 'PATCH' && parts.length === 3 && parts[1] === 'payroll') {
      const cycleId = parts[2];
      const payload = await readJson(req);
      const updates = { updated_at: nowIso() };
      if (payload.status) updates.status = payload.status;
      if (payload.status === 'submitted') updates.submitted_at = nowIso();
      if (payload.notes !== undefined) updates.notes = payload.notes;

      const { data, error } = await adminClient
        .from('hr_payroll_cycles')
        .update(updates)
        .eq('id', cycleId)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, cycle: data });
      return true;
    }

    // ═══════ HR PAYMENT REQUESTS ═══════
    if (req.method === 'GET' && url.pathname === '/hr/payment-requests') {
      const { data, error } = await adminClient
        .from('hr_payment_requests')
        .select('*, hr_payroll_cycles(year, month, status, total_amount)')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    if (req.method === 'POST' && url.pathname === '/hr/payment-requests') {
      const payload = await readJson(req);
      if (!payload.cycle_id) {
        sendJson(res, 400, { ok: false, error: 'cycle_id is required' });
        return true;
      }

      // Get cycle info
      const { data: cycle } = await adminClient
        .from('hr_payroll_cycles')
        .select('*')
        .eq('id', payload.cycle_id)
        .single();
      if (!cycle) {
        sendJson(res, 404, { ok: false, error: 'payroll cycle not found' });
        return true;
      }

      // Mark cycle as submitted
      await adminClient.from('hr_payroll_cycles').update({
        status: 'submitted',
        submitted_at: nowIso(),
        updated_at: nowIso()
      }).eq('id', payload.cycle_id);

      // Resolve user for FK
      let resolvedUserId2 = null;
      if (actor.userId && actor.userId !== 'dev-user') {
        const { data: userRow } = await adminClient.from('users').select('id').eq('id', actor.userId).maybeSingle();
        if (userRow) resolvedUserId2 = userRow.id;
      }

      // Create payment request
      const { data, error } = await adminClient.from('hr_payment_requests').insert({
        cycle_id: payload.cycle_id,
        total_amount: cycle.total_amount,
        status: 'pending',
        requested_by: resolvedUserId2
      }).select('*').single();
      if (error) throw new Error(error.message);

      sendJson(res, 201, { ok: true, request: data });
      return true;
    }

    sendJson(res, 404, { ok: false, error: 'route not found' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
