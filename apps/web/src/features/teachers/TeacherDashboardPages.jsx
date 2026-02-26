import { useEffect, useMemo, useState, useRef } from 'react';
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
                const [p, t, h, hist, demoRes] = await Promise.all([
                    apiFetch('/teachers/me').catch(() => ({ teacher: null })),
                    apiFetch('/students/sessions/today').catch(() => ({ items: [] })),
                    apiFetch('/teachers/my-hours').catch(() => ({ items: [], total_hours: 0 })),
                    apiFetch('/students/sessions/history').catch(() => ({ items: [] })),
                    apiFetch('/teachers/my-demos').catch(() => ({ items: [] }))
                ]);
                setProfile(p.teacher);
                // Merge today's demos into todaySessions
                const todayStr = new Date().toISOString().split('T')[0];
                const todayDemos = (demoRes.items || [])
                    .filter(d => d.scheduled_at && d.scheduled_at.startsWith(todayStr))
                    .map(d => ({
                        id: d.id,
                        _type: 'demo',
                        students: { student_name: d.leads?.student_name || 'Student' },
                        subject: d.leads?.subject || '',
                        started_at: d.scheduled_at,
                        status: 'demo'
                    }));
                setTodaySessions([...(t.items || []).map(s => ({ ...s, _type: 'session' })), ...todayDemos]);
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
                                background: s._type === 'demo' ? '#ffedd5' : s.status === 'completed' ? '#dcfce7' : s.status === 'scheduled' ? '#e0e7ff' : '#f3f4f6',
                                color: s._type === 'demo' ? '#ea580c' : s.status === 'completed' ? '#15803d' : s.status === 'scheduled' ? '#4338ca' : '#6b7280'
                            }}>{s._type === 'demo' ? '🎯 Demo' : s.status}</span>
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
    const [demos, setDemos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiFetch('/students/sessions/history').then(d => d.items || []).catch(() => []),
            apiFetch('/teachers/my-demos').then(d => d.items || []).catch(() => [])
        ]).then(([s, d]) => {
            setSessions(s);
            setDemos(d);
        }).finally(() => setLoading(false));
    }, []);

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Merge sessions and demos into a unified timetable grouped by day
    const timetable = useMemo(() => {
        const map = {};
        DAYS.forEach(d => { map[d] = []; });

        sessions.forEach(s => {
            if (s.session_date) {
                const day = new Date(s.session_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
                if (map[day]) map[day].push({ ...s, _type: 'session' });
            }
        });

        demos.forEach(d => {
            if (d.scheduled_at) {
                const day = new Date(d.scheduled_at).toLocaleDateString('en-US', { weekday: 'long' });
                if (map[day]) map[day].push({
                    id: d.id,
                    _type: 'demo',
                    students: { student_name: d.leads?.student_name || 'Student' },
                    subject: d.leads?.subject || '',
                    started_at: d.scheduled_at,
                    ends_at: d.ends_at,
                    status: 'demo'
                });
            }
        });

        return map;
    }, [sessions, demos]);

    if (loading) return <section className="panel"><p>Loading timetable...</p></section>;

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>My Timetable</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e0e7ff', display: 'inline-block' }} /> Session
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ffedd5', display: 'inline-block' }} /> Demo
                </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {DAYS.map(day => (
                    <article key={day} className="card" style={{ padding: '16px' }}>
                        <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#4338ca' }}>{day}</h4>
                        {timetable[day].length ? timetable[day].slice(0, 8).map(s => (
                            <div key={s.id} style={{
                                padding: '6px 8px', borderRadius: '6px', marginBottom: '6px', fontSize: '12px',
                                background: s._type === 'demo' ? '#ffedd5' : '#e0e7ff',
                                borderLeft: `3px solid ${s._type === 'demo' ? '#f97316' : '#4338ca'}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ margin: 0, fontWeight: 600 }}>{s.students?.student_name || 'Student'}</p>
                                    {s._type === 'demo' && (
                                        <span style={{
                                            fontSize: '9px', fontWeight: 700, padding: '1px 6px',
                                            borderRadius: '8px', background: '#f97316', color: 'white'
                                        }}>DEMO</span>
                                    )}
                                </div>
                                <p className="text-muted" style={{ margin: '2px 0 0' }}>
                                    {s.started_at ? new Date(s.started_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                    {s.ends_at ? ` - ${new Date(s.ends_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}` : ''}
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

    const [originalSlots, setOriginalSlots] = useState([]);
    const [saving, setSaving] = useState(false);
    const [validationModal, setValidationModal] = useState({ isOpen: false, type: 'error', message: '', conflictingSlots: [], newSlot: null, mergedSlot: null });

    const [msg, setMsg] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const TIME_OPTIONS = useMemo(() => generateTimeOptions(), []);

    async function loadProfile() {
        try {
            const d = await apiFetch('/teachers/me');
            setProfile(d.teacher);
            const sorted = (d.teacher?.teacher_availability || []).map(s => ({
                ...s,
                start_time: (s.start_time || '').slice(0, 5),
                end_time: (s.end_time || '').slice(0, 5)
            })).sort((a, b) => {
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                const da = days.indexOf(a.day_of_week);
                const db = days.indexOf(b.day_of_week);
                if (da !== db) return da - db;
                return (a.start_time || '').localeCompare(b.start_time || '');
            });
            setSlots(sorted);
            setOriginalSlots(JSON.parse(JSON.stringify(sorted)));
        } catch (e) { console.error(e); }
        setLoading(false);
    }

    useEffect(() => { loadProfile(); }, []);

    function handleAddSlots(newSlots) {
        // Validation 1: Start Time < End Time
        for (const slot of newSlots) {
            if (parseTime(slot.start_time) >= parseTime(slot.end_time)) {
                setValidationModal({ isOpen: true, type: 'error', message: `Start time (${slot.start_time}) must be earlier than end time (${slot.end_time}).` });
                return;
            }
        }

        // Validation 2: Overlap Check
        const conflicting = [];
        for (const newSlot of newSlots) {
            const overlaps = checkOverlap(newSlot, slots);
            if (overlaps.length > 0) {
                conflicting.push({ newSlot, overlaps });
            }
        }

        if (conflicting.length > 0) {
            // Handle first conflict for now (simplified UX)
            const { newSlot, overlaps } = conflicting[0];
            const merged = mergeSlots(newSlot, overlaps);
            setValidationModal({
                isOpen: true,
                type: 'merge',
                message: `The new slot (${newSlot.start_time} - ${newSlot.end_time}) overlaps with existing slots.`,
                conflictingSlots: overlaps,
                newSlot,
                mergedSlot: merged
            });
            return;
        }

        const combined = [...slots, ...newSlots];
        const sorted = combined.sort((a, b) => {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const da = days.indexOf(a.day_of_week);
            const db = days.indexOf(b.day_of_week);
            if (da !== db) return da - db;
            return (a.start_time || '').localeCompare(b.start_time || '');
        });
        setSlots(sorted);
        saveAvailability(sorted);
    }

    function confirmMerge() {
        const { mergedSlot, conflictingSlots } = validationModal;
        // Remove conflicting slots from current slots
        const cleanSlots = slots.filter(s => !conflictingSlots.some(c => c.day_of_week === s.day_of_week && c.start_time === s.start_time && c.end_time === s.end_time));
        // Add merged slot
        const combined = [...cleanSlots, mergedSlot];
        const sorted = combined.sort((a, b) => {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const da = days.indexOf(a.day_of_week);
            const db = days.indexOf(b.day_of_week);
            if (da !== db) return da - db;
            return (a.start_time || '').localeCompare(b.start_time || '');
        });
        setSlots(sorted);
        saveAvailability(sorted);
        setValidationModal({ isOpen: false, type: 'error', message: '', conflictingSlots: [], newSlot: null });
    }

    function removeSlot(idx) {
        setSlots(prev => prev.filter((_, i) => i !== idx));
    }

    function updateSlot(idx, key, val) {
        setSlots(prev => prev.map((s, i) => i === idx ? { ...s, [key]: val } : s));
    }

    async function saveAvailability(slotsToSave = null) {
        setSaving(true);
        setMsg('');
        const slotsToCheck = slotsToSave || slots;

        // Validation: Start Time < End Time
        for (const slot of slotsToCheck) {
            if (parseTime(slot.start_time) >= parseTime(slot.end_time)) {
                setValidationModal({ isOpen: true, type: 'error', message: `Start time (${slot.start_time}) must be earlier than end time (${slot.end_time}) for ${slot.day_of_week}.` });
                setSaving(false);
                return;
            }
        }

        try {
            await apiFetch('/teachers/availability', {
                method: 'PUT',
                body: JSON.stringify({ slots: slotsToCheck })
            });
            setMsg('Availability saved!');
            /* If we saved specific slots (auto-save), likely we want to update original state to match new reality.
               If manual save, we definitely update original state. */
            if (slotsToSave) {
                setOriginalSlots(JSON.parse(JSON.stringify(slotsToSave)));
            } else {
                await loadProfile();
            }
        } catch (e) { setMsg('Error: ' + e.message); }
        setSaving(false);
    }

    /* ════ Helper Functions ════ */
    function parseTime(t) {
        if (!t) return 0;
        const [time, period] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + m;
    }

    function formatTime(m) {
        let h = Math.floor(m / 60);
        const min = m % 60;
        const period = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
    }

    function checkOverlap(newSlot, existingSlots) {
        return existingSlots.filter(s => {
            if (s.day_of_week !== newSlot.day_of_week) return false;
            const start1 = parseTime(newSlot.start_time);
            const end1 = parseTime(newSlot.end_time);
            const start2 = parseTime(s.start_time);
            const end2 = parseTime(s.end_time);
            return Math.max(start1, start2) < Math.min(end1, end2); // Overlap condition
        });
    }

    function mergeSlots(newSlot, overlappingSlots) {
        let minStart = parseTime(newSlot.start_time);
        let maxEnd = parseTime(newSlot.end_time);

        overlappingSlots.forEach(s => {
            minStart = Math.min(minStart, parseTime(s.start_time));
            maxEnd = Math.max(maxEnd, parseTime(s.end_time));
        });

        return {
            ...newSlot,
            start_time: formatTime(minStart),
            end_time: formatTime(maxEnd)
        };
    }

    const ValidationModal = ({ isOpen, type, message, onClose, onMerge }) => {
        if (!isOpen) return null;
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: type === 'error' ? '#dc2626' : '#2563eb' }}>
                        {type === 'error' ? 'Cannot Save Slot' : 'Merge Slots?'}
                    </h3>
                    <p style={{ margin: '0 0 20px', color: '#4b5563', lineHeight: '1.5' }}>{message}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button onClick={onClose} style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                            {type === 'merge' ? 'Cancel' : 'Close'}
                        </button>
                        {type === 'merge' && (
                            <button onClick={onMerge} style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                                Merge & Save
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const ReadOnlyField = ({ label, value, full }) => (
        <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>{label}</span>
            <div style={{
                padding: '8px 12px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#111827',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '4px'
            }}>
                {value || <span style={{ color: '#9ca3af' }}>—</span>}
            </div>
        </div>
    );

    const Badge = ({ children, color }) => (
        <span style={{
            background: color ? `${color}15` : '#e5e7eb',
            color: color || '#374151',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500
        }}>{children}</span>
    );

    function parseSubjects(s) {
        if (Array.isArray(s)) return s;
        if (typeof s === 'string') { try { const p = JSON.parse(s); return Array.isArray(p) ? p : []; } catch { return s ? [s] : []; } }
        return [];
    }

    if (loading) return <section className="panel"><p>Loading profile...</p></section>;

    const subjects = parseSubjects(profile?.subjects_taught);
    const syllabus = parseSubjects(profile?.syllabus);
    const languages = parseSubjects(profile?.languages);

    const gridRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' };

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>My Profile</h2>

            {/* Tabs Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0' }}>
                {['Personal', 'Professional', 'Bank', 'Slots'].map(tab => {
                    const key = tab.toLowerCase();
                    const isActive = activeTab === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                background: 'transparent',
                                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                                color: isActive ? '#2563eb' : '#6b7280',
                                fontWeight: isActive ? 600 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '14px'
                            }}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Profile Details */}
            {activeTab === 'personal' && (
                <article className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Personal Information</h3>
                        <div style={{ fontWeight: 600, color: profile?.is_in_pool ? '#15803d' : '#dc2626', fontSize: '14px', padding: '4px 12px', background: profile?.is_in_pool ? '#dcfce7' : '#fee2e2', borderRadius: '20px' }}>
                            {profile?.is_in_pool ? '✅ Active Pool Member' : '❌ Inactive'}
                        </div>
                    </div>

                    <div style={gridRow}>
                        <ReadOnlyField label="Full Name" value={profile?.users?.full_name} />
                        <ReadOnlyField label="Teacher Code" value={profile?.teacher_code} />
                        <ReadOnlyField label="Email" value={profile?.users?.email} />
                        <ReadOnlyField label="Phone" value={profile?.phone} />
                    </div>
                    <div style={gridRow}>
                        <ReadOnlyField label="Gender" value={profile?.gender} />
                        <ReadOnlyField label="Date of Birth" value={profile?.dob} />
                    </div>
                    <div style={gridRow}>
                        <ReadOnlyField label="Address" value={profile?.address} />
                        <ReadOnlyField label="Pincode" value={profile?.pincode} />
                        <ReadOnlyField label="City" value={profile?.city} />
                        <ReadOnlyField label="Place/Area" value={profile?.place} />
                    </div>
                </article>
            )}

            {activeTab === 'professional' && (
                <article className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '18px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>Professional Details</h3>
                    <div style={gridRow}>
                        <ReadOnlyField label="Qualification" value={profile?.qualification} />
                        <ReadOnlyField label="Experience" value={profile?.experience_level} />
                        <ReadOnlyField label="Exp. Duration" value={profile?.experience_duration} />
                        <ReadOnlyField label="Rate per Hour" value={profile?.per_hour_rate ? `₹${profile.per_hour_rate}/hr` : null} />
                    </div>


                    <div style={gridRow}>
                        <ReadOnlyField label="Subjects" value={subjects.length ? subjects.map((s, i) => <Badge key={i} color="#3b82f6">{s}</Badge>) : null} full />
                        <ReadOnlyField label="Syllabus" value={syllabus.length ? syllabus.map((m, i) => <Badge key={i} color="#15803d">{m}</Badge>) : null} full />
                        <ReadOnlyField label="Languages" value={languages.length ? languages.map((b, i) => <Badge key={i} color="#8b5cf6">{b}</Badge>) : null} full />
                    </div>
                </article>
            )}

            {activeTab === 'bank' && (
                <article className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '18px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>Bank Information</h3>
                    <div style={gridRow}>
                        <ReadOnlyField label="Account Holder" value={profile?.account_holder_name} />
                        <ReadOnlyField label="Account Number" value={profile?.account_number} />
                        <ReadOnlyField label="IFSC Code" value={profile?.ifsc_code} />
                    </div>
                    <div style={gridRow}>
                        <ReadOnlyField label="UPI ID" value={profile?.upi_id} />
                        <ReadOnlyField label="GPay Name" value={profile?.gpay_holder_name} />
                        <ReadOnlyField label="GPay Number" value={profile?.gpay_number} />
                    </div>
                </article>
            )}

            {/* Preferred Time / Availability */}
            {activeTab === 'slots' && (
                <article className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Preferred Teaching Times</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {msg && <span style={{ fontSize: '14px', fontWeight: 500, color: msg.startsWith('Error') ? '#dc2626' : '#10b981' }}>{msg}</span>}
                            {JSON.stringify(slots) !== JSON.stringify(originalSlots) ? (
                                <button className="primary" onClick={() => saveAvailability()} disabled={saving} style={{ padding: '6px 16px', fontSize: '14px' }}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            ) : (
                                <span style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>Saved</span>
                            )}
                            <button className="small primary" onClick={() => setShowAddModal(true)}>+ Add Slot</button>
                        </div>
                    </div>

                    {slots.length === 0 ? (
                        <p className="text-muted" style={{ fontSize: '14px', fontStyle: 'italic' }}>No time slots set. Please add your available teaching times.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {DAYS.filter(d => slots.some(s => s.day_of_week === d)).map(day => (
                                <div key={day} style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#111827', fontWeight: 600, borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>{day}</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {slots.map((slot, idx) => {
                                            if (slot.day_of_week !== day) return null;
                                            return (
                                                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                                        <div style={{ flex: 1, minWidth: '105px' }}>
                                                            <CustomDropdown
                                                                value={slot.start_time}
                                                                onChange={v => updateSlot(idx, 'start_time', v)}
                                                                options={TIME_OPTIONS}
                                                                placeholder="Start"
                                                            />
                                                        </div>
                                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>-</span>
                                                        <div style={{ flex: 1, minWidth: '105px' }}>
                                                            <CustomDropdown
                                                                value={slot.end_time}
                                                                onChange={v => updateSlot(idx, 'end_time', v)}
                                                                options={TIME_OPTIONS}
                                                                placeholder="End"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button className="small danger" onClick={() => removeSlot(idx)} style={{ fontSize: '12px', background: 'transparent', color: '#ef4444', border: 'none', padding: '4px' }} title="Remove Slot">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>
            )}

            <AddAvailabilityModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddSlots}
                existingSlots={slots}
            />
            <ValidationModal
                isOpen={validationModal.isOpen}
                type={validationModal.type}
                message={validationModal.message}
                onClose={() => setValidationModal({ ...validationModal, isOpen: false })}
                onMerge={confirmMerge}
            />
        </section>
    );
}


/* ─── Custom Dropdown (Local Version) ─── */
function CustomDropdown({ value, onChange, options, placeholder }) {
    const [open, setOpen] = useState(false);
    // Use a ref to close on click outside - basic implementation without extra dependency
    const ref = useRef(null);
    const selected = options.find(o => o.value === value);

    useEffect(() => {
        function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    return (
        <div className="custom-dropdown" ref={ref} style={{ position: 'relative' }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    padding: '8px 12px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '14px', minHeight: '38px'
                }}
            >
                <span style={{ color: selected ? '#111827' : '#9ca3af' }}>{selected ? selected.label : (placeholder || 'Select...')}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            {open && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                    background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', marginTop: '4px',
                    maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                    {options.map(o => (
                        <div key={o.value}
                            onClick={() => { onChange(o.value); setOpen(false); }}
                            style={{
                                padding: '8px 12px', fontSize: '14px', cursor: 'pointer',
                                background: o.value === value ? '#eff6ff' : 'transparent',
                                color: o.value === value ? '#2563eb' : '#374151',
                                borderBottom: '1px solid #f3f4f6'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.background = o.value === value ? '#eff6ff' : 'transparent'}
                        >
                            {o.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function generateTimeOptions() {
    const options = [];
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM
    for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += 15) {
            const hh = h.toString().padStart(2, '0');
            const mm = m.toString().padStart(2, '0');
            const time24 = `${hh}:${mm}`;

            // Format 12h label
            const period = h < 12 ? 'AM' : 'PM';
            const h12 = h % 12 || 12;
            const label = `${h12}:${mm} ${period}`;

            options.push({ value: time24, label });
        }
    }
    return options;
}

function AddAvailabilityModal({ isOpen, onClose, onAdd }) {
    if (!isOpen) return null;

    const [selectedDays, setSelectedDays] = useState([]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const TIME_OPTIONS = useMemo(() => generateTimeOptions(), []);

    const toggleDay = (day) => {
        setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const handleAdd = () => {
        if (selectedDays.length === 0) return alert('Please select at least one day.');
        if (!startTime || !endTime) return alert('Please select start and end time.');
        if (startTime >= endTime) return alert('Start time must be before end time.');

        const newSlots = selectedDays.map(day => ({
            day_of_week: day,
            start_time: startTime,
            end_time: endTime
        }));
        onAdd(newSlots);
        onClose();
        setSelectedDays([]);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600 }}>Add Availability</h3>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Select Days</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {DAYS.map(day => (
                            <button key={day} onClick={() => toggleDay(day)} style={{
                                padding: '6px 12px', borderRadius: '20px', fontSize: '13px', border: '1px solid',
                                background: selectedDays.includes(day) ? '#eff6ff' : 'white',
                                borderColor: selectedDays.includes(day) ? '#2563eb' : '#d1d5db',
                                color: selectedDays.includes(day) ? '#1e40af' : '#374151',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                {day.slice(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 500, color: '#374151' }}>Start Time</label>
                        <CustomDropdown
                            value={startTime}
                            onChange={setStartTime}
                            options={TIME_OPTIONS}
                            placeholder="Start"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 500, color: '#374151' }}>End Time</label>
                        <CustomDropdown
                            value={endTime}
                            onChange={setEndTime}
                            options={TIME_OPTIONS}
                            placeholder="End"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                    <button onClick={handleAdd} className="primary" style={{ padding: '8px 20px', fontSize: '14px' }}>Add Slots</button>
                </div>
            </div>
        </div>
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
