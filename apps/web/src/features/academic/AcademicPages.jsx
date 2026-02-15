import { useEffect, useMemo, useState, useCallback } from 'react';
import { apiFetch } from '../../lib/api.js';
import { SearchSelect } from '../../components/ui/SearchSelect.jsx';


/* ═══════ AC Dashboard ═══════ */
export function AcademicCoordinatorDashboardPage() {
  const [s, setS] = useState({ students: 0, today: 0, queue: 0, topups: 0 });
  const [weekSessions, setWeekSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [a, b, c, d, w] = await Promise.all([
          apiFetch('/students'),
          apiFetch('/students/sessions/today'),
          apiFetch('/sessions/verification-queue'),
          apiFetch('/students/topup-requests?status=pending_finance'),
          apiFetch('/students/sessions/week?offset=0')
        ]);
        setS({ students: (a.items || []).length, today: (b.items || []).length, queue: (c.items || []).length, topups: (d.items || []).length });
        setWeekSessions(w.items || []);
      } catch (e) { setError(e.message); }
    })();
  }, []);

  /* Prepare Chart Data */
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDate = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(todayDate); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const sessionsPerDay = last7Days.map(date => ({
    date,
    day: dayNames[new Date(date).getDay()],
    count: weekSessions.filter(sess => sess.session_date === date).length
  }));
  const maxSess = Math.max(...sessionsPerDay.map(d => d.count), 1);

  const teacherStats = useMemo(() => {
    const map = {};
    weekSessions.forEach(sess => {
      const tid = sess.teacher_id;
      const name = sess.users?.full_name || tid;
      if (!map[tid]) map[tid] = { name, hours: 0 };
      map[tid].hours += Number(sess.duration_hours) || 0;
    });
    return Object.values(map).sort((a, b) => b.hours - a.hours).slice(0, 5);
  }, [weekSessions]);
  const maxHours = Math.max(...teacherStats.map(t => t.hours), 1);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <div className="grid-four">
        <article className="card stat-card"><p className="eyebrow">Students</p><h3>{s.students}</h3></article>
        <article className="card stat-card"><p className="eyebrow">Today</p><h3>{s.today}</h3></article>
        <article className="card stat-card"><p className="eyebrow">Queue</p><h3>{s.queue}</h3></article>
        <article className="card stat-card success"><p className="eyebrow">Top-Ups</p><h3>{s.topups}</h3></article>
      </div>

      <div className="grid-two">
        <article className="card">
          <h3>Sessions Last 7 Days</h3>
          <div className="chart-container">
            {sessionsPerDay.map((d, i) => (
              <div key={i} className="chart-bar-group">
                <div className="chart-bar" style={{ height: `${(d.count / maxSess) * 100}%` }}>
                  <div className="chart-val-tooltip">{d.count}</div>
                </div>
                <span className="chart-label">{d.day}</span>
              </div>
            ))}
            <div className="chart-grid-line" style={{ bottom: '25%' }}></div>
            <div className="chart-grid-line" style={{ bottom: '50%' }}></div>
            <div className="chart-grid-line" style={{ bottom: '75%' }}></div>
          </div>
        </article>

        <article className="card">
          <h3>Top Teachers (This Week)</h3>
          {!teacherStats.length ? <p className="muted" style={{ marginTop: 20 }}>No data yet.</p> :
            <div className="top-teachers-list">
              {teacherStats.map((t, i) => (
                <div key={i} className="teacher-stat-row">
                  <div className="teacher-stat-info" title={t.name}>{t.name}</div>
                  <div className="teacher-stat-bar-bg">
                    <div className="teacher-stat-bar" style={{ width: `${(t.hours / maxHours) * 100}%` }}></div>
                  </div>
                  <div className="teacher-stat-val">{t.hours}h</div>
                </div>
              ))}
            </div>
          }
        </article>
      </div>
    </section>
  );
}

/* ═══════ Student Detail (inline) ═══════ */
function StudentDetailPage({ studentId, onBack }) {
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('profile');
  const [aTeacher, setATeacher] = useState('');
  const [aSubject, setASubject] = useState('');
  const [aNote, setANote] = useState('');
  const [msgText, setMsgText] = useState('');

  const load = useCallback(async () => {
    try {
      const d = await apiFetch(`/students/${studentId}`);
      setStudent(d.student); setAssignments(d.assignments || []); setSessions(d.sessions || []); setMessages(d.messages || []);
      const p = await apiFetch('/teachers/pool'); setTeachers(p.items || []);
    } catch (e) { setError(e.message); }
  }, [studentId]);
  useEffect(() => { load(); }, [load]);

  async function assignTeacher(e) {
    e.preventDefault();
    try { await apiFetch(`/students/${studentId}/assignments`, { method: 'POST', body: JSON.stringify({ teacher_id: aTeacher, subject: aSubject, schedule_note: aNote }) }); setATeacher(''); setASubject(''); setANote(''); await load(); } catch (e) { setError(e.message); }
  }
  async function removeAssignment(id) { try { await apiFetch(`/students/${studentId}/assignments/${id}`, { method: 'DELETE' }); await load(); } catch (e) { setError(e.message); } }
  async function sendMessage(e) {
    e.preventDefault(); if (!msgText.trim()) return;
    try { await apiFetch(`/students/${studentId}/messages/send-reminder`, { method: 'POST', body: JSON.stringify({ message: msgText, type: 'general' }) }); setMsgText(''); await load(); } catch (e) { setError(e.message); }
  }

  if (!student) return <section className="panel">{error ? <p className="error">{error}</p> : <p>Loading...</p>}</section>;
  const tabs = [{ id: 'profile', label: 'Profile' }, { id: 'teachers', label: `Teachers (${assignments.length})` }, { id: 'sessions', label: `Sessions (${sessions.length})` }, { id: 'chat', label: `Messages (${messages.length})` }];

  return (
    <section className="panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button type="button" className="secondary" onClick={onBack}>← Back</button>
        <h2 style={{ margin: 0 }}>{student.student_name}</h2>
        <span className={`status-tag ${student.status === 'active' ? 'success' : ''}`}>{student.status}</span>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <div className="tabs-row">{tabs.map(t => <button key={t.id} type="button" className={tab === t.id ? 'tab-btn active' : 'tab-btn'} onClick={() => setTab(t.id)}>{t.label}</button>)}</div>

      {tab === 'profile' ? <div className="grid-two">
        <article className="card"><h3>Info</h3><div className="detail-grid">
          <div><span className="eyebrow">Code</span><p><strong>{student.student_code || '—'}</strong></p></div>
          <div><span className="eyebrow">Class</span><p>{student.class_level || '—'}</p></div>
          <div><span className="eyebrow">Parent</span><p>{student.parent_name || '—'}</p></div>
          <div><span className="eyebrow">Student No.</span><p>{student.contact_number || '—'}</p></div>
          <div><span className="eyebrow">Parent No.</span><p>{student.parent_number || '—'}</p></div>
          <div><span className="eyebrow">Package</span><p>{student.package_name || '—'}</p></div>
          <div><span className="eyebrow">Notification</span><p>{student.notification_pref || 'WhatsApp'}</p></div>
          <div><span className="eyebrow">Joined</span><p>{student.joined_at ? new Date(student.joined_at).toLocaleDateString('en-IN') : '—'}</p></div>
        </div></article>
        <article className="card"><h3>Hours</h3><div className="grid-two" style={{ gap: 12 }}>
          <div className="stat-card card" style={{ textAlign: 'center' }}><p className="eyebrow">Total</p><h3>{student.total_hours}</h3></div>
          <div className={`stat-card card ${Number(student.remaining_hours) <= 5 ? 'danger' : 'success'}`} style={{ textAlign: 'center' }}><p className="eyebrow">Left</p><h3>{student.remaining_hours}</h3></div>
        </div></article>
      </div> : null}

      {tab === 'teachers' ? <div>
        <article className="card">{assignments.length ? <div className="assignment-cards">{assignments.map(a => <div key={a.id} className="assignment-card"><div className="assignment-info"><strong>{a.users?.full_name || a.teacher_id}</strong><span className="status-tag">{a.subject}</span>{a.schedule_note ? <p className="muted">{a.schedule_note}</p> : null}</div><button type="button" className="danger small" onClick={() => removeAssignment(a.id)}>Remove</button></div>)}</div> : <p className="muted">No teachers assigned.</p>}</article>
        <article className="card"><h3>Assign Teacher</h3><form className="form-grid" onSubmit={assignTeacher}><label>Teacher<select value={aTeacher} onChange={e => setATeacher(e.target.value)} required><option value="">Select</option>{teachers.map(t => <option key={t.id} value={t.user_id}>{t.users?.full_name || t.teacher_code}</option>)}</select></label><label>Subject<input value={aSubject} onChange={e => setASubject(e.target.value)} required placeholder="e.g. Mathematics" /></label><label>Schedule Note<input value={aNote} onChange={e => setANote(e.target.value)} placeholder="e.g. Mon/Wed 4-5 PM" /></label><button type="submit">Assign</button></form></article>
      </div> : null}

      {tab === 'sessions' ? <article className="card"><div className="table-wrap mobile-friendly-table"><table><thead><tr><th>Date</th><th>Teacher</th><th>Subject</th><th>Hrs</th><th>Status</th></tr></thead><tbody>{sessions.map(s => <tr key={s.id}><td data-label="Date">{s.session_date}</td><td data-label="Teacher">{s.users?.full_name || s.teacher_id}</td><td data-label="Subject">{s.subject || '—'}</td><td data-label="Hrs">{s.duration_hours}h</td><td data-label="Status"><span className={`status-tag ${s.session_verifications?.[0]?.status === 'approved' ? 'success' : ''}`}>{s.session_verifications?.[0]?.status || 'pending'}</span></td></tr>)}{!sessions.length ? <tr><td colSpan="5">No sessions.</td></tr> : null}</tbody></table></div></article> : null}

      {tab === 'chat' ? <article className="card chat-container">
        <div className="chat-messages">{!messages.length ? <div className="chat-empty"><p>No messages yet.</p></div> : null}{messages.map(m => <div key={m.id} className={`chat-bubble ${m.direction}`}><div className="chat-bubble-content"><p>{m.content}</p><div className="chat-meta"><span className={`delivery-status ${m.delivery_status}`}>{m.delivery_status === 'delivered' ? '✓✓' : m.delivery_status === 'sent' ? '✓' : m.delivery_status === 'failed' ? '✗' : '⏳'}</span><span className="chat-time">{new Date(m.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span></div></div></div>)}</div>
        <form className="chat-compose" onSubmit={sendMessage}><input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type a message..." required /><button type="submit">Send</button></form>
      </article> : null}
    </section>
  );
}

/* ═══════ Student Onboarding Form (multi-schedule, multi-assignment) ═══════ */
function StudentOnboardingForm({ teachers, onDone }) {
  const [f, setF] = useState({ name: '', parent: '', studentNumber: '', parentNumber: '', classLevel: '', package: '', totalHours: '', notifPref: 'whatsapp' });
  const [assigns, setAssigns] = useState([{ teacherId: '', subject: '', scheduleNote: '', day: '', time: '' }]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  function updateAssign(idx, k, v) { setAssigns(prev => prev.map((a, i) => i === idx ? { ...a, [k]: v } : a)); }
  function addAssign() { setAssigns(prev => [...prev, { teacherId: '', subject: '', scheduleNote: '', day: '', time: '' }]); }
  function removeAssign(idx) { setAssigns(prev => prev.filter((_, i) => i !== idx)); }

  async function submit(e) {
    e.preventDefault(); setError(''); setMsg('');
    setMsg('Student onboarding data captured. Backend integration pending.');
    // TODO: POST /students with all fields, then POST assignments for each, then POST recurring sessions
  }

  return (
    <article className="card">
      <h3>Onboard New Student</h3>
      <form className="form-grid" onSubmit={submit}>
        <div className="onboard-row grid-4">
          <label>Student Name <input value={f.name} onChange={e => set('name', e.target.value)} required /></label>
          <label>Parent Name <input value={f.parent} onChange={e => set('parent', e.target.value)} /></label>
          <label>Student Number <input value={f.studentNumber} onChange={e => set('studentNumber', e.target.value)} placeholder="+91..." /></label>
          <label>Parent Number <input value={f.parentNumber} onChange={e => set('parentNumber', e.target.value)} placeholder="+91..." /></label>
        </div>
        <div className="onboard-row grid-4">
          <label>Class / Level <input value={f.classLevel} onChange={e => set('classLevel', e.target.value)} /></label>
          <label>Package <input value={f.package} onChange={e => set('package', e.target.value)} /></label>
          <label>Total Hours <input type="number" value={f.totalHours} onChange={e => set('totalHours', e.target.value)} /></label>
          <label>Notify On
            <select value={f.notifPref} onChange={e => set('notifPref', e.target.value)}>
              <option value="student_number">Student No.</option>
              <option value="parent_number">Parent No.</option>
              <option value="both">Both</option>
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 4px' }}>
          <h4 style={{ margin: 0 }}>Schedules & Assignments</h4>
          <button type="button" className="secondary small" onClick={addAssign}>+ Add</button>
        </div>
        {assigns.map((a, i) => (
          <div key={i} className="onboard-assign-row">
            <label>Teacher<select value={a.teacherId} onChange={e => updateAssign(i, 'teacherId', e.target.value)}><option value="">Select</option>{teachers.map(t => <option key={t.id} value={t.user_id}>{t.users?.full_name || t.teacher_code}</option>)}</select></label>
            <label>Subject <input value={a.subject} onChange={e => updateAssign(i, 'subject', e.target.value)} placeholder="e.g. Maths" /></label>
            <label>Day<select value={a.day} onChange={e => updateAssign(i, 'day', e.target.value)}><option value="">Day</option>{dayNames.map(d => <option key={d} value={d}>{d}</option>)}</select></label>
            <label>Time <input type="time" value={a.time} onChange={e => updateAssign(i, 'time', e.target.value)} /></label>
            <label>Note <input value={a.scheduleNote} onChange={e => updateAssign(i, 'scheduleNote', e.target.value)} placeholder="e.g. Mon/Wed" /></label>
            {assigns.length > 1 ? <button type="button" className="danger small" onClick={() => removeAssign(i)} style={{ alignSelf: 'end', marginBottom: 4 }}>✕</button> : null}
          </div>
        ))}
        <button type="submit" style={{ marginTop: 8 }}>Onboard Student</button>
        {msg ? <p>{msg}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </form>
    </article>
  );
}

/* ═══════ Students Hub ═══════ */
export function StudentsHubPage({ role }) {
  const [selId, setSelId] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const isAC = role === 'academic_coordinator';

  const tabs = useMemo(() => {
    const t = [{ id: 'students', label: 'Student List' }];
    if (isAC) t.push({ id: 'onboard', label: 'Onboard Student' });
    return t;
  }, [isAC]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const loadData = useCallback(async () => {
    setError('');
    try {
      const d = await apiFetch('/students'); setStudents(d.items || []);
      if (isAC && teachers.length === 0) { const tp = await apiFetch('/teachers/pool'); setTeachers(tp.items || []); }
    } catch (e) { setError(e.message); }
  }, [isAC, teachers.length]);
  useEffect(() => { loadData(); }, [loadData]);

  if (selId) return <StudentDetailPage studentId={selId} onBack={() => { setSelId(null); loadData(); }} />;

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <div className="tabs-row">{tabs.map(t => <button key={t.id} type="button" className={activeTab === t.id ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab(t.id)}>{t.label}</button>)}</div>
      <article className="card">
        {activeTab === 'students' ? <div className="table-wrap mobile-friendly-table"><table><thead><tr><th>ID</th><th>Name</th><th>Class</th><th>Status</th><th>Hours Left</th><th>Teachers</th></tr></thead><tbody>{students.map(s => <tr key={s.id} onClick={() => isAC && setSelId(s.id)} className={isAC ? 'clickable-row' : ''}><td data-label="ID">{s.student_code || '—'}</td><td data-label="Name">{s.student_name}</td><td data-label="Class">{s.class_level || '—'}</td><td data-label="Status"><span className={`status-tag ${s.status === 'active' ? 'success' : ''}`}>{s.status}</span></td><td data-label="Hours Left"><span className={Number(s.remaining_hours) <= 5 ? 'text-danger' : ''}>{s.remaining_hours}</span></td><td data-label="Teachers">{(s.student_teacher_assignments || []).filter(a => a.is_active).map(a => <span key={a.id} className="status-tag small" style={{ marginRight: 4 }}>{a.users?.full_name || '?'}·{a.subject}</span>)}{!(s.student_teacher_assignments || []).filter(a => a.is_active).length ? <span className="muted">None</span> : null}</td></tr>)}{!students.length ? <tr><td colSpan="6">No students.</td></tr> : null}</tbody></table></div> : null}
        {activeTab === 'onboard' ? <StudentOnboardingForm teachers={teachers} onDone={loadData} /> : null}
      </article>
    </section>
  );
}

/* ═══════ Today Classes ═══════ */
export function TodayClassesPage() {
  const [today, setToday] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState('');
  const [fTeacher, setFTeacher] = useState('');
  const [fStudent, setFStudent] = useState('');

  useEffect(() => { apiFetch('/students/sessions/today').then(d => { setToday(d.items || []); setFiltered(d.items || []) }).catch(e => setError(e.message)); }, []);

  useEffect(() => {
    let items = today;
    if (fTeacher) items = items.filter(s => s.teacher_id === fTeacher);
    if (fStudent) items = items.filter(s => s.student_id === fStudent);
    setFiltered(items);
  }, [today, fTeacher, fStudent]);

  const teacherOpts = useMemo(() => {
    const m = new Map(); today.forEach(s => { if (s.users?.full_name) m.set(s.teacher_id, s.users.full_name) });
    return [...m.entries()].map(([value, label]) => ({ value, label }));
  }, [today]);

  const studentOpts = useMemo(() => {
    const m = new Map(); today.forEach(s => { if (s.students?.student_name) m.set(s.student_id, s.students.student_name) });
    return [...m.entries()].map(([value, label]) => ({ value, label }));
  }, [today]);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card">
        <div className="filter-bar">
          <SearchSelect label="Teacher" value={fTeacher} onChange={setFTeacher} options={teacherOpts} placeholder="All Teachers" />
          <SearchSelect label="Student" value={fStudent} onChange={setFStudent} options={studentOpts} placeholder="All Students" />
        </div>
        <div className="table-wrap mobile-friendly-table">
          <table><thead><tr><th>Time</th><th>Student</th><th>Teacher</th><th>Subject</th><th>Hrs</th><th>Status</th></tr></thead>
            <tbody>{filtered.map(s => <tr key={s.id}>
              <td data-label="Time">{s.started_at ? new Date(s.started_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
              <td data-label="Student">{s.students?.student_name || s.student_id}</td>
              <td data-label="Teacher">{s.users?.full_name || s.teacher_id}</td>
              <td data-label="Subject">{s.subject || '—'}</td>
              <td data-label="Hrs">{s.duration_hours}h</td>
              <td data-label="Status"><span className={`status-tag ${s.status === 'completed' ? 'success' : ''}`}>{s.status}</span></td>
            </tr>)}{!filtered.length ? <tr><td colSpan="6">No classes match filters.</td></tr> : null}</tbody></table>
        </div>
      </article>
    </section>
  );
}

/* ═══════ Weekly Calendar ═══════ */
export function WeeklyCalendarPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [filterStudentId, setFilterStudentId] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  const loadWeek = useCallback(async () => {
    try {
      const d = await apiFetch(`/students/sessions/week?offset=${weekOffset}`);
      setSessions(d.items || []); setWeekStart(d.weekStart || ''); setWeekEnd(d.weekEnd || '');
    } catch (e) { setError(e.message); }
  }, [weekOffset]);
  useEffect(() => { loadWeek(); }, [loadWeek]);
  useEffect(() => { if (!students.length) apiFetch('/students').then(d => setStudents(d.items || [])); }, [students.length]);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const filtered = useMemo(() => filterStudentId ? sessions.filter(s => s.student_id === filterStudentId) : sessions, [sessions, filterStudentId]);
  const byDay = useMemo(() => { const m = {}; dayNames.forEach(d => { m[d] = []; }); for (const s of filtered) { const dt = new Date(s.session_date + 'T00:00:00'); const i = (dt.getDay() + 6) % 7; if (m[dayNames[i]]) m[dayNames[i]].push(s); } return m; }, [filtered]);
  const dayDates = useMemo(() => { if (!weekStart) return {}; const m = {}; const st = new Date(weekStart + 'T00:00:00'); dayNames.forEach((d, i) => { const dt = new Date(st); dt.setDate(st.getDate() + i); m[d] = dt.toISOString().slice(0, 10); }); return m; }, [weekStart]);
  const fmt = (iso) => iso ? new Date(iso).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card">
        <div className="calendar-controls">
          <button type="button" className="secondary" onClick={() => setWeekOffset(o => o - 1)}>← Prev</button>
          <span className="calendar-range">{weekStart} — {weekEnd}</span>
          <button type="button" className="secondary" onClick={() => setWeekOffset(o => o + 1)}>Next →</button>
          <SearchSelect label="Filter Student" value={filterStudentId} onChange={setFilterStudentId} options={students.map(s => ({ value: s.id, label: `${s.student_code} — ${s.student_name}` }))} placeholder="All Students" />
        </div>
        <div className="calendar-grid">
          {dayNames.map(day => <div key={day} className="calendar-day"><div className="calendar-day-header"><strong>{day}</strong><span className="muted">{dayDates[day] || ''}</span></div><div className="calendar-day-sessions">{byDay[day]?.length ? byDay[day].map(s => <div key={s.id} className="calendar-session-card"><div className="calendar-session-time">{fmt(s.started_at) || '—'}</div><div className="calendar-session-info"><strong>{s.students?.student_name || 'Student'}</strong><span>{s.users?.full_name || 'Teacher'}</span>{s.subject ? <span className="status-tag small">{s.subject}</span> : null}</div><span className="calendar-session-duration">{s.duration_hours}h</span></div>) : <div className="calendar-empty">No sessions</div>}</div></div>)}
        </div>
      </article>
    </section>
  );
}

/* ═══════ Sessions Verify (with Filters) ═══════ */
export function SessionsManagePage() {
  const [activeTab, setActiveTab] = useState('queue');
  const [queue, setQueue] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  // Logs filters
  const [fTeacher, setFTeacher] = useState('');
  const [fStudent, setFStudent] = useState('');
  const [fStatus, setFStatus] = useState('');
  // Queue filters
  const [qTeacher, setQTeacher] = useState('');
  const [qStudent, setQStudent] = useState('');

  const loadAll = useCallback(async () => {
    try { const [q, l] = await Promise.all([apiFetch('/sessions/verification-queue'), apiFetch('/sessions/logs')]); setQueue(q.items || []); setLogs(l.items || []); } catch (e) { setError(e.message); }
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

  async function verify(id, approved) { try { await apiFetch(`/sessions/${id}/verify`, { method: 'POST', body: JSON.stringify({ approved }) }); await loadAll(); } catch (e) { setError(e.message); } }

  const makeOpts = (list, key, nameKey) => {
    const m = new Map();
    list.forEach(i => { if (i[nameKey]) m.set(i[key], i[nameKey]); else if (i.users?.full_name && key === 'teacher_id') m.set(i.teacher_id, i.users.full_name); else if (i.students?.student_name && key === 'student_id') m.set(i.student_id, i.students.student_name); });
    return [...m.entries()].map(([value, label]) => ({ value, label }));
  };

  const logsTeacherOpts = useMemo(() => makeOpts(logs, 'teacher_id'), [logs]);
  const logsStudentOpts = useMemo(() => makeOpts(logs, 'student_id'), [logs]);
  const filteredLogs = useMemo(() => { let items = logs; if (fTeacher) items = items.filter(s => s.teacher_id === fTeacher); if (fStudent) items = items.filter(s => s.student_id === fStudent); if (fStatus) items = items.filter(s => s.verification_status === fStatus); return items; }, [logs, fTeacher, fStudent, fStatus]);

  const queueTeacherOpts = useMemo(() => makeOpts(queue, 'teacher_id'), [queue]);
  const queueStudentOpts = useMemo(() => makeOpts(queue, 'student_id'), [queue]);
  const filteredQueue = useMemo(() => { let items = queue; if (qTeacher) items = items.filter(s => s.teacher_id === qTeacher); if (qStudent) items = items.filter(s => s.student_id === qStudent); return items; }, [queue, qTeacher, qStudent]);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <div className="tabs-row">
        <button type="button" className={activeTab === 'queue' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('queue')}>Verification ({queue.length})</button>
        <button type="button" className={activeTab === 'logs' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('logs')}>Session Logs</button>
      </div>

      {activeTab === 'queue' ? <article className="card">
        <div className="filter-bar">
          <SearchSelect label="Teacher" value={qTeacher} onChange={setQTeacher} options={queueTeacherOpts} placeholder="All Teachers" />
          <SearchSelect label="Student" value={qStudent} onChange={setQStudent} options={queueStudentOpts} placeholder="All Students" />
        </div>
        <div className="table-wrap mobile-friendly-table"><table><thead><tr><th>Date</th><th>Student</th><th>Teacher</th><th>Subject</th><th>Hrs</th><th>Actions</th></tr></thead><tbody>{filteredQueue.map(s => <tr key={s.id}><td data-label="Date">{s.session_date}</td><td data-label="Student">{s.students?.student_name || s.student_id}</td><td data-label="Teacher">{s.users?.full_name || s.teacher_id}</td><td data-label="Subject">{s.subject || '—'}</td><td data-label="Hrs">{s.duration_hours}h</td><td className="actions" data-label="Actions"><button type="button" onClick={() => verify(s.id, true)}>Approve</button><button type="button" className="danger" onClick={() => verify(s.id, false)}>Reject</button></td></tr>)}{!filteredQueue.length ? <tr><td colSpan="6">No pending sessions match filters.</td></tr> : null}</tbody></table></div>
      </article> : null}

      {activeTab === 'logs' ? <article className="card">
        <div className="filter-bar">
          <SearchSelect label="Teacher" value={fTeacher} onChange={setFTeacher} options={logsTeacherOpts} placeholder="All Teachers" />
          <SearchSelect label="Student" value={fStudent} onChange={setFStudent} options={logsStudentOpts} placeholder="All Students" />
          <SearchSelect label="Status" value={fStatus} onChange={setFStatus} options={[{ value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }, { value: 'pending', label: 'Pending' }]} placeholder="All Status" />
        </div>
        <div className="table-wrap mobile-friendly-table"><table><thead><tr><th>Date</th><th>Student</th><th>Teacher</th><th>Subject</th><th>Hrs</th><th>Status</th></tr></thead><tbody>{filteredLogs.map(s => <tr key={s.id}><td data-label="Date">{s.session_date}</td><td data-label="Student">{s.students?.student_name || s.student_id}</td><td data-label="Teacher">{s.users?.full_name || s.teacher_id}</td><td data-label="Subject">{s.subject || '—'}</td><td data-label="Hrs">{s.duration_hours}h</td><td data-label="Status"><span className={`status-tag ${s.verification_status === 'approved' ? 'success' : ''}`}>{s.verification_status || 'pending'}</span></td></tr>)}{!filteredLogs.length ? <tr><td colSpan="6">No sessions match filters.</td></tr> : null}</tbody></table></div>
      </article> : null}
    </section>
  );
}

/* ═══════ Top-Ups ═══════ */
export function TopUpsPage() {
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [sid, setSid] = useState('');
  const [hrs, setHrs] = useState('');
  const [amt, setAmt] = useState('');
  const [scrFile, setScrFile] = useState(null);

  const load = useCallback(async () => { try { const [s, t] = await Promise.all([apiFetch('/students'), apiFetch('/students/topup-requests?status=all')]); setStudents(s.items || []); setRequests(t.items || []); } catch (e) { setError(e.message); }; }, []);
  useEffect(() => { load(); }, [load]);

  async function submit(e) {
    e.preventDefault(); setError(''); setMsg('');
    let scrUrl = null;

    if (scrFile) {
      try {
        const formData = new FormData();
        formData.append('file', scrFile);
        const res = await apiFetch('/upload/screenshot', { method: 'POST', body: formData });
        scrUrl = res.url;
      } catch (e) {
        setError('Upload failed: ' + e.message);
        return;
      }
    }

    try {
      await apiFetch(`/students/${sid}/topup-requests`, {
        method: 'POST',
        body: JSON.stringify({ hours_added: Number(hrs), amount: Number(amt), screenshot_url: scrUrl })
      });
      setMsg('Sent to finance.'); setHrs(''); setAmt(''); setScrFile(null); await load();
    } catch (e) { setError(e.message); }
  }

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card"><h3>Create Top-Up</h3><form className="form-grid form-row" onSubmit={submit}><label>Student<select value={sid} onChange={e => setSid(e.target.value)} required><option value="">Select</option>{students.map(s => <option key={s.id} value={s.id}>{s.student_code || s.id} — {s.student_name} ({s.remaining_hours}h)</option>)}</select></label><label>Hours<input type="number" value={hrs} onChange={e => setHrs(e.target.value)} required /></label><label>Amount (₹)<input type="number" value={amt} onChange={e => setAmt(e.target.value)} required /></label><label>Screenshot (Upload)<input type="file" accept="image/*" onChange={e => setScrFile(e.target.files[0])} /></label><button type="submit">Submit</button></form>{msg ? <p>{msg}</p> : null}</article>
      <article className="card"><h3>All Requests</h3><div className="table-wrap mobile-friendly-table"><table><thead><tr><th>Student</th><th>Hrs</th><th>₹</th><th>Status</th><th>Date</th></tr></thead><tbody>{requests.map(r => <tr key={r.id}><td data-label="Student">{r.students?.student_code || r.student_id}</td><td data-label="Hrs">{r.hours_added}</td><td data-label="₹">₹{r.amount}</td><td data-label="Status"><span className={`status-tag ${r.status === 'approved' ? 'success' : ''}`}>{r.status}</span></td><td data-label="Date">{new Date(r.created_at).toLocaleDateString('en-IN')}</td></tr>)}{!requests.length ? <tr><td colSpan="5">No requests.</td></tr> : null}</tbody></table></div></article>
    </section>
  );
}

/* ═══════ Teacher Pool ═══════ */
export function TeacherPoolPage() {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [view, setView] = useState('table');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [fExp, setFExp] = useState('');
  const [fLang, setFLang] = useState('');
  const [fSubj, setFSubj] = useState('');
  const [fSyllabus, setFSyllabus] = useState('');
  const [fTime, setFTime] = useState('');
  const [selectedMapDay, setSelectedMapDay] = useState(new Date().getDay()); // Default to today

  useEffect(() => { (async () => { try { const d = await apiFetch('/teachers/pool'); setTeachers(d.items || []); } catch (e) { setError(e.message); } })(); }, []);
  useEffect(() => { function close(e) { if (!e.target.closest('.filter-panel') && !e.target.closest('.filter-toggle-btn')) setFiltersOpen(false); } if (filtersOpen) document.addEventListener('click', close); return () => document.removeEventListener('click', close); }, [filtersOpen]);

  const allLangs = useMemo(() => { const s = new Set(); teachers.forEach(t => (t.languages || []).forEach(l => s.add(l))); return [...s].sort(); }, [teachers]);
  const allSubjs = useMemo(() => { const s = new Set(); teachers.forEach(t => (t.subjects_taught || []).forEach(l => s.add(l))); return [...s].sort(); }, [teachers]);
  const allSyllabus = useMemo(() => { const s = new Set(); teachers.forEach(t => (t.syllabus || []).forEach(l => s.add(l))); return [...s].sort(); }, [teachers]);

  const activeFilterCount = [fExp, fLang, fSubj, fSyllabus, fTime].filter(Boolean).length;

  const filtered = useMemo(() => {
    let items = teachers;
    if (fExp) items = items.filter(t => t.experience_level === fExp);
    if (fLang) items = items.filter(t => (t.languages || []).includes(fLang));
    if (fSubj) items = items.filter(t => (t.subjects_taught || []).includes(fSubj));
    if (fSyllabus) items = items.filter(t => (t.syllabus || []).includes(fSyllabus));
    if (fTime) items = items.filter(t => t.preferred_time === fTime);
    return items;
  }, [teachers, fExp, fLang, fSubj, fSyllabus, fTime]);

  function clearFilters() { setFExp(''); setFLang(''); setFSubj(''); setFSyllabus(''); setFTime(''); }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <div className="filter-toggle-wrap">
          <button type="button" className={`filter-toggle-btn ${filtersOpen ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setFiltersOpen(!filtersOpen); }}>
            🔍 Filters {activeFilterCount ? <span className="filter-badge">{activeFilterCount}</span> : null}
          </button>
          {filtersOpen ? <div className="filter-panel" onClick={e => e.stopPropagation()}>
            <div className="filter-panel-grid">
              <SearchSelect label="Experience" value={fExp} onChange={setFExp} options={[{ value: 'fresher', label: 'Fresher' }, { value: 'experienced', label: 'Experienced' }]} placeholder="Any" />
              <SearchSelect label="Language" value={fLang} onChange={setFLang} options={allLangs.map(l => ({ value: l, label: l }))} placeholder="Any" />
              <SearchSelect label="Subject" value={fSubj} onChange={setFSubj} options={allSubjs.map(l => ({ value: l, label: l }))} placeholder="Any" />
              <SearchSelect label="Syllabus" value={fSyllabus} onChange={setFSyllabus} options={allSyllabus.map(l => ({ value: l, label: l }))} placeholder="Any" />
              <SearchSelect label="Pref. Time" value={fTime} onChange={setFTime} options={[{ value: 'morning', label: 'Morning' }, { value: 'afternoon', label: 'Afternoon' }, { value: 'evening', label: 'Evening' }, { value: 'flexible', label: 'Flexible' }]} placeholder="Any" />
            </div>
            {activeFilterCount ? <button type="button" className="secondary small" onClick={clearFilters} style={{ marginTop: 12 }}>Clear All</button> : null}
          </div> : null}
        </div>
        <span className="muted" style={{ fontSize: 13 }}>{filtered.length} of {teachers.length} teachers</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button type="button" className={view === 'table' ? 'tab-btn active' : 'tab-btn'} onClick={() => setView('table')}>Table</button>
          <button type="button" className={view === 'map' ? 'tab-btn active' : 'tab-btn'} onClick={() => setView('map')}>Map</button>
        </div>
      </div>

      {view === 'table' ? <article className="card"><div className="table-wrap mobile-friendly-table"><table><thead><tr><th>Code</th><th>Name</th><th>Exp</th><th>Rate</th><th>Subjects</th><th>Languages</th><th>Syllabus</th><th>Pref. Time</th></tr></thead><tbody>{filtered.map(t => <tr key={t.id}><td data-label="Code">{t.teacher_code}</td><td data-label="Name">{t.users?.full_name || '—'}</td><td data-label="Exp">{t.experience_level || '—'}</td><td data-label="Rate">{t.per_hour_rate ? `₹${t.per_hour_rate}` : '—'}</td><td data-label="Subjects">{(t.subjects_taught || []).join(', ') || '—'}</td><td data-label="Languages">{(t.languages || []).join(', ') || '—'}</td><td data-label="Syllabus">{(t.syllabus || []).join(', ') || '—'}</td><td data-label="Pref. Time">{t.preferred_time || '—'}</td></tr>)}{!filtered.length ? <tr><td colSpan="8">No teachers match filters.</td></tr> : null}</tbody></table></div></article> : null}

      {view === 'map' ? <article className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p className="muted" style={{ fontSize: 13 }}>Availability for <strong>{dayLabels[selectedMapDay]}</strong> (Green = Available)</p>
          <div className="day-tabs">
            {dayLabels.map((d, i) => <button key={d} type="button" className={`day-tab-btn ${selectedMapDay === i ? 'active' : ''}`} onClick={() => setSelectedMapDay(i)}>{d}</button>)}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="avail-map-table"><thead><tr><th>Teacher</th>{hours.map(h => <th key={h} className="avail-map-th">{h}:00</th>)}</tr></thead>
            <tbody>{filtered.map(t => {
              const slots = (t.teacher_availability || []);
              return <tr key={t.id}><td style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: 13, textAlign: 'left', padding: '4px 8px' }}>{t.users?.full_name || t.teacher_code}<br /><span className="muted" style={{ fontWeight: 400, fontSize: 11 }}>₹{t.per_hour_rate || '?'}/hr</span></td>
                {hours.map(h => {
                  const avail = slots.some(s => s.day_of_week === selectedMapDay && parseInt(s.start_time) <= h && parseInt(s.end_time) > h);
                  return <td key={h} className={avail ? 'avail-cell avail-yes' : 'avail-cell'}></td>;
                })}
              </tr>;
            })}</tbody>
          </table>
        </div>
      </article> : null}
    </section>
  );
}

/* ═══════ Automation Hub ═══════ */
export function AutomationPage() {
  const [tab, setTab] = useState('messages');
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selContact, setSelContact] = useState(null); // { id, name, role, type }
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Campaigns State
  const [cRole, setCRole] = useState('student');
  const [cClass, setCClass] = useState('');
  const [recipients, setRecipients] = useState([]); // Array of IDs
  const [cMsg, setCMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');

  // Data Loading
  const [allStudents, setAllStudents] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [s, t] = await Promise.all([apiFetch('/students'), apiFetch('/teachers/pool')]);
        setAllStudents(s.items || []);
        setAllTeachers(t.items || []);
      } catch (e) { setError(e.message); }
    })();
  }, []);

  // Prepare Contacts List (Chat)
  useEffect(() => {
    const sList = allStudents.map(s => ({ id: s.id, name: s.student_name, role: 'Student', type: 'student', avatar: s.student_name.charAt(0) }));
    const tList = allTeachers.map(t => ({ id: t.user_id, name: t.users?.full_name || t.teacher_code, role: 'Teacher', type: 'teacher', avatar: (t.users?.full_name || 'T').charAt(0) }));
    const combined = [...sList, ...tList].sort((a, b) => a.name.localeCompare(b.name));
    setContacts(combined);
  }, [allStudents, allTeachers]);

  useEffect(() => {
    if (!search) setFilteredContacts(contacts);
    else setFilteredContacts(contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, contacts]);

  // Load Chat Messages
  const loadChat = useCallback(async (contact) => {
    if (!contact) return;
    try {
      if (contact.type === 'student') {
        const d = await apiFetch(`/students/${contact.id}/messages`);
        setMessages(d.items || []);
      } else {
        setMessages([]); // TODO: Teacher chat endpoint
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { loadChat(selContact); }, [selContact, loadChat]);

  async function sendChat(e) {
    e.preventDefault();
    if (!msgText.trim() || !selContact) return;
    try {
      if (selContact.type === 'student') {
        await apiFetch(`/students/${selContact.id}/messages/send-reminder`, { method: 'POST', body: JSON.stringify({ message: msgText, type: 'general' }) });
        setMsgText('');
        await loadChat(selContact);
      } else {
        alert('Teacher chat not yet connected.');
      }
    } catch (e) { setError(e.message); }
  }

  // Campaigns Filtering
  const filteredRecipients = useMemo(() => {
    if (cRole === 'student') {
      return allStudents.filter(s => !cClass || s.class_level === cClass).map(s => ({ id: s.id, name: s.student_name, desc: s.class_level }));
    } else if (cRole === 'teacher') {
      return allTeachers.map(t => ({ id: t.user_id, name: t.users?.full_name || t.teacher_code, desc: t.subjects_taught?.join(', ') }));
    }
    return [];
  }, [cRole, cClass, allStudents, allTeachers]);

  // Toggle Recipient
  const toggleRecipient = (id) => {
    setRecipients(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    if (recipients.length === filteredRecipients.length) setRecipients([]);
    else setRecipients(filteredRecipients.map(r => r.id));
  };

  async function sendCampaign() {
    if (!cMsg.trim() || !recipients.length) return;
    setSending(true); setBulkStatus('Sending...');
    let success = 0;
    for (const rId of recipients) {
      try {
        if (cRole === 'student') {
          await apiFetch(`/students/${rId}/messages/send-reminder`, { method: 'POST', body: JSON.stringify({ message: cMsg, type: 'notification' }) });
          success++;
        }
      } catch (e) { console.error(e); }
    }
    setSending(false);
    setBulkStatus(`Sent to ${success} recipients.`);
    setCMsg('');
  }

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <div className="tabs-row">
        <button type="button" className={tab === 'messages' ? 'tab-btn active' : 'tab-btn'} onClick={() => setTab('messages')}>WhatsApp Chat</button>
        <button type="button" className={tab === 'campaigns' ? 'tab-btn active' : 'tab-btn'} onClick={() => setTab('campaigns')}>Campaigns</button>
        <button type="button" className={tab === 'account' ? 'tab-btn active' : 'tab-btn'} onClick={() => setTab('account')}>Account</button>
      </div>

      {tab === 'messages' ? (
        <div className="automation-grid">
          <div className="chat-sidebar">
            <div className="chat-sidebar-search">
              <input type="text" placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div className="contact-list">
              {filteredContacts.map(c => (
                <div key={c.id} className={`contact-item ${selContact?.id === c.id ? 'active' : ''}`} onClick={() => setSelContact(c)}>
                  <div className="contact-avatar">{c.avatar}</div>
                  <div className="contact-info"><h4>{c.name}</h4><p>{c.role}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-window">
            {selContact ? <>
              <div className="chat-header"><strong>{selContact.name}</strong><span className="muted">({selContact.role})</span></div>
              <div className="chat-body">
                {!messages.length ? <p className="muted" style={{ textAlign: 'center' }}>No messages found.</p> :
                  messages.map(m => (
                    <div key={m.id} className={`chat-bubble ${m.direction}`}>
                      <div className="chat-bubble-content"><p>{m.content}</p><span className="chat-time">{new Date(m.created_at).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span></div>
                    </div>
                  ))}
              </div>
              <form className="chat-footer" onSubmit={sendChat}>
                <input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type a message..." />
                <button type="submit">Send</button>
              </form>
            </> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>Select a contact to start chatting</div>}
          </div>
        </div>
      ) : null}

      {tab === 'campaigns' ? (
        <div className="automation-grid">
          <div className="campaign-sidebar">
            <div className="campaign-filter-header">
              <SearchSelect label="Role" value={cRole} onChange={setCRole} options={[{ value: 'student', label: 'Student' }, { value: 'teacher', label: 'Teacher' }]} placeholder="Select Role" />
              {cRole === 'student' ? <SearchSelect label="Class" value={cClass} onChange={setCClass} options={['10th', '11th', '12th'].map(c => ({ value: c, label: c }))} placeholder="All Classes" /> : null}
              <div style={{ padding: '4px 0', fontSize: '13px', fontWeight: 600 }}>{recipients.length} selected</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="selAll" checked={recipients.length === filteredRecipients.length && filteredRecipients.length > 0} onChange={toggleAll} />
                <label htmlFor="selAll" style={{ fontSize: '13px', cursor: 'pointer' }}>Select All</label>
              </div>
            </div>
            <div className="campaign-recipient-list">
              {filteredRecipients.map(r => (
                <div key={r.id} className="recipient-item">
                  <input type="checkbox" checked={recipients.includes(r.id)} onChange={() => toggleRecipient(r.id)} />
                  <div style={{ flex: 1, minWidth: 0, marginLeft: 8 }}><div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div><div className="muted" style={{ fontSize: '11px' }}>{r.desc}</div></div>
                </div>
              ))}
              {!filteredRecipients.length ? <div style={{ padding: 16, textAlign: 'center' }} className="muted">No recipients match filters.</div> : null}
            </div>
          </div>
          <div className="campaign-compose-window">
            <h3 style={{ margin: 0 }}>Compose Campaign</h3>
            <div className="campaign-compose-area">
              <textarea value={cMsg} onChange={e => setCMsg(e.target.value)} placeholder="Type your campaign message here..." style={{ flex: 1, padding: 16, borderRadius: 8, border: '1px solid #ddd', resize: 'none', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="muted">{cMsg.length} chars</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {bulkStatus ? <span className={(bulkStatus.includes('Sent') ? 'text-success' : '')}>{bulkStatus}</span> : null}
                <button type="button" onClick={sendCampaign} disabled={sending || !recipients.length || !cMsg.trim()} className="primary">
                  {sending ? 'Sending...' : `Send to ${recipients.length} Recipients`}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'account' ? <div className="grid-two">
        <article className="card"><h3>WhatsApp Integration</h3><div className="detail-grid"><div><span className="eyebrow">Channel</span><p>WhatsApp (n8n + Waappa)</p></div><div><span className="eyebrow">Status</span><p><span className="status-tag success">Connected</span></p></div></div></article>
        <article className="card"><h3>Settings</h3><div className="detail-grid"><div><span className="eyebrow">Auto-Remind</span><p>Manual. Set up n8n schedule for auto.</p></div></div></article>
      </div> : null}
    </section>
  );
}
