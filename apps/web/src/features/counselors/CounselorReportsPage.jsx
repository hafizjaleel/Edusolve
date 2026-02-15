
import { useEffect, useState, useMemo } from 'react';
import { apiFetch } from '../../lib/api.js';

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


            <div className="card filters-bar" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Start Date</label>
                    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>End Date</label>
                    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                </div>
                <button onClick={generateReport} className="primary" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>

            {error ? <p className="error">{error}</p> : null}

            <div className="card">
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
                                <tr><td colSpan="6">No data available.</td></tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
