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
        // 1. Leads Stats
        const { count: totalLeads } = await adminClient.from('leads').select('*', { count: 'exact', head: true });
        const { count: newLeads } = await adminClient.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new');

        // 2. Students Stats
        const { count: totalStudents } = await adminClient.from('students').select('*', { count: 'exact', head: true }).eq('status', 'active');

        // 3. Teachers Stats
        const { count: totalTeachers } = await adminClient.from('teachers').select('*', { count: 'exact', head: true }).eq('status', 'active');

        // 4. Finance Stats (This month)
        // Note: For MVP we might just grab totals or use a simplified query if finance_transactions table exists
        // Checking if finance_transactions exists from previous context or just using aggregation
        // Assuming we need to calculate from 'finance_income' and 'finance_expenses' tables

        const { data: incomeData } = await adminClient.from('finance_income').select('amount');
        const totalIncome = (incomeData || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

        const { data: expenseData } = await adminClient.from('finance_expenses').select('amount');
        const totalExpenses = (expenseData || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

        const netProfit = totalIncome - totalExpenses;

        // 5. Teacher Payables (Approved but not Paid)
        // We need to join with payroll_monthly_cycles to check status='approved'
        // For MVP, let's fetch approved cycles first, then sum their items
        const { data: approvedCycles } = await adminClient.from('payroll_monthly_cycles').select('id').eq('status', 'approved');
        const approvedCycleIds = (approvedCycles || []).map(c => c.id);

        let teacherPayable = 0;
        if (approvedCycleIds.length > 0) {
          const { data: payrollItems } = await adminClient.from('payroll_items').select('amount').in('cycle_id', approvedCycleIds);
          teacherPayable = (payrollItems || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
        }

        // 6. Pending Incoming (Pending Payment Requests)
        const { data: pendingRequests } = await adminClient.from('payment_requests').select('amount').eq('status', 'pending');
        const pendingIncoming = (pendingRequests || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

        const stats = {
          leads: { total: totalLeads || 0, new: newLeads || 0 },
          students: { total: totalStudents || 0 },
          teachers: { total: totalTeachers || 0 },
          finance: { income: totalIncome, expenses: totalExpenses, net: netProfit, teacherPayable, pendingIncoming }
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
