
import { useEffect, useState, useMemo } from 'react';
import { apiFetch } from '../../lib/api.js';

function MobileSalesCard({ row }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="card list-mobile-card" style={{ padding: '16px', position: 'relative', marginBottom: '0', border: '1px solid #e5e7eb', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} onClick={() => setExpanded(!expanded)}>
                <div style={{ flex: 1, paddingRight: 8, display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                        {row.name}
                    </h4>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        Conversion: <strong style={{ color: '#10b981' }}>{row.conversionRate}</strong>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>{row.joined} Won</span>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', color: '#6b7280', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </span>
                    </div>
                </div>
            </div>

            {expanded && (
                <div style={{ marginTop: '12px', animation: 'fadeIn 0.2s ease-in' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                        <div><span style={{ color: '#888' }}>Total Leads:</span> <div style={{ fontWeight: 600, fontSize: '14px' }}>{row.total}</div></div>
                        <div><span style={{ color: '#888' }}>Active:</span> <div style={{ fontWeight: 600, fontSize: '14px' }}>{row.active}</div></div>
                        <div><span style={{ color: '#888' }}>Joined (Won):</span> <div style={{ fontWeight: 600, fontSize: '14px', color: '#10b981' }}>{row.joined}</div></div>
                        <div><span style={{ color: '#888' }}>Dropped (Lost):</span> <div style={{ fontWeight: 600, fontSize: '14px', color: '#ef4444' }}>{row.dropped}</div></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function CounselorReportsPage() {
    const [stats, setStats] = useState(null);
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        // Load counselors for name mapping
        apiFetch('/counselors').then(data => setCounselors(data.items || [])).catch(() => { });
    }, []);

    async function generateReport() {
        setLoading(true);
        setError('');
        try {
            const query = new URLSearchParams();
            if (fromDate) query.append('from', new Date(fromDate).toISOString());
            if (toDate) query.append('to', new Date(toDate).toISOString());

            const data = await apiFetch(`/counselors/stats?${query.toString()}`);
            setStats(data.stats);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Initial load
    useEffect(() => {
        generateReport();
    }, []);

    const reportData = useMemo(() => {
        if (!stats || !counselors.length) return [];
        return counselors.map(c => {
            const s = stats[c.id] || { total: 0, active: 0, joined: 0, dropped: 0 };
            const conversionRate = s.total > 0 ? ((s.joined / s.total) * 100).toFixed(1) : '0.0';
            return {
                id: c.id,
                name: c.full_name || c.email,
                total: s.total,
                active: s.active,
                joined: s.joined,
                dropped: s.dropped,
                conversionRate: conversionRate + '%'
            };
        }).sort((a, b) => b.joined - a.joined); // Default sort by joined
    }, [stats, counselors]);

    return (
        <section className="panel">


            <div className="card filters-bar" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', padding: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 120px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Start Date</label>
                    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 120px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>End Date</label>
                    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ width: '100%' }} />
                </div>
                <button onClick={generateReport} className="primary" disabled={loading} style={{ flex: '1 1 100px', padding: '10px' }}>
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>

            {error ? <p className="error">{error}</p> : null}

            {/* Desktop Table */}
            <div className="card desktop-only">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Counselor</th>
                                <th>Total Leads</th>
                                <th>Active</th>
                                <th>Joined (Won)</th>
                                <th>Dropped (Lost)</th>
                                <th>Conversion Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map(row => (
                                <tr key={row.id}>
                                    <td style={{ fontWeight: 500 }}>{row.name}</td>
                                    <td>{row.total}</td>
                                    <td>{row.active}</td>
                                    <td style={{ color: '#10b981', fontWeight: 500 }}>{row.joined}</td>
                                    <td style={{ color: '#ef4444' }}>{row.dropped}</td>
                                    <td>{row.conversionRate}</td>
                                </tr>
                            ))}
                            {!reportData.length && !loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>No data available.</td></tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reportData.map(row => (
                    <MobileSalesCard
                        key={row.id}
                        row={row}
                    />
                ))}
                {!reportData.length && !loading && (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>No data available.</div>
                )}
            </div>
        </section>
    );
}
