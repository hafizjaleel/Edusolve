import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

/* ─── Shared helpers ─── */
const STATUS_STEPS = ['sourced', 'contacted', 'interview_scheduled', 'interview_done', 'demo_class', 'approved', 'onboarded'];
const STATUS_LABELS = {
    sourced: 'Sourced',
    contacted: 'Contacted',
    interview_scheduled: 'Interview Scheduled',
    interview_done: 'Interview Done',
    demo_class: 'Demo Class',
    approved: 'Approved',
    onboarded: '✅ Onboarded',
    rejected: '❌ Rejected'
};
const STATUS_COLORS = {
    sourced: '#6366f1',
    contacted: '#8b5cf6',
    interview_scheduled: '#f59e0b',
    interview_done: '#3b82f6',
    demo_class: '#06b6d4',
    approved: '#10b981',
    onboarded: '#15803d',
    rejected: '#ef4444'
};

function getNextStatus(current) {
    if (current === 'rejected' || current === 'onboarded') return null;
    const idx = STATUS_STEPS.indexOf(current);
    if (idx === -1 || idx >= STATUS_STEPS.length - 1) return null;
    return STATUS_STEPS[idx + 1];
}

function getNextLabel(next) {
    const labels = {
        contacted: '📞 Mark Contacted',
        interview_scheduled: '📅 Schedule Interview',
        interview_done: '✅ Interview Done',
        demo_class: '🎓 Demo Class',
        approved: '👍 Approve',
        onboarded: '🚀 Onboard'
    };
    return labels[next] || next;
}

/* ═══════ TC Dashboard ═══════ */
export function TCDashboardPage() {
    const [stats, setStats] = useState({});
    const [pool, setPool] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [s, p, l] = await Promise.all([
                    apiFetch('/teacher-leads/stats'),
                    apiFetch('/teachers/pool'),
                    apiFetch('/teacher-leads')
                ]);
                setStats(s.stats || {});
                setPool(p.items || []);
                setLeads(l.items || []);
            } catch (e) { }
            setLoading(false);
        })();
    }, []);

    const totalLeads = Object.values(stats).reduce((a, b) => a + b, 0);
    const pipelineActive = (stats.sourced || 0) + (stats.contacted || 0) + (stats.interview_scheduled || 0) + (stats.interview_done || 0) + (stats.demo_class || 0) + (stats.approved || 0);
    const conversionRate = totalLeads > 0 ? Math.round(((stats.onboarded || 0) / totalLeads) * 100) : 0;

    // Recent 5 leads
    const recentLeads = leads.slice(0, 5);

    if (loading) return <section className="panel"><p>Loading dashboard...</p></section>;

    return (
        <section className="panel">
            <div className="grid-four">
                <StatCard label="Total Teacher Leads" value={totalLeads} />
                <StatCard label="Pipeline Active" value={pipelineActive} />
                <StatCard label="Teachers in Pool" value={pool.length} tone="success" />
                <StatCard label="Conversion Rate" value={`${conversionRate}%`} tone="info" />
            </div>

            <div className="grid-three" style={{ marginTop: '16px' }}>
                {/* Pipeline Breakdown */}
                <article className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Recruitment Pipeline</h3>
                    {STATUS_STEPS.map(status => (
                        <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLORS[status] }} />
                                <span style={{ fontSize: '13px' }}>{STATUS_LABELS[status]}</span>
                            </div>
                            <strong style={{ fontSize: '14px' }}>{stats[status] || 0}</strong>
                        </div>
                    ))}
                    {/* Rejected */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLORS.rejected }} />
                            <span style={{ fontSize: '13px' }}>Rejected</span>
                        </div>
                        <strong style={{ fontSize: '14px' }}>{stats.rejected || 0}</strong>
                    </div>
                </article>

                {/* Outcomes */}
                <article className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Outcomes</h3>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                        <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#dcfce7', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#15803d' }}>{stats.onboarded || 0}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#15803d' }}>Onboarded</p>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#fee2e2', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#dc2626' }}>{stats.rejected || 0}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#dc2626' }}>Rejected</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px', background: '#eff6ff', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1d4ed8' }}>{pool.length}</p>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#1d4ed8' }}>Active in Pool</p>
                    </div>
                </article>

                {/* Recent Leads */}
                <article className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Recent Teacher Leads</h3>
                    {recentLeads.length ? recentLeads.map(lead => (
                        <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}>
                            <span style={{ fontWeight: 500 }}>{lead.full_name}</span>
                            <span style={{
                                padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                                background: `${STATUS_COLORS[lead.status] || '#6b7280'}18`,
                                color: STATUS_COLORS[lead.status] || '#6b7280'
                            }}>
                                {STATUS_LABELS[lead.status] || lead.status}
                            </span>
                        </div>
                    )) : <p className="text-muted" style={{ fontSize: '13px' }}>No teacher leads yet</p>}
                </article>
            </div>
        </section>
    );
}

function StatCard({ label, value, tone }) {
    const bg = tone === 'success' ? '#dcfce7' : tone === 'danger' ? '#fee2e2' : tone === 'info' ? '#e0e7ff' : '#f3f4f6';
    const color = tone === 'success' ? '#15803d' : tone === 'danger' ? '#dc2626' : tone === 'info' ? '#4338ca' : '#111';
    return (
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color }}>{value}</p>
            <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>{label}</p>
        </div>
    );
}


/* ═══════ Teacher Leads Pipeline ═══════ */
export function TeacherLeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('sourced');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(null); // lead object

    async function loadLeads() {
        try {
            const d = await apiFetch('/teacher-leads');
            setLeads(d.items || []);
        } catch (e) { setError(e.message); }
        setLoading(false);
    }

    useEffect(() => { loadLeads(); }, []);

    const TABS = [
        { id: 'sourced', label: 'Sourced' },
        { id: 'contacted', label: 'Contacted' },
        { id: 'interview_scheduled', label: 'Interview' },
        { id: 'interview_done', label: 'Interview Done' },
        { id: 'demo_class', label: 'Demo Class' },
        { id: 'approved', label: 'Approved' },
        { id: 'onboarded', label: 'Onboarded' },
        { id: 'rejected', label: 'Rejected' },
        { id: 'all', label: 'All' }
    ];

    const filteredLeads = activeTab === 'all' ? leads : leads.filter(l => l.status === activeTab);

    async function handleStatusChange(id, newStatus) {
        try {
            await apiFetch(`/teacher-leads/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            await loadLeads();
        } catch (e) { alert(e.message); }
    }

    async function handleReject(id) {
        if (!confirm('Are you sure you want to reject this teacher lead?')) return;
        try {
            await apiFetch(`/teacher-leads/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'rejected', reason: 'Rejected by coordinator' })
            });
            await loadLeads();
        } catch (e) { alert(e.message); }
    }

    function formatPhone(num) {
        if (!num) return null;
        let clean = num.replace(/[^0-9+]/g, '');
        if (!clean.startsWith('+') && !clean.startsWith('91') && clean.length === 10) clean = '91' + clean;
        return clean;
    }

    return (
        <section className="panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>Teacher Leads</h2>
                <button className="primary" onClick={() => setShowAddModal(true)}>+ Add Teacher Lead</button>
            </div>

            <div className="tabs-row" style={{ marginBottom: '16px', flexWrap: 'wrap' }}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label} ({tab.id === 'all' ? leads.length : leads.filter(l => l.status === tab.id).length})
                    </button>
                ))}
            </div>

            {loading ? <p>Loading teacher leads...</p> : null}
            {error ? <p className="error">{error}</p> : null}

            {!loading && filteredLeads.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px' }}>👩‍🏫</p>
                    <p style={{ fontWeight: 500 }}>No teacher leads in this stage.</p>
                </div>
            ) : null}

            <div className="today-leads-grid">
                {filteredLeads.map(lead => {
                    const phone = formatPhone(lead.phone);
                    const nextStatus = getNextStatus(lead.status);

                    return (
                        <div key={lead.id} className="card today-lead-card" style={{
                            padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                            borderLeft: `4px solid ${STATUS_COLORS[lead.status] || '#6b7280'}`,
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <div style={{ minWidth: 0 }}>
                                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{lead.full_name}</h3>
                                    {lead.qualification ? <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '12px' }}>{lead.qualification}</p> : null}
                                </div>
                                <span style={{
                                    padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                                    background: `${STATUS_COLORS[lead.status] || '#6b7280'}18`,
                                    color: STATUS_COLORS[lead.status] || '#6b7280',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {STATUS_LABELS[lead.status] || lead.status}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="today-lead-details">
                                <div>
                                    <span className="text-muted">Phone</span>
                                    <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.phone || '—'}</p>
                                </div>
                                <div>
                                    <span className="text-muted">Subject</span>
                                    <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.subject || '—'}</p>
                                </div>
                                <div>
                                    <span className="text-muted">Experience</span>
                                    <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.experience_level || '—'}</p>
                                </div>
                                {lead.email ? (
                                    <div>
                                        <span className="text-muted">Email</span>
                                        <p style={{ margin: '2px 0 0', fontWeight: 500, wordBreak: 'break-all', fontSize: '12px' }}>{lead.email}</p>
                                    </div>
                                ) : null}
                            </div>

                            {/* Notes */}
                            {lead.notes ? (
                                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>📝 {lead.notes}</p>
                            ) : null}

                            {/* Contact */}
                            {phone ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a href={`tel:+${phone}`} className="today-lead-action-btn call-btn">📞 Call</a>
                                    <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="today-lead-action-btn wa-btn">💬 WhatsApp</a>
                                </div>
                            ) : null}

                            {/* Actions */}
                            {lead.status !== 'onboarded' && lead.status !== 'rejected' ? (
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {/* If approved, show "Convert to Teacher" instead of next step */}
                                    {lead.status === 'approved' ? (
                                        <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                                            onClick={() => setShowConvertModal(lead)}>
                                            🚀 Convert to Teacher
                                        </button>
                                    ) : nextStatus ? (
                                        <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                                            onClick={() => handleStatusChange(lead.id, nextStatus)}>
                                            {getNextLabel(nextStatus)}
                                        </button>
                                    ) : null}
                                    <button className="small danger" style={{ fontSize: '12px' }}
                                        onClick={() => handleReject(lead.id)}>
                                        ✕ Reject
                                    </button>
                                </div>
                            ) : null}

                            {/* Converted badge */}
                            {lead.status === 'onboarded' && lead.converted_teacher_id ? (
                                <p style={{ margin: 0, fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
                                    ✅ Converted to teacher
                                </p>
                            ) : null}

                            {/* Footer */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <span className="text-muted" style={{ fontSize: '12px' }}>
                                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' }) : ''}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Teacher Lead Modal */}
            {showAddModal ? <AddTeacherLeadModal onClose={() => setShowAddModal(false)} onDone={() => { setShowAddModal(false); loadLeads(); }} /> : null}

            {/* Convert to Teacher Modal */}
            {showConvertModal ? <ConvertToTeacherModal lead={showConvertModal} onClose={() => setShowConvertModal(null)} onDone={() => { setShowConvertModal(null); loadLeads(); }} /> : null}
        </section>
    );
}


/* ─── Add Teacher Lead Modal ─── */
function AddTeacherLeadModal({ onClose, onDone }) {
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', subject: '', experience_level: 'fresher', qualification: '', notes: '' });
    const [err, setErr] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setErr('');
        try {
            await apiFetch('/teacher-leads', { method: 'POST', body: JSON.stringify(form) });
            onDone();
        } catch (e) { setErr(e.message); }
    }

    function upd(key, val) { setForm(f => ({ ...f, [key]: val })); }

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '500px' }}>
                <h3>Add Teacher Lead</h3>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <label>Full Name *<input value={form.full_name} onChange={e => upd('full_name', e.target.value)} required /></label>
                    <label>Email<input type="email" value={form.email} onChange={e => upd('email', e.target.value)} /></label>
                    <label>Phone<input value={form.phone} onChange={e => upd('phone', e.target.value)} /></label>
                    <label>Subject<input value={form.subject} onChange={e => upd('subject', e.target.value)} placeholder="e.g. Mathematics" /></label>
                    <label>Experience
                        <select value={form.experience_level} onChange={e => upd('experience_level', e.target.value)}>
                            <option value="fresher">Fresher</option>
                            <option value="1-2 years">1-2 Years</option>
                            <option value="3-5 years">3-5 Years</option>
                            <option value="5+ years">5+ Years</option>
                        </select>
                    </label>
                    <label>Qualification<input value={form.qualification} onChange={e => upd('qualification', e.target.value)} placeholder="e.g. B.Ed, M.Sc" /></label>
                    <label>Notes<textarea value={form.notes} onChange={e => upd('notes', e.target.value)} rows={2} /></label>
                    {err ? <p className="error">{err}</p> : null}
                    <div className="actions">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit">Add Lead</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/* ─── Convert to Teacher Modal ─── */
function ConvertToTeacherModal({ lead, onClose, onDone }) {
    const [userId, setUserId] = useState('');
    const [rate, setRate] = useState('');
    const [err, setErr] = useState('');

    async function handleConvert(e) {
        e.preventDefault();
        setErr('');
        if (!userId.trim()) { setErr('User ID is required to create teacher account.'); return; }
        try {
            await apiFetch(`/teacher-leads/${lead.id}/convert`, {
                method: 'POST',
                body: JSON.stringify({ user_id: userId.trim(), per_hour_rate: rate ? Number(rate) : null })
            });
            onDone();
        } catch (e) { setErr(e.message); }
    }

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '450px' }}>
                <h3>Convert to Teacher</h3>
                <p className="text-muted" style={{ margin: '0 0 12px', fontSize: '13px' }}>
                    Converting <strong>{lead.full_name}</strong> ({lead.subject || 'General'}) to a teacher in the pool.
                </p>
                <form className="form-grid" onSubmit={handleConvert}>
                    <label>
                        Auth User ID *
                        <input value={userId} onChange={e => setUserId(e.target.value)} required placeholder="Supabase auth user UUID" />
                    </label>
                    <label>
                        Per Hour Rate
                        <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="Optional" />
                    </label>
                    {err ? <p className="error">{err}</p> : null}
                    <div className="actions">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit">🚀 Convert & Onboard</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/* ═══════ Teacher Pool Page (TC view) ═══════ */
export function TCTeacherPoolPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const d = await apiFetch('/teachers/pool');
                setTeachers(d.items || []);
            } catch (e) { setError(e.message); }
            setLoading(false);
        })();
    }, []);

    if (loading) return <section className="panel"><p>Loading teacher pool...</p></section>;

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Teacher Pool ({teachers.length})</h2>
            {error ? <p className="error">{error}</p> : null}

            {!teachers.length ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px' }}>👩‍🏫</p>
                    <p style={{ fontWeight: 500 }}>No teachers in pool yet. Convert leads to add teachers.</p>
                </div>
            ) : null}

            <div className="today-leads-grid">
                {teachers.map(t => (
                    <div key={t.id} className="card today-lead-card" style={{
                        padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                        borderLeft: '4px solid #10b981',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{t.users?.full_name || 'Unknown'}</h3>
                                <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '12px' }}>{t.teacher_code}</p>
                            </div>
                            <span style={{
                                padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                                background: '#dcfce7', color: '#15803d'
                            }}>Active</span>
                        </div>
                        <div className="today-lead-details">
                            <div>
                                <span className="text-muted">Email</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500, fontSize: '12px', wordBreak: 'break-all' }}>{t.users?.email || '—'}</p>
                            </div>
                            <div>
                                <span className="text-muted">Experience</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{t.experience_level || '—'}</p>
                            </div>
                            <div>
                                <span className="text-muted">Rate/hr</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{t.per_hour_rate ? `₹${t.per_hour_rate}` : '—'}</p>
                            </div>
                        </div>
                        {t.teacher_availability?.length ? (
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                📅 {t.teacher_availability.length} availability slots
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </section>
    );
}


/* ═══════ Teacher Performance Page ═══════ */
export function TeacherPerformancePage() {
    const [teachers, setTeachers] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [p] = await Promise.all([
                    apiFetch('/teachers/pool'),
                ]);
                setTeachers(p.items || []);
                // Try fetching session data if available
                try {
                    const s = await apiFetch('/students/sessions/history');
                    setSessions(s.items || []);
                } catch (e) { }
            } catch (e) { }
            setLoading(false);
        })();
    }, []);

    // Group sessions by teacher
    const teacherStats = useMemo(() => {
        const map = {};
        teachers.forEach(t => {
            map[t.user_id] = {
                name: t.users?.full_name || 'Unknown',
                code: t.teacher_code,
                rate: t.per_hour_rate,
                experience: t.experience_level,
                totalSessions: 0,
                completedSessions: 0,
                pendingSessions: 0,
            };
        });
        sessions.forEach(s => {
            if (map[s.teacher_id]) {
                map[s.teacher_id].totalSessions++;
                if (s.status === 'completed' || s.status === 'verified') {
                    map[s.teacher_id].completedSessions++;
                } else {
                    map[s.teacher_id].pendingSessions++;
                }
            }
        });
        return Object.values(map).sort((a, b) => b.completedSessions - a.completedSessions);
    }, [teachers, sessions]);

    if (loading) return <section className="panel"><p>Loading performance data...</p></section>;

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Teacher Performance</h2>

            <div className="grid-three" style={{ marginBottom: '16px' }}>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{teachers.length}</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Total Teachers</p>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{sessions.filter(s => s.status === 'completed' || s.status === 'verified').length}</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Sessions Completed</p>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>{sessions.filter(s => s.status !== 'completed' && s.status !== 'verified').length}</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Sessions Pending</p>
                </div>
            </div>

            {/* Leaderboard */}
            <article className="card" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Teacher Leaderboard</h3>
                <div className="table-wrap mobile-friendly-table">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Teacher</th>
                                <th>Code</th>
                                <th>Experience</th>
                                <th>Sessions</th>
                                <th>Completed</th>
                                <th>Rate/hr</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacherStats.map((t, idx) => (
                                <tr key={idx}>
                                    <td data-label="#">{idx + 1}</td>
                                    <td data-label="Teacher">{t.name}</td>
                                    <td data-label="Code">{t.code || '—'}</td>
                                    <td data-label="Experience">{t.experience || '—'}</td>
                                    <td data-label="Sessions">{t.totalSessions}</td>
                                    <td data-label="Completed">{t.completedSessions}</td>
                                    <td data-label="Rate/hr">{t.rate ? `₹${t.rate}` : '—'}</td>
                                </tr>
                            ))}
                            {!teacherStats.length ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No teachers yet.</td></tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
    );
}
