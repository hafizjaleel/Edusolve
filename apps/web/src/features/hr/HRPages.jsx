import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { PhoneInput, isValidEmail } from '../../components/PhoneInput.jsx';

/* ═══════ HR DASHBOARD ═══════ */

/** Tiny SVG donut chart — no external dependencies */
function DonutChart({ segments, size = 120, thickness = 22 }) {
    const r = (size - thickness) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    if (total === 0) {
        return (
            <svg width={size} height={size}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={thickness} />
                <text x={cx} y={cy + 5} textAnchor="middle" fill="#94a3b8" fontSize={13}>—</text>
            </svg>
        );
    }

    let offset = 0;
    const slices = segments.map(seg => {
        const dash = (seg.value / total) * circumference;
        const gap = circumference - dash;
        const slice = { ...seg, dash, gap, offset };
        offset += dash;
        return slice;
    });

    const centerVal = segments[0]?.value ?? 0;

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={thickness} />
            {slices.map((s, i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                    stroke={s.color} strokeWidth={thickness}
                    strokeDasharray={`${s.dash} ${s.gap}`}
                    strokeDashoffset={-s.offset}
                    strokeLinecap="butt"
                />
            ))}
            <text x={cx} y={cy + 5} textAnchor="middle"
                style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}
                fill="#334155" fontSize={22} fontWeight={700}>
                {centerVal}
            </text>
        </svg>
    );
}

/** Horizontal mini progress bar */
function MiniBar({ value, max, color }) {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    return (
        <div style={{ marginTop: 10, height: 5, borderRadius: 99, background: '#e9ecef', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
        </div>
    );
}

export function HRDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('today');

    useEffect(() => {
        apiFetch('/hr/stats').then(r => setStats(r.stats)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <section className="panel"><p>Loading system overview...</p></section>;

    const s = stats || {};
    const total = s.totalEmployees || 0;
    const totalStaff = s.totalStaff || 0;
    const pending = s.pendingPaymentRequests || 0;

    // Top cards always show today
    const present = s.todayPresent || 0;
    const absent = s.todayAbsent || 0;
    const halfDay = s.todayHalfDay || 0;
    const attendanceRate = totalStaff > 0 ? Math.round((present / totalStaff) * 100) : 0;

    // Period-based breakdown (staff only)
    const periodData = s.periods?.[period] || { present: 0, absent: 0, half_day: 0, total_staff: totalStaff };
    const pPresent = periodData.present || 0;
    const pAbsent = periodData.absent || 0;
    const pHalfDay = periodData.half_day || 0;
    // For week/month we compare against total possible days × staff
    const periodMax = Math.max(pPresent + pAbsent + pHalfDay, 1);

    const donutSegments = [
        { value: pPresent, color: 'var(--success)', label: 'Present' },
        { value: pAbsent, color: 'var(--danger)', label: 'Absent' },
        { value: pHalfDay, color: '#e8a000', label: 'Half Day' },
    ];

    const periods = [
        { key: 'today', label: 'Today' },
        { key: 'week', label: 'This Week' },
        { key: 'month', label: 'This Month' },
        { key: 'last_month', label: 'Last Month' },
    ];

    return (
        <section className="panel">
            {/* Top stat cards — always today */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>

                {/* Total Employees */}
                <article className="card" style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <p className="eyebrow">Total Staff</p>
                        <span style={{ fontSize: 18 }}>👥</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: 'var(--primary)' }}>{totalStaff}</h3>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--muted)' }}>of {total} employees</p>
                    <MiniBar value={totalStaff} max={Math.max(total, 1)} color="var(--primary)" />
                </article>

                {/* Present Today */}
                <article className="card stat-card success" style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <p className="eyebrow" style={{ color: 'var(--success)' }}>Present Today</p>
                        <span style={{ fontSize: 18 }}>✅</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: 'var(--success)' }}>{present}</h3>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--muted)' }}>of {totalStaff} staff</p>
                    <MiniBar value={present} max={totalStaff} color="var(--success)" />
                </article>

                {/* Absent Today */}
                <article className="card stat-card danger" style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <p className="eyebrow" style={{ color: 'var(--danger)' }}>Absent Today</p>
                        <span style={{ fontSize: 18 }}>❌</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: 'var(--danger)' }}>{absent}</h3>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--muted)' }}>of {totalStaff} staff</p>
                    <MiniBar value={absent} max={totalStaff} color="var(--danger)" />
                </article>

                {/* Half Day */}
                <article className="card" style={{ padding: '16px 18px', borderColor: '#fde68a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <p className="eyebrow" style={{ color: '#b45309' }}>Half Day</p>
                        <span style={{ fontSize: 18 }}>🌗</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#b45309' }}>{halfDay}</h3>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--muted)' }}>partial</p>
                    <MiniBar value={halfDay} max={totalStaff} color="#e8a000" />
                </article>

                {/* Pending Requests */}
                <article className={`card ${pending > 0 ? 'stat-card danger' : 'stat-card success'}`} style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <p className="eyebrow" style={{ color: pending > 0 ? 'var(--danger)' : 'var(--success)' }}>Pending Requests</p>
                        <span style={{ fontSize: 18 }}>📋</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: pending > 0 ? 'var(--danger)' : 'var(--success)' }}>{pending}</h3>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--muted)' }}>payment requests</p>
                    <MiniBar value={pending} max={Math.max(pending, 5)} color={pending > 0 ? 'var(--danger)' : 'var(--success)'} />
                </article>

            </div>

            {/* Bottom row: donut + staff attendance breakdown with period tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>

                {/* Donut */}
                <article className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    <p className="eyebrow" style={{ alignSelf: 'flex-start' }}>Staff Attendance</p>
                    <DonutChart segments={donutSegments} size={128} thickness={22} />
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {donutSegments.map(seg => (
                            <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                <span style={{ width: 9, height: 9, borderRadius: '50%', background: seg.color, display: 'inline-block' }} />
                                <span style={{ color: 'var(--muted)' }}>{seg.label}</span>
                                <span style={{ fontWeight: 700, color: 'var(--text)' }}>{seg.value}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
                        {s.periods?.[period]?.label || 'Today'} · Staff only
                    </p>
                </article>

                {/* Breakdown with period tabs */}
                <article className="card" style={{ padding: '18px 20px' }}>
                    {/* Period tab selector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                        <p className="eyebrow">Attendance Breakdown</p>
                        <div className="tabs-row" style={{ gap: 6 }}>
                            {periods.map(p => (
                                <button key={p.key}
                                    onClick={() => setPeriod(p.key)}
                                    className={`tab-btn${period === p.key ? ' active' : ''}`}
                                    style={{ padding: '4px 12px', fontSize: 12, borderRadius: 8 }}>
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { label: 'Present', value: pPresent, color: 'var(--success)', trackColor: '#b7efcc', textColor: 'var(--success)' },
                            { label: 'Absent', value: pAbsent, color: 'var(--danger)', trackColor: '#f4c0c0', textColor: 'var(--danger)' },
                            { label: 'Half Day', value: pHalfDay, color: '#e8a000', trackColor: '#fde68a', textColor: '#b45309' },
                        ].map(row => {
                            const pct = periodMax > 0 ? Math.round((row.value / periodMax) * 100) : 0;
                            return (
                                <div key={row.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, display: 'inline-block' }} />
                                            <span style={{ color: 'var(--text)', fontWeight: 500 }}>{row.label}</span>
                                        </span>
                                        <span style={{ fontWeight: 700, color: row.textColor }}>
                                            {row.value} <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 11 }}>({pct}%)</span>
                                        </span>
                                    </div>
                                    <div className="bar-track">
                                        <div style={{
                                            width: `${pct}%`, height: '100%', borderRadius: 999,
                                            background: row.color,
                                            transition: 'width 0.6s ease'
                                        }} />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Summary row */}
                        <div style={{
                            marginTop: 4, padding: '10px 14px', borderRadius: 10,
                            background: 'var(--surface-soft)', border: '1px solid var(--line)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                                Staff tracked · {s.periods?.[period]?.label || 'Today'}
                            </span>
                            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
                                {totalStaff} staff
                            </span>
                        </div>
                    </div>
                </article>

            </div>
        </section>
    );
}


/* ═══════ ATTENDANCE PAGE ═══════ */
export function AttendancePage() {
    const [viewReport, setViewReport] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changes, setChanges] = useState({});
    const [filter, setFilter] = useState('all');

    function load() {
        setLoading(true);
        apiFetch(`/hr/attendance?date=${date}`)
            .then(r => { setItems(r.items || []); setChanges({}); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, [date]);


    function updateStatus(empId, status) {
        setChanges(prev => ({ ...prev, [empId]: { ...prev[empId], employee_id: empId, status } }));
    }

    function markAllAs(status) {
        const bulk = {};
        filteredItems.forEach(emp => {
            if (!changes[emp.id] && !emp.attendance) {
                bulk[emp.id] = { employee_id: emp.id, status };
            }
        });
        setChanges(prev => ({ ...prev, ...bulk }));
    }

    async function saveAll() {
        const records = Object.values(changes);
        if (records.length === 0) return;
        setSaving(true);
        try {
            await apiFetch('/hr/attendance', {
                method: 'POST',
                body: JSON.stringify({ date, records })
            });
            load();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    const statuses = ['present', 'absent', 'half_day'];
    const statusLabels = { present: 'Present', absent: 'Absent', half_day: 'Half Day' };
    const statusIcons = { present: '✓', absent: '✗', half_day: '½' };
    const statusColors = { present: '#22c55e', absent: '#ef4444', half_day: '#f59e0b' };

    const summary = useMemo(() => {
        const counts = { present: 0, absent: 0, half_day: 0, unmarked: 0 };
        items.forEach(emp => {
            const s = changes[emp.id]?.status || emp.attendance?.status;
            if (s && counts[s] !== undefined) counts[s]++;
            else counts.unmarked++;
        });
        return counts;
    }, [items, changes]);

    const filteredItems = useMemo(() => {
        if (filter === 'all') return items;
        if (filter === 'unmarked') return items.filter(emp => !changes[emp.id]?.status && !emp.attendance?.status);
        return items.filter(emp => {
            const s = changes[emp.id]?.status || emp.attendance?.status;
            return s === filter;
        });
    }, [items, changes, filter]);

    const changesCount = Object.keys(changes).length;
    const isToday = date === new Date().toISOString().slice(0, 10);
    const dateLabel = isToday ? 'Today' : new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

    if (viewReport) {
        return <AttendanceReportPage onBack={() => setViewReport(false)} />;
    }

    return (
        <section className="panel" style={{ paddingBottom: changesCount > 0 ? 80 : 24 }}>
            {/* Header */}
            <div className="card filters-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0, marginBottom: 4 }}>Attendance</h2>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>{dateLabel} · {items.length} employees</p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button onClick={() => setDate(prev => { const d = new Date(prev); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })}
                            className="secondary small">←</button>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--line)', background: '#fff', color: 'var(--text)', fontSize: 14 }} />
                        <button onClick={() => setDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })}
                            className="secondary small">→</button>
                        {!isToday && (
                            <button onClick={() => setDate(new Date().toISOString().slice(0, 10))}
                                className="secondary" style={{ padding: '6px 14px', fontSize: 13 }}>Today</button>
                        )}
                    </div>
                    <button onClick={() => setViewReport(true)}
                        className="primary">
                        View Monthly Report
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid-four" style={{ marginBottom: 20 }}>
                {[
                    { label: 'Present', count: summary.present, modifier: 'success', filterKey: 'present' },
                    { label: 'Absent', count: summary.absent, modifier: 'danger', filterKey: 'absent' },
                    { label: 'Half Day', count: summary.half_day, modifier: 'warning', filterKey: 'half_day' },
                    { label: 'Unmarked', count: summary.unmarked, modifier: '', filterKey: 'unmarked' },
                ].map(card => (
                    <article key={card.label} onClick={() => setFilter(filter === card.filterKey ? 'all' : card.filterKey)}
                        className={`card stat-card ${card.modifier}`}
                        style={{
                            cursor: 'pointer',
                            outline: filter === card.filterKey ? '2px solid var(--primary)' : 'none',
                            transition: 'outline 0.15s'
                        }}>
                        <p className="eyebrow">{card.label}</p>
                        <h3>{card.count}</h3>
                    </article>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#64748b', marginRight: 4 }}>Quick:</span>
                <button onClick={() => markAllAs('present')}
                    style={{ padding: '4px 12px', borderRadius: 6, background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', cursor: 'pointer', fontSize: 12 }}>
                    Mark all Present
                </button>
                <button onClick={() => markAllAs('absent')}
                    style={{ padding: '4px 12px', borderRadius: 6, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', cursor: 'pointer', fontSize: 12 }}>
                    Mark all Absent
                </button>
                {filter !== 'all' && (
                    <button onClick={() => setFilter('all')}
                        style={{ padding: '4px 12px', borderRadius: 6, background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe', cursor: 'pointer', fontSize: 12, marginLeft: 'auto' }}>
                        Show All
                    </button>
                )}
            </div>

            {/* Table */}
            {loading ? <p>Loading...</p> : (
                <div className="card">
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: 40 }}>#</th>
                                    <th>Employee</th>
                                    <th style={{ width: 100 }}>Department</th>
                                    <th style={{ width: 80 }}>Type</th>
                                    <th style={{ textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((emp, idx) => {
                                    const currentStatus = changes[emp.id]?.status || emp.attendance?.status || null;
                                    return (
                                        <tr key={emp.id}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{emp.full_name}</div>
                                                {emp.designation && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{emp.designation}</div>}
                                            </td>
                                            <td>{emp.department || '—'}</td>
                                            <td>
                                                <span style={{
                                                    padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                                                    background: emp.employee_type === 'student' ? '#dbeafe' : '#eff6ff',
                                                    color: emp.employee_type === 'student' ? '#1d4ed8' : '#3b82f6'
                                                }}>
                                                    {emp.employee_type}
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <div style={{ display: 'inline-flex', gap: 4, background: '#eff6ff', borderRadius: 8, padding: 3, border: '1px solid #bfdbfe' }}>
                                                    {statuses.map(s => {
                                                        const isActive = currentStatus === s;
                                                        return (
                                                            <button key={s} onClick={() => updateStatus(emp.id, s)}
                                                                title={statusLabels[s]}
                                                                style={{
                                                                    padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                                                    fontSize: 12, fontWeight: isActive ? 700 : 400,
                                                                    background: isActive ? statusColors[s] : 'transparent',
                                                                    color: isActive ? '#fff' : '#6b7280',
                                                                    transition: 'all 0.15s', minWidth: 70
                                                                }}>
                                                                <span style={{ marginRight: 4 }}>{statusIcons[s]}</span>
                                                                {statusLabels[s]}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredItems.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                                        {filter !== 'all' ? 'No employees match this filter' : 'No employees found. Add employees first.'}
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* Sticky Save Bar */}
            {changesCount > 0 && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 24px',
                    background: '#eff6fff0', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                    borderTop: '1px solid #bfdbfe', zIndex: 100
                }}>
                    <span style={{ color: '#3b82f6', fontSize: 14 }}>{changesCount} unsaved change{changesCount > 1 ? 's' : ''}</span>
                    <button onClick={() => setChanges({})}
                        style={{ padding: '8px 20px', borderRadius: 8, background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe', cursor: 'pointer', fontSize: 14 }}>
                        Discard
                    </button>
                    <button onClick={saveAll} disabled={saving}
                        style={{ padding: '8px 24px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                        {saving ? 'Saving...' : 'Save All'}
                    </button>
                </div>
            )}
        </section>
    );
}

/* ═══════ MONTHLY ATTENDANCE REPORT PAGE ═══════ */
function AttendanceReportPage({ onBack }) {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    function load() {
        setLoading(true);
        apiFetch(`/hr/attendance/report?year=${year}&month=${month}`)
            .then(r => setItems(r.items || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, [year, month]);

    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <section className="panel">
            <div className="card filters-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#10233f' }}>Monthly Report</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
                        style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #d8e1ef', background: '#fff', color: '#10233f', fontSize: 14 }}>
                        {monthNames.map((name, i) => i > 0 && <option key={i} value={i}>{name}</option>)}
                    </select>
                    <select value={year} onChange={e => setYear(parseInt(e.target.value))}
                        style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #d8e1ef', background: '#fff', color: '#10233f', fontSize: 14 }}>
                        {[...Array(5)].map((_, i) => {
                            const y = new Date().getFullYear() - i;
                            return <option key={y} value={y}>{y}</option>;
                        })}
                    </select>
                    <button onClick={onBack}
                        className="primary" style={{ whiteSpace: 'nowrap' }}>
                        Back to Attendance
                    </button>
                </div>
            </div>

            {loading ? <p>Loading report...</p> : (
                <div className="card">
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: 'center' }}>Present</th>
                                    <th style={{ textAlign: 'center' }}>Absent</th>
                                    <th style={{ textAlign: 'center' }}>Half Day</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((emp, idx) => (
                                    <tr key={emp.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{emp.full_name}</div>
                                            {emp.designation && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{emp.designation}</div>}
                                        </td>
                                        <td>{emp.department || '-'}</td>
                                        <td>{emp.employee_type}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#22c55e' }}>
                                            {emp.report.present}
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#ef4444' }}>
                                            {emp.report.absent}
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#f59e0b' }}>
                                            {emp.report.half_day}
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                                        No records found.
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}

/* ═══════ EMPLOYEES PAGE ═══════ */
export function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editEmp, setEditEmp] = useState(null);
    const [salaryEmp, setSalaryEmp] = useState(null);
    const [assignLevelEmp, setAssignLevelEmp] = useState(null);

    function load() {
        setLoading(true);
        apiFetch('/hr/employees').then(r => setEmployees(r.items || [])).catch(() => { }).finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, []);

    return (
        <section className="panel">
            <div className="card filters-bar" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#10233f' }}>Employees</h2>
                <div style={{ marginLeft: 'auto' }}>
                    <button onClick={() => setShowAdd(true)} className="primary">
                        + Add Employee
                    </button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="card">
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Designation</th>
                                    <th>Department</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Salary</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp, idx) => {
                                    const sal = emp.salary_structures?.[0] || emp.salary_structures;
                                    const hasSalary = sal && sal.base_salary > 0;
                                    return (
                                        <tr key={emp.id}>
                                            <td>{idx + 1}</td>
                                            <td>{emp.full_name}</td>
                                            <td>
                                                <span style={{
                                                    padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                                                    background: emp.employee_type === 'student' ? '#1e3a5f' : '#f3f4f6',
                                                    color: emp.employee_type === 'student' ? '#60a5fa' : '#6b7280'
                                                }}>
                                                    {emp.employee_type}
                                                </span>
                                            </td>
                                            <td>{emp.designation || '—'}</td>
                                            <td>{emp.department || '—'}</td>
                                            <td>{emp.phone || '—'}</td>
                                            <td>{emp.email || '—'}</td>
                                            <td>
                                                <span className={`status-badge ${emp.is_active ? 'success' : 'danger'}`}>
                                                    {emp.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>{hasSalary ? `₹${Number(sal.base_salary).toLocaleString()}` : '—'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                     {emp.designation?.toLowerCase().includes('counselor') && (
                                                         <button onClick={() => setAssignLevelEmp(emp)} className="secondary small" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                                                             Level
                                                         </button>
                                                     )}
                                                     <button onClick={() => setEditEmp(emp)} className="secondary small">
                                                         Edit
                                                     </button>
                                                     <button onClick={() => setSalaryEmp(emp)} className={hasSalary ? "secondary small" : "primary small"}>
                                                         {hasSalary ? 'Edit Salary' : 'Set Salary'}
                                                     </button>
                                                 </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {employees.length === 0 && (
                                    <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No employees yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showAdd && <AddEmployeeModal onClose={() => setShowAdd(false)} onDone={() => { setShowAdd(false); load(); }} />}
            {editEmp && <EditEmployeeModal employee={editEmp} onClose={() => setEditEmp(null)} onDone={() => { setEditEmp(null); load(); }} />}
            {salaryEmp && <SalaryModal employee={salaryEmp} existing={(salaryEmp.salary_structures?.[0] || salaryEmp.salary_structures)} onClose={() => setSalaryEmp(null)} onDone={() => { setSalaryEmp(null); load(); }} />}
            {assignLevelEmp && <AssignCounselorLevelModal employee={assignLevelEmp} onClose={() => setAssignLevelEmp(null)} onDone={() => { setAssignLevelEmp(null); load(); }} />}
        </section>
    );
}

/* ═══════ COUNCILOR LEVELS PAGE ═══════ */
export function CouncilorLevelsPage() {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editLevel, setEditLevel] = useState(null);

    function load() {
        setLoading(true);
        apiFetch('/hr/councilor-levels').then(r => setLevels(r.items || [])).catch(() => { }).finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, []);

    async function deleteLevel(id) {
        if (!confirm('Are you sure you want to delete this level?')) return;
        try {
            await apiFetch(`/hr/councilor-levels/${id}`, { method: 'DELETE' });
            load();
        } catch (err) { alert(err.message); }
    }

    return (
        <section className="panel">
            <div className="card filters-bar" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#10233f' }}>Counselor Levels Configuration</h2>
                <div style={{ marginLeft: 'auto' }}>
                    <button onClick={() => setShowAdd(true)} className="primary">
                        + Add Level
                    </button>
                </div>
            </div>

            {loading ? <p>Loading levels...</p> : (
                <div className="card">
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Level Name</th>
                                    <th>Basic Salary (₹)</th>
                                    <th>Target Amount (₹)</th>
                                    <th>Incentive (%)</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {levels.map(lvl => (
                                    <tr key={lvl.id}>
                                        <td style={{ fontWeight: 600 }}>{lvl.level_name}</td>
                                        <td>{Number(lvl.basic_salary).toLocaleString()}</td>
                                        <td>{Number(lvl.target_amount).toLocaleString()}</td>
                                        <td>{lvl.incentive_percentage}%</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                <button onClick={() => setEditLevel(lvl)} className="secondary small">Edit</button>
                                                <button onClick={() => deleteLevel(lvl.id)} className="secondary small" style={{ color: 'var(--danger)' }}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {levels.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No levels configured yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {(showAdd || editLevel) && (
                <LevelModal 
                    level={editLevel} 
                    onClose={() => { setShowAdd(false); setEditLevel(null); }} 
                    onDone={() => { setShowAdd(false); setEditLevel(null); load(); }} 
                />
            )}
        </section>
    );
}

function LevelModal({ level, onClose, onDone }) {
    const [form, setForm] = useState({
        level_name: level?.level_name || '',
        basic_salary: level?.basic_salary || '',
        target_amount: level?.target_amount || '',
        incentive_percentage: level?.incentive_percentage || ''
    });
    const [saving, setSaving] = useState(false);
    const upd = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const method = level ? 'PATCH' : 'POST';
            const url = level ? `/hr/councilor-levels/${level.id}` : '/hr/councilor-levels';
            await apiFetch(url, { method, body: JSON.stringify(form) });
            onDone();
        } catch (err) { alert(err.message); }
        finally { setSaving(false); }
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3>{level ? 'Edit' : 'Add'} Counselor Level</h3>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                    <label style={labelStyle}>Level Name
                        <input required value={form.level_name} onChange={e => upd('level_name', e.target.value)} style={inputStyle} placeholder="e.g. Level 1" />
                    </label>
                    <label style={labelStyle}>Basic Salary (₹)
                        <input type="number" required value={form.basic_salary} onChange={e => upd('basic_salary', e.target.value)} style={inputStyle} />
                    </label>
                    <label style={labelStyle}>Target Amount (₹)
                        <input type="number" required value={form.target_amount} onChange={e => upd('target_amount', e.target.value)} style={inputStyle} />
                    </label>
                    <label style={labelStyle}>Incentive Percentage (%)
                        <input type="number" step="0.1" required value={form.incentive_percentage} onChange={e => upd('incentive_percentage', e.target.value)} style={inputStyle} />
                    </label>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : 'Save Level'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AssignCounselorLevelModal({ employee, onClose, onDone }) {
    const [levels, setLevels] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            apiFetch('/hr/councilor-levels'),
            apiFetch('/hr/councilor-profiles')
        ]).then(([lvlRes, profRes]) => {
            setLevels(lvlRes.items || []);
            const current = profRes.items?.find(p => p.user_id === employee.user_id);
            if (current) setSelectedLevel(current.level_id);
        }).finally(() => setLoading(false));
    }, []);

    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await apiFetch('/hr/councilor-profiles', {
                method: 'POST',
                body: JSON.stringify({ user_id: employee.user_id, level_id: selectedLevel })
            });
            onDone();
        } catch (err) { alert(err.message); }
        finally { setSaving(false); }
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3>Assign Counselor Level</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>{employee.full_name}</p>
                {loading ? <p>Loading...</p> : (
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <label style={labelStyle}>Select Level
                            <select required value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} style={inputStyle}>
                                <option value="">— Select Level —</option>
                                {levels.map(lvl => (
                                    <option key={lvl.id} value={lvl.id}>
                                        {lvl.level_name} (₹{lvl.basic_salary} + {lvl.incentive_percentage}%)
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                            <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                            <button type="submit" disabled={saving || !selectedLevel} style={btnPrimary}>{saving ? 'Saving...' : 'Assign Level'}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function AddEmployeeModal({ onClose, onDone }) {
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', designation: '', department: '', employee_type: 'staff' });
    const [saving, setSaving] = useState(false);
    const upd = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    async function submit(e) {
        e.preventDefault();
        setSaving(true);

        const safeForm = { ...form };
        if (safeForm.email) safeForm.email = safeForm.email.trim();
        if (safeForm.full_name) safeForm.full_name = safeForm.full_name.trim();

        if (safeForm.email && !isValidEmail(safeForm.email)) {
            alert('Please enter a valid email address');
            setSaving(false);
            return;
        }

        try {
            await apiFetch('/hr/employees', { method: 'POST', body: JSON.stringify(safeForm) });
            onDone();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{ marginBottom: 16 }}>Add Employee</h3>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={labelStyle}>
                        Full Name *
                        <input required value={form.full_name} onChange={e => upd('full_name', e.target.value)} style={inputStyle} />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Email
                            <input type="email" value={form.email} onChange={e => upd('email', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>
                            Phone
                            <PhoneInput value={form.phone} onChange={v => upd('phone', v)} />
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Designation
                            <input value={form.designation} onChange={e => upd('designation', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>
                            Department
                            <input value={form.department} onChange={e => upd('department', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <label style={labelStyle}>
                        Type
                        <select value={form.employee_type} onChange={e => upd('employee_type', e.target.value)} style={inputStyle}>
                            <option value="staff">Staff</option>
                            <option value="student">Student</option>
                        </select>
                    </label>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : 'Add Employee'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditEmployeeModal({ employee, onClose, onDone }) {
    const [form, setForm] = useState({
        full_name: employee.full_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        designation: employee.designation || '',
        department: employee.department || '',
        employee_type: employee.employee_type || 'staff',
        is_active: employee.is_active !== false
    });
    const [saving, setSaving] = useState(false);
    const upd = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    async function submit(e) {
        e.preventDefault();
        setSaving(true);

        const safeForm = { ...form };
        if (safeForm.email) safeForm.email = safeForm.email.trim();
        if (safeForm.full_name) safeForm.full_name = safeForm.full_name.trim();

        if (safeForm.email && !isValidEmail(safeForm.email)) {
            alert('Please enter a valid email address');
            setSaving(false);
            return;
        }

        try {
            await apiFetch(`/hr/employees/${employee.id}`, { method: 'PATCH', body: JSON.stringify(safeForm) });
            onDone();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{ marginBottom: 16 }}>Edit Employee</h3>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={labelStyle}>
                        Full Name *
                        <input required value={form.full_name} onChange={e => upd('full_name', e.target.value)} style={inputStyle} />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Email
                            <input type="email" value={form.email} onChange={e => upd('email', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>
                            Phone
                            <PhoneInput value={form.phone} onChange={v => upd('phone', v)} />
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Designation
                            <input value={form.designation} onChange={e => upd('designation', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>
                            Department
                            <input value={form.department} onChange={e => upd('department', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Type
                            <select value={form.employee_type} onChange={e => upd('employee_type', e.target.value)} style={inputStyle}>
                                <option value="staff">Staff</option>
                                <option value="student">Student</option>
                            </select>
                        </label>
                        <label style={labelStyle}>
                            Status
                            <select value={form.is_active ? 'active' : 'inactive'} onChange={e => upd('is_active', e.target.value === 'active')} style={inputStyle}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════ SALARY CALCULATOR PAGE ═══════ */
export function SalaryCalculatorPage() {
    const [employees, setEmployees] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [teacherReport, setTeacherReport] = useState([]);
    const [paymentRequests, setPaymentRequests] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [workingDaysOverride, setWorkingDaysOverride] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(null); // { type, data }
    const [loading, setLoading] = useState(true);
    const [editEmp, setEditEmp] = useState(null);
    const [activeTab, setActiveTab] = useState('employees'); // 'employees' or 'teachers'
    const [teacherMonthOffset, setTeacherMonthOffset] = useState(0);
    const [selectedTeacher, setSelectedTeacher] = useState(null); // clicked teacher row
    const [assignLevelEmp, setAssignLevelEmp] = useState(null);
    const [counselorProfiles, setCounselorProfiles] = useState([]);
    const [counselorLevels, setCounselorLevels] = useState([]);
    const [counselorSalesMap, setCounselorSalesMap] = useState({});

    const getMonthYearString = (offset) => {
        const d = new Date();
        d.setMonth(d.getMonth() + offset);
        return { month: d.getMonth() + 1, year: d.getFullYear(), label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }) };
    };

    const currentMY = getMonthYearString(teacherMonthOffset);

    // Auto-calculate working days (Mon-Sat) for selected month
    const autoWorkingDays = useMemo(() => {
        const start = new Date(currentMY.year, currentMY.month - 1, 1);
        const end = new Date(currentMY.year, currentMY.month, 0);
        let count = 0;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            if (d.getDay() !== 0) count++;
        }
        return count;
    }, [currentMY.month, currentMY.year]);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            apiFetch('/hr/employees'),
            apiFetch('/hr/salary-structures'),
            apiFetch(`/hr/teachers/salary-report?month=${currentMY.month}&year=${currentMY.year}`),
            apiFetch(`/hr/payment-requests?month=${currentMY.month}&year=${currentMY.year}`),
            apiFetch(`/hr/attendance/report?month=${currentMY.month}&year=${currentMY.year}`),
            apiFetch('/hr/councilor-profiles'),
            apiFetch('/hr/councilor-levels'),
            apiFetch(`/hr/councilors/sales-report?month=${currentMY.month}&year=${currentMY.year}`)
        ]).then(([empRes, salRes, teachRes, prRes, attRes, cpRes, clRes, salesRes]) => {
            setEmployees(empRes.items || []);
            setSalaries(salRes.items || []);
            setTeacherReport(teachRes.items || []);
            setPaymentRequests(prRes.items || []);
            const aMap = {};
            (attRes.items || []).forEach(i => { aMap[i.id] = i.report; });
            setAttendanceMap(aMap);
            setWorkingDaysOverride(null);
            setCounselorProfiles(cpRes.items || []);
            setCounselorLevels(clRes.items || []);
            setCounselorSalesMap(salesRes.report || {});
        }).catch(() => { }).finally(() => setLoading(false));
    }, [currentMY.month, currentMY.year]);

    function reload() {
        Promise.all([
            apiFetch('/hr/employees'),
            apiFetch('/hr/salary-structures'),
            apiFetch(`/hr/teachers/salary-report?month=${currentMY.month}&year=${currentMY.year}`),
            apiFetch(`/hr/payment-requests?month=${currentMY.month}&year=${currentMY.year}`),
            apiFetch(`/hr/attendance/report?month=${currentMY.month}&year=${currentMY.year}`),
            apiFetch('/hr/councilor-profiles'),
            apiFetch('/hr/councilor-levels'),
            apiFetch(`/hr/councilors/sales-report?month=${currentMY.month}&year=${currentMY.year}`)
        ]).then(([empRes, salRes, teachRes, prRes, attRes, cpRes, clRes, salesRes]) => {
            setEmployees(empRes.items || []);
            setSalaries(salRes.items || []);
            setTeacherReport(teachRes.items || []);
            setPaymentRequests(prRes.items || []);
            const aMap = {};
            (attRes.items || []).forEach(i => { aMap[i.id] = i.report; });
            setAttendanceMap(aMap);
            setCounselorProfiles(cpRes.items || []);
            setCounselorLevels(clRes.items || []);
            setCounselorSalesMap(salesRes.report || {});
        }).catch(() => { });
    }

    const salaryMap = useMemo(() => {
        const map = {};
        (salaries || []).forEach(s => { map[s.employee_id] = s; });
        return map;
    }, [salaries]);

    const prMap = useMemo(() => {
        const map = { employee: {}, teacher: {} };
        (paymentRequests || []).forEach(pr => {
            if (pr.employee_id) map.employee[pr.employee_id] = pr;
            if (pr.teacher_id) map.teacher[pr.teacher_id] = pr;
        });
        return map;
    }, [paymentRequests]);

    const counselorProfileMap = useMemo(() => {
        const map = {};
        (counselorProfiles || []).forEach(cp => { map[cp.user_id] = cp; });
        return map;
    }, [counselorProfiles]);

    async function handleSubmitRequest(e) {
        e.preventDefault();
        if (!confirmSubmit || submitting) return;
        setSubmitting(true);
        try {
            const endpoint = confirmSubmit.type === 'teacher' ? '/hr/payment-requests/teacher' : '/hr/payment-requests/employee';
            const payload = {
                year: currentMY.year,
                month: currentMY.month,
                adjustment: confirmSubmit.adjustment || 0,
                hr_note: confirmSubmit.hr_note || ''
            };

            if (confirmSubmit.type === 'teacher') {
                payload.teacherUserId = confirmSubmit.data.user_id;
            } else {
                payload.employeeId = confirmSubmit.data.id;
                payload.workingDays = confirmSubmit.data.workingDays || 0;
            }

            await apiFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            setConfirmSubmit(null);
            reload();
        } catch (err) {
            alert(err.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

    return (
        <section className="panel">
            <div className="card filters-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#10233f' }}>Salary Calculator</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => setActiveTab('employees')}
                        className={activeTab === 'employees' ? 'primary' : 'secondary'}
                        style={activeTab === 'employees' ? {} : { background: 'transparent', border: '1px solid var(--line)' }}
                    >
                        Employees
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={activeTab === 'teachers' ? 'primary' : 'secondary'}
                        style={activeTab === 'teachers' ? {} : { background: 'transparent', border: '1px solid var(--line)' }}
                    >
                        Teachers
                    </button>
                    <button
                        onClick={() => setActiveTab('master_rates')}
                        className={activeTab === 'master_rates' ? 'primary' : 'secondary'}
                        style={activeTab === 'master_rates' ? {} : { background: 'transparent', border: '1px solid var(--line)' }}
                    >
                        Master Rates
                    </button>
                </div>
            </div>

            {activeTab === 'employees' && (
                <>
                    <div className="card filters-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0, fontSize: '16px', color: '#10233f' }}>Employee Salaries</h2>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button onClick={() => setTeacherMonthOffset(prev => prev - 1)} className="secondary small">←</button>
                                <span style={{ fontSize: 14, fontWeight: 500 }}>{currentMY.label}</span>
                                <button onClick={() => setTeacherMonthOffset(prev => prev + 1)} className="secondary small" disabled={teacherMonthOffset >= 0}>→</button>
                                {teacherMonthOffset !== 0 && (
                                    <button onClick={() => setTeacherMonthOffset(0)} className="secondary small" style={{ marginLeft: 4 }}>Current Month</button>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid var(--line)', paddingLeft: 12 }}>
                                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Working Days:</span>
                                <input
                                    type="number"
                                    value={workingDaysOverride !== null ? workingDaysOverride : autoWorkingDays}
                                    onChange={e => setWorkingDaysOverride(Number(e.target.value))}
                                    style={{ width: 50, padding: '3px 6px', borderRadius: 6, border: '1px solid var(--line)', textAlign: 'center', fontSize: 13 }}
                                    min="0" max="31"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ─── Regular Employees Table ─── */}
                    <h3 style={{ fontSize: 15, margin: '0 0 10px', color: '#10233f' }}>Staff Salaries</h3>
                    <div className="card" style={{ marginBottom: 24 }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Employee</th>
                                    <th>Gross</th>
                                    <th>Deductions</th>
                                    <th style={{ textAlign: 'center' }}>Present</th>
                                    <th>Net Salary</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.filter(e => e.is_active && (!e.designation?.toLowerCase().includes('counselor') || e.designation?.toLowerCase().includes('head'))).map((emp, idx) => {
                                    const pr = prMap.employee[emp.id];
                                    const isSubmitted = !!pr;

                                    const sal = salaryMap[emp.id];
                                    const base = sal ? Number(sal.base_salary) : 0;
                                    const hra = sal ? Number(sal.hra) : 0;
                                    const allowances = sal ? Number(sal.transport_allowance) + Number(sal.other_allowance) : 0;
                                    const deductions = sal ? Number(sal.pf_deduction) + Number(sal.tax_deduction) + Number(sal.other_deduction) : 0;
                                    const gross = base + hra + allowances;

                                    const att = attendanceMap[emp.id] || { present: 0, half_day: 0 };
                                    const presentDays = att.present + (att.half_day * 0.5);
                                    const wd = workingDaysOverride !== null ? workingDaysOverride : autoWorkingDays;

                                    let calcNet = 0;
                                    if (presentDays === 0) {
                                        calcNet = Math.round(gross - deductions);
                                    } else {
                                        const proRatedGross = wd > 0 ? (gross * presentDays / wd) : 0;
                                        calcNet = Math.round(proRatedGross - deductions);
                                    }

                                    const net = isSubmitted ? pr.total_amount : Math.max(0, calcNet);

                                    return (
                                        <tr key={emp.id}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{emp.full_name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{emp.designation || ''}</div>
                                            </td>
                                            <td>₹{gross.toLocaleString()}</td>
                                            <td>₹{deductions.toLocaleString()}</td>
                                            <td style={{ textAlign: 'center', fontWeight: 500 }}>{presentDays}</td>
                                            <td style={{ fontWeight: 700, color: '#10233f' }}>₹{net.toLocaleString()}</td>
                                            <td>
                                                {isSubmitted ? (
                                                    <span className="badge success" style={{ padding: '4px 8px', fontSize: 11, borderRadius: 12 }}>Submitted ✓</span>
                                                ) : (
                                                     <div style={{ display: 'flex', gap: 6 }}>
                                                         <button onClick={() => setEditEmp(emp)} className={gross > 0 ? "secondary small" : "primary small"}>
                                                             {gross > 0 ? 'Edit Salary' : 'Set Salary'}
                                                         </button>
                                                         <button onClick={() => setConfirmSubmit({ type: 'employee', data: { ...emp, calcNet: net, workingDays: wd } })} className="primary small">Submit</button>
                                                     </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {employees.filter(e => e.is_active && (!e.designation?.toLowerCase().includes('counselor') || e.designation?.toLowerCase().includes('head'))).length === 0 && (
                                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>No staff employees</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ─── Counselors Table ─── */}
                    <h3 style={{ fontSize: 15, margin: '0 0 10px', color: '#10233f' }}>Counselor Salaries</h3>
                    <div className="card" style={{ marginBottom: 24 }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Counselor</th>
                                    <th>Level</th>
                                    <th>Basic Salary</th>
                                    <th>Target (₹)</th>
                                    <th style={{ textAlign: 'center' }}>Present</th>
                                    <th>Payable Basic</th>
                                    <th>Incentive</th>
                                    <th>Total Net</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.filter(e => e.is_active && e.designation?.toLowerCase().includes('counselor') && !e.designation?.toLowerCase().includes('head')).map((emp, idx) => {
                                    const pr = prMap.employee[emp.id];
                                    const isSubmitted = !!pr;

                                    // Find counselor profile/level — default to Level 1
                                    const cProfile = counselorProfileMap[emp.user_id];
                                    const defaultLevel = counselorLevels.length > 0 ? counselorLevels.sort((a, b) => a.level_name.localeCompare(b.level_name))[0] : null;
                                    const cLevel = cProfile?.councilor_levels || defaultLevel;
                                    const levelBasic = cLevel ? Number(cLevel.basic_salary) : 0;
                                    const levelTarget = cLevel ? Number(cLevel.target_amount) : 0;
                                    const levelIncentivePct = cLevel ? Number(cLevel.incentive_percentage) : 0;

                                    const att = attendanceMap[emp.id] || { present: 0, half_day: 0 };
                                    const presentDays = att.present + (att.half_day * 0.5);
                                    const wd = workingDaysOverride !== null ? workingDaysOverride : autoWorkingDays;

                                    let payableBasic = 0;
                                    if (presentDays === 0) {
                                        payableBasic = levelBasic; // Full if no attendance marked yet
                                    } else {
                                        payableBasic = wd > 0 ? Math.round(levelBasic * presentDays / wd) : 0;
                                    }

                                    // For submitted ones, show the submitted breakdown
                                    // For unsubmitted ones, calculate expected values based on real-time sales
                                    let displayIncentive = 0;
                                    let displayAchieved = 0;
                                    
                                    if (isSubmitted) {
                                        displayIncentive = pr.breakdown?.details?.incentive_amount || 0;
                                        displayAchieved = pr.breakdown?.details?.achieved_sales || 0;
                                    } else if (cLevel) {
                                        displayAchieved = counselorSalesMap[emp.user_id] || 0;
                                        const extraSales = Math.max(0, displayAchieved - levelTarget);
                                        displayIncentive = Math.round(extraSales * levelIncentivePct / 100);
                                    }

                                    const displayNet = isSubmitted ? pr.total_amount : (payableBasic + displayIncentive);

                                    return (
                                        <tr key={emp.id}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{emp.full_name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{emp.designation || ''}</div>
                                            </td>
                                            <td>
                                                <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#dbeafe', color: '#1d4ed8' }}>
                                                    {cLevel ? cLevel.level_name : '—'}
                                                </span>
                                            </td>
                                            <td>₹{levelBasic.toLocaleString()}</td>
                                            <td>₹{levelTarget.toLocaleString()}</td>
                                            <td style={{ textAlign: 'center', fontWeight: 500 }}>{presentDays}</td>
                                            <td>₹{payableBasic.toLocaleString()}</td>
                                            <td>
                                                <div style={{ fontWeight: 600, color: displayIncentive > 0 ? (isSubmitted ? 'var(--success)' : '#4f46e5') : 'var(--muted)' }}>
                                                    ₹{displayIncentive.toLocaleString()}
                                                </div>
                                                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                                                    Sales: ₹{displayAchieved.toLocaleString()}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 700, color: '#10233f', fontSize: 14 }}>₹{displayNet.toLocaleString()}</div>
                                            </td>
                                            <td>
                                                {isSubmitted ? (
                                                    <span className="badge success" style={{ padding: '4px 8px', fontSize: 11, borderRadius: 12 }}>Submitted ✓</span>
                                                ) : (
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        <button onClick={() => setAssignLevelEmp(emp)} className="secondary small" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                                                            Change Level
                                                        </button>
                                                        <button onClick={() => setConfirmSubmit({ type: 'employee', data: { ...emp, calcNet: payableBasic, workingDays: wd } })} className="primary small">Submit</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {employees.filter(e => e.is_active && e.designation?.toLowerCase().includes('counselor') && !e.designation?.toLowerCase().includes('head')).length === 0 && (
                                    <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>No counselors found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'master_rates' && <SalaryMasterRatesConfig />}

            {
                activeTab === 'teachers' && (
                    <>
                        <div className="card filters-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '16px', color: '#10233f' }}>Session-wise Salaries</h2>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button onClick={() => setTeacherMonthOffset(prev => prev - 1)} className="secondary small">←</button>
                                <span style={{ fontSize: 14, fontWeight: 500 }}>{currentMY.label}</span>
                                <button onClick={() => setTeacherMonthOffset(prev => prev + 1)} className="secondary small" disabled={teacherMonthOffset >= 0}>→</button>
                                {teacherMonthOffset !== 0 && (
                                    <button onClick={() => setTeacherMonthOffset(0)} className="secondary small" style={{ marginLeft: 8 }}>Current Month</button>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Teacher</th>
                                            <th>Experience</th>
                                            <th>Total Hours</th>
                                            <th>Total Salary</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teacherReport.map((t, idx) => {
                                            const pr = prMap.teacher[t.id];
                                            const isSubmitted = !!pr;
                                            const displayVal = isSubmitted ? pr.total_amount : (t.total_salary || 0);

                                            return (
                                                <tr key={t.id} onClick={() => {
                                                    if (pr && (pr.status === 'approved' || pr.status === 'paid')) return;
                                                    setSelectedTeacher(t);
                                                }} style={{ cursor: pr && (pr.status === 'approved' || pr.status === 'paid') ? 'default' : 'pointer' }}>
                                                    <td>{idx + 1}</td>
                                                    <td>
                                                        <div style={{ fontWeight: 500 }}>{t.full_name}</div>
                                                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.teacher_code || 'No Code'}</div>
                                                    </td>
                                                    <td style={{ textTransform: 'capitalize' }}>{(t.experience_level || '').replace(/_/g, ' ')}</td>
                                                    <td style={{ fontWeight: 600 }}>{isSubmitted && pr.breakdown && pr.breakdown.details ? (pr.breakdown.details.total_hours || t.total_hours) : t.total_hours} hrs</td>
                                                    <td style={{ fontWeight: 700, color: '#10233f' }}>₹{displayVal.toLocaleString()}</td>
                                                    <td>
                                                        {isSubmitted ? (
                                                            <span className="badge success" style={{ padding: '4px 8px', fontSize: 11, borderRadius: 12 }}>Submitted ✓</span>
                                                        ) : (
                                                            <button onClick={(e) => { e.stopPropagation(); setConfirmSubmit({ type: 'teacher', data: t }); }} className="primary small">
                                                                Submit
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {teacherReport.length === 0 && (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--muted)' }}>No teachers found in pool</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            }

            {
                editEmp && (
                    <SalaryModal
                        employee={editEmp}
                        existing={salaryMap[editEmp.id]}
                        onClose={() => setEditEmp(null)}
                        onDone={() => { setEditEmp(null); reload(); }}
                    />
                )
            }

            {
                selectedTeacher && (
                    <TeacherSalaryDetail
                        teacher={selectedTeacher}
                        month={currentMY.month}
                        year={currentMY.year}
                        onClose={() => setSelectedTeacher(null)}
                        onRatesUpdated={(closeModal = true) => { if (closeModal) setSelectedTeacher(null); reload(); }}
                    />
                )
            }

            {/* Confirm Submit Modal */}
            {
                confirmSubmit && (
                    <div className="modal-overlay" onClick={() => setConfirmSubmit(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                            <h3 style={{ marginTop: 0 }}>Confirm Payment Submission</h3>
                            <p style={{ fontSize: 14 }}>
                                You are submitting a payment request to Finance for <strong>{confirmSubmit.data.full_name}</strong> for {currentMY.label}.
                            </p>
                            <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ color: 'var(--muted)', fontSize: 13 }}>Calculated Value:</span>
                                    <strong style={{ color: '#10233f', fontSize: 14 }}>
                                        ₹{Number(confirmSubmit.type === 'teacher' ? confirmSubmit.data.total_salary : confirmSubmit.data.calcNet).toLocaleString()}
                                    </strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--muted)', fontSize: 13 }}>Adjustment (₹):</span>
                                    <input
                                        type="number"
                                        value={confirmSubmit.adjustment || ''}
                                        onChange={e => setConfirmSubmit({ ...confirmSubmit, adjustment: Number(e.target.value) })}
                                        style={{ width: 80, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--line)', textAlign: 'right' }}
                                        placeholder="0"
                                    />
                                </div>
                                {confirmSubmit.adjustment ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                                        <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 500 }}>Final Amount:</span>
                                        <strong style={{ color: '#22c55e', fontSize: 15 }}>
                                            ₹{Math.max(0, Number(confirmSubmit.type === 'teacher' ? confirmSubmit.data.total_salary : confirmSubmit.data.calcNet) + (confirmSubmit.adjustment || 0)).toLocaleString()}
                                        </strong>
                                    </div>
                                ) : null}
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>HR Note (Optional):</label>
                                <textarea
                                    value={confirmSubmit.hr_note || ''}
                                    onChange={e => setConfirmSubmit({ ...confirmSubmit, hr_note: e.target.value })}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg)', minHeight: 60, fontSize: 14 }}
                                    placeholder="Any specific reason for adjustment or note for finance..."
                                />
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--warning)', margin: '0 0 20px', lineHeight: 1.4 }}>
                                Warning: This snapshot will be frozen in history. Future rate changes will not alter this month's submitted amount.
                            </p>
                            <form onSubmit={handleSubmitRequest} style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setConfirmSubmit(null)} className="secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                                <button type="submit" className="primary" disabled={submitting} style={{ padding: '8px 16px', background: '#22c55e', borderColor: '#22c55e', color: '#fff' }}>
                                    {submitting ? 'Submitting...' : 'Confirm & Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {assignLevelEmp && (
                <AssignCounselorLevelModal
                    employee={assignLevelEmp}
                    onClose={() => setAssignLevelEmp(null)}
                    onDone={() => { setAssignLevelEmp(null); reload(); }}
                />
            )}
        </section >
    );
}

/* ═══════ TEACHER SALARY DETAIL MODAL ═══════ */
function TeacherSalaryDetail({ teacher, month, year, onClose, onRatesUpdated }) {
    const [sessions, setSessions] = useState([]);
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customRates, setCustomRates] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showRateEditor, setShowRateEditor] = useState(false);
    const [newRate, setNewRate] = useState({ subject: '_any', board: '_any', level: 'lkg_7', rate: '' });
    const [subjectsList, setSubjectsList] = useState([]);
    const [boardsList, setBoardsList] = useState([]);

    useEffect(() => {
        setLoading(true);
        apiFetch(`/hr/teachers/${teacher.user_id}/salary-detail?month=${month}&year=${year}`)
            .then(res => {
                setSessions(res.sessions || []);
                setTeacherInfo(res.teacher || null);
                setCustomRates(res.teacher?.custom_rates || {});
            })
            .catch(() => { })
            .finally(() => setLoading(false));
        apiFetch('/subjects').then(r => setSubjectsList((r.subjects || []).map(s => s.name))).catch(() => { });
        apiFetch('/boards').then(r => setBoardsList(r.boards || [])).catch(() => { });
    }, [teacher.user_id, month, year]);

    const totalHours = sessions.reduce((sum, s) => sum + s.duration_hours, 0);
    const totalAmount = sessions.reduce((sum, s) => sum + s.amount, 0);

    function addCustomRate() {
        if (!newRate.rate) return;
        const subValue = newRate.subject ? newRate.subject.trim().toLowerCase() : '_any';
        const boardValue = newRate.board ? newRate.board.trim().toLowerCase() : '_any';
        const subKey = `${subValue}__${boardValue}`;
        const updated = { ...customRates };
        if (!updated[subKey]) updated[subKey] = {};
        updated[subKey][newRate.level] = Number(newRate.rate);
        setCustomRates(updated);
        setNewRate({ subject: '_any', board: '_any', level: 'lkg_7', rate: '' });
        setSaveSuccess(false);
    }

    function removeCustomRate(subKey, level) {
        const updated = { ...customRates };
        if (updated[subKey]) {
            delete updated[subKey][level];
            if (Object.keys(updated[subKey]).length === 0) delete updated[subKey];
        }
        setCustomRates(updated);
        setSaveSuccess(false);
    }

    async function saveCustomRates() {
        setSaving(true);
        setSaveSuccess(false);
        try {
            await apiFetch(`/hr/teachers/${teacher.user_id}/custom-rates`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ custom_rates: customRates })
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            onRatesUpdated(false);
        } catch { }
        setSaving(false);
    }

    const levelLabels = { lkg_7: 'LKG–7', class_8_10: '8–10', plus_1_2: '+1 & +2' };

    function parseRateKey(subKey) {
        const parts = subKey.split('__');
        return { subject: parts[0], board: parts[1] || '' };
    }

    return (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 24 }}>
            <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 1000, maxHeight: '90vh', overflow: 'auto', padding: 24 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 20, color: '#10233f' }}>{teacherInfo?.full_name || teacher.full_name}</h2>
                        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                            {teacherInfo?.teacher_code || teacher.teacher_code || 'No Code'} · Experience: <span style={{ textTransform: 'capitalize' }}>{(teacherInfo?.experience_level || '').replace(/_/g, ' ')}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="secondary small">✕ Close</button>
                </div>

                {loading ? <p style={{ padding: 24, textAlign: 'center' }}>Loading sessions...</p> : (
                    <>
                        {/* Summary */}
                        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                            <div style={{ flex: 1, background: '#f0f5ff', borderRadius: 8, padding: '12px 16px' }}>
                                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Total Sessions</div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>{sessions.length}</div>
                            </div>
                            <div style={{ flex: 1, background: '#f0f5ff', borderRadius: 8, padding: '12px 16px' }}>
                                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Total Hours</div>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>{Math.round(totalHours * 100) / 100} hrs</div>
                            </div>
                            <div style={{ flex: 1, background: '#e8f5e9', borderRadius: 8, padding: '12px 16px' }}>
                                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Total Salary</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#10233f' }}>₹{Math.round(totalAmount).toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Sessions Table */}
                        <h3 style={{ fontSize: 15, margin: '0 0 12px', color: '#10233f' }}>Session Breakdown</h3>
                        <div className="table-wrap" style={{ marginBottom: 24 }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Student</th>
                                        <th>Subject</th>
                                        <th>Board</th>
                                        <th>Level</th>
                                        <th>Hours</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((s, idx) => (
                                        <tr key={s.session_id}>
                                            <td>{idx + 1}</td>
                                            <td>{s.session_date}</td>
                                            <td>{s.student_name}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{s.subject}</td>
                                            <td>{s.board || '—'}</td>
                                            <td>{levelLabels[s.salary_level] || s.salary_level}</td>
                                            <td>{s.duration_hours}</td>
                                            <td>₹{s.rate_applied}</td>
                                            <td style={{ fontWeight: 600 }}>₹{s.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {sessions.length === 0 && (
                                        <tr>
                                            <td colSpan={9} style={{ textAlign: 'center', padding: 24, color: 'var(--muted)' }}>No approved sessions this month</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Custom Rates Section */}
                        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ fontSize: 15, margin: 0, color: '#10233f' }}>Custom Rate Overrides</h3>
                                <button onClick={() => setShowRateEditor(!showRateEditor)} className="secondary small">
                                    {showRateEditor ? 'Hide Editor' : 'Edit Rates'}
                                </button>
                            </div>

                            {/* Existing custom rates */}
                            {Object.keys(customRates).length > 0 && (
                                <div style={{ marginBottom: 12 }}>
                                    {Object.entries(customRates).map(([subKey, levels]) => {
                                        const { subject, board } = parseRateKey(subKey);
                                        return Object.entries(levels).map(([level, rate]) => (
                                            <div key={`${subKey}-${level}`} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '6px 10px', background: '#fff8e1', borderRadius: 6, fontSize: 13 }}>
                                                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{subject === '_any' ? 'All Subjects' : subject}</span>
                                                <><span style={{ color: 'var(--muted)' }}>·</span><span style={{ textTransform: 'capitalize', color: '#6b7280' }}>{board === '_any' || !board ? 'All Boards' : board}</span></>
                                                <span style={{ color: 'var(--muted)' }}>→</span>
                                                <span>{levelLabels[level] || level}</span>
                                                <span style={{ color: 'var(--muted)' }}>→</span>
                                                <span style={{ fontWeight: 600 }}>₹{rate}/hr</span>
                                                {showRateEditor && (
                                                    <button onClick={() => removeCustomRate(subKey, level)} className="secondary small" style={{ marginLeft: 'auto', color: '#e53935', fontSize: 11, padding: '2px 8px' }}>Remove</button>
                                                )}
                                            </div>
                                        ));
                                    })}
                                </div>
                            )}

                            {Object.keys(customRates).length === 0 && !showRateEditor && (
                                <p style={{ fontSize: 13, color: 'var(--muted)' }}>No custom overrides set. Using master rates.</p>
                            )}

                            {/* Add new custom rate */}
                            {showRateEditor && (
                                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 8 }}>
                                    <div>
                                        <label style={{ fontSize: 12, color: 'var(--muted)' }}>Subject</label>
                                        <select value={newRate.subject} onChange={e => setNewRate(p => ({ ...p, subject: e.target.value }))} style={{ width: 150, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--line)' }}>
                                            <option value="_any">All Subjects</option>
                                            {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: 'var(--muted)' }}>Board</label>
                                        <select value={newRate.board} onChange={e => setNewRate(p => ({ ...p, board: e.target.value }))} style={{ width: 120, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--line)' }}>
                                            <option value="_any">All Boards</option>
                                            {boardsList.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: 'var(--muted)' }}>Level</label>
                                        <select value={newRate.level} onChange={e => setNewRate(p => ({ ...p, level: e.target.value }))} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--line)' }}>
                                            <option value="lkg_7">LKG–7</option>
                                            <option value="class_8_10">8–10</option>
                                            <option value="plus_1_2">+1 & +2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: 'var(--muted)' }}>Rate (₹/hr)</label>
                                        <input type="number" placeholder="0" value={newRate.rate} onChange={e => setNewRate(p => ({ ...p, rate: e.target.value }))} style={{ width: 90, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--line)' }} />
                                    </div>
                                    <button onClick={addCustomRate} className="primary small" style={{ padding: '6px 14px' }}>+ Add</button>
                                </div>
                            )}

                            {/* Save Button */}
                            {showRateEditor && (
                                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <button onClick={saveCustomRates} className="primary" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Custom Rates'}
                                    </button>
                                    {saveSuccess && <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 500 }}>✓ Saved successfully!</span>}
                                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>Remember to save after adding or removing rates.</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function SalaryModal({ employee, existing, onClose, onDone }) {
    const [form, setForm] = useState({
        base_salary: existing?.base_salary || '',
        hra: existing?.hra || '',
        transport_allowance: existing?.transport_allowance || '',
        other_allowance: existing?.other_allowance || '',
        pf_deduction: existing?.pf_deduction || '',
        tax_deduction: existing?.tax_deduction || '',
        other_deduction: existing?.other_deduction || ''
    });
    const [saving, setSaving] = useState(false);
    const upd = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await apiFetch('/hr/salary-structures', {
                method: 'POST',
                body: JSON.stringify({ employee_id: employee.id, ...form })
            });
            onDone();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    const gross = Number(form.base_salary || 0) + Number(form.hra || 0) + Number(form.transport_allowance || 0) + Number(form.other_allowance || 0);
    const deductions = Number(form.pf_deduction || 0) + Number(form.tax_deduction || 0) + Number(form.other_deduction || 0);
    const net = gross - deductions;

    return (
        <div style={overlayStyle}>
            <div style={{ ...modalStyle, maxWidth: 520 }}>
                <h3 style={{ marginBottom: 4 }}>Salary Structure</h3>
                <p style={{ color: '#64748b', marginBottom: 16, fontSize: 14 }}>{employee.full_name} — {employee.designation || 'No designation'}</p>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={labelStyle}>Base Salary (₹)
                        <input type="number" step="0.01" value={form.base_salary} onChange={e => upd('base_salary', e.target.value)} style={inputStyle} />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>HRA (₹)
                            <input type="number" step="0.01" value={form.hra} onChange={e => upd('hra', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>Transport (₹)
                            <input type="number" step="0.01" value={form.transport_allowance} onChange={e => upd('transport_allowance', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <label style={labelStyle}>Other Allowance (₹)
                        <input type="number" step="0.01" value={form.other_allowance} onChange={e => upd('other_allowance', e.target.value)} style={inputStyle} />
                    </label>
                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>PF (₹)
                            <input type="number" step="0.01" value={form.pf_deduction} onChange={e => upd('pf_deduction', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>Tax (₹)
                            <input type="number" step="0.01" value={form.tax_deduction} onChange={e => upd('tax_deduction', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>Other (₹)
                            <input type="number" step="0.01" value={form.other_deduction} onChange={e => upd('other_deduction', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#475569' }}>Gross: <strong style={{ color: '#16a34a' }}>₹{gross.toLocaleString()}</strong></span>
                        <span style={{ color: '#475569' }}>Deductions: <strong style={{ color: '#dc2626' }}>₹{deductions.toLocaleString()}</strong></span>
                        <span style={{ color: '#475569' }}>Net: <strong style={{ color: '#0f172a' }}>₹{net.toLocaleString()}</strong></span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : 'Save Salary'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════ MASTER RATES COMPONENT ═══════ */
function SalaryMasterRatesConfig() {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiFetch('/hr/salary-rate-config')
            .then(res => setConfigs(res.items || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    function handleRateChange(idx, newRate) {
        const updated = [...configs];
        updated[idx].rate = newRate;
        setConfigs(updated);
    }

    async function saveConfigs() {
        setSaving(true);
        try {
            await apiFetch('/hr/salary-rate-config', {
                method: 'PUT',
                body: JSON.stringify({ items: configs })
            });
            alert('Master rates updated successfully! These will apply to all calculations dynamically.');
        } catch (err) {
            alert(err.message);
        }
        setSaving(false);
    }

    function addRow() {
        setConfigs([{
            board: 'state_cbse',
            experience_category: 'fresher',
            subject_key: '_default',
            level: 'lkg_7',
            rate: ''
        }, ...configs]);
    }

    function deleteRow(idx) {
        setConfigs(configs.filter((_, i) => i !== idx));
    }

    if (loading) return <p style={{ padding: 24, textAlign: 'center' }}>Loading master rates...</p>;

    const selectStyle = { padding: '6px 8px', borderRadius: 4, border: '1px solid var(--line)', width: '100%', fontSize: 13 };
    const textStyle = { padding: '6px 8px', borderRadius: 4, border: '1px solid var(--line)', width: '100%', fontSize: 13 };

    return (
        <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, borderBottom: '1px solid var(--line)' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: 16, color: '#10233f' }}>Master Salary Rules</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>These baseline rates are used if a teacher does not have a custom rate override. <br />The system prioritizes Exact Subject & Board {'>'} Special Subjects {'>'} ICSE/IGCSE {'>'} State/CBSE by Box.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={addRow} className="secondary small">+ Add Rule</button>
                    <button onClick={saveConfigs} className="primary" disabled={saving}>{saving ? 'Saving...' : 'Save All Changes'}</button>
                </div>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Board Category</th>
                            <th>Experience Level</th>
                            <th>Subject Key</th>
                            <th>Class Level</th>
                            <th>Rate (₹/hr)</th>
                            <th style={{ width: 40 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {configs.map((c, idx) => (
                            <tr key={idx}>
                                <td>
                                    <select value={c.board} onChange={e => { const v = [...configs]; v[idx].board = e.target.value; setConfigs(v); }} style={selectStyle}>
                                        <option value="state_cbse">State / CBSE</option>
                                        <option value="icse_igcse">ICSE / IGCSE</option>
                                        <option value="_any">Any Board</option>
                                    </select>
                                </td>
                                <td>
                                    <select value={c.experience_category} onChange={e => { const v = [...configs]; v[idx].experience_category = e.target.value; setConfigs(v); }} style={selectStyle}>
                                        <option value="fresher">Fresher</option>
                                        <option value="experienced">Experienced</option>
                                        <option value="experienced_high">Experienced (High)</option>
                                        <option value="_any">Any Experience</option>
                                    </select>
                                </td>
                                <td>
                                    <input value={c.subject_key} onChange={e => { const v = [...configs]; v[idx].subject_key = e.target.value; setConfigs(v); }} style={textStyle} placeholder="_default, french, etc." />
                                </td>
                                <td>
                                    <select value={c.level} onChange={e => { const v = [...configs]; v[idx].level = e.target.value; setConfigs(v); }} style={selectStyle}>
                                        <option value="lkg_7">LKG–7</option>
                                        <option value="class_8_10">8–10</option>
                                        <option value="plus_1_2">+1 & +2</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="number" value={c.rate} onChange={e => handleRateChange(idx, e.target.value)} style={textStyle} placeholder="0" />
                                </td>
                                <td>
                                    <button onClick={() => deleteRow(idx)} className="secondary small" style={{ color: '#ef4444', padding: '4px 8px' }}>✕</button>
                                </td>
                            </tr>
                        ))}
                        {configs.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No master rules configured.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}



/* ═══════ HR PAYMENT REQUESTS PAGE ═══════ */
export function HRPaymentRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthOffset, setMonthOffset] = useState(0);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const getMonthYearString = (offset) => {
        const d = new Date();
        d.setMonth(d.getMonth() + offset);
        return { month: d.getMonth() + 1, year: d.getFullYear(), label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }) };
    };

    const currentMY = getMonthYearString(monthOffset);

    useEffect(() => {
        setLoading(true);
        apiFetch(`/hr/payment-requests?month=${currentMY.month}&year=${currentMY.year}`)
            .then(r => setRequests(r.items || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [currentMY.month, currentMY.year]);

    const statusColors = { pending: '#f59e0b', approved: '#22c55e', rejected: '#ef4444', paid: '#8b5cf6' };
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <section className="panel">
            <div className="card filters-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#10233f' }}>Payment Requests to Finance</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setMonthOffset(o => o - 1)} className="secondary" style={{ padding: '4px 12px' }}>&larr; Prev</button>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{currentMY.label}</span>
                    <button onClick={() => setMonthOffset(o => o + 1)} className="secondary" style={{ padding: '4px 12px' }}>Next &rarr;</button>
                </div>
            </div>

            <div className="card">
                {loading ? <div style={{ padding: 24 }}>Loading...</div> : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Staff/Teacher</th>
                                    <th>Type</th>
                                    <th>Period</th>
                                    <th>Calculated Amount</th>
                                    <th>Adjustment</th>
                                    <th>Total Payable</th>
                                    <th>Status</th>
                                    <th>Submitted At</th>
                                    <th>HR Note</th>
                                    <th>Finance Note</th>
                                    <th></th> {/* For the Details button */}
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req, idx) => {
                                    const name = req.target_type === 'teacher' ? (req.teacher_profiles?.users?.full_name || 'Unknown Teacher') : (req.employees?.full_name || 'Unknown Employee');
                                    const typeLabel = req.target_type === 'teacher' ? 'Teacher' : 'Staff';
                                    const calcAmount = req.breakdown?.base_calculated || 0;
                                    const adjustment = req.breakdown?.adjustment || 0;

                                    return (
                                        <tr key={req.id}>
                                            <td>{idx + 1}</td>
                                            <td><div style={{ fontWeight: 500 }}>{name}</div></td>
                                            <td>
                                                <span style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, background: req.target_type === 'teacher' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: req.target_type === 'teacher' ? '#8b5cf6' : '#3b82f6', fontWeight: 600 }}>
                                                    {typeLabel}
                                                </span>
                                            </td>
                                            <td>{monthNames[req.month]} {req.year}</td>
                                            <td style={{ color: '#64748b' }}>₹{Number(calcAmount).toLocaleString()}</td>
                                            <td style={{ color: adjustment < 0 ? '#ef4444' : (adjustment > 0 ? '#22c55e' : '#94a3b8'), fontWeight: adjustment !== 0 ? 600 : 400 }}>
                                                {adjustment !== 0 ? (adjustment > 0 ? `+₹${Number(adjustment).toLocaleString()}` : `-₹${Math.abs(Number(adjustment)).toLocaleString()}`) : '—'}
                                            </td>
                                            <td style={{ fontWeight: 700, color: '#10233f' }}>₹{Number(req.total_amount).toLocaleString()}</td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: 20, fontSize: 12,
                                                    background: (statusColors[req.status] || '#666') + '22',
                                                    color: statusColors[req.status] || '#94a3b8',
                                                    fontWeight: 600
                                                }}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: 13, color: '#64748b' }}>{new Date(req.created_at).toLocaleDateString('en-IN')}</td>
                                            <td style={{ fontSize: 13, maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.hr_note}>{req.hr_note || '—'}</td>
                                            <td style={{ fontSize: 13, maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.finance_note}>{req.finance_note || '—'}</td>
                                            <td>
                                                <button onClick={() => setSelectedRequest(req)} className="secondary small">Details</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {requests.length === 0 && (
                                    <tr><td colSpan={12} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No individual payment requests yet. Submit from the Salary Calculator.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {selectedRequest && <RequestDetailsModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
        </section>
    );
}

function RequestDetailsModal({ request, onClose }) {
    const details = request.breakdown?.details || {};
    const isCounselor = request.target_type === 'employee' && request.employees?.designation?.toLowerCase().includes('counselor');

    return (
        <div style={overlayStyle}>
            <div style={{ ...modalStyle, maxWidth: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0 }}>Payment Details</h3>
                    <button onClick={onClose} className="secondary small">✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <p style={labelStyle}>Staff Name</p>
                            <p style={{ margin: 0, fontWeight: 600 }}>{request.employees?.full_name || request.teacher_profiles?.users?.full_name || '—'}</p>
                        </div>
                        <div>
                            <p style={labelStyle}>Type / Period</p>
                            <p style={{ margin: 0 }}>{request.target_type} · {request.month}/{request.year}</p>
                        </div>
                    </div>

                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 14 }}>Base Salary {isCounselor ? `(${details.counselor_level})` : ''}</span>
                            <span style={{ fontWeight: 600 }}>₹{Number(details.base_salary || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: 13, marginBottom: 12 }}>
                            <span>Attendance: {details.present_days}P + {details.half_days}H / {details.working_days} Days</span>
                            <span>Pro-rated basic</span>
                        </div>

                        {isCounselor && (
                            <div style={{ borderTop: '1px dotted #cbd5e1', paddingTop: 12, marginTop: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: 14, fontWeight: 500 }}>Sales Incentive</span>
                                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>+₹{Number(details.incentive_amount || 0).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: 12 }}>
                                    <span>Achieved: ₹{Number(details.achieved_sales || 0).toLocaleString()}</span>
                                    <span>Based on Monthly Target</span>
                                </div>
                            </div>
                        )}

                        <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700 }}>Total Calculated</span>
                            <span style={{ fontWeight: 700 }}>₹{Number(request.breakdown?.base_calculated || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    {request.hr_note && (
                        <div>
                            <p style={labelStyle}>HR Note</p>
                            <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>{request.hr_note}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ═══════ SHARED STYLES ═══════ */
const thStyle = { textAlign: 'left', padding: '10px 12px', color: '#94a3b8', fontSize: 13, fontWeight: 600, background: '#0f172a', whiteSpace: 'nowrap' };
const tdStyle = { padding: '10px 12px', color: '#1e293b', fontSize: 14 };
const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24
};
const modalStyle = {
    background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 480,
    maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'
};
const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
    background: '#ffffff', color: '#1e293b', fontSize: 14, marginTop: 4, transition: 'border-color 0.15s'
};
const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: 13, color: '#475569', fontWeight: 500 };
const btnPrimary = { padding: '8px 20px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 };
const btnSecondary = { padding: '8px 20px', borderRadius: 8, background: '#334155', color: '#e2e8f0', border: 'none', cursor: 'pointer' };
const btnSmall = { padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, color: '#f1f5f9' };
