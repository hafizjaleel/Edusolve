import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

/* ═══════ FINANCE DASHBOARD ═══════ */
export function FinanceDashboardPage() {

  const [stats, setStats] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [recentIncome, setRecentIncome] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/finance/stats'),
      apiFetch('/finance/accounts'),
      apiFetch('/finance/income'),
      apiFetch('/finance/expenses')
    ]).then(([s, a, i, e]) => {
      setStats(s.stats);
      setAccounts(a.items || []);
      setRecentIncome((i.items || []).slice(0, 5));
      setRecentExpenses((e.items || []).slice(0, 5));
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="panel"><p>Loading dashboard...</p></section>;
  if (!stats) return <section className="panel"><p className="error">Failed to load stats</p></section>;

  const income = Number(stats.totalIncome) || 0;
  const expense = Number(stats.totalExpenses) || 0;
  const net = Number(stats.netProfit) || 0;
  const balance = Number(stats.totalBalance) || 0;
  const maxBar = Math.max(income, expense, 1);
  const profitMargin = income > 0 ? Math.round((net / income) * 100) : 0;

  return (
    <section className="panel">
      {/* ── KPI Cards ── */}
      <div className="grid-four">
        <article className="card stat-card success">
          <p className="eyebrow">Total Income</p>
          <h3>₹{income.toLocaleString()}</h3>
        </article>
        <article className="card stat-card danger">
          <p className="eyebrow">Total Expenses</p>
          <h3>₹{expense.toLocaleString()}</h3>
        </article>
        <article className={`card stat-card ${net >= 0 ? 'success' : 'danger'}`}>
          <p className="eyebrow">Net Profit</p>
          <h3>₹{net.toLocaleString()}</h3>
        </article>
        <article className="card stat-card spotlight">
          <p className="eyebrow">Total Balance</p>
          <h3>₹{balance.toLocaleString()}</h3>
        </article>
      </div>

      {/* ── Visual Bar: Income vs Expense + Margin ── */}
      <div className="grid-two" style={{ marginTop: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>

          <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px', color: '#6b7280' }}><path d="M15.5 2A1.5 1.5 0 0014 3.5v8a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-8A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v4a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v.5A1.5 1.5 0 003.5 13.5h1a1.5 1.5 0 001.5-1.5v-.5A1.5 1.5 0 004.5 10h-1z" /></svg>
            Income vs Expenses
          </h3>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: '#15803d', fontWeight: 600 }}>Income</span>
              <span style={{ fontWeight: 700, color: '#15803d' }}>₹{income.toLocaleString()}</span>
            </div>
            <div style={{ height: '18px', background: '#f3f4f6', borderRadius: '9px', overflow: 'hidden' }}>
              <div style={{ width: `${(income / maxBar) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #15803d)', borderRadius: '9px', transition: 'width 0.6s ease' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: '#dc2626', fontWeight: 600 }}>Expenses</span>
              <span style={{ fontWeight: 700, color: '#dc2626' }}>₹{expense.toLocaleString()}</span>
            </div>
            <div style={{ height: '18px', background: '#f3f4f6', borderRadius: '9px', overflow: 'hidden' }}>
              <div style={{ width: `${(expense / maxBar) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #f87171, #dc2626)', borderRadius: '9px', transition: 'width 0.6s ease' }} />
            </div>
          </div>
          <div style={{ marginTop: '14px', padding: '10px', background: net >= 0 ? '#ecfdf5' : '#fef2f2', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: net >= 0 ? '#15803d' : '#dc2626' }}>
              {net >= 0 ? '▲' : '▼'} Net: ₹{Math.abs(net).toLocaleString()} ({net >= 0 ? '+' : '-'}{Math.abs(profitMargin)}% margin)
            </span>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px', color: '#6b7280' }}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.5-10.5a.5.5 0 011 0v3a.5.5 0 01-.5.5H6a.5.5 0 010-1h1.5v-2.5zM13 10a1 1 0 10-2 0 1 1 0 002 0z" clipRule="evenodd" /></svg>
            Pending Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Payment Requests</p>
                <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '11px' }}>Awaiting verification</p>
              </div>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#d97706' }}>{stats.pendingPayments}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f5f3ff', borderRadius: '10px', border: '1px solid #ddd6fe' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3zM12 8.25a.75.75 0 01.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75h-.008z" clipRule="evenodd" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Top-up Requests</p>
                <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '11px' }}>Awaiting verification</p>
              </div>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#7c3aed' }}>{stats.pendingTopups}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}><path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" /><path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Profit Margin</p>
                <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '11px' }}>Overall efficiency</p>
              </div>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb' }}>{profitMargin}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Accounts Overview ── */}
      {accounts.length > 0 ? (
        <div className="card" style={{ padding: '20px', marginTop: '16px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px', color: '#6b7280' }}><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm13 1.5a1 1 0 011 1v10a1 1 0 01-1 1h-3v-2h2V7.5h-1a1 1 0 01-1-1v-1a1 1 0 011-1h1z" clipRule="evenodd" /></svg>
            Accounts Overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {accounts.map(acc => {
              const accBal = Number(acc.balance) || 0;
              const maxBal = Math.max(...accounts.map(a => Math.abs(Number(a.balance) || 0)), 1);
              const typeIcons = {
                bank: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>,
                cash: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}><path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" /><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" /><path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" /></svg>,
                upi: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}><path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" /><path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3h6.75c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z" clipRule="evenodd" /></svg>,
                wallet: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}><path d="M22 6.002a2.002 2.002 0 00-2-2.002H4c-1.1 0-2 .892-2 1.992v12.016a2 2 0 002 2.002h16c1.1 0 2-.892 2-2.002V6.002zM20 16.01a1 1 0 110-2.002 1 1 0 010 2.002z" /></svg>,
                other: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}><path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" /></svg>
              };
              return (
                <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px', width: '28px', textAlign: 'center', color: '#6b7280', display: 'flex', justifyContent: 'center' }}>{typeIcons[acc.type] || typeIcons['other']}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {acc.name} {acc.is_main ? <span style={{ color: '#4338ca', fontSize: '10px' }}>(Main)</span> : ''}
                      </span>
                      <span style={{ fontWeight: 700, color: accBal >= 0 ? '#15803d' : '#dc2626', flexShrink: 0 }}>₹{accBal.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(Math.abs(accBal) / maxBal) * 100}%`, height: '100%', background: accBal >= 0 ? 'linear-gradient(90deg, #34d399, #059669)' : 'linear-gradient(90deg, #f87171, #dc2626)', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ── Recent Transactions ── */}
      <div className="grid-two" style={{ marginTop: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /></svg>
            Recent Income
          </h3>
          {recentIncome.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recentIncome.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f0fdf4', borderRadius: '8px', fontSize: '12px' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{item.description || 'Income'}</p>
                    <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '11px' }}>{item.entry_date}</p>
                  </div>
                  <span style={{ fontWeight: 700, color: '#15803d' }}>+₹{Number(item.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-muted" style={{ fontSize: '12px' }}>No income entries yet</p>}
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.5-9a.75.75 0 00-1.5 0H8a.75.75 0 000 1.5h4z" clipRule="evenodd" /></svg>
            Recent Expenses
          </h3>
          {recentExpenses.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recentExpenses.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#fef2f2', borderRadius: '8px', fontSize: '12px' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{item.description || item.category || 'Expense'}</p>
                    <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '11px' }}>{item.expense_date}</p>
                  </div>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>-₹{Number(item.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-muted" style={{ fontSize: '12px' }}>No expenses yet</p>}
        </div>
      </div>
    </section>
  );
}

function DashCard({ label, value, tone }) {
  const color = tone === 'success' ? '#15803d' : tone === 'danger' ? '#dc2626' : tone === 'info' ? '#4338ca' : '#111';
  return (
    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
      <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color }}>{value}</p>
      <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>{label}</p>
    </div>
  );
}

/* ═══════ INCOME PAGE ═══════ */
export function IncomeManagementPage() {
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [parties, setParties] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [i, a, p] = await Promise.all([
        apiFetch('/finance/income'), apiFetch('/finance/accounts'), apiFetch('/finance/parties')
      ]);
      setItems(i.items || []); setAccounts(a.items || []); setParties(p.items || []);
    } catch (e) { }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const total = items.reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Income</h2>
          <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '13px' }}>Total: ₹{total.toLocaleString()}</p>
        </div>
        <button className="primary" onClick={() => setShowAdd(true)}>+ Add Income</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <article className="card" style={{ padding: '16px' }}>
          <div className="table-wrap mobile-friendly-table">
            <table>
              <thead><tr><th>Date</th><th>Description</th><th>Account</th><th>Party</th><th>Amount</th></tr></thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id}>
                    <td data-label="Date">{i.entry_date}</td>
                    <td data-label="Description">{i.description || '—'}</td>
                    <td data-label="Account">{i.finance_accounts?.name || '—'}</td>
                    <td data-label="Party">{i.finance_parties?.name || '—'}</td>
                    <td data-label="Amount" style={{ fontWeight: 600, color: '#15803d' }}>₹{Number(i.amount).toLocaleString()}</td>
                  </tr>
                ))}
                {!items.length ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>No income entries</td></tr> : null}
              </tbody>
            </table>
          </div>
        </article>
      )}
      {showAdd ? <AddEntryModal type="income" accounts={accounts} parties={parties} onClose={() => setShowAdd(false)} onDone={() => { setShowAdd(false); load(); }} /> : null}
    </section>
  );
}

/* ═══════ EXPENSE PAGE ═══════ */
export function ExpenseManagementPage() {
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [parties, setParties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [e, a, p, c] = await Promise.all([
        apiFetch('/finance/expenses'), apiFetch('/finance/accounts'), apiFetch('/finance/parties'),
        apiFetch('/finance/categories?type=expense')
      ]);
      setItems(e.items || []); setAccounts(a.items || []); setParties(p.items || []);
      setCategories(c.items || []);
    } catch (e) { }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const total = items.reduce((s, r) => s + Number(r.amount || 0), 0);

  const categoryNames = categories.length > 0 ? categories.map(c => c.name) : ['salary', 'rent', 'marketing', 'software', 'travel', 'office supplies', 'utilities', 'maintenance', 'other'];

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Expenses</h2>
          <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '13px' }}>Total: ₹{total.toLocaleString()}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="secondary" onClick={() => setShowCategories(true)}>Manage Categories</button>
          <button className="primary" onClick={() => setShowAdd(true)}>+ Add Expense</button>
        </div>
      </div>
      {loading ? <p>Loading...</p> : (
        <article className="card" style={{ padding: '16px' }}>
          <div className="table-wrap mobile-friendly-table">
            <table>
              <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Account</th><th>Party</th><th>Amount</th></tr></thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id}>
                    <td data-label="Date">{i.expense_date}</td>
                    <td data-label="Category"><span style={{ textTransform: 'capitalize' }}>{i.category}</span></td>
                    <td data-label="Description">{i.description || '—'}</td>
                    <td data-label="Account">{i.finance_accounts?.name || '—'}</td>
                    <td data-label="Party">{i.finance_parties?.name || '—'}</td>
                    <td data-label="Amount" style={{ fontWeight: 600, color: '#dc2626' }}>₹{Number(i.amount).toLocaleString()}</td>
                  </tr>
                ))}
                {!items.length ? <tr><td colSpan="6" style={{ textAlign: 'center' }}>No expenses</td></tr> : null}
              </tbody>
            </table>
          </div>
        </article>
      )}
      {showAdd ? <AddExpenseModal accounts={accounts} parties={parties} categories={categoryNames} onClose={() => setShowAdd(false)} onDone={() => { setShowAdd(false); load(); }} /> : null}
      {showCategories ? <CategoriesModal type="expense" onClose={() => setShowCategories(false)} onUpdate={load} /> : null}
    </section>
  );
}

/* ═══════ ACCOUNTS PAGE ═══════ */
export function AccountsPage() {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try { const d = await apiFetch('/finance/accounts'); setItems(d.items || []); } catch (e) { }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const totalBalance = items.reduce((s, r) => s + Number(r.balance || 0), 0);

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Accounts</h2>
          <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '13px' }}>Total Balance: ₹{totalBalance.toLocaleString()}</p>
        </div>
        <button className="primary" onClick={() => setShowAdd(true)}>+ Add Account</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="today-leads-grid">
          {items.map(acc => (
            <div key={acc.id} className="card" style={{
              padding: '20px', borderLeft: `4px solid ${acc.is_main ? '#4338ca' : '#6b7280'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{acc.name}</h3>
                  <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '12px', textTransform: 'capitalize' }}>{acc.type}</p>
                </div>
                {acc.is_main ? <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, background: '#e0e7ff', color: '#4338ca' }}>MAIN</span> : null}
              </div>
              <p style={{ margin: '12px 0 0', fontSize: '28px', fontWeight: 700, color: Number(acc.balance) >= 0 ? '#15803d' : '#dc2626' }}>
                ₹{Number(acc.balance).toLocaleString()}
              </p>
              {acc.description ? <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>{acc.description}</p> : null}
            </div>
          ))}
          {!items.length ? <div className="card" style={{ padding: '40px', textAlign: 'center' }}><p className="text-muted">No accounts. Add your first account.</p></div> : null}
        </div>
      )}
      {showAdd ? <AddAccountModal onClose={() => setShowAdd(false)} onDone={() => { setShowAdd(false); load(); }} /> : null}
    </section>
  );
}

/* ═══════ PARTIES PAGE ═══════ */
export function PartiesPage() {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try { const d = await apiFetch('/finance/parties'); setItems(d.items || []); } catch (e) { }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const typeColors = { vendor: '#f59e0b', client: '#10b981', employee: '#6366f1', other: '#6b7280' };

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Parties ({items.length})</h2>
        <button className="primary" onClick={() => setShowAdd(true)}>+ Add Party</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="today-leads-grid">
          {items.map(p => (
            <div key={p.id} className="card" style={{
              padding: '16px', borderLeft: `4px solid ${typeColors[p.type] || '#6b7280'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{p.name}</h3>
                <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, textTransform: 'capitalize', background: `${typeColors[p.type]}18`, color: typeColors[p.type] }}>{p.type}</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                {p.phone ? <p style={{ margin: '2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '12px', height: '12px' }}><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" /></svg> {p.phone}</p> : null}
                {p.email ? <p style={{ margin: '2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '12px', height: '12px' }}><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" /><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" /></svg> {p.email}</p> : null}
                {p.address ? <p style={{ margin: '2px 0', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '12px', height: '12px' }}><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg> {p.address}</p> : null}
              </div>
            </div>
          ))}
          {!items.length ? <div className="card" style={{ padding: '40px', textAlign: 'center' }}><p className="text-muted">No parties added yet.</p></div> : null}
        </div>
      )}
      {showAdd ? <AddPartyModal onClose={() => setShowAdd(false)} onDone={() => { setShowAdd(false); load(); }} /> : null}
    </section>
  );
}

/* ═══════ PAYROLL PAGE ═══════ */
export function PayrollPage() {
  const [cycles, setCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [payrollItems, setPayrollItems] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadCycles() {
    try { const d = await apiFetch('/finance/payroll'); setCycles(d.items || []); } catch (e) { }
    setLoading(false);
  }
  useEffect(() => { loadCycles(); }, []);

  async function viewCycle(cycle) {
    setSelectedCycle(cycle);
    try { const d = await apiFetch(`/finance/payroll/${cycle.id}`); setPayrollItems(d.items || []); } catch (e) { alert(e.message); }
  }

  async function generatePayroll(cycleId) {
    try {
      await apiFetch('/finance/payroll/generate', { method: 'POST', body: JSON.stringify({ cycle_id: cycleId }) });
      alert('Payroll generated!');
      await viewCycle(selectedCycle);
    } catch (e) { alert(e.message); }
  }

  async function updateCycleStatus(cycleId, status) {
    try {
      await apiFetch(`/finance/payroll/${cycleId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await loadCycles();
      if (selectedCycle?.id === cycleId) setSelectedCycle({ ...selectedCycle, status });
    } catch (e) { alert(e.message); }
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const statusColors = { draft: '#f59e0b', approved: '#10b981', paid: '#4338ca', reopened: '#ef4444' };
  const totalPayroll = payrollItems.reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Payroll</h2>
        <button className="primary" onClick={() => setShowCreate(true)}>+ Create Cycle</button>
      </div>

      {loading ? <p>Loading...</p> : null}

      {/* Payroll Cycles Grid */}
      <div className="today-leads-grid" style={{ marginBottom: '20px' }}>
        {cycles.map(c => (
          <div key={c.id} className="card" style={{
            padding: '16px', cursor: 'pointer', borderLeft: `4px solid ${statusColors[c.status] || '#6b7280'}`,
            background: selectedCycle?.id === c.id ? '#f0f4ff' : ''
          }} onClick={() => viewCycle(c)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{MONTHS[c.month - 1]} {c.year}</h3>
              <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: `${statusColors[c.status]}18`, color: statusColors[c.status] }}>{c.status}</span>
            </div>
            <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>{c.start_date} → {c.end_date}</p>
          </div>
        ))}
      </div>

      {/* Selected Cycle Details */}
      {selectedCycle ? (
        <article className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>{MONTHS[selectedCycle.month - 1]} {selectedCycle.year} — Payroll Items</h3>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button className="small secondary" onClick={() => generatePayroll(selectedCycle.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '14px', height: '14px', marginRight: '4px', verticalAlign: 'text-bottom' }}><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                Generate
              </button>
              {selectedCycle.status === 'draft' ? (
                <button className="small primary" onClick={() => updateCycleStatus(selectedCycle.id, 'approved')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '14px', height: '14px', marginRight: '4px', verticalAlign: 'text-bottom' }}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Approve
                </button>
              ) : null}
              {selectedCycle.status === 'approved' ? (
                <button className="small primary" onClick={() => updateCycleStatus(selectedCycle.id, 'paid')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '14px', height: '14px', marginRight: '4px', verticalAlign: 'text-bottom' }}><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                  Mark Paid
                </button>
              ) : null}
            </div>
          </div>
          <p className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>Total Payroll: <strong style={{ color: '#1d4ed8' }}>₹{totalPayroll.toLocaleString()}</strong></p>
          <div className="table-wrap mobile-friendly-table">
            <table>
              <thead><tr><th>Teacher</th><th>Hours</th><th>Rate</th><th>Amount</th><th>Adj</th><th>Total</th></tr></thead>
              <tbody>
                {payrollItems.map(item => (
                  <tr key={item.id}>
                    <td data-label="Teacher">{item.users?.full_name || '—'}</td>
                    <td data-label="Hours">{item.verified_hours}h</td>
                    <td data-label="Rate">₹{Number(item.rate_per_hour).toLocaleString()}</td>
                    <td data-label="Amount">₹{Number(item.amount).toLocaleString()}</td>
                    <td data-label="Adj">₹{Number(item.adjustment_amount).toLocaleString()}</td>
                    <td data-label="Total" style={{ fontWeight: 600, color: '#15803d' }}>₹{(Number(item.amount) + Number(item.adjustment_amount)).toLocaleString()}</td>
                  </tr>
                ))}
                {!payrollItems.length ? <tr><td colSpan="6" style={{ textAlign: 'center' }}>No items. Click "Generate" to auto-calculate from sessions.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </article>
      ) : null}

      {showCreate ? <CreatePayrollCycleModal onClose={() => setShowCreate(false)} onDone={() => { setShowCreate(false); loadCycles(); }} /> : null}
    </section>
  );
}

/* ═══════ REQUESTS VERIFICATION PAGE ═══════ */
export function RequestsVerificationPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try { const d = await apiFetch('/finance/requests'); setRequests(d.items || []); } catch (e) { }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const statusColors = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444', resolved: '#4338ca' };

  return (
    <section className="panel">
      <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>All Requests</h2>
      {loading ? <p>Loading...</p> : (
        <div className="today-leads-grid">
          {requests.map(r => (
            <div key={r.id} className="card" style={{
              padding: '16px', borderLeft: `4px solid ${statusColors[r.status] || '#6b7280'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{r.subject}</h3>
                <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, textTransform: 'capitalize', background: `${statusColors[r.status]}18`, color: statusColors[r.status] }}>{r.status}</span>
              </div>
              <p className="text-muted" style={{ margin: '6px 0', fontSize: '12px' }}>{r.description || '—'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af' }}>
                <span>{r.type || 'general'}</span>
                <span>{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}</span>
              </div>
            </div>
          ))}
          {!requests.length ? <div className="card" style={{ padding: '40px', textAlign: 'center' }}><p className="text-muted">No requests</p></div> : null}
        </div>
      )}
    </section>
  );
}

/* ═══════ REPORTS PAGE ═══════ */
export function FinanceReportsPage() {
  const [accountReport, setAccountReport] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [ar, i, e] = await Promise.all([
          apiFetch('/finance/reports/account-wise'),
          apiFetch('/finance/income'),
          apiFetch('/finance/expenses')
        ]);
        setAccountReport(ar.items || []);
        setIncome(i.items || []);
        setExpenses(e.items || []);
      } catch (e) { }
      setLoading(false);
    })();
  }, []);

  const totalIncome = income.reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, r) => s + Number(r.amount || 0), 0);

  // Monthly breakdown
  const monthlyData = useMemo(() => {
    const map = {};
    income.forEach(i => {
      const m = (i.entry_date || '').slice(0, 7);
      if (!map[m]) map[m] = { income: 0, expenses: 0 };
      map[m].income += Number(i.amount);
    });
    expenses.forEach(e => {
      const m = (e.expense_date || '').slice(0, 7);
      if (!map[m]) map[m] = { income: 0, expenses: 0 };
      map[m].expenses += Number(e.amount);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [income, expenses]);

  if (loading) return <section className="panel"><p>Loading reports...</p></section>;

  return (
    <section className="panel">
      <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Financial Reports</h2>

      <div className="grid-three" style={{ marginBottom: '16px' }}>
        <DashCard label="Total Income" value={`₹${totalIncome.toLocaleString()}`} tone="success" />
        <DashCard label="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`} tone="danger" />
        <DashCard label="Net Profit" value={`₹${(totalIncome - totalExpenses).toLocaleString()}`} tone="info" />
      </div>

      {/* Account-wise Report */}
      <article className="card" style={{ padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Account-wise Report</h3>
        <div className="table-wrap mobile-friendly-table">
          <table>
            <thead><tr><th>Account</th><th>Type</th><th>Balance</th><th>Income</th><th>Expense</th><th>Net</th></tr></thead>
            <tbody>
              {accountReport.map(acc => (
                <tr key={acc.id}>
                  <td data-label="Account">
                    {acc.name} {acc.is_main ? <span style={{ fontSize: '10px', color: '#4338ca' }}>(Main)</span> : ''}
                  </td>
                  <td data-label="Type" style={{ textTransform: 'capitalize' }}>{acc.type}</td>
                  <td data-label="Balance" style={{ fontWeight: 600 }}>₹{Number(acc.balance).toLocaleString()}</td>
                  <td data-label="Income" style={{ color: '#15803d' }}>₹{acc.total_income.toLocaleString()}</td>
                  <td data-label="Expense" style={{ color: '#dc2626' }}>₹{acc.total_expense.toLocaleString()}</td>
                  <td data-label="Net" style={{ fontWeight: 600, color: acc.net >= 0 ? '#15803d' : '#dc2626' }}>₹{acc.net.toLocaleString()}</td>
                </tr>
              ))}
              {!accountReport.length ? <tr><td colSpan="6" style={{ textAlign: 'center' }}>No accounts. Add accounts first.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </article>

      {/* Monthly Breakdown */}
      <article className="card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Monthly Breakdown</h3>
        <div className="table-wrap mobile-friendly-table">
          <table>
            <thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Net</th></tr></thead>
            <tbody>
              {monthlyData.map(([month, data]) => (
                <tr key={month}>
                  <td data-label="Month">{month}</td>
                  <td data-label="Income" style={{ color: '#15803d' }}>₹{data.income.toLocaleString()}</td>
                  <td data-label="Expenses" style={{ color: '#dc2626' }}>₹{data.expenses.toLocaleString()}</td>
                  <td data-label="Net" style={{ fontWeight: 600, color: (data.income - data.expenses) >= 0 ? '#15803d' : '#dc2626' }}>₹{(data.income - data.expenses).toLocaleString()}</td>
                </tr>
              ))}
              {!monthlyData.length ? <tr><td colSpan="4" style={{ textAlign: 'center' }}>No data yet</td></tr> : null}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}


/* ═══════ PAYMENT VERIFICATION PAGE ═══════ */
export function PaymentVerificationPage() {
  const [payments, setPayments] = useState([]);
  const [topups, setTopups] = useState([]);
  const [activeTab, setActiveTab] = useState('payments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  async function load() {
    setLoading(true); setError('');
    try {
      const [p, t] = await Promise.all([
        apiFetch('/finance/payment-requests?status=all'),
        apiFetch('/finance/topup-requests?status=all')
      ]);
      setPayments(p.items || []); setTopups(t.items || []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function verifyPayment(id, approved) {
    try {
      await apiFetch(`/finance/payment-requests/${id}/verify`, {
        method: 'POST', body: JSON.stringify({ approved })
      });
      await load();
    } catch (e) { alert(e.message); }
  }

  async function verifyTopup(id, approved) {
    try {
      await apiFetch(`/finance/topup-requests/${id}/verify`, {
        method: 'POST', body: JSON.stringify({ approved })
      });
      await load();
    } catch (e) { alert(e.message); }
  }

  const tabs = [
    { key: 'payments', label: `Payments (${payments.filter(p => p.status === 'pending').length})` },
    { key: 'topups', label: `Top-ups (${topups.filter(t => t.status === 'pending_finance').length})` }
  ];

  const statusColors = { pending: '#f59e0b', pending_finance: '#f59e0b', verified: '#10b981', rejected: '#ef4444' };

  return (
    <section className="panel">
      <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Payment Verification</h2>
      {error ? <p className="error">{error}</p> : null}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {tabs.map(t => (
          <button key={t.key} className={activeTab === t.key ? 'primary' : 'secondary'} style={{ fontSize: '13px' }} onClick={() => setActiveTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : null}

      {/* Payment Requests Tab */}
      {activeTab === 'payments' ? (
        <article className="card" style={{ padding: '16px' }}>
          <div className="table-wrap mobile-friendly-table">
            <table>
              <thead><tr>
                <th>Lead</th>
                <th>Phone</th>
                <th>Total Amt</th>
                <th>Hours</th>
                <th>Paid Amt</th>
                <th>Finance Note</th>
                <th>Screenshot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr></thead>
              <tbody>
                {payments.map(item => (
                  <tr key={item.id}>
                    <td data-label="Lead" style={{ fontWeight: 500 }}>{item.leads?.student_name || item.lead_id}</td>
                    <td data-label="Phone">{item.leads?.contact_number || '—'}</td>
                    <td data-label="Total Amt" style={{ fontWeight: 600 }}>{item.total_amount ? `₹${Number(item.total_amount).toLocaleString('en-IN')}` : '—'}</td>
                    <td data-label="Hours">{item.hours || '—'}</td>
                    <td data-label="Paid Amt" style={{ fontWeight: 600, color: '#15803d' }}>₹{Number(item.amount).toLocaleString('en-IN')}</td>
                    <td data-label="Finance Note" style={{ fontSize: '12px', color: '#6b7280', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.finance_note || '—'}</td>
                    <td data-label="Screenshot">
                      {item.screenshot_url ? <a href={item.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#4338ca' }}>View</a> : '—'}
                    </td>
                    <td data-label="Status">
                      <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, background: `${statusColors[item.status]}18`, color: statusColors[item.status] }}>{item.status}</span>
                    </td>
                    <td data-label="Actions" className="actions">
                      {item.status === 'pending' ? (
                        <button className="small primary" onClick={() => setSelectedPayment(item)}>🔍 Review</button>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
                {!payments.length ? <tr><td colSpan="9" style={{ textAlign: 'center' }}>No payment requests</td></tr> : null}
              </tbody>
            </table>

          </div>
        </article>
      ) : null}

      {/* Top-up Requests Tab */}
      {activeTab === 'topups' ? (
        <article className="card" style={{ padding: '16px' }}>
          <div className="table-wrap mobile-friendly-table">
            <table>
              <thead><tr><th>Student</th><th>Hours</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {topups.map(item => (
                  <tr key={item.id}>
                    <td data-label="Student">{item.students?.student_name || '—'} <span className="text-muted" style={{ fontSize: '11px' }}>({item.students?.student_code || ''})</span></td>
                    <td data-label="Hours">{item.hours_added}h</td>
                    <td data-label="Amount" style={{ fontWeight: 600 }}>₹{Number(item.amount).toLocaleString()}</td>
                    <td data-label="Status">
                      <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, background: `${statusColors[item.status]}18`, color: statusColors[item.status] }}>{item.status}</span>
                    </td>
                    <td data-label="Actions" className="actions">
                      {item.status === 'pending_finance' ? (
                        <>
                          <button className="small primary" onClick={() => verifyTopup(item.id, true)}>✅ Verify</button>
                          <button className="small danger" onClick={() => verifyTopup(item.id, false)}>✕ Reject</button>
                        </>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
                {!topups.length ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>No top-up requests</td></tr> : null}
              </tbody>
            </table>
          </div>
        </article>
      ) : null}
      {selectedPayment && (
        <PaymentVerifyModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onDone={() => { setSelectedPayment(null); load(); }}
        />
      )}
    </section>
  );
}

function PaymentVerifyModal({ payment, onClose, onDone }) {
  const [financeNote, setFinanceNote] = useState(payment.finance_note || '');
  const [saving, setSaving] = useState(false);

  async function handle(approved) {
    setSaving(true);
    try {
      await apiFetch(`/finance/payment-requests/${payment.id}/verify`, {
        method: 'POST',
        body: JSON.stringify({ approved, finance_note: financeNote || null })
      });
      onDone();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  const row = (label, value) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}>
      <span style={{ color: '#6b7280', fontWeight: 500 }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}
        style={{ maxWidth: '480px', background: 'white', padding: '24px', borderRadius: '12px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '17px' }}>Payment Request Review</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>×</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          {row('Student Name', payment.leads?.student_name || '—')}
          {row('Phone', payment.leads?.contact_number || '—')}
          {row('Total Package Amount', payment.total_amount ? `₹${Number(payment.total_amount).toLocaleString('en-IN')}` : '—')}
          {row('Hours Purchased', payment.hours ? `${payment.hours} hrs` : '—')}
          {row('Paid Amount', `₹${Number(payment.amount).toLocaleString('en-IN')}`)}
          {row('Counselor Note', payment.finance_note || '—')}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>Screenshot</span>
            {payment.screenshot_url
              ? <a href={payment.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#4338ca', fontWeight: 600 }}>View Screenshot ↗</a>
              : <span style={{ fontWeight: 600 }}>—</span>}
          </div>
        </div>

        <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
          ⚠️ <strong>Clicking Verify will convert this lead to a student</strong>, add their purchased hours to their account, and mark them as Joined in the counselor dashboard.
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
          Finance Note (optional)
          <textarea
            value={financeNote}
            onChange={e => setFinanceNote(e.target.value)}
            rows={2}
            placeholder="Add a note for records…"
            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', resize: 'vertical', fontWeight: 400 }}
          />
        </label>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="secondary" onClick={onClose} disabled={saving} style={{ fontSize: '13px' }}>Cancel</button>
          <button className="danger" onClick={() => handle(false)} disabled={saving} style={{ fontSize: '13px' }}>
            {saving ? '…' : '✕ Reject'}
          </button>
          <button className="primary" onClick={() => handle(true)} disabled={saving} style={{ fontSize: '13px', background: '#15803d' }}>
            {saving ? 'Processing…' : '✅ Verify & Convert to Student'}
          </button>
        </div>
      </div>
    </div>
  );
}


/* ═══════ MODALS ═══════ */

function AddEntryModal({ type, accounts, parties, onClose, onDone }) {
  const [form, setForm] = useState({ amount: '', description: '', entry_date: new Date().toISOString().slice(0, 10), account_id: '', party_id: '' });
  const [err, setErr] = useState('');
  function upd(k, v) { setForm(f => ({ ...f, [k]: v })); }
  async function submit(e) {
    e.preventDefault(); setErr('');
    try {
      await apiFetch(`/finance/${type}`, { method: 'POST', body: JSON.stringify({ ...form, amount: Number(form.amount), account_id: form.account_id || null, party_id: form.party_id || null }) });
      onDone();
    } catch (e) { setErr(e.message); }
  }
  return (
    <div className="modal-overlay"><div className="modal card" style={{ maxWidth: '450px' }}>
      <h3>Add {type === 'income' ? 'Income' : 'Expense'}</h3>
      <form className="form-grid" onSubmit={submit}>
        <label>Amount *<input type="number" value={form.amount} onChange={e => upd('amount', e.target.value)} required /></label>
        <label>Date<input type="date" value={form.entry_date} onChange={e => upd('entry_date', e.target.value)} /></label>
        <label>Description<input value={form.description} onChange={e => upd('description', e.target.value)} /></label>
        <label>Account<select value={form.account_id} onChange={e => upd('account_id', e.target.value)}><option value="">— None —</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
        <label>Party<select value={form.party_id} onChange={e => upd('party_id', e.target.value)}><option value="">— None —</option>{parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        {err ? <p className="error">{err}</p> : null}
        <div className="actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button type="submit">Add</button></div>
      </form>
    </div></div>
  );
}

function AddExpenseModal({ accounts, parties, categories, onClose, onDone }) {
  const [form, setForm] = useState({ amount: '', category: 'other', description: '', expense_date: new Date().toISOString().slice(0, 10), account_id: '', party_id: '' });
  const [err, setErr] = useState('');
  function upd(k, v) { setForm(f => ({ ...f, [k]: v })); }
  async function submit(e) {
    e.preventDefault(); setErr('');
    try {
      await apiFetch('/finance/expenses', { method: 'POST', body: JSON.stringify({ ...form, amount: Number(form.amount), account_id: form.account_id || null, party_id: form.party_id || null }) });
      onDone();
    } catch (e) { setErr(e.message); }
  }
  return (
    <div className="modal-overlay"><div className="modal card" style={{ maxWidth: '450px' }}>
      <h3>Add Expense</h3>
      <form className="form-grid" onSubmit={submit}>
        <label>Amount *<input type="number" value={form.amount} onChange={e => upd('amount', e.target.value)} required /></label>
        <label>Category *<select value={form.category} onChange={e => upd('category', e.target.value)}>{categories.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}</select></label>
        <label>Date<input type="date" value={form.expense_date} onChange={e => upd('expense_date', e.target.value)} /></label>
        <label>Description<input value={form.description} onChange={e => upd('description', e.target.value)} /></label>
        <label>Account<select value={form.account_id} onChange={e => upd('account_id', e.target.value)}><option value="">— None —</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
        <label>Party<select value={form.party_id} onChange={e => upd('party_id', e.target.value)}><option value="">— None —</option>{parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        {err ? <p className="error">{err}</p> : null}
        <div className="actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button type="submit">Add</button></div>
      </form>
    </div></div>
  );
}

function AddAccountModal({ onClose, onDone }) {
  const [form, setForm] = useState({ name: '', type: 'bank', is_main: false, balance: '', description: '' });
  const [err, setErr] = useState('');
  function upd(k, v) { setForm(f => ({ ...f, [k]: v })); }
  async function submit(e) {
    e.preventDefault(); setErr('');
    try {
      await apiFetch('/finance/accounts', { method: 'POST', body: JSON.stringify({ ...form, balance: Number(form.balance || 0) }) });
      onDone();
    } catch (e) { setErr(e.message); }
  }
  return (
    <div className="modal-overlay"><div className="modal card" style={{ maxWidth: '420px' }}>
      <h3>Add Account</h3>
      <form className="form-grid" onSubmit={submit}>
        <label>Name *<input value={form.name} onChange={e => upd('name', e.target.value)} required placeholder="e.g. HDFC Business" /></label>
        <label>Type<select value={form.type} onChange={e => upd('type', e.target.value)}><option value="bank">Bank</option><option value="cash">Cash</option><option value="upi">UPI</option><option value="wallet">Wallet</option><option value="other">Other</option></select></label>
        <label>Opening Balance<input type="number" value={form.balance} onChange={e => upd('balance', e.target.value)} placeholder="0" /></label>
        <label>Description<input value={form.description} onChange={e => upd('description', e.target.value)} /></label>
        <label style={{ flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
          <input type="checkbox" checked={form.is_main} onChange={e => upd('is_main', e.target.checked)} style={{ width: 'auto' }} />
          Main Company Account
        </label>
        {err ? <p className="error">{err}</p> : null}
        <div className="actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button type="submit">Create</button></div>
      </form>
    </div></div>
  );
}

function AddPartyModal({ onClose, onDone }) {
  const [form, setForm] = useState({ name: '', type: 'vendor', phone: '', email: '', address: '', notes: '' });
  const [err, setErr] = useState('');
  function upd(k, v) { setForm(f => ({ ...f, [k]: v })); }
  async function submit(e) {
    e.preventDefault(); setErr('');
    try {
      await apiFetch('/finance/parties', { method: 'POST', body: JSON.stringify(form) });
      onDone();
    } catch (e) { setErr(e.message); }
  }
  return (
    <div className="modal-overlay"><div className="modal card" style={{ maxWidth: '450px' }}>
      <h3>Add Party</h3>
      <form className="form-grid" onSubmit={submit}>
        <label>Name *<input value={form.name} onChange={e => upd('name', e.target.value)} required /></label>
        <label>Type<select value={form.type} onChange={e => upd('type', e.target.value)}><option value="vendor">Vendor</option><option value="client">Client</option><option value="employee">Employee</option><option value="other">Other</option></select></label>
        <label>Phone<input value={form.phone} onChange={e => upd('phone', e.target.value)} /></label>
        <label>Email<input type="email" value={form.email} onChange={e => upd('email', e.target.value)} /></label>
        <label>Address<input value={form.address} onChange={e => upd('address', e.target.value)} /></label>
        <label>Notes<textarea value={form.notes} onChange={e => upd('notes', e.target.value)} rows={2} /></label>
        {err ? <p className="error">{err}</p> : null}
        <div className="actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button type="submit">Create</button></div>
      </form>
    </div></div>
  );
}

function CreatePayrollCycleModal({ onClose, onDone }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [err, setErr] = useState('');
  async function submit(e) {
    e.preventDefault(); setErr('');
    try {
      await apiFetch('/finance/payroll', { method: 'POST', body: JSON.stringify({ year, month }) });
      onDone();
    } catch (e) { setErr(e.message); }
  }
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return (
    <div className="modal-overlay"><div className="modal card" style={{ maxWidth: '380px' }}>
      <h3>Create Payroll Cycle</h3>
      <form className="form-grid" onSubmit={submit}>
        <label>Year<input type="number" value={year} onChange={e => setYear(Number(e.target.value))} /></label>
        <label>Month<select value={month} onChange={e => setMonth(Number(e.target.value))}>{MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}</select></label>
        {err ? <p className="error">{err}</p> : null}
        <div className="actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button type="submit">Create</button></div>
      </form>
    </div></div>
  );
}

function CategoriesModal({ type, onClose, onUpdate }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/finance/categories?type=${type}`).then(d => {
      setItems(d.items || []);
      setLoading(false);
    });
  }, [type]);

  async function add(e) {
    e.preventDefault();
    if (!newItem) return;
    try {
      await apiFetch('/finance/categories', { method: 'POST', body: JSON.stringify({ name: newItem, type }) });
      setNewItem('');
      const d = await apiFetch(`/finance/categories?type=${type}`);
      setItems(d.items || []);
      onUpdate();
    } catch (e) { alert(e.message); }
  }

  async function remove(id) {
    if (!confirm('Delete this category?')) return;
    try {
      await apiFetch(`/finance/categories/${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
      onUpdate();
    } catch (e) { alert(e.message); }
  }

  return (
    <div className="modal-overlay"><div className="modal card" style={{ maxWidth: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Manage {type === 'income' ? 'Income' : 'Expense'} Categories</h3>
        <button className="text-danger" onClick={onClose} style={{ fontSize: '20px', padding: 0 }}>×</button>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
        {items.map(cat => (
          <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ textTransform: 'capitalize' }}>{cat.name}</span>
            <button className="text-danger small" onClick={() => remove(cat.id)}>Delete</button>
          </div>
        ))}
        {!items.length && <p className="text-muted" style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>No categories found.</p>}
      </div>

      <form onSubmit={add} style={{ display: 'flex', gap: '8px' }}>
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="New category name..."
          style={{ flex: 1 }}
          required
        />
        <button type="submit" className="primary small">Add</button>
      </form>
    </div></div>
  );
}
