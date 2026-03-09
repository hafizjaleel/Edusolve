import { ALL_ROLES } from '../common/roles.js';
import { sendJson } from '../common/http.js';
import { getSupabaseAdminClient } from '../config/supabase.js';

export async function handleDashboard(req, res) {
  if (req.method === 'GET' && req.url.startsWith('/dashboard/')) {
    const role = req.url.replace('/dashboard/', '').trim();

    // Allow SUPER_ADMIN to access their specific dashboard data
    if (role === 'super-admin') {
      const adminClient = getSupabaseAdminClient();
      if (!adminClient) {
        sendJson(res, 500, { ok: false, error: 'Database configuration missing' });
        return true;
      }

      try {
        const [
          { count: totalLeads },
          { count: newLeads },
          { count: totalStudents },
          { count: totalTeachers },
          { data: incomeData },
          { data: expenseData },
          { data: teacherPayableEntries },
          { data: teacherExpenseEntries },
          { data: studentLedgerData },
        ] = await Promise.all([
          adminClient.from('leads').select('*', { count: 'exact', head: true }),
          adminClient.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
          adminClient.from('students').select('*', { count: 'exact', head: true }).eq('status', 'active'),
          adminClient.from('teacher_profiles').select('*', { count: 'exact', head: true }).eq('is_in_pool', true),
          // Real income table: ledger_entries with entry_type = 'income'
          adminClient.from('ledger_entries').select('amount').eq('entry_type', 'income'),
          // Real expenses table
          adminClient.from('expenses').select('amount'),
          // Teacher payable: net ledger balance (payable - already paid via expenses)
          adminClient.from('ledger_entries').select('teacher_id, amount').eq('entry_type', 'payable').not('teacher_id', 'is', null),
          adminClient.from('expenses').select('teacher_id, amount').not('teacher_id', 'is', null),
          // Pending Incoming: per-student outstanding (same logic as Finance Ledger page)
          adminClient.from('ledger_entries').select('student_id, amount, entry_type').in('entry_type', ['receivable', 'income']).not('student_id', 'is', null),
        ]);

        const totalIncome = (incomeData || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
        const totalExpenses = (expenseData || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
        // Teacher payable = total payable entries - total expenses paid to teachers (net balance we still owe)
        const totalTeacherPayable = (teacherPayableEntries || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
        const totalTeacherPaid = (teacherExpenseEntries || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
        const teacherPayable = totalTeacherPayable - totalTeacherPaid;
        // Group ledger entries by student, compute receivable - income per student, sum only +ve (student still owes)
        const studentLedger = {};
        for (const row of (studentLedgerData || [])) {
          if (!row.student_id) continue;
          if (!studentLedger[row.student_id]) studentLedger[row.student_id] = { receivable: 0, income: 0 };
          if (row.entry_type === 'receivable') studentLedger[row.student_id].receivable += Number(row.amount || 0);
          else studentLedger[row.student_id].income += Number(row.amount || 0);
        }
        const pendingIncoming = Object.values(studentLedger)
          .reduce((sum, s) => sum + (s.receivable - s.income), 0);

        const stats = {
          leads: { total: totalLeads || 0, new: newLeads || 0 },
          students: { total: totalStudents || 0 },
          teachers: { total: totalTeachers || 0 },
          finance: {
            income: totalIncome,
            expenses: totalExpenses,
            net: totalIncome - totalExpenses,
            teacherPayable,
            pendingIncoming
          }
        };

        sendJson(res, 200, { ok: true, stats });
        return true;

      } catch (err) {
        console.error('Super Admin Dashboard Error:', err);
        sendJson(res, 500, { ok: false, error: 'Failed to aggregate dashboard stats' });
        return true;
      }
    }

    if (!ALL_ROLES.includes(role)) {
      sendJson(res, 404, { ok: false, error: 'dashboard not found' });
      return true;
    }

    sendJson(res, 200, { ok: true, role, message: `${role} dashboard scaffold ready` });
    return true;
  }

  return false;
}
