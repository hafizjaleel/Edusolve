import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

/* ═══════ Teacher Dashboard ═══════ */
export function TeacherDashboardPage() {
    const [profile, setProfile] = useState(null);
    const [todaySessions, setTodaySessions] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [hours, setHours] = useState({ items: [], total_hours: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [p, t, h, hist] = await Promise.all([
                    apiFetch('/teachers/me').catch(() => ({ teacher: null })),
                    apiFetch('/students/sessions/today').catch(() => ({ items: [] })),
                    apiFetch('/teachers/my-hours').catch(() => ({ items: [], total_hours: 0 })),
                    apiFetch('/students/sessions/history').catch(() => ({ items: [] }))
                ]);
                setProfile(p.teacher);
                setTodaySessions(t.items || []);
                setHours(h);
                setAllSessions(hist.items || []);
            } catch (e) { }
            setLoading(false);
        })();
    }, []);

    const metrics = useMemo(() => {
        const completed = allSessions.filter(s => s.status === 'completed' || s.status === 'verified').length;
        const pending = todaySessions.filter(s => s.status === 'scheduled' || s.status === 'in_progress').length;
        const rescheduled = allSessions.filter(s => s.status === 'rescheduled').length;
        const uniqueStudents = new Set(allSessions.map(s => s.student_id)).size;
        return { completed, pending, rescheduled, uniqueStudents };
    }, [todaySessions, allSessions]);

    if (loading) return <section className="panel"><p>Loading dashboard...</p></section>;

    return (
        <section className="panel">
            <div className="grid-four">
                <DashCard label="Total Hours" value={`${hours.total_hours}h`} tone="info" />
                <DashCard label="Today's Sessions" value={todaySessions.length} />
                <DashCard label="Sessions Completed" value={metrics.completed} tone="success" />
                <DashCard label="My Students" value={metrics.uniqueStudents} />
            </div>

            <div className="grid-three" style={{ marginTop: '16px' }}>
                {/* Today's Schedule */}
                <article className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Today's Sessions</h3>
                    {todaySessions.length ? todaySessions.map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '13px' }}>{s.students?.student_name || 'Student'}</p>
                                <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '11px' }}>
                                    {s.started_at ? new Date(s.started_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                    {s.subject ? ` · ${s.subject}` : ''}
                                </p>
                            </div>
                            <span style={{
                                padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
                                background: s.status === 'completed' ? '#dcfce7' : s.status === 'scheduled' ? '#e0e7ff' : '#f3f4f6',
                                color: s.status === 'completed' ? '#15803d' : s.status === 'scheduled' ? '#4338ca' : '#6b7280'
                            }}>{s.status}</span>
                        </div>
                    )) : <p className="text-muted" style={{ fontSize: '13px' }}>No sessions today</p>}
                </article>

                {/* Hours Summary */}
                <article className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Hours Summary</h3>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#eff6ff', borderRadius: '12px', marginBottom: '12px' }}>
                        <p style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: '#1d4ed8' }}>{hours.total_hours}h</p>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#1d4ed8' }}>Total Teaching Hours</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#dcfce7', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#15803d' }}>{metrics.completed}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#15803d' }}>Completed</p>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#fef9c3', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#a16207' }}>{metrics.pending}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#a16207' }}>Pending</p>
                        </div>
                    </div>
                </article>

                {/* Profile Summary */}
                <article className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>My Profile</h3>
                    {profile ? (
                        <>
                            <p style={{ fontSize: '13px' }}><strong>Code:</strong> {profile.teacher_code || '—'}</p>
                            <p style={{ fontSize: '13px' }}><strong>Name:</strong> {profile.users?.full_name || '—'}</p>
                            <p style={{ fontSize: '13px' }}><strong>Experience:</strong> {profile.experience_level || '—'}</p>
                            <p style={{ fontSize: '13px' }}><strong>Rate:</strong> {profile.per_hour_rate ? `₹${profile.per_hour_rate}/hr` : '—'}</p>
                            <p style={{ fontSize: '13px' }}><strong>Availability Slots:</strong> {(profile.teacher_availability || []).length}</p>
                        </>
                    ) : <p className="text-muted" style={{ fontSize: '13px' }}>Profile not found</p>}
                </article>
            </div>
        </section>
    );
}

function DashCard({ label, value, tone }) {
    const bg = tone === 'success' ? '#dcfce7' : tone === 'danger' ? '#fee2e2' : tone === 'info' ? '#e0e7ff' : '#f3f4f6';
    const color = tone === 'success' ? '#15803d' : tone === 'danger' ? '#dc2626' : tone === 'info' ? '#4338ca' : '#111';
    return (
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color }}>{value}</p>
            <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>{label}</p>
        </div>
    );
}


/* ═══════ Today Sessions (with Approval / Reschedule) ═══════ */
export function TeacherTodaySessionsPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rescheduleSession, setRescheduleSession] = useState(null);

    async function loadSessions() {
        try {
            const d = await apiFetch('/students/sessions/today');
            setSessions(d.items || []);
        } catch (e) { setError(e.message); }
        setLoading(false);
    }

    useEffect(() => { loadSessions(); }, []);

    async function handleRequestApproval(id) {
        if (!confirm('Mark this session as completed and request approval?')) return;
        try {
            await apiFetch(`/teachers/sessions/${id}/request-approval`, { method: 'POST', body: '{}' });
            alert('Approval requested!');
            await loadSessions();
        } catch (e) { alert(e.message); }
    }

    const statusColors = {
        scheduled: '#6366f1',
        in_progress: '#f59e0b',
        completed: '#10b981',
        rescheduled: '#ef4444',
        verified: '#15803d',
        cancelled: '#6b7280'
    };

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Today's Sessions</h2>

            {loading ? <p>Loading sessions...</p> : null}
            {error ? <p className="error">{error}</p> : null}

            {!loading && !sessions.length ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px' }}>📚</p>
                    <p style={{ fontWeight: 500 }}>No sessions scheduled for today.</p>
                </div>
            ) : null}

            <div className="today-leads-grid">
                {sessions.map(s => (
                    <div key={s.id} className="card today-lead-card" style={{
                        padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                        borderLeft: `4px solid ${statusColors[s.status] || '#6b7280'}`,
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{s.students?.student_name || 'Student'}</h3>
                                <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '12px' }}>{s.students?.student_code || ''}</p>
                            </div>
                            <span style={{
                                padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                                background: `${statusColors[s.status] || '#6b7280'}18`,
                                color: statusColors[s.status] || '#6b7280', textTransform: 'capitalize'
                            }}>{s.status}</span>
                        </div>

                        {/* Details */}
                        <div className="today-lead-details">
                            <div>
                                <span className="text-muted">Time</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>
                                    {s.started_at ? new Date(s.started_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted">Subject</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{s.subject || 'General'}</p>
                            </div>
                            <div>
                                <span className="text-muted">Duration</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{s.duration_hours ? `${s.duration_hours}h` : '—'}</p>
                            </div>
                            <div>
                                <span className="text-muted">Date</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{s.session_date || '—'}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        {s.status === 'scheduled' || s.status === 'in_progress' ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                                    onClick={() => handleRequestApproval(s.id)}>
                                    ✅ Send Approval
                                </button>
                                <button className="small danger" style={{ fontSize: '12px' }}
                                    onClick={() => setRescheduleSession(s)}>
                                    🔄 Reschedule
                                </button>
                            </div>
                        ) : null}
                        {s.status === 'completed' ? (
                            <p style={{ margin: 0, fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>⏳ Waiting for approval</p>
                        ) : null}
                        {s.status === 'verified' ? (
                            <p style={{ margin: 0, fontSize: '12px', color: '#15803d', fontWeight: 600 }}>✅ Approved</p>
                        ) : null}
                    </div>
                ))}
            </div>

            {rescheduleSession ? (
                <RescheduleModal session={rescheduleSession} onClose={() => setRescheduleSession(null)} onDone={() => { setRescheduleSession(null); loadSessions(); }} />
            ) : null}
        </section>
    );
}

function RescheduleModal({ session, onClose, onDone }) {
    const [reason, setReason] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [err, setErr] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (!reason.trim()) { setErr('Reason is required'); return; }
        setErr('');
        try {
            await apiFetch(`/teachers/sessions/${session.id}/reschedule`, {
                method: 'POST',
                body: JSON.stringify({ reason, new_date: newDate || null, new_time: newTime || null })
            });
            onDone();
        } catch (e) { setErr(e.message); }
    }

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '420px' }}>
                <h3>Reschedule Session</h3>
                <p className="text-muted" style={{ margin: '0 0 12px', fontSize: '13px' }}>
                    Student: <strong>{session.students?.student_name}</strong> · {session.session_date}
                </p>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <label>Reason *<textarea value={reason} onChange={e => setReason(e.target.value)} required rows={2} placeholder="Why are you rescheduling?" /></label>
                    <label>New Date<input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} /></label>
                    <label>New Time<input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} /></label>
                    {err ? <p className="error">{err}</p> : null}
                    <div className="actions">
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit">Reschedule</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/* ═══════ My Timetable ═══════ */
export function TeacherTimetablePage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/students/sessions/history')
            .then(d => setSessions(d.items || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Group sessions by day of week
    const timetable = useMemo(() => {
        const map = {};
        DAYS.forEach(d => { map[d] = []; });
        sessions.forEach(s => {
            if (s.session_date) {
                const day = new Date(s.session_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
                if (map[day]) map[day].push(s);
            }
        });
        return map;
    }, [sessions]);

    if (loading) return <section className="panel"><p>Loading timetable...</p></section>;

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>My Timetable</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {DAYS.map(day => (
                    <article key={day} className="card" style={{ padding: '16px' }}>
                        <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#4338ca' }}>{day}</h4>
                        {timetable[day].length ? timetable[day].slice(0, 5).map(s => (
                            <div key={s.id} style={{ padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '12px' }}>
                                <p style={{ margin: 0, fontWeight: 600 }}>{s.students?.student_name || 'Student'}</p>
                                <p className="text-muted" style={{ margin: '2px 0 0' }}>
                                    {s.started_at ? new Date(s.started_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                    {s.subject ? ` · ${s.subject}` : ''}
                                </p>
                            </div>
                        )) : <p className="text-muted" style={{ fontSize: '12px' }}>No sessions</p>}
                    </article>
                ))}
            </div>
        </section>
    );
}


/* ═══════ Teacher Profile / Preferred Time ═══════ */
export function TeacherMyProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState([]);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    async function loadProfile() {
        try {
            const d = await apiFetch('/teachers/me');
            setProfile(d.teacher);
            setSlots(d.teacher?.teacher_availability || []);
        } catch (e) { }
        setLoading(false);
    }

    useEffect(() => { loadProfile(); }, []);

    function addSlot() {
        setSlots(prev => [...prev, { day_of_week: 'Monday', start_time: '09:00', end_time: '10:00' }]);
    }

    function removeSlot(idx) {
        setSlots(prev => prev.filter((_, i) => i !== idx));
    }

    function updateSlot(idx, key, val) {
        setSlots(prev => prev.map((s, i) => i === idx ? { ...s, [key]: val } : s));
    }

    async function saveAvailability() {
        setSaving(true);
        setMsg('');
        try {
            await apiFetch('/teachers/availability', {
                method: 'PUT',
                body: JSON.stringify({ slots })
            });
            setMsg('Availability saved!');
            await loadProfile();
        } catch (e) { setMsg('Error: ' + e.message); }
        setSaving(false);
    }

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (loading) return <section className="panel"><p>Loading profile...</p></section>;

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>My Profile</h2>

            {/* Profile Details */}
            <article className="card" style={{ padding: '20px', marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <span className="text-muted" style={{ fontSize: '12px' }}>Name</span>
                        <p style={{ margin: '2px 0 0', fontWeight: 600 }}>{profile?.users?.full_name || '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted" style={{ fontSize: '12px' }}>Email</span>
                        <p style={{ margin: '2px 0 0', fontWeight: 500, fontSize: '13px' }}>{profile?.users?.email || '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted" style={{ fontSize: '12px' }}>Teacher Code</span>
                        <p style={{ margin: '2px 0 0', fontWeight: 600 }}>{profile?.teacher_code || '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted" style={{ fontSize: '12px' }}>Experience</span>
                        <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{profile?.experience_level || '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted" style={{ fontSize: '12px' }}>Rate per Hour</span>
                        <p style={{ margin: '2px 0 0', fontWeight: 600 }}>{profile?.per_hour_rate ? `₹${profile.per_hour_rate}` : '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted" style={{ fontSize: '12px' }}>Pool Status</span>
                        <p style={{ margin: '2px 0 0', fontWeight: 600, color: profile?.is_in_pool ? '#15803d' : '#dc2626' }}>
                            {profile?.is_in_pool ? '✅ Active' : '❌ Inactive'}
                        </p>
                    </div>
                </div>
            </article>

            {/* Preferred Time / Availability */}
            <article className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>Preferred Teaching Times</h3>
                    <button className="small primary" onClick={addSlot}>+ Add Slot</button>
                </div>

                {slots.length === 0 ? (
                    <p className="text-muted" style={{ fontSize: '13px' }}>No time slots set. Add your available times.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {slots.map((slot, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <select value={slot.day_of_week} onChange={e => updateSlot(idx, 'day_of_week', e.target.value)} style={{ flex: '1 1 120px', padding: '6px 8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px' }}>
                                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <input type="time" value={slot.start_time} onChange={e => updateSlot(idx, 'start_time', e.target.value)} style={{ padding: '6px 8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px' }} />
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>to</span>
                                <input type="time" value={slot.end_time} onChange={e => updateSlot(idx, 'end_time', e.target.value)} style={{ padding: '6px 8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px' }} />
                                <button className="small danger" onClick={() => removeSlot(idx)} style={{ fontSize: '11px' }}>✕</button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="primary" onClick={saveAvailability} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Availability'}
                    </button>
                    {msg ? <span style={{ fontSize: '13px', color: msg.startsWith('Error') ? '#dc2626' : '#10b981' }}>{msg}</span> : null}
                </div>
            </article>
        </section>
    );
}


/* ═══════ Teacher Reports ═══════ */
export function TeacherReportsPage() {
    const [sessions, setSessions] = useState([]);
    const [hours, setHours] = useState({ items: [], total_hours: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [h, s] = await Promise.all([
                    apiFetch('/teachers/my-hours'),
                    apiFetch('/students/sessions/history')
                ]);
                setHours(h);
                setSessions(s.items || []);
            } catch (e) { }
            setLoading(false);
        })();
    }, []);

    const monthlyBreakdown = useMemo(() => {
        const map = {};
        sessions.forEach(s => {
            const d = s.session_date || '';
            const month = d.slice(0, 7); // YYYY-MM
            if (!map[month]) map[month] = { sessions: 0, hours: 0, completed: 0 };
            map[month].sessions++;
            map[month].hours += Number(s.duration_hours || 0);
            if (s.status === 'completed' || s.status === 'verified') map[month].completed++;
        });
        return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
    }, [sessions]);

    if (loading) return <section className="panel"><p>Loading reports...</p></section>;

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Reports</h2>

            <div className="grid-three" style={{ marginBottom: '16px' }}>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#1d4ed8' }}>{hours.total_hours}h</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Total Hours</p>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{sessions.length}</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Total Sessions</p>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#10b981' }}>
                        {sessions.filter(s => s.status === 'completed' || s.status === 'verified').length}
                    </p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Completed</p>
                </div>
            </div>

            {/* Monthly Breakdown */}
            <article className="card" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Monthly Breakdown</h3>
                <div className="table-wrap mobile-friendly-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Sessions</th>
                                <th>Hours</th>
                                <th>Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyBreakdown.map(([month, data]) => (
                                <tr key={month}>
                                    <td data-label="Month">{month}</td>
                                    <td data-label="Sessions">{data.sessions}</td>
                                    <td data-label="Hours">{data.hours}h</td>
                                    <td data-label="Completed">{data.completed}</td>
                                </tr>
                            ))}
                            {!monthlyBreakdown.length ? <tr><td colSpan="4" style={{ textAlign: 'center' }}>No data yet</td></tr> : null}
                        </tbody>
                    </table>
                </div>
            </article>

            {/* Session History */}
            <article className="card" style={{ padding: '20px', marginTop: '16px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Session History</h3>
                <div className="table-wrap mobile-friendly-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Student</th>
                                <th>Subject</th>
                                <th>Duration</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.slice(0, 30).map(s => (
                                <tr key={s.id}>
                                    <td data-label="Date">{s.session_date}</td>
                                    <td data-label="Student">{s.students?.student_name || '—'}</td>
                                    <td data-label="Subject">{s.subject || '—'}</td>
                                    <td data-label="Duration">{s.duration_hours ? `${s.duration_hours}h` : '—'}</td>
                                    <td data-label="Status">
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                                            background: s.status === 'completed' || s.status === 'verified' ? '#dcfce7' : '#f3f4f6',
                                            color: s.status === 'completed' || s.status === 'verified' ? '#15803d' : '#6b7280'
                                        }}>{s.status}</span>
                                    </td>
                                </tr>
                            ))}
                            {!sessions.length ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>No sessions yet</td></tr> : null}
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
    );
}


/* ═══════ Teacher Invoices ═══════ */
export function TeacherInvoicesPage() {
    const [hours, setHours] = useState({ items: [], total_hours: 0 });
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [h, p] = await Promise.all([
                    apiFetch('/teachers/my-hours'),
                    apiFetch('/teachers/me').catch(() => ({ teacher: null }))
                ]);
                setHours(h);
                setProfile(p.teacher);
            } catch (e) { }
            setLoading(false);
        })();
    }, []);

    // Group by month for invoice-style display
    const invoices = useMemo(() => {
        const map = {};
        (hours.items || []).forEach(entry => {
            const d = entry.created_at ? entry.created_at.slice(0, 7) : 'unknown';
            if (!map[d]) map[d] = { hours: 0, entries: 0 };
            map[d].hours += Number(entry.hours_delta || 0);
            map[d].entries++;
        });
        const rate = profile?.per_hour_rate || 0;
        return Object.entries(map)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([month, data]) => ({
                month,
                hours: data.hours,
                entries: data.entries,
                amount: data.hours * rate
            }));
    }, [hours.items, profile]);

    const totalEarnings = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    if (loading) return <section className="panel"><p>Loading invoices...</p></section>;

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Invoices</h2>

            <div className="grid-three" style={{ marginBottom: '16px' }}>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#1d4ed8' }}>{hours.total_hours}h</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Total Hours</p>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>₹{profile?.per_hour_rate || 0}/hr</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Hourly Rate</p>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#15803d' }}>₹{totalEarnings.toLocaleString()}</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Total Earnings</p>
                </div>
            </div>

            <article className="card" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Monthly Invoices</h3>
                <div className="table-wrap mobile-friendly-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Sessions</th>
                                <th>Hours</th>
                                <th>Rate</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.month}>
                                    <td data-label="Month">{inv.month}</td>
                                    <td data-label="Sessions">{inv.entries}</td>
                                    <td data-label="Hours">{inv.hours}h</td>
                                    <td data-label="Rate">₹{profile?.per_hour_rate || 0}</td>
                                    <td data-label="Amount" style={{ fontWeight: 600, color: '#15803d' }}>₹{inv.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                            {!invoices.length ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>No invoices yet</td></tr> : null}
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
    );
}
