import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

function StatCard({ label, value, tone = 'neutral' }) {
  return (
    <article className={`card stat-card ${tone}`}>
      <p className="eyebrow">{label}</p>
      <h3>{value}</h3>
    </article>
  );
}

export function CounselorDashboardPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    apiFetch('/leads?scope=mine').then((data) => setItems(data.items || [])).catch(() => setItems([]));
  }, []);

  const metrics = useMemo(() => {
    const total = items.length;
    const active = items.filter((lead) => lead.status !== 'dropped' && lead.status !== 'joined').length;
    const newLeads = items.filter((lead) => lead.status === 'new').length;
    const demoScheduled = items.filter((lead) => lead.status === 'demo_scheduled').length;
    const demoDone = items.filter((lead) => lead.status === 'demo_done').length;
    const paymentPending = items.filter((lead) => lead.status === 'payment_pending').length;
    const paymentVerification = items.filter((lead) => lead.status === 'payment_verification').length;
    const joined = items.filter((lead) => lead.status === 'joined').length;
    const dropped = items.filter((lead) => lead.status === 'dropped').length;

    // Today's leads
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const todayLeads = items.filter(l => {
      if (!l.created_at) return false;
      return new Date(l.created_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) === todayStr;
    }).length;

    const conversionRate = total > 0 ? Math.round((joined / total) * 100) : 0;

    return { total, active, newLeads, demoScheduled, demoDone, paymentPending, paymentVerification, joined, dropped, todayLeads, conversionRate };
  }, [items]);

  // Recent 5 leads
  const recentLeads = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  }, [items]);

  return (
    <section className="panel">
      <div className="grid-four">
        <StatCard label="My Leads" value={metrics.total} />
        <StatCard label="Active Pipeline" value={metrics.active} />
        <StatCard label="Today's Leads" value={metrics.todayLeads} tone="info" />
        <StatCard label="Conversion Rate" value={`${metrics.conversionRate}%`} tone="success" />
      </div>

      {/* Status Breakdown */}
      <div className="grid-three" style={{ marginTop: '16px' }}>
        <article className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Pipeline Breakdown</h3>
          {[
            { label: 'New', count: metrics.newLeads, color: '#6366f1' },
            { label: 'Demo Scheduled', count: metrics.demoScheduled, color: '#f59e0b' },
            { label: 'Demo Done', count: metrics.demoDone, color: '#3b82f6' },
            { label: 'Payment Pending', count: metrics.paymentPending, color: '#ef4444' },
            { label: 'Payment Verification', count: metrics.paymentVerification, color: '#f97316' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                <span style={{ fontSize: '13px' }}>{item.label}</span>
              </div>
              <strong style={{ fontSize: '14px' }}>{item.count}</strong>
            </div>
          ))}
        </article>

        <article className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Outcomes</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#dcfce7', borderRadius: '12px' }}>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#15803d' }}>{metrics.joined}</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#15803d' }}>Joined</p>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#fee2e2', borderRadius: '12px' }}>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#dc2626' }}>{metrics.dropped}</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#dc2626' }}>Dropped</p>
            </div>
          </div>
        </article>

        <article className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Recent Leads</h3>
          {recentLeads.length ? recentLeads.map(lead => (
            <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}>
              <span style={{ fontWeight: 500 }}>{lead.student_name}</span>
              <span style={{
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 600,
                background: lead.status === 'new' ? '#e0e7ff' : lead.status === 'joined' ? '#dcfce7' : '#f3f4f6',
                color: lead.status === 'new' ? '#4338ca' : lead.status === 'joined' ? '#15803d' : '#6b7280'
              }}>
                {lead.status.replace('_', ' ')}
              </span>
            </div>
          )) : <p className="text-muted" style={{ fontSize: '13px' }}>No leads yet</p>}
        </article>
      </div>
    </section>
  );
}


function SimpleBarChart({ data, xKey, yKeys, colors }) {
  const maxVal = Math.max(...data.map(d => yKeys.reduce((sum, k) => sum + (d[k] || 0), 0))) || 1;

  return (
    <div className="chart-container" style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '16px', paddingTop: '20px' }}>
      {data.map((item, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
          <div style={{ flex: 1, width: '40px', display: 'flex', flexDirection: 'column-reverse', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            {yKeys.map((key, idx) => {
              const val = item[key] || 0;
              const h = (val / maxVal) * 100;
              return (
                <div key={key} style={{ height: `${h}%`, background: colors[idx], width: '100%', transition: 'height 0.3s' }} title={`${key}: ${val}`} />
              );
            })}
          </div>
          <span style={{ fontSize: '10px', marginTop: '8px', textAlign: 'center' }}>{item[xKey]}</span>
        </div>
      ))}
    </div>
  );
}

export function CounselorHeadDashboardPage() {
  const [stats, setStats] = useState(null);
  const [counselors, setCounselors] = useState([]);

  useEffect(() => {
    // Parallel fetch
    Promise.all([
      apiFetch('/counselors/stats'),
      apiFetch('/counselors')
    ]).then(([statsData, counselorsData]) => {
      setStats(statsData.stats);
      setCounselors(counselorsData.items || []);
    }).catch(err => console.error(err));
  }, []);

  const chartData = useMemo(() => {
    if (!stats || !counselors.length) return [];
    return counselors.map(c => {
      const s = stats[c.id] || { total: 0, active: 0, joined: 0, dropped: 0 };
      return {
        name: c.full_name?.split(' ')[0] || c.email.split('@')[0],
        Active: s.active,
        Joined: s.joined,
        Dropped: s.dropped
      };
    });
  }, [stats, counselors]);

  const totals = useMemo(() => {
    if (!stats) return { total: 0, joined: 0, dropped: 0 };
    return Object.values(stats).reduce((acc, curr) => ({
      total: acc.total + curr.total,
      joined: acc.joined + curr.joined,
      dropped: acc.dropped + curr.dropped
    }), { total: 0, joined: 0, dropped: 0 });
  }, [stats]);

  return (
    <section className="panel">


      <div className="grid-three">
        <StatCard label="Total Leads" value={totals.total} />
        <StatCard label="Converted" value={totals.joined} tone="success" />
        <StatCard label="Dropped" value={totals.dropped} tone="danger" />

      </div>

      <div className="grid-two">
        <article className="card">
          <h3>Team Performance</h3>
          <p className="text-sm text-dim">Active (Blue) vs Joined (Green) vs Dropped (Red)</p>
          <SimpleBarChart
            data={chartData}
            xKey="name"
            yKeys={['Dropped', 'Joined', 'Active']}
            colors={['#ef4444', '#10b981', '#3b82f6']}
          />
        </article>
        <article className="card">
          <h3>Conversion Leaderboard</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Conv</th><th>Drop</th></tr></thead>
              <tbody>
                {chartData.sort((a, b) => b.Joined - a.Joined).slice(0, 5).map(c => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td>{c.Joined}</td>
                    <td>{c.Dropped}</td>
                  </tr>
                ))}
                {!chartData.length && <tr><td colSpan="3">No data</td></tr>}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
