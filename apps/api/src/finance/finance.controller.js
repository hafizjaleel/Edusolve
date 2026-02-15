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

function isFinance(actor) {
  return actor.role === 'finance' || actor.role === 'super_admin';
}

async function generateStudentCode(adminClient) {
  const { data, error } = await adminClient
    .from('students')
    .select('student_code')
    .not('student_code', 'is', null)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);

  let maxNum = 0;
  for (const row of data || []) {
    const code = row.student_code || '';
    const num = Number(code.replace(/^STD/i, ''));
    if (Number.isFinite(num) && num > maxNum) maxNum = num;
  }
  return `STD${String(maxNum + 1).padStart(6, '0')}`;
}

export async function handleFinance(req, res, url) {
  if (!url.pathname.startsWith('/finance')) return false;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    sendJson(res, 500, { ok: false, error: 'supabase admin is not configured' });
    return true;
  }

  const actor = actorFromHeaders(req);
  if (!isFinance(actor)) {
    sendJson(res, 403, { ok: false, error: 'finance role required' });
    return true;
  }

  try {
    // ═══════ STATS ═══════
    if (req.method === 'GET' && url.pathname === '/finance/stats') {
      // 1. Total Income
      const { data: incomeData } = await adminClient.from('ledger_entries').select('amount').eq('entry_type', 'income');
      const totalIncome = (incomeData || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

      // 2. Total Expenses
      const { data: expenseData } = await adminClient.from('expenses').select('amount');
      const totalExpenses = (expenseData || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

      // 3. Total Balance (Sum of all accounts)
      const { data: accounts } = await adminClient.from('finance_accounts').select('balance');
      const totalBalance = (accounts || []).reduce((sum, item) => sum + Number(item.balance || 0), 0);

      const stats = {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        totalBalance
      };

      sendJson(res, 200, { ok: true, stats });
      return true;
    }

    if (req.method === 'GET' && url.pathname === '/finance/payment-requests') {
      const status = url.searchParams.get('status') || 'pending';
      let query = adminClient
        .from('payment_requests')
        .select('*, leads(*)')
        .order('created_at', { ascending: false });
      if (status !== 'all') query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    const parts = url.pathname.split('/').filter(Boolean);
    if (req.method === 'GET' && url.pathname === '/finance/topup-requests') {
      const status = url.searchParams.get('status') || 'pending_finance';
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

    if (req.method === 'POST' && parts.length === 4 && parts[1] === 'payment-requests' && parts[3] === 'verify') {
      const requestId = parts[2];
      const payload = await readJson(req);

      const { data: request, error: requestError } = await adminClient
        .from('payment_requests')
        .select('*')
        .eq('id', requestId)
        .maybeSingle();
      if (requestError) throw new Error(requestError.message);
      if (!request) {
        sendJson(res, 404, { ok: false, error: 'payment request not found' });
        return true;
      }
      if (request.status !== 'pending') {
        sendJson(res, 400, { ok: false, error: 'payment request already processed' });
        return true;
      }

      if (payload.approved === false) {
        const { error: rejectError } = await adminClient
          .from('payment_requests')
          .update({
            status: 'rejected',
            finance_note: payload.finance_note || null,
            verified_by: actor.userId,
            verified_at: nowIso(),
            updated_at: nowIso()
          })
          .eq('id', requestId);
        if (rejectError) throw new Error(rejectError.message);

        sendJson(res, 200, { ok: true, status: 'rejected' });
        return true;
      }

      const { data: lead, error: leadError } = await adminClient
        .from('leads')
        .select('*')
        .eq('id', request.lead_id)
        .maybeSingle();
      if (leadError) throw new Error(leadError.message);
      if (!lead) {
        sendJson(res, 404, { ok: false, error: 'lead not found for payment request' });
        return true;
      }

      const studentCode = await generateStudentCode(adminClient);

      const { data: student, error: studentError } = await adminClient
        .from('students')
        .insert({
          lead_id: lead.id,
          student_name: lead.student_name,
          parent_name: lead.parent_name,
          contact_number: lead.contact_number,
          class_level: lead.class_level,
          package_name: lead.package_name,
          status: 'active',
          joined_at: nowIso(),
          student_code: studentCode
        })
        .select('*')
        .single();
      if (studentError) throw new Error(studentError.message);

      const { error: leadUpdateError } = await adminClient
        .from('leads')
        .update({
          status: 'joined',
          owner_stage: 'academic',
          joined_student_id: student.id,
          updated_at: nowIso()
        })
        .eq('id', lead.id);
      if (leadUpdateError) throw new Error(leadUpdateError.message);

      const { error: paymentUpdateError } = await adminClient
        .from('payment_requests')
        .update({
          status: 'verified',
          finance_note: payload.finance_note || null,
          verified_by: actor.userId,
          verified_at: nowIso(),
          updated_at: nowIso()
        })
        .eq('id', requestId);
      if (paymentUpdateError) throw new Error(paymentUpdateError.message);

      await adminClient.from('lead_status_history').insert({
        lead_id: lead.id,
        from_status: lead.status,
        to_status: 'joined',
        changed_by: actor.userId,
        reason: 'payment verified and student created'
      });

      sendJson(res, 200, { ok: true, status: 'verified', student });
      return true;
    }

    if (req.method === 'POST' && parts.length === 4 && parts[1] === 'topup-requests' && parts[3] === 'verify') {
      const requestId = parts[2];
      const payload = await readJson(req);

      const { data: request, error: requestError } = await adminClient
        .from('student_topups')
        .select('*')
        .eq('id', requestId)
        .maybeSingle();
      if (requestError) throw new Error(requestError.message);
      if (!request) {
        sendJson(res, 404, { ok: false, error: 'top-up request not found' });
        return true;
      }
      if (request.status !== 'pending_finance') {
        sendJson(res, 400, { ok: false, error: 'top-up request already processed' });
        return true;
      }

      if (payload.approved === false) {
        const { error: rejectError } = await adminClient
          .from('student_topups')
          .update({
            status: 'rejected',
            finance_note: payload.finance_note || null,
            verified_by: actor.userId,
            verified_at: nowIso()
          })
          .eq('id', requestId);
        if (rejectError) throw new Error(rejectError.message);
        sendJson(res, 200, { ok: true, status: 'rejected' });
        return true;
      }

      const { data: student, error: studentError } = await adminClient
        .from('students')
        .select('*')
        .eq('id', request.student_id)
        .maybeSingle();
      if (studentError) throw new Error(studentError.message);
      if (!student) {
        sendJson(res, 404, { ok: false, error: 'student not found for top-up' });
        return true;
      }

      const totalHours = Number(student.total_hours || 0) + Number(request.hours_added || 0);
      const remainingHours = Number(student.remaining_hours || 0) + Number(request.hours_added || 0);

      const { error: studentUpdateError } = await adminClient
        .from('students')
        .update({
          total_hours: totalHours,
          remaining_hours: remainingHours,
          updated_at: nowIso()
        })
        .eq('id', student.id);
      if (studentUpdateError) throw new Error(studentUpdateError.message);

      const { error: requestUpdateError } = await adminClient
        .from('student_topups')
        .update({
          status: 'verified',
          payment_verified: true,
          finance_note: payload.finance_note || null,
          verified_by: actor.userId,
          verified_at: nowIso()
        })
        .eq('id', requestId);
      if (requestUpdateError) throw new Error(requestUpdateError.message);

      sendJson(res, 200, { ok: true, status: 'verified' });
      return true;
    }

    // ═══════ FINANCE DASHBOARD STATS ═══════
    if (req.method === 'GET' && url.pathname === '/finance/stats') {
      const [{ data: income }, { data: expenses }, { data: accounts }, { data: payReqs }, { data: topups }] = await Promise.all([
        adminClient.from('ledger_entries').select('amount').eq('entry_type', 'income'),
        adminClient.from('expenses').select('amount'),
        adminClient.from('finance_accounts').select('balance'),
        adminClient.from('payment_requests').select('status'),
        adminClient.from('student_topups').select('status')
      ]);
      const totalIncome = (income || []).reduce((s, r) => s + Number(r.amount || 0), 0);
      const totalExpenses = (expenses || []).reduce((s, r) => s + Number(r.amount || 0), 0);
      const totalBalance = (accounts || []).reduce((s, r) => s + Number(r.balance || 0), 0);
      const pendingPayments = (payReqs || []).filter(r => r.status === 'pending').length;
      const pendingTopups = (topups || []).filter(r => r.status === 'pending_finance').length;
      sendJson(res, 200, { ok: true, stats: { totalIncome, totalExpenses, totalBalance, pendingPayments, pendingTopups, netProfit: totalIncome - totalExpenses } });
      return true;
    }

    // ═══════ ACCOUNTS ═══════
    if (req.method === 'GET' && url.pathname === '/finance/accounts') {
      const { data, error } = await adminClient.from('finance_accounts').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }
    if (req.method === 'POST' && url.pathname === '/finance/accounts') {
      const payload = await readJson(req);
      if (!payload.name) { sendJson(res, 400, { ok: false, error: 'name required' }); return true; }
      const { data, error } = await adminClient.from('finance_accounts').insert({
        name: payload.name, type: payload.type || 'bank', is_main: payload.is_main || false,
        balance: payload.balance || 0, description: payload.description || null, created_by: actor.userId
      }).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, account: data });
      return true;
    }

    // ═══════ PARTIES ═══════
    if (req.method === 'GET' && url.pathname === '/finance/parties') {
      const { data, error } = await adminClient.from('finance_parties').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }
    if (req.method === 'POST' && url.pathname === '/finance/parties') {
      const payload = await readJson(req);
      if (!payload.name) { sendJson(res, 400, { ok: false, error: 'name required' }); return true; }
      const { data, error } = await adminClient.from('finance_parties').insert({
        name: payload.name, type: payload.type || 'vendor', phone: payload.phone || null,
        email: payload.email || null, address: payload.address || null, notes: payload.notes || null, created_by: actor.userId
      }).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, party: data });
      return true;
    }

    // ═══════ CATEGORIES ═══════
    if (req.method === 'GET' && url.pathname === '/finance/categories') {
      const type = url.searchParams.get('type');
      let query = adminClient.from('finance_categories').select('*').order('name');
      if (type) query = query.eq('type', type);
      const { data, error } = await query;
      // If table doesn't exist yet, return empty array instead of error
      if (error && error.code === '42P01') {
        sendJson(res, 200, { ok: true, items: [] });
        return true;
      }
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }
    if (req.method === 'POST' && url.pathname === '/finance/categories') {
      const payload = await readJson(req);
      if (!payload.name || !payload.type) { sendJson(res, 400, { ok: false, error: 'name and type required' }); return true; }
      const { data, error } = await adminClient.from('finance_categories').insert({
        name: payload.name.toLowerCase(), type: payload.type
      }).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, category: data });
      return true;
    }
    if (req.method === 'DELETE' && parts.length === 3 && parts[1] === 'categories') {
      const catId = parts[2];
      const { error } = await adminClient.from('finance_categories').delete().eq('id', catId);
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true });
      return true;
    }

    // ═══════ INCOME (Ledger Entries) ═══════
    if (req.method === 'GET' && url.pathname === '/finance/income') {
      const { data, error } = await adminClient.from('ledger_entries').select('*, finance_accounts(name), finance_parties(name)')
        .eq('entry_type', 'income').order('entry_date', { ascending: false }).limit(200);
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }
    if (req.method === 'POST' && url.pathname === '/finance/income') {
      const payload = await readJson(req);
      if (!payload.amount) { sendJson(res, 400, { ok: false, error: 'amount required' }); return true; }
      const { data, error } = await adminClient.from('ledger_entries').insert({
        entry_date: payload.entry_date || new Date().toISOString().slice(0, 10),
        entry_type: 'income', amount: payload.amount, description: payload.description || null,
        account_id: payload.account_id || null, party_id: payload.party_id || null,
        reference_type: payload.reference_type || null, posted_by: actor.userId
      }).select('*').single();
      if (error) throw new Error(error.message);
      // Update account balance
      if (payload.account_id) {
        await adminClient.rpc('increment_balance', { acc_id: payload.account_id, delta: payload.amount }).catch(() => {
          // If RPC doesn't exist, update manually
          adminClient.from('finance_accounts').select('balance').eq('id', payload.account_id).single().then(({ data: acc }) => {
            if (acc) adminClient.from('finance_accounts').update({ balance: Number(acc.balance) + Number(payload.amount), updated_at: nowIso() }).eq('id', payload.account_id);
          });
        });
      }
      sendJson(res, 201, { ok: true, entry: data });
      return true;
    }

    // ═══════ EXPENSES ═══════
    if (req.method === 'GET' && url.pathname === '/finance/expenses') {
      const { data, error } = await adminClient.from('expenses').select('*, finance_accounts(name), finance_parties(name)')
        .order('expense_date', { ascending: false }).limit(200);
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }
    if (req.method === 'POST' && url.pathname === '/finance/expenses') {
      const payload = await readJson(req);
      if (!payload.amount || !payload.category) { sendJson(res, 400, { ok: false, error: 'amount and category required' }); return true; }
      const { data, error } = await adminClient.from('expenses').insert({
        expense_date: payload.expense_date || new Date().toISOString().slice(0, 10),
        category: payload.category, amount: payload.amount, description: payload.description || null,
        account_id: payload.account_id || null, party_id: payload.party_id || null, created_by: actor.userId
      }).select('*').single();
      if (error) throw new Error(error.message);
      // Update account balance
      if (payload.account_id) {
        adminClient.from('finance_accounts').select('balance').eq('id', payload.account_id).single().then(({ data: acc }) => {
          if (acc) adminClient.from('finance_accounts').update({ balance: Number(acc.balance) - Number(payload.amount), updated_at: nowIso() }).eq('id', payload.account_id);
        }).catch(() => { });
      }
      sendJson(res, 201, { ok: true, expense: data });
      return true;
    }

    // ═══════ PAYROLL ═══════
    if (req.method === 'GET' && url.pathname === '/finance/payroll') {
      const { data, error } = await adminClient.from('payroll_monthly_cycles').select('*').order('year', { ascending: false }).order('month', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }
    if (req.method === 'POST' && url.pathname === '/finance/payroll') {
      const payload = await readJson(req);
      if (!payload.year || !payload.month) { sendJson(res, 400, { ok: false, error: 'year and month required' }); return true; }
      const startDate = `${payload.year}-${String(payload.month).padStart(2, '0')}-01`;
      const endDate = new Date(payload.year, payload.month, 0).toISOString().slice(0, 10);
      const { data, error } = await adminClient.from('payroll_monthly_cycles').insert({
        year: payload.year, month: payload.month, start_date: startDate, end_date: endDate, status: 'draft'
      }).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, cycle: data });
      return true;
    }
    if (req.method === 'GET' && parts.length === 3 && parts[1] === 'payroll' && parts[2] !== 'generate') {
      const cycleId = parts[2];
      const { data, error } = await adminClient.from('payroll_items').select('*, users(id,full_name,email)')
        .eq('cycle_id', cycleId).order('amount', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }
    if (req.method === 'POST' && parts.length === 3 && parts[1] === 'payroll' && parts[2] === 'generate') {
      const payload = await readJson(req);
      if (!payload.cycle_id) { sendJson(res, 400, { ok: false, error: 'cycle_id required' }); return true; }

      const { data: cycle } = await adminClient.from('payroll_monthly_cycles').select('*').eq('id', payload.cycle_id).single();
      if (!cycle) { sendJson(res, 404, { ok: false, error: 'cycle not found' }); return true; }

      // Get all verified sessions in date range
      const { data: sessions } = await adminClient.from('academic_sessions')
        .select('teacher_id, duration_hours')
        .gte('session_date', cycle.start_date).lte('session_date', cycle.end_date);

      // Get teacher profiles for rates
      const { data: teachers } = await adminClient.from('teacher_profiles').select('user_id, per_hour_rate');
      const rateMap = {};
      (teachers || []).forEach(t => { rateMap[t.user_id] = Number(t.per_hour_rate || 0); });

      // Aggregate hours by teacher
      const hoursMap = {};
      (sessions || []).forEach(s => {
        hoursMap[s.teacher_id] = (hoursMap[s.teacher_id] || 0) + Number(s.duration_hours || 0);
      });

      // Delete existing items for this cycle
      await adminClient.from('payroll_items').delete().eq('cycle_id', payload.cycle_id);

      // Insert payroll items
      const items = Object.entries(hoursMap).map(([teacherId, hours]) => ({
        cycle_id: payload.cycle_id, teacher_id: teacherId,
        verified_hours: hours, rate_per_hour: rateMap[teacherId] || 0,
        amount: hours * (rateMap[teacherId] || 0), adjustment_amount: 0
      }));

      if (items.length > 0) {
        const { error: insertError } = await adminClient.from('payroll_items').insert(items);
        if (insertError) throw new Error(insertError.message);
      }

      sendJson(res, 200, { ok: true, count: items.length });
      return true;
    }
    if (req.method === 'PATCH' && parts.length === 3 && parts[1] === 'payroll') {
      const cycleId = parts[2];
      const payload = await readJson(req);
      const updates = { approved_by: actor.userId };
      if (payload.status) updates.status = payload.status;
      if (payload.status === 'approved') updates.approved_at = nowIso();
      if (payload.status === 'paid') updates.paid_at = nowIso();
      const { data, error } = await adminClient.from('payroll_monthly_cycles').update(updates).eq('id', cycleId).select('*').single();
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, cycle: data });
      return true;
    }

    // ═══════ REQUESTS (all from counselors/AC) ═══════
    if (req.method === 'GET' && url.pathname === '/finance/requests') {
      const { data, error } = await adminClient.from('requests').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    // ═══════ REPORTS ═══════
    if (req.method === 'GET' && url.pathname === '/finance/reports/account-wise') {
      const { data: accounts } = await adminClient.from('finance_accounts').select('*');
      const { data: income } = await adminClient.from('ledger_entries').select('amount, account_id').eq('entry_type', 'income');
      const { data: expenseData } = await adminClient.from('expenses').select('amount, account_id');

      const report = (accounts || []).map(acc => {
        const accIncome = (income || []).filter(i => i.account_id === acc.id).reduce((s, r) => s + Number(r.amount), 0);
        const accExpense = (expenseData || []).filter(e => e.account_id === acc.id).reduce((s, r) => s + Number(r.amount), 0);
        return { ...acc, total_income: accIncome, total_expense: accExpense, net: accIncome - accExpense };
      });
      sendJson(res, 200, { ok: true, items: report });
      return true;
    }

    sendJson(res, 404, { ok: false, error: 'route not found' });
    return true;
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'internal server error' });
    return true;
  }
}
