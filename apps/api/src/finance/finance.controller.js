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

  // Routes accessible to counselors and academic coordinators (not finance-only)
  const isOpenRoute =
    (req.method === 'GET' && url.pathname === '/finance/pending-balances') ||
    (req.method === 'GET' && url.pathname === '/finance/my-installments') ||
    (req.method === 'POST' && url.pathname === '/finance/installments');

  const isCounselorOrAC = ['counselor', 'counselor_head', 'academic_coordinator', 'super_admin'].includes(actor.role);

  if (!isFinance(actor) && !(isOpenRoute && isCounselorOrAC)) {
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
        .select('*, leads(*), users!payment_requests_requested_by_fkey(full_name)')
        .order('created_at', { ascending: false });
      if (status !== 'all') query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      console.log('DEBUG API PAYMENTS:', JSON.stringify(data?.[0]?.users));
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    const parts = url.pathname.split('/').filter(Boolean);
    if (req.method === 'GET' && url.pathname === '/finance/topup-requests') {
      const status = url.searchParams.get('status') || 'pending_finance';
      let query = adminClient
        .from('student_topups')
        .select('*, students(student_code,student_name), users!student_topups_requested_by_fkey(full_name)')
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

      // Insert receivable entry (total owed) and income entry (amount paid)
      await adminClient.from('ledger_entries').insert([
        {
          entry_date: nowIso().slice(0, 10),
          entry_type: 'receivable',
          amount: request.total_amount || request.amount || 0,
          description: `Receivable: Onboarding Fee — ${student.student_name}`,
          student_id: student.id,
          posted_by: actor.userId
        },
        {
          entry_date: nowIso().slice(0, 10),
          entry_type: 'income',
          amount: request.amount || 0,
          description: `Payment Received: ${student.student_name} (Onboarding)`,
          student_id: student.id,
          account_id: payload.account_id || null,
          posted_by: actor.userId
        }
      ]);

      if (payload.account_id) {
        adminClient.from('finance_accounts').select('balance').eq('id', payload.account_id).single().then(({ data: acc }) => {
          if (acc) adminClient.from('finance_accounts').update({ balance: Number(acc.balance) + Number(request.amount), updated_at: nowIso() }).eq('id', payload.account_id);
        }).catch(() => { });
      }

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

      // Insert receivable entry (total owed) and income entry (amount paid)
      await adminClient.from('ledger_entries').insert([
        {
          entry_date: nowIso().slice(0, 10),
          entry_type: 'receivable',
          amount: request.total_amount || request.amount || 0,
          description: `Receivable: Top-Up Fee — ${student.student_name}`,
          student_id: student.id,
          posted_by: actor.userId
        },
        {
          entry_date: nowIso().slice(0, 10),
          entry_type: 'income',
          amount: request.amount || 0,
          description: `Payment Received: ${student.student_name} (Top-Up)`,
          student_id: student.id,
          account_id: payload.account_id || null,
          posted_by: actor.userId
        }
      ]);

      if (payload.account_id) {
        adminClient.from('finance_accounts').select('balance').eq('id', payload.account_id).single().then(({ data: acc }) => {
          if (acc) adminClient.from('finance_accounts').update({ balance: Number(acc.balance) + Number(request.amount), updated_at: nowIso() }).eq('id', payload.account_id);
        }).catch(() => { });
      }

      sendJson(res, 200, { ok: true, status: 'verified' });
      return true;
    }

    // ═══════ FINANCE DASHBOARD STATS ═══════
    if (req.method === 'GET' && url.pathname === '/finance/stats') {
      const results = await Promise.all([
        adminClient.from('ledger_entries').select('amount').eq('entry_type', 'income'),
        adminClient.from('expenses').select('amount'),
        adminClient.from('finance_accounts').select('balance'),
        adminClient.from('payment_requests').select('status'),
        adminClient.from('student_topups').select('status')
      ]);
      const income = results[0]?.data || [];
      const expenses = results[1]?.data || [];
      const accounts = results[2]?.data || [];
      const payReqs = results[3]?.data || [];
      const topups = results[4]?.data || [];

      const totalIncome = income.reduce((s, r) => s + Number(r.amount || 0), 0);
      const totalExpenses = expenses.reduce((s, r) => s + Number(r.amount || 0), 0);
      const totalBalance = accounts.reduce((s, r) => s + Number(r.balance || 0), 0);
      const pendingPayments = payReqs.filter(r => r.status === 'pending').length;
      const pendingTopups = topups.filter(r => r.status === 'pending_finance').length;
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

    // ═══════ LEDGERS (Parties Redesign) ═══════
    if (req.method === 'GET' && parts.length === 3 && parts[1] === 'ledgers') {
      const type = parts[2];

      const getLedgerStats = async (idField, table) => {
        const [peopleRes, ledgersRes, expensesRes] = await Promise.all([
          adminClient.from(table).select('*').order('created_at', { ascending: false }),
          adminClient.from('ledger_entries').select(`${idField}, amount, entry_type`),
          adminClient.from('expenses').select(`${idField}, amount`)
        ]);

        const incomeTotals = {};
        const receivableTotals = {};
        const payableTotals = {};
        (ledgersRes.data || []).forEach(l => {
          if (!l[idField]) return;
          if (l.entry_type === 'receivable') {
            receivableTotals[l[idField]] = (receivableTotals[l[idField]] || 0) + Number(l.amount || 0);
          } else if (l.entry_type === 'payable') {
            payableTotals[l[idField]] = (payableTotals[l[idField]] || 0) + Number(l.amount || 0);
          } else if (l.entry_type === 'income') {
            incomeTotals[l[idField]] = (incomeTotals[l[idField]] || 0) + Number(l.amount || 0);
          }
        });

        const expenseTotals = {};
        (expensesRes.data || []).forEach(e => {
          if (e[idField]) expenseTotals[e[idField]] = (expenseTotals[e[idField]] || 0) + Number(e.amount || 0);
        });

        return (peopleRes.data || []).map(p => {
          const income = incomeTotals[p.id] || 0;
          const receivable = receivableTotals[p.id] || 0;
          const payable = payableTotals[p.id] || 0;
          const expense = expenseTotals[p.id] || 0;
          return {
            ...p,
            total_income: income,
            total_receivable: receivable,
            total_payable: payable,
            total_expense: expense,
            balance: income - expense,
            outstanding: receivable - income,        // for students: still owed to us
            balance_owed: payable - expense           // for employees/teachers: we still owe them
          };
        });
      };

      if (type === 'students') {
        const items = await getLedgerStats('student_id', 'students');
        sendJson(res, 200, { ok: true, items });
        return true;
      }
      if (type === 'employees') {
        const items = await getLedgerStats('employee_id', 'employees');
        sendJson(res, 200, { ok: true, items });
        return true;
      }
      if (type === 'teachers') {
        // Use teacher_profiles table (the canonical source for teachers)
        const { data: profiles } = await adminClient
          .from('teacher_profiles')
          .select('id, user_id, teacher_code, users!teacher_profiles_user_id_fkey(id, full_name, email, phone)')
          .order('created_at', { ascending: false });

        // teacher_id in ledger_entries/expenses may store EITHER teacher_profiles.id (from HR payroll)
        // OR users.id (from other flows), so we must search by both sets of IDs
        const profileIds = (profiles || []).map(p => p.id).filter(Boolean);
        const teacherUserIds = (profiles || []).map(p => p.user_id).filter(Boolean);
        const allIds = [...new Set([...profileIds, ...teacherUserIds])];

        // Build a mapping: any ID (profile or user) → user_id (canonical key)
        const idToUserId = {};
        (profiles || []).forEach(p => {
          idToUserId[p.id] = p.user_id;
          idToUserId[p.user_id] = p.user_id;
        });

        let items = [];
        if (allIds.length > 0) {
          const [ledgersRes, expensesRes] = await Promise.all([
            adminClient.from('ledger_entries').select('teacher_id, amount, entry_type').in('teacher_id', allIds),
            adminClient.from('expenses').select('teacher_id, amount').in('teacher_id', allIds)
          ]);
          const payableTotals2 = {};
          (ledgersRes.data || []).forEach(l => {
            if (!l.teacher_id) return;
            const uid = idToUserId[l.teacher_id];
            if (!uid) return;
            if (l.entry_type === 'payable') {
              payableTotals2[uid] = (payableTotals2[uid] || 0) + Number(l.amount || 0);
            }
          });
          const expenseTotals = {};
          (expensesRes.data || []).forEach(e => {
            if (!e.teacher_id) return;
            const uid = idToUserId[e.teacher_id];
            if (uid) expenseTotals[uid] = (expenseTotals[uid] || 0) + Number(e.amount || 0);
          });
          items = (profiles || []).map(p => ({
            id: p.user_id,
            full_name: p.users?.full_name || 'Unknown',
            email: p.users?.email || '',
            phone: p.users?.phone || '',
            teacher_code: p.teacher_code || '',
            total_payable: payableTotals2[p.user_id] || 0,
            total_paid: expenseTotals[p.user_id] || 0,
            balance_owed: (payableTotals2[p.user_id] || 0) - (expenseTotals[p.user_id] || 0)
          }));
        }
        sendJson(res, 200, { ok: true, items });
        return true;
      }
      if (type === 'others') {
        const items = await getLedgerStats('party_id', 'finance_parties');
        sendJson(res, 200, { ok: true, items });
        return true;
      }
    }

    if (req.method === 'GET' && parts.length === 4 && parts[1] === 'ledgers') {
      const type = parts[2];
      const id = parts[3];
      const idField = type === 'students' ? 'student_id' : type === 'employees' ? 'employee_id' : type === 'teachers' ? 'teacher_id' : 'party_id';

      let incomeRes, expenseRes;

      if (type === 'teachers') {
        // teacher_id in ledger/expenses may be EITHER user_id or teacher_profiles.id
        // Look up the teacher profile to get both IDs
        const { data: profile } = await adminClient
          .from('teacher_profiles')
          .select('id, user_id')
          .eq('user_id', id)
          .maybeSingle();
        const searchIds = profile ? [profile.id, profile.user_id].filter(Boolean) : [id];

        [incomeRes, expenseRes] = await Promise.all([
          adminClient.from('ledger_entries').select('*').in(idField, searchIds).order('entry_date', { ascending: false }),
          adminClient.from('expenses').select('*').in(idField, searchIds).order('expense_date', { ascending: false })
        ]);
      } else {
        [incomeRes, expenseRes] = await Promise.all([
          adminClient.from('ledger_entries').select('*').eq(idField, id).order('entry_date', { ascending: false }),
          adminClient.from('expenses').select('*').eq(idField, id).order('expense_date', { ascending: false })
        ]);
      }

      const history = [
        ...(incomeRes.data || []).map(i => ({
          ...i,
          __type: i.entry_type === 'receivable' ? 'receivable'
               : i.entry_type === 'payable' ? 'payable'
               : i.entry_type === 'expense' ? 'expense'
               : 'income',
          date: i.entry_date
        })),
        ...(expenseRes.data || []).map(e => ({ ...e, __type: 'expense', date: e.expense_date }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      sendJson(res, 200, { ok: true, history });
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
      const { data, error } = await adminClient.from('ledger_entries').select('*, finance_accounts(name), finance_parties(name), students(student_name), users!teacher_id(full_name), employees(full_name)')
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
        account_id: payload.account_id || null,
        party_id: payload.party_id || null,
        student_id: payload.student_id || null,
        teacher_id: payload.teacher_id || null,
        employee_id: payload.employee_id || null,
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
      const { data, error } = await adminClient.from('expenses').select('*, finance_accounts(name), finance_parties(name), students(student_name), users!teacher_id(full_name), employees(full_name)')
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
        account_id: payload.account_id || null,
        party_id: payload.party_id || null,
        student_id: payload.student_id || null,
        teacher_id: payload.teacher_id || null,
        employee_id: payload.employee_id || null,
        created_by: actor.userId
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

    // ═══════ HR PAYROLL REQUESTS (View and Pay) ═══════
    if (req.method === 'GET' && url.pathname === '/finance/hr-payment-requests') {
      const { data, error } = await adminClient
        .from('hr_payment_requests')
        .select('*, employees(full_name, designation, department), teacher_profiles(users!teacher_profiles_user_id_fkey(full_name))')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      sendJson(res, 200, { ok: true, items: data || [] });
      return true;
    }

    if (req.method === 'GET' && parts.length === 3 && parts[1] === 'hr-payroll') {
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

    if (req.method === 'POST' && parts.length === 4 && parts[1] === 'hr-payment-requests' && parts[3] === 'pay') {
      const requestId = parts[2];
      const payload = await readJson(req);
      if (!payload.account_id) { sendJson(res, 400, { ok: false, error: 'account_id required' }); return true; }

      // Get hr_payment_request
      const { data: request, error: reqError } = await adminClient.from('hr_payment_requests').select('*').eq('id', requestId).single();
      if (reqError || !request) { sendJson(res, 404, { ok: false, error: 'request not found' }); return true; }
      if (request.status === 'paid') { sendJson(res, 400, { ok: false, error: 'already paid' }); return true; }

      // Update account balance
      const { data: acc } = await adminClient.from('finance_accounts').select('balance').eq('id', payload.account_id).single();
      if (acc) {
        await adminClient.from('finance_accounts').update({ balance: Number(acc.balance) - Number(request.total_amount), updated_at: nowIso() }).eq('id', payload.account_id);
      }

      // Mark HR payment request as paid
      await adminClient.from('hr_payment_requests').update({ status: 'paid', finance_note: payload.finance_note || null, updated_at: nowIso() }).eq('id', requestId);

      // Create an expense
      const expense = {
        expense_date: nowIso().slice(0, 10),
        category: 'salary',
        amount: request.total_amount,
        description: `Salary Payment — ${request.year}/${String(request.month).padStart(2, '0')}`,
        account_id: payload.account_id,
        employee_id: request.target_type === 'employee' ? request.employee_id : null,
        teacher_id: request.target_type === 'teacher' ? request.teacher_id : null,
        created_by: actor.userId
      };
      await adminClient.from('expenses').insert([expense]);

      sendJson(res, 200, { ok: true, status: 'paid' });
      return true;
    }



    // ═══════ PENDING INSTALLMENTS ═══════
    if (req.method === 'GET' && url.pathname === '/finance/pending-balances') {
      try {
        const [payRes, topupRes] = await Promise.all([
          adminClient.from('payment_requests').select('*, leads(student_name, contact_number)').eq('status', 'verified'),
          adminClient.from('student_topups').select('*, students(student_name, student_code)').eq('status', 'verified')
        ]);

        const pendingPayments = (payRes.data || []).filter(p => Number(p.total_amount || 0) > Number(p.amount || 0)).map(p => ({
          ...p,
          _type: 'payment_request',
          remaining_amount: Number(p.total_amount || 0) - Number(p.amount || 0)
        }));

        const pendingTopups = (topupRes.data || []).filter(t => Number(t.total_amount || 0) > Number(t.amount || 0)).map(t => ({
          ...t,
          _type: 'student_topup',
          remaining_amount: Number(t.total_amount || 0) - Number(t.amount || 0)
        }));

        sendJson(res, 200, { ok: true, items: [...pendingPayments, ...pendingTopups].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) });
        return true;
      } catch (err) {
        throw new Error(err.message);
      }
    }

    if (req.method === 'POST' && url.pathname === '/finance/installments') {
      const payload = await readJson(req);
      if (!payload.reference_type || !payload.reference_id || !payload.amount) {
        sendJson(res, 400, { ok: false, error: 'reference_type, reference_id, and amount required' });
        return true;
      }

      const { data, error } = await adminClient.from('installment_payments').insert({
        reference_type: payload.reference_type,
        reference_id: payload.reference_id,
        amount: Number(payload.amount),
        finance_note: payload.finance_note || null,
        screenshot_url: payload.screenshot_url || null,
        status: 'pending',
        created_by: actor.userId
      }).select('*').single();

      if (error) throw new Error(error.message);
      sendJson(res, 201, { ok: true, item: data });
      return true;
    }

    if (req.method === 'GET' && url.pathname === '/finance/my-installments') {
      const { data, error } = await adminClient
        .from('installment_payments')
        .select('*')
        .eq('created_by', actor.userId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);

      // Stitch parent data
      const items = await Promise.all((data || []).map(async (inst) => {
        let studentName = '—';
        if (inst.reference_type === 'payment_request') {
          const { data: p } = await adminClient.from('payment_requests').select('leads(student_name)').eq('id', inst.reference_id).single();
          studentName = p?.leads?.student_name || '—';
        } else if (inst.reference_type === 'student_topup') {
          const { data: t } = await adminClient.from('student_topups').select('students(student_name)').eq('id', inst.reference_id).single();
          studentName = t?.students?.student_name || '—';
        }
        return { ...inst, student_name: studentName };
      }));

      sendJson(res, 200, { ok: true, items });
      return true;
    }

    if (req.method === 'GET' && url.pathname === '/finance/installments') {
      const status = url.searchParams.get('status') || 'pending';
      let query = adminClient
        .from('installment_payments')
        .select('*, users!installment_payments_created_by_fkey(full_name)')
        .order('created_at', { ascending: false });

      if (status !== 'all') query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw new Error(error.message);

      // Stitch parent data
      const items = await Promise.all((data || []).map(async (inst) => {
        let parent = null;
        if (inst.reference_type === 'payment_request') {
          const { data: p } = await adminClient.from('payment_requests').select('*, leads(student_name, contact_number)').eq('id', inst.reference_id).single();
          parent = p;
        } else if (inst.reference_type === 'student_topup') {
          const { data: t } = await adminClient.from('student_topups').select('*, students(student_name, student_code)').eq('id', inst.reference_id).single();
          parent = t;
        }
        return { ...inst, parent };
      }));

      sendJson(res, 200, { ok: true, items });
      return true;
    }

    if (req.method === 'POST' && parts.length === 4 && parts[1] === 'installments' && parts[3] === 'verify') {
      const instId = parts[2];
      const payload = await readJson(req);

      if (payload.approved === false) {
        await adminClient.from('installment_payments').update({
          status: 'rejected', finance_note: payload.finance_note || null, verified_by: actor.userId, verified_at: nowIso(), updated_at: nowIso()
        }).eq('id', instId);
        sendJson(res, 200, { ok: true, status: 'rejected' });
        return true;
      }

      if (!payload.account_id) {
        sendJson(res, 400, { ok: false, error: 'account_id required to verify' });
        return true;
      }

      const { data: inst, error: instErr } = await adminClient.from('installment_payments').select('*').eq('id', instId).single();
      if (instErr || !inst) throw new Error(instErr?.message || 'Installment not found');
      if (inst.status !== 'pending') {
        sendJson(res, 400, { ok: false, error: 'Installment already processed' });
        return true;
      }

      let studentId = null;
      let studentName = 'Unknown';
      let table = inst.reference_type === 'payment_request' ? 'payment_requests' : 'student_topups';

      const { data: parent } = await adminClient.from(table).select('*').eq('id', inst.reference_id).single();
      if (!parent) throw new Error('Parent record not found');

      if (inst.reference_type === 'payment_request') {
        const { data: lead } = await adminClient.from('leads').select('student_name, joined_student_id').eq('id', parent.lead_id).single();
        if (lead) { studentId = lead.joined_student_id; studentName = lead.student_name; }
      } else {
        studentId = parent.student_id;
        const { data: st } = await adminClient.from('students').select('student_name').eq('id', studentId).single();
        if (st) studentName = st.student_name;
      }

      // Update Parent Paid Amount
      await adminClient.from(table).update({ amount: Number(parent.amount || 0) + Number(inst.amount) }).eq('id', parent.id);

      // Verify Installment
      await adminClient.from('installment_payments').update({
        status: 'verified', account_id: payload.account_id, finance_note: payload.finance_note || null,
        verified_by: actor.userId, verified_at: nowIso(), updated_at: nowIso()
      }).eq('id', instId);

      // Add to Ledger
      await adminClient.from('ledger_entries').insert({
        entry_date: nowIso().slice(0, 10),
        entry_type: 'income',
        amount: inst.amount,
        description: `Installment Payment: ${studentName}`,
        student_id: studentId,
        account_id: payload.account_id,
        posted_by: actor.userId
      });

      // Update Bank Balance
      const { data: acc } = await adminClient.from('finance_accounts').select('balance').eq('id', payload.account_id).single();
      if (acc) {
        await adminClient.from('finance_accounts').update({ balance: Number(acc.balance) + Number(inst.amount), updated_at: nowIso() }).eq('id', payload.account_id);
      }

      sendJson(res, 200, { ok: true, status: 'verified' });
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
