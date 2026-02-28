import { useEffect, useMemo, useState, useCallback, useRef, Fragment } from 'react';
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

function SubjectSelect({ value, onChange, options, required }) {
  return (
    <select
      value={value}
      onChange={async (e) => {
        if (e.target.value === '--add-new--') {
          const newName = prompt('Enter new subject name:');
          if (newName && newName.trim()) {
            const trimmed = newName.trim();
            try {
              await apiFetch('/subjects', { method: 'POST', body: JSON.stringify({ name: trimmed }) });
              onChange(trimmed, true);
            } catch (err) {
              alert(err.message);
              onChange('', false);
            }
          } else {
            onChange('', false);
          }
        } else {
          onChange(e.target.value, false);
        }
      }}
      required={required}
    >
      <option value="">Select Subject</option>
      {options.map(s => <option key={s} value={s}>{s}</option>)}
      <option value="--add-new--">+ Add New Subject</option>
    </select>
  );
}

/* ═══════ Student Classes & Timetable Tab ═══════ */
function StudentClassesTab({ studentId, initialSessions, teachers, onClassesChanged }) {
  const [sessions, setSessions] = useState(initialSessions || []);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekSessions, setWeekSessions] = useState([]);
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [selectedSession, setSelectedSession] = useState(null);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [rescheduleStudentClasses, setRescheduleStudentClasses] = useState([]);
  const [rescheduleTeacherClasses, setRescheduleTeacherClasses] = useState([]);
  const [rescheduleTeacherDemos, setRescheduleTeacherDemos] = useState([]);
  const [rescheduleLoadingSlots, setRescheduleLoadingSlots] = useState(false);
  const [sessionEditData, setSessionEditData] = useState(null);
  const [sessionDeleteId, setSessionDeleteId] = useState(null);
  const [editStudentClasses, setEditStudentClasses] = useState([]);
  const [editTeacherClasses, setEditTeacherClasses] = useState([]);
  const [editTeacherDemos, setEditTeacherDemos] = useState([]);
  const [editLoadingSlots, setEditLoadingSlots] = useState(false);

  // Bulk Form State
  const today = new Date().toISOString().slice(0, 10);
  const [showForm, setShowForm] = useState(false);
  const [fStart, setFStart] = useState(today);
  const [fEnd, setFEnd] = useState('');
  const [fDays, setFDays] = useState([]);
  const [fTeacher, setFTeacher] = useState('');
  const [fSubject, setFSubject] = useState('');
  const [fTime, setFTime] = useState('');
  const [fEndTime, setFEndTime] = useState('');

  const [teacherAvail, setTeacherAvail] = useState(null);
  const [availLoading, setAvailLoading] = useState(false);

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const DAY_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const loadWeek = useCallback(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + weekOffset * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const st = monday.toISOString().slice(0, 10);
    const en = sunday.toISOString().slice(0, 10);
    setWeekStart(st);
    setWeekEnd(en);

    const match = sessions.filter(s => s.session_date >= st && s.session_date <= en);
    setWeekSessions(match);
  }, [weekOffset, sessions]);

  useEffect(() => { setSessions(initialSessions); }, [initialSessions]);
  useEffect(() => { loadWeek(); }, [loadWeek]);

  // Fetch student + teacher availability when reschedule date changes
  useEffect(() => {
    if (!rescheduleData?.date || !studentId) return;
    setRescheduleLoadingSlots(true);
    const fetchStudents = apiFetch(`/students/${studentId}/availability?start_date=${rescheduleData.date}&end_date=${rescheduleData.date}`)
      .then(res => setRescheduleStudentClasses(res.classes || []))
      .catch(() => setRescheduleStudentClasses([]));
    const fetchTeacher = rescheduleData.teacher_id
      ? apiFetch(`/teachers/${rescheduleData.teacher_id}/availability?start_date=${rescheduleData.date}&end_date=${rescheduleData.date}`)
        .then(res => { setRescheduleTeacherClasses(res.classes || []); setRescheduleTeacherDemos(res.demos || []); })
        .catch(() => { setRescheduleTeacherClasses([]); setRescheduleTeacherDemos([]); })
      : Promise.resolve();
    Promise.all([fetchStudents, fetchTeacher]).finally(() => setRescheduleLoadingSlots(false));
  }, [rescheduleData?.date, studentId, rescheduleData?.teacher_id]);

  // Fetch availability for edit modal when date or teacher changes
  useEffect(() => {
    if (!sessionEditData?.date) return;
    setEditLoadingSlots(true);
    const fetchStudent = apiFetch(`/students/${studentId}/availability?start_date=${sessionEditData.date}&end_date=${sessionEditData.date}`)
      .then(res => setEditStudentClasses(res.classes || []))
      .catch(() => setEditStudentClasses([]));
    const fetchTeacher = sessionEditData.teacher_id
      ? apiFetch(`/teachers/${sessionEditData.teacher_id}/availability?start_date=${sessionEditData.date}&end_date=${sessionEditData.date}`)
        .then(res => { setEditTeacherClasses(res.classes || []); setEditTeacherDemos(res.demos || []); })
        .catch(() => { setEditTeacherClasses([]); setEditTeacherDemos([]); })
      : Promise.resolve();
    Promise.all([fetchStudent, fetchTeacher]).finally(() => setEditLoadingSlots(false));
  }, [sessionEditData?.date, sessionEditData?.teacher_id, studentId]);

  useEffect(() => {
    if (!fTeacher || !fStart || !fEnd || fStart > fEnd) {
      setTeacherAvail(null);
      return;
    }
    setAvailLoading(true);
    apiFetch(`/teachers/${fTeacher}/availability?start_date=${fStart}&end_date=${fEnd}`)
      .then(d => { setTeacherAvail(d); setFTime(''); })
      .catch(e => setError(e.message))
      .finally(() => setAvailLoading(false));
  }, [fTeacher, fStart, fEnd]);

  const { validStarts, validEnds } = useMemo(() => {
    if (!teacherAvail || !fDays.length) return { validStarts: [], validEnds: [] };

    const times = [];
    for (let h = 6; h <= 22; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 22 && m > 0) break;
        times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }

    const targetDates = [];
    const startObj = new Date(fStart + 'T00:00:00Z');
    const endObj = new Date(fEnd + 'T00:00:00Z');

    for (let d = new Date(startObj); d <= endObj; d.setDate(d.getDate() + 1)) {
      if (fDays.includes(DAY_MAP[d.getUTCDay()])) {
        targetDates.push({ dateStr: d.toISOString().split('T')[0], dayName: DAY_MAP[d.getUTCDay()] });
      }
    }

    if (!targetDates.length) return { validStarts: [], validEnds: [] };

    function checkSlot(start, end) {
      if (start >= end) return false;
      return targetDates.every(td => {
        // Removed preferred slot tracking at user request. All time slots are valid natively unless there is a class/demo clash.

        const classClash = teacherAvail.classes.some(c => {
          if (c.session_date !== td.dateStr || !c.started_at) return false;
          const cStart = c.started_at.slice(0, 5);
          const [ch, cm] = cStart.split(':').map(Number);
          const cDur = Number(c.duration_hours || 0);
          const ceH = ch + Math.floor(cDur) + Math.floor((cm + (cDur % 1) * 60) / 60);
          const ceM = (cm + (cDur % 1) * 60) % 60;
          const cEnd = `${String(ceH).padStart(2, '0')}:${String(ceM).padStart(2, '0')}`;
          return (start < cEnd && end > cStart);
        });
        if (classClash) return false;

        const demoClash = teacherAvail.demos.some(d => {
          const dDate = d.scheduled_at.split('T')[0];
          if (dDate !== td.dateStr) return false;
          const dStart = new Date(d.scheduled_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
          const dEnd = d.ends_at ? new Date(d.ends_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) :
            `${String(Number(dStart.split(':')[0]) + 1).padStart(2, '0')}:${dStart.split(':')[1]}`;
          return (start < dEnd && end > dStart);
        });
        if (demoClash) return false;

        return true;
      });
    }

    const validStarts = times.filter((tStart, i) => {
      if (i === times.length - 1) return false;
      return checkSlot(tStart, times[i + 1]);
    });

    let validEnds = [];
    if (fTime) {
      const startIndex = times.indexOf(fTime);
      if (startIndex !== -1) {
        // Enforce a minimum of 1 hour (4 slots of 15 mins)
        const minEndIndex = startIndex + 4;
        for (let i = startIndex + 1; i < times.length; i++) {
          if (checkSlot(fTime, times[i])) {
            if (i >= minEndIndex) validEnds.push(times[i]);
          } else {
            // Once we hit a blocked slot, we can't extend the duration any further
            break;
          }
        }
      }
    }

    return { validStarts, validEnds };
  }, [teacherAvail, fDays, fStart, fEnd, fTime]);

  function format24to12(timeStr) {
    if (!timeStr) return '';
    if (timeStr.includes('T')) {
      return new Date(timeStr).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    }
    const [h, m] = timeStr.split(':');
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const hd = hr % 12 || 12;
    return `${hd}:${m} ${ampm}`;
  }

  function toggleDay(d) {
    setFDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    setFTime('');
    setFEndTime('');
  }

  // 15-min time slots for reschedule modal
  const rescheduleTimeSlots = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 22 && m > 0) break;
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const hr12 = h % 12 || 12;
      const ampm = h >= 12 ? 'PM' : 'AM';
      rescheduleTimeSlots.push({ value: `${hh}:${mm}`, label: `${hr12}:${mm} ${ampm}` });
    }
  }

  function isRescheduleSlotOverlapping(slotValue) {
    if (!rescheduleData?.duration || Number(rescheduleData.duration) <= 0) return false;
    const [sH, sM] = slotValue.split(':').map(Number);
    const newStartMins = sH * 60 + sM;
    const newEndMins = newStartMins + Number(rescheduleData.duration) * 60;

    // Check student conflicts
    for (const cls of rescheduleStudentClasses) {
      if (cls.id === rescheduleData?.id) continue;
      const clsStart = (cls.started_at || '').slice(0, 5);
      if (!clsStart) continue;
      const [cH, cM] = clsStart.split(':').map(Number);
      const cStartMins = cH * 60 + cM;
      const cEndMins = cStartMins + Number(cls.duration_hours || 1) * 60;
      if (newStartMins < cEndMins && newEndMins > cStartMins) return 'student';
    }

    // Check teacher class conflicts
    for (const cls of rescheduleTeacherClasses) {
      if (cls.id === rescheduleData?.id) continue;
      const clsStart = (cls.started_at || '').slice(0, 5);
      if (!clsStart) continue;
      const [cH, cM] = clsStart.split(':').map(Number);
      const cStartMins = cH * 60 + cM;
      const cEndMins = cStartMins + Number(cls.duration_hours || 1) * 60;
      if (newStartMins < cEndMins && newEndMins > cStartMins) return 'teacher';
    }

    // Check teacher demo conflicts
    for (const demo of rescheduleTeacherDemos) {
      if (!demo.scheduled_at) continue;
      const demoStart = new Date(demo.scheduled_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      const [dH, dM] = demoStart.split(':').map(Number);
      const dStartMins = dH * 60 + dM;
      const dEndMins = dStartMins + 60; // assume 1h for demos
      if (newStartMins < dEndMins && newEndMins > dStartMins) return 'teacher';
    }

    return false;
  }

  async function handleBulkSubmit(e) {
    e.preventDefault();
    setError(''); setMsg('');
    if (!fTime) return setError('Please select an available time correctly.');
    if (fEnd < fStart) return setError('End date must be after start date.');
    try {
      let durH = 0;
      if (fTime && fEndTime) {
        const [sh, sm] = fTime.split(':').map(Number);
        const [eh, em] = fEndTime.split(':').map(Number);
        durH = (eh + em / 60) - (sh + sm / 60);
      }
      const res = await apiFetch(`/students/${studentId}/sessions/bulk`, {
        method: 'POST',
        body: JSON.stringify({
          teacher_id: fTeacher,
          start_date: fStart,
          end_date: fEnd,
          days_of_week: fDays,
          started_at: fTime,
          duration_hours: durH,
          subject: fSubject
        })
      });
      setMsg(`Successfully scheduled ${res.count} class(es)!`);
      setTimeout(() => setMsg(''), 4000);
      setShowForm(false);
      onClassesChanged();
    } catch (err) { setError(err.message); }
  }

  async function handleRescheduleSave(e) {
    e.preventDefault();
    if (!rescheduleData) return;
    try {
      await apiFetch(`/students/sessions/${rescheduleData.id}/reschedule`, {
        method: 'PUT',
        body: JSON.stringify({
          session_date: rescheduleData.date,
          started_at: rescheduleData.time,
          duration_hours: rescheduleData.duration
        })
      });
      setRescheduleData(null);
      setSelectedSession(null);
      setMsg('Session rescheduled successfully!');
      setTimeout(() => setMsg(''), 4000);
      onClassesChanged();
    } catch (err) { alert(err.message); }
  }

  async function submitSessionEdit(e) {
    e.preventDefault();
    try {
      await apiFetch(`/sessions/${sessionEditData.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          subject: sessionEditData.subject,
          session_date: sessionEditData.date,
          started_at: sessionEditData.time,
          duration_hours: Number(sessionEditData.duration),
          status: sessionEditData.status,
          teacher_id: sessionEditData.teacher_id || undefined
        })
      });
      setSessionEditData(null);
      setSelectedSession(null);
      onClassesChanged();
    } catch (e) { setError(e.message); }
  }

  async function handleSessionDelete(id) {
    try {
      await apiFetch(`/sessions/${id}`, { method: 'DELETE' });
      setSessionDeleteId(null);
      setSelectedSession(null);
      onClassesChanged();
    } catch (e) { setError(e.message); }
  }

  const editTimeSlots = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 22 && m > 0) break;
      editTimeSlots.push({ value: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, label: `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}` });
    }
  }

  function isEditSlotOverlapping(slotValue) {
    if (!sessionEditData?.duration || Number(sessionEditData.duration) <= 0) return false;
    const [sH, sM] = slotValue.split(':').map(Number);
    const newStart = sH * 60 + sM;
    const newEnd = newStart + Number(sessionEditData.duration) * 60;
    for (const cls of editStudentClasses) {
      if (cls.id === sessionEditData.id) continue;
      const t = (cls.started_at || '').slice(0, 5);
      if (!t) continue;
      const [cH, cM] = t.split(':').map(Number);
      const cStart = cH * 60 + cM, cEnd = cStart + (cls.duration_hours || 1) * 60;
      if (newStart < cEnd && newEnd > cStart) return 'student';
    }
    for (const cls of editTeacherClasses) {
      if (cls.id === sessionEditData.id) continue;
      const t = (cls.started_at || '').slice(0, 5);
      if (!t) continue;
      const [cH, cM] = t.split(':').map(Number);
      const cStart = cH * 60 + cM, cEnd = cStart + (cls.duration_hours || 1) * 60;
      if (newStart < cEnd && newEnd > cStart) return 'teacher';
    }
    for (const demo of editTeacherDemos) {
      if (!demo.scheduled_at) continue;
      const ds = new Date(demo.scheduled_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      const [dH, dM] = ds.split(':').map(Number);
      const dStart = dH * 60 + dM, dEnd = dStart + 60;
      if (newStart < dEnd && newEnd > dStart) return 'teacher';
    }
    return false;
  }


  const byDay = useMemo(() => {
    const m = {};
    dayNames.forEach(d => m[d] = []);
    for (const s of weekSessions) {
      const dt = new Date(s.session_date + 'T00:00:00Z');
      const i = (dt.getUTCDay() + 6) % 7;
      if (m[dayNames[i]]) m[dayNames[i]].push(s);
    }
    return m;
  }, [weekSessions]);

  const subjectOptions = useMemo(() => {
    if (!fTeacher) return [];
    const t = teachers.find(x => x.user_id === fTeacher);
    if (!t) return [];
    const subs = Array.isArray(t.subjects_taught) ? t.subjects_taught : (typeof t.subjects_taught === 'string' ? JSON.parse(t.subjects_taught || '[]') : []);
    return subs.filter(Boolean);
  }, [teachers, fTeacher]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Weekly Timetable</h3>
        <button type="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel Scheduling' : '+ Add Class'}
        </button>
      </div>

      {msg && <div className="status-tag success" style={{ padding: '8px 12px', width: 'fit-content' }}>{msg}</div>}
      {error && <div className="error" style={{ marginBottom: 0 }}>{error}</div>}

      {showForm && (
        <article className="card" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <h4 style={{ marginTop: 0 }}>Schedule New Classes</h4>
          <form className="form-grid" onSubmit={handleBulkSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', gridColumn: '1 / -1' }}>
              <label>Start Date
                <input type="date" value={fStart} min={today} onChange={e => setFStart(e.target.value)} required />
              </label>
              <label>End Date
                <input type="date" value={fEnd} min={fStart} onChange={e => setFEnd(e.target.value)} required />
              </label>
              <label>Teacher
                <select value={fTeacher} onChange={e => { setFTeacher(e.target.value); setFTime(''); setFEndTime(''); }} required>
                  <option value="">Select Teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.user_id}>{t.users?.full_name || t.teacher_code}</option>)}
                </select>
              </label>
            </div>

            <label style={{ gridColumn: '1 / -1' }}>Days of Week
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                {dayNames.map(d => (
                  <button key={d} type="button"
                    className={`secondary small ${fDays.includes(d) ? 'primary' : ''}`}
                    style={fDays.includes(d) ? { background: '#2563eb', color: '#fff', borderColor: '#2563eb' } : {}}
                    onClick={() => toggleDay(d)}>
                    {d}
                  </button>
                ))}
              </div>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', gridColumn: '1 / -1' }}>
              <label>Subject
                <select value={fSubject} onChange={e => setFSubject(e.target.value)} required disabled={!subjectOptions.length}>
                  <option value="">Select Subject</option>
                  {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <label>Start Time
                <select value={fTime} onChange={e => { setFTime(e.target.value); setFEndTime(''); }} required disabled={!fTeacher || !fDays.length || availLoading}>
                  <option value="">{availLoading ? 'Checking availability...' : 'Select Start Time'}</option>
                  {validStarts.map(t => <option key={t} value={t}>{format24to12(t)}</option>)}
                </select>
                {fTeacher && fDays.length > 0 && validStarts.length === 0 && !availLoading && (
                  <small className="error" style={{ display: 'block', marginTop: '4px' }}>No available slots found for all selected days.</small>
                )}
              </label>

              <label>End Time
                <select value={fEndTime} onChange={e => setFEndTime(e.target.value)} required disabled={!fTime || availLoading}>
                  <option value="">Select End Time</option>
                  {validEnds.map(t => <option key={t} value={t}>{format24to12(t)}</option>)}
                </select>
              </label>
            </div>

            <button type="submit" style={{ gridColumn: '1 / -1', marginTop: '8px' }} disabled={availLoading || !fEndTime}>Confirm & Schedule</button>
          </form>
        </article>
      )}

      <article className="card">
        <div className="calendar-controls">
          <button type="button" className="secondary" onClick={() => setWeekOffset(o => o - 1)}>← Prev</button>
          <span className="calendar-range">{weekStart} — {weekEnd}</span>
          <button type="button" className="secondary" onClick={() => setWeekOffset(o => o + 1)}>Next →</button>
        </div>
        <div className="calendar-grid">
          {dayNames.map(day => (
            <div key={day} className="calendar-day">
              <div className="calendar-day-header">
                <strong>{day}</strong>
              </div>
              <div className="calendar-day-sessions">
                {byDay[day]?.length ? byDay[day].map(s => (
                  <div key={s.id} className="calendar-session-card" onClick={() => setSelectedSession(s)} style={{ cursor: 'pointer' }}>
                    <div className="calendar-session-time">
                      {format24to12(s.started_at) || '—'} ({s.duration_hours}h)
                    </div>
                    <div className="calendar-session-info">
                      <strong>{s.subject || 'Class'}</strong>
                      <span>{s.users?.full_name || 'Teacher'}</span>
                      <span className={`status-tag small ${s.status === 'scheduled' ? 'warning' : 'success'}`}>{s.status}</span>
                    </div>
                  </div>
                )) : <div className="calendar-empty">Free</div>}
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Details Modal */}
      {selectedSession && !rescheduleData && (
        <div className="modal-overlay" onClick={() => setSelectedSession(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <h3>Session Details</h3>
            <div className="detail-grid" style={{ gridTemplateColumns: '1fr', gap: '12px' }}>
              <div><span className="eyebrow">Subject</span><p>{selectedSession.subject || '—'}</p></div>
              <div><span className="eyebrow">Teacher</span><p>{selectedSession.users?.full_name || '—'}</p></div>
              <div><span className="eyebrow">Date</span><p>{new Date(selectedSession.session_date).toLocaleDateString('en-IN')}</p></div>
              <div><span className="eyebrow">Time & Duration</span><p>{format24to12(selectedSession.started_at)} ({selectedSession.duration_hours} Hour{selectedSession.duration_hours > 1 ? 's' : ''})</p></div>
              <div><span className="eyebrow">Status</span>
                <p>
                  <span className={`status-tag small ${selectedSession.status === 'scheduled' ? 'warning' : 'success'}`}>
                    {selectedSession.status}
                  </span>
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
              {selectedSession.status === 'scheduled' && (
                <button type="button" className="secondary" onClick={() => {
                  setRescheduleData({
                    id: selectedSession.id,
                    teacher_id: selectedSession.teacher_id,
                    date: selectedSession.session_date,
                    time: selectedSession.started_at ? selectedSession.started_at.slice(11, 16) : '',
                    duration: selectedSession.duration_hours
                  });
                }}>Reschedule</button>
              )}
              {selectedSession.status !== 'completed' && (
                <button type="button" title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                  onClick={() => setSessionEditData({
                    id: selectedSession.id,
                    teacher_id: selectedSession.teacher_id || '',
                    subject: selectedSession.subject || '',
                    date: selectedSession.session_date || '',
                    time: selectedSession.started_at ? selectedSession.started_at.slice(11, 16) : '',
                    duration: selectedSession.duration_hours || 1,
                    status: selectedSession.status || 'scheduled'
                  })}>✏️</button>
              )}
              {selectedSession.status !== 'completed' && (
                <button type="button" title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                  onClick={() => setSessionDeleteId(selectedSession.id)}>🗑️</button>
              )}
              <button type="button" onClick={() => setSelectedSession(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal (Same structure as Manage Page) */}
      {rescheduleData && (
        <div className="modal-overlay" onClick={() => setRescheduleData(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Reschedule Session</h3>
            <form onSubmit={handleRescheduleSave}>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                <label>Date
                  <input type="date" value={rescheduleData.date} min={today} onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value, time: '' })} required />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label>Start Time
                    <select
                      value={rescheduleData.time}
                      onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                      disabled={rescheduleLoadingSlots}
                      required
                    >
                      <option value="">{rescheduleLoadingSlots ? 'Loading...' : 'Select time'}</option>
                      {rescheduleTimeSlots.map(t => {
                        const overlapType = isRescheduleSlotOverlapping(t.value);
                        const nowLocal = new Date();
                        const todayStr = nowLocal.getFullYear() + '-' + String(nowLocal.getMonth() + 1).padStart(2, '0') + '-' + String(nowLocal.getDate()).padStart(2, '0');
                        const currentMins = nowLocal.getHours() * 60 + nowLocal.getMinutes();
                        const [tH, tM] = t.value.split(':').map(Number);
                        const isPast = rescheduleData.date === todayStr && (tH * 60 + tM) <= currentMins;
                        const disabled = !!overlapType || isPast;
                        const suffix = overlapType === 'student' ? ' (Student Booked)' : overlapType === 'teacher' ? ' (Teacher Booked)' : isPast ? ' (Past)' : '';
                        return (
                          <option key={t.value} value={t.value} disabled={disabled}>
                            {t.label}{suffix}
                          </option>
                        );
                      })}
                    </select>
                  </label>

                  <label>Duration (Hours)
                    <input type="number" step="0.25" min="1" value={rescheduleData.duration} onChange={e => setRescheduleData({ ...rescheduleData, duration: e.target.value })} required />
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="secondary" onClick={() => setRescheduleData(null)}>Cancel</button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Session Modal (Classes tab) */}
      {sessionEditData && (() => {
        const editTeacher = teachers.find(t => t.user_id === sessionEditData.teacher_id);
        const editSubjects = editTeacher
          ? (Array.isArray(editTeacher.subjects_taught)
            ? editTeacher.subjects_taught
            : (typeof editTeacher.subjects_taught === 'string'
              ? JSON.parse(editTeacher.subjects_taught || '[]') : []))
          : [];
        const todayStr = new Date().toISOString().split('T')[0];
        const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
        return (
          <div className="modal-overlay" onClick={() => setSessionEditData(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <h3>Edit Session</h3>
              <form onSubmit={submitSessionEdit}>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
                  <label>Teacher
                    <select value={sessionEditData.teacher_id} onChange={e => setSessionEditData({ ...sessionEditData, teacher_id: e.target.value, subject: '', time: '' })} required>
                      <option value="">Select teacher</option>
                      {teachers.map(t => <option key={t.user_id} value={t.user_id}>{t.users?.full_name || t.user_id}</option>)}
                    </select>
                  </label>
                  <label>Subject
                    <select value={sessionEditData.subject} onChange={e => setSessionEditData({ ...sessionEditData, subject: e.target.value })} required>
                      <option value="">{sessionEditData.teacher_id ? 'Select subject' : 'Pick teacher first'}</option>
                      {editSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>Date
                      <input type="date" value={sessionEditData.date} onChange={e => setSessionEditData({ ...sessionEditData, date: e.target.value, time: '' })} required />
                    </label>
                    <label>Duration (hrs)
                      <select value={sessionEditData.duration} onChange={e => setSessionEditData({ ...sessionEditData, duration: e.target.value })}>
                        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(h => <option key={h} value={h}>{h}h</option>)}
                      </select>
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>Start Time
                      <select value={sessionEditData.time} onChange={e => setSessionEditData({ ...sessionEditData, time: e.target.value })} required disabled={editLoadingSlots}>
                        <option value="">{editLoadingSlots ? 'Checking availability...' : 'Select time'}</option>
                        {editTimeSlots.map(t => {
                          const overlap = isEditSlotOverlapping(t.value);
                          const [tH, tM] = t.value.split(':').map(Number);
                          const isPast = sessionEditData.date === todayStr && (tH * 60 + tM) <= nowMins;
                          const disabled = !!overlap || isPast;
                          const suffix = overlap === 'student' ? ' (Student Busy)' : overlap === 'teacher' ? ' (Teacher Busy)' : isPast ? ' (Past)' : '';
                          return <option key={t.value} value={t.value} disabled={disabled}>{t.label}{suffix}</option>;
                        })}
                      </select>
                    </label>
                    <label>Status
                      <select value={sessionEditData.status} onChange={e => setSessionEditData({ ...sessionEditData, status: e.target.value })}>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="secondary" onClick={() => setSessionEditData(null)}>Cancel</button>
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Delete Session Confirmation (Classes tab) */}
      {sessionDeleteId && (
        <div className="modal-overlay" onClick={() => setSessionDeleteId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '360px', textAlign: 'center' }}>
            <h3>Delete Session?</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>This cannot be undone. The session will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="secondary" onClick={() => setSessionDeleteId(null)}>Cancel</button>
              <button style={{ background: '#ef4444', color: '#fff', border: 'none' }} onClick={() => handleSessionDelete(sessionDeleteId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════ Student Detail (inline) ═══════ */
function StudentDetailPage({ studentId, onBack }) {
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [demoSessions, setDemoSessions] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('profile');
  const [aTeacher, setATeacher] = useState('');
  const [aSubject, setASubject] = useState('');
  const [aDay, setADay] = useState('');
  const [aTime, setATime] = useState('');
  const [msgText, setMsgText] = useState('');
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 6; h <= 22; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 22 && m > 0) break; // Ends exactly at 10:00 PM
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        const mins = m.toString().padStart(2, '0');
        times.push(`${hour12}:${mins} ${ampm}`);
      }
    }
    return times;
  }, []);

  const load = useCallback(async () => {
    try {
      const d = await apiFetch(`/students/${studentId}`);
      setStudent(d.student);
      setAssignments(d.assignments || []);
      setSessions(d.sessions || []);
      setMessages(d.messages || []);
      setDemoSessions(d.demoSessions || []);
      setPaymentRequests(d.paymentRequests || []);
      const p = await apiFetch('/teachers/pool');
      setTeachers(p.items || []);
      const subjs = await apiFetch('/subjects');
      setSubjectOptions((subjs.subjects || []).map(s => s.name));
    } catch (e) { setError(e.message); }
  }, [studentId]);
  useEffect(() => { load(); }, [load]);

  async function assignTeacher(e) {
    e.preventDefault();
    const scheduleNote = aDay && aTime ? `${aDay} at ${aTime}` : '';
    try {
      await apiFetch(`/students/${studentId}/assignments`, {
        method: 'POST',
        body: JSON.stringify({ teacher_id: aTeacher, subject: aSubject, day: aDay, time: aTime, schedule_note: scheduleNote })
      });
      setATeacher(''); setASubject(''); setADay(''); setATime('');
      await load();
    } catch (e) { setError(e.message); }
  }

  async function removeAssignment(id) {
    try { await apiFetch(`/students/${studentId}/assignments/${id}`, { method: 'DELETE' }); await load(); } catch (e) { setError(e.message); }
  }

  async function acceptAssignment(id) {
    try { await apiFetch(`/students/${studentId}/assignments/${id}/accept`, { method: 'POST' }); await load(); } catch (e) { setError(e.message); }
  }

  async function sendMessage(e) {
    e.preventDefault(); if (!msgText.trim()) return;
    try { await apiFetch(`/students/${studentId}/messages/send-reminder`, { method: 'POST', body: JSON.stringify({ message: msgText, type: 'general' }) }); setMsgText(''); await load(); } catch (e) { setError(e.message); }
  }

  function openEditModal() {
    setEditForm({
      student_name: student.student_name || '',
      parent_name: student.parent_name || '',
      contact_number: student.contact_number || '',
      alternative_number: student.alternative_number || '',
      parent_phone: student.parent_phone || '',
      class_level: student.class_level || '',
      package_name: student.package_name || '',
      messaging_number: student.messaging_number || 'contact'
    });
    setShowEdit(true);
  }

  async function saveEdit(e) {
    e.preventDefault();
    setEditSaving(true); setError('');
    try {
      await apiFetch(`/students/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(editForm)
      });
      setShowEdit(false);
      await load();
    } catch (e) { setError(e.message); }
    finally { setEditSaving(false); }
  }

  const messagingLabel = { contact: 'Contact Number', alternative: 'Alternative Number', parent: 'Parent Phone' };
  const activeSubjects = (assignments || []).filter(a => a.is_active).map(a => a.subject).filter(Boolean);
  const uniqueSubjects = [...new Set(activeSubjects)];

  if (!student) return <section className="panel">{error ? <p className="error">{error}</p> : <p>Loading...</p>}</section>;
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'classes', label: `Classes (${sessions.length})` },
    { id: 'lead_data', label: 'Lead Data' }
  ];

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
        <article className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Info</h3>
            <button type="button" className="secondary small" onClick={openEditModal}>✏️ Edit Details</button>
          </div>
          <div className="detail-grid" style={{ marginTop: 12 }}>
            <div><span className="eyebrow">Code</span><p><strong>{student.student_code || '—'}</strong></p></div>
            <div><span className="eyebrow">Class</span><p>{student.class_level || student.leads?.class_level || '—'}</p></div>
            <div><span className="eyebrow">Subjects</span><p>{uniqueSubjects.length ? uniqueSubjects.join(', ') : '—'}</p></div>
            <div><span className="eyebrow">Parent</span><p>{student.parent_name || student.leads?.parent_name || '—'}</p></div>
            <div><span className="eyebrow">Contact No.</span><p>{(student.country_code ? student.country_code + ' ' : '') + (student.contact_number || '—')}</p></div>
            <div><span className="eyebrow">Alternative No.</span><p>{student.alternative_number || '—'}</p></div>
            <div><span className="eyebrow">Parent Phone</span><p>{student.parent_phone || '—'}</p></div>
            <div><span className="eyebrow">Messaging No.</span><p>{messagingLabel[student.messaging_number] || 'Contact Number'}</p></div>
            <div><span className="eyebrow">Package</span><p>{student.package_name || student.leads?.package_name || '—'}</p></div>
            <div><span className="eyebrow">Source</span><p>{student.counselor_id ? (student.leads?.source || 'Lead') : 'Manual'}</p></div>
            <div><span className="eyebrow">Joined</span><p>{student.joined_at ? new Date(student.joined_at).toLocaleDateString('en-IN') : '—'}</p></div>
          </div>
        </article>
        <article className="card"><h3>Hours</h3><div className="grid-two" style={{ gap: 12 }}>
          <div className="stat-card card" style={{ textAlign: 'center' }}><p className="eyebrow">Total</p><h3>{student.total_hours}</h3></div>
          <div className={`stat-card card ${Number(student.remaining_hours) <= 5 ? 'danger' : 'success'}`} style={{ textAlign: 'center' }}><p className="eyebrow">Left</p><h3>{student.remaining_hours}</h3></div>
        </div></article>

        {/* Edit Details Modal */}
        {showEdit && (
          <div className="modal-overlay" onClick={() => setShowEdit(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
              <h3>Edit Student Details</h3>
              <form onSubmit={saveEdit}>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>Student Name
                      <input value={editForm.student_name} onChange={e => setEditForm({ ...editForm, student_name: e.target.value })} required />
                    </label>
                    <label>Parent Name
                      <input value={editForm.parent_name} onChange={e => setEditForm({ ...editForm, parent_name: e.target.value })} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <label>Contact Number
                      <input value={editForm.contact_number} onChange={e => setEditForm({ ...editForm, contact_number: e.target.value })} />
                    </label>
                    <label>Alternative No.
                      <input value={editForm.alternative_number} onChange={e => setEditForm({ ...editForm, alternative_number: e.target.value })} />
                    </label>
                    <label>Parent Phone
                      <input value={editForm.parent_phone} onChange={e => setEditForm({ ...editForm, parent_phone: e.target.value })} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <label>Class / Level
                      <input value={editForm.class_level} onChange={e => setEditForm({ ...editForm, class_level: e.target.value })} />
                    </label>
                    <label>Package
                      <input value={editForm.package_name} onChange={e => setEditForm({ ...editForm, package_name: e.target.value })} />
                    </label>
                    <label>Messaging Number
                      <select value={editForm.messaging_number} onChange={e => setEditForm({ ...editForm, messaging_number: e.target.value })}>
                        <option value="contact">Contact Number</option>
                        <option value="alternative">Alternative Number</option>
                        <option value="parent">Parent Phone</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="secondary" onClick={() => setShowEdit(false)}>Cancel</button>
                  <button type="submit" disabled={editSaving}>{editSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div> : null}

      {tab === 'classes' ? <StudentClassesTab studentId={studentId} initialSessions={sessions} teachers={teachers} onClassesChanged={load} /> : null}

      {tab === 'lead_data' ? <div>
        <article className="card" style={{ marginBottom: '16px' }}>
          <h3>Original Lead Information</h3>
          {student.leads ? (
            <div className="detail-grid">
              <div><span className="eyebrow">Status History</span><p>{student.leads.status || '—'}</p></div>
              <div><span className="eyebrow">Assigned To</span><p>{student.leads.counselor_id ? 'Assigned Counselor' : 'Unassigned'}</p></div>
              <div><span className="eyebrow">Assigned At</span><p>{student.leads.assigned_at ? new Date(student.leads.assigned_at).toLocaleDateString('en-IN') : '—'}</p></div>
              <div><span className="eyebrow">Follow-Up Date</span><p>{student.leads.next_followup_date ? new Date(student.leads.next_followup_date).toLocaleDateString('en-IN') : '—'}</p></div>
              <div><span className="eyebrow">Lost Reason</span><p>{student.leads.lost_reason || '—'}</p></div>
              <div style={{ gridColumn: '1 / -1' }}><span className="eyebrow">Counselor Notes</span><p style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{student.leads.counselor_notes || '—'}</p></div>
              <div style={{ gridColumn: '1 / -1' }}><span className="eyebrow">Initial Remarks</span><p style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{student.leads.remarks || '—'}</p></div>
            </div>
          ) : (
            <p className="muted">No original lead record found for this student.</p>
          )}
        </article>

        <article className="card">
          <h3>Demo Sessions</h3>
          <div className="table-wrap mobile-friendly-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Teacher</th>
                  <th>Status</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {demoSessions.map(d => {
                  const tProf = d.users?.teacher_profiles?.[0];
                  const codeLabel = tProf?.teacher_code ? ` (${tProf.teacher_code})` : '';
                  return (
                    <tr key={d.id}>
                      <td data-label="Date">{new Date(d.scheduled_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</td>
                      <td data-label="Teacher">{d.users?.full_name ? `${d.users.full_name}${codeLabel}` : '—'}</td>
                      <td data-label="Status"><span className={`status-tag ${d.status === 'completed' ? 'success' : ''}`}>{d.status}</span></td>
                      <td data-label="Outcome" style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>{d.outcome || '—'}</td>
                    </tr>
                  );
                })}
                {!demoSessions.length && <tr><td colSpan="4">No demo sessions found.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card" style={{ marginTop: '16px' }}>
          <h3>Payment History</h3>
          <div className="table-wrap mobile-friendly-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Amt</th>
                  <th>Hours</th>
                  <th>Paid Amt</th>
                  <th>Status</th>
                  <th>Screenshot</th>
                </tr>
              </thead>
              <tbody>
                {paymentRequests.map(p => (
                  <tr key={p.id}>
                    <td data-label="Date">{new Date(p.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' })}</td>
                    <td data-label="Total Amt">{p.total_amount ? `₹${p.total_amount}` : '—'}</td>
                    <td data-label="Hours">{p.hours || '—'}</td>
                    <td data-label="Paid Amt" style={{ color: '#15803d', fontWeight: 600 }}>₹{p.amount}</td>
                    <td data-label="Status"><span className="status-tag success">{p.status}</span></td>
                    <td data-label="Screenshot">
                      {p.screenshot_url ? <a href={p.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>View</a> : '—'}
                    </td>
                  </tr>
                ))}
                {!paymentRequests.length && <tr><td colSpan="6">No payment history found.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>
      </div> : null}
    </section>
  );
}

/* ═══════ Student Onboarding Form (multi-schedule, multi-assignment) ═══════ */
function StudentOnboardingForm({ teachers, subjects, onDone, onNewSubjectAdded }) {
  const [f, setF] = useState({ name: '', parent: '', studentNumber: '', parentNumber: '', classLevel: '', package: '', totalHours: '', notifPref: 'whatsapp' });
  const [assigns, setAssigns] = useState([{ teacherId: '', subject: '', scheduleNote: '', day: '', time: '' }]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 6; h <= 22; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 22 && m > 0) break; // Ends exactly at 10:00 PM
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        const mins = m.toString().padStart(2, '0');
        times.push(`${hour12}:${mins} ${ampm}`);
      }
    }
    return times;
  }, []);

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
            <label>Subject<SubjectSelect value={a.subject} onChange={(v, isNew) => { updateAssign(i, 'subject', v); if (isNew && onNewSubjectAdded) onNewSubjectAdded(v); }} options={subjects} required /></label>
            <label>Day<select value={a.day} onChange={e => updateAssign(i, 'day', e.target.value)} required><option value="">Day</option>{dayNames.map(d => <option key={d} value={d}>{d}</option>)}</select></label>
            <label>Time<select value={a.time} onChange={e => updateAssign(i, 'time', e.target.value)} required><option value="">Time</option>{timeOptions.map(t => <option key={t} value={t}>{t}</option>)}</select></label>
            <label>Teacher
              <select value={a.teacherId} onChange={e => updateAssign(i, 'teacherId', e.target.value)} required disabled={!a.subject || !a.day || !a.time}>
                <option value="">Select Candidate</option>
                {(() => {
                  const filtered = teachers.filter(t => {
                    if (!a.subject) return true;
                    const target = a.subject.trim().toLowerCase();
                    const tSubjects = Array.isArray(t.subjects_taught) ? t.subjects_taught : (typeof t.subjects_taught === 'string' ? JSON.parse(t.subjects_taught || '[]') : []);
                    return tSubjects.some(s => (s || '').trim().toLowerCase() === target);
                  });
                  if (filtered.length === 0 && a.subject) return <option disabled>No teachers found for this subject</option>;
                  return filtered.map(t => {
                    let slots = [];
                    try { slots = typeof t.teacher_availability === 'string' ? JSON.parse(t.teacher_availability) : (t.teacher_availability || []); } catch (e) { }
                    const isAvailable = slots.some(slot => slot.day_of_week === a.day);
                    return (
                      <option key={t.id} value={t.user_id}>
                        {t.users?.full_name || t.teacher_code} {isAvailable ? '(Available)' : '⚠️ (Schedule Conflict)'}
                      </option>
                    );
                  });
                })()}
              </select>
            </label>
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
  const [subjectsList, setSubjectsList] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
      if (isAC && teachers.length === 0) {
        const [tp, subjs] = await Promise.all([
          apiFetch('/teachers/pool'),
          apiFetch('/subjects')
        ]);
        setTeachers(tp.items || []);
        setSubjectsList((subjs.subjects || []).map(s => s.name));
      }
    } catch (e) { setError(e.message); }
  }, [isAC, teachers.length]);
  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    let items = students;
    if (statusFilter) items = items.filter(s => s.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(s =>
        (s.student_name || '').toLowerCase().includes(q) ||
        (s.student_code || '').toLowerCase().includes(q)
      );
    }
    return items;
  }, [students, statusFilter, search]);

  async function quickStatusChange(studentId, newStatus, e) {
    e.stopPropagation();
    try {
      await apiFetch(`/students/${studentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
    } catch (e) { setError(e.message); }
  }

  const statusColor = { active: 'success', vacation: 'warning', inactive: '' };

  if (selId) return <StudentDetailPage studentId={selId} onBack={() => { setSelId(null); loadData(); }} />;

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <div className="tabs-row">{tabs.map(t => <button key={t.id} type="button" className={activeTab === t.id ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab(t.id)}>{t.label}</button>)}</div>
      <article className="card">
        {activeTab === 'students' ? <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text" placeholder="Search by name or code..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: '1 1 220px', minWidth: '180px' }}
            />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ minWidth: '140px' }}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="vacation">Vacation</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="table-wrap mobile-friendly-table"><table><thead><tr>
            <th>ID</th><th>Name</th><th>Class</th><th>Status</th><th>Hours Left</th><th>Teachers</th>
          </tr></thead><tbody>
              {filtered.map(s => <tr key={s.id} onClick={() => isAC && setSelId(s.id)} className={isAC ? 'clickable-row' : ''}>
                <td data-label="ID">{s.student_code || '—'}</td>
                <td data-label="Name">{s.student_name}</td>
                <td data-label="Class">{s.class_level || '—'}</td>
                <td data-label="Status">{isAC ? (
                  <select
                    value={s.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => quickStatusChange(s.id, e.target.value, e)}
                    className={`status-select ${statusColor[s.status] || ''}`}
                    style={{
                      fontSize: '0.85em', padding: '4px 6px', borderRadius: '6px', fontWeight: 600,
                      background: s.status === 'active' ? '#dcfce7' : s.status === 'vacation' ? '#fef9c3' : '#f1f5f9',
                      color: s.status === 'active' ? '#166534' : s.status === 'vacation' ? '#854d0e' : '#475569',
                      border: '1px solid ' + (s.status === 'active' ? '#bbf7d0' : s.status === 'vacation' ? '#fde68a' : '#cbd5e1'),
                      cursor: 'pointer'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="vacation">Vacation</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span className={`status-tag ${statusColor[s.status] || ''}`}>{s.status}</span>
                )}</td>
                <td data-label="Hours Left"><span className={Number(s.remaining_hours) <= 5 ? 'text-danger' : ''}>{s.remaining_hours}</span></td>
                <td data-label="Teachers">{(s.student_teacher_assignments || []).filter(a => a.is_active).map(a => <span key={a.id} className="status-tag small" style={{ marginRight: 4 }}>{a.users?.full_name || '?'}·{a.subject}</span>)}{!(s.student_teacher_assignments || []).filter(a => a.is_active).length ? <span className="muted">None</span> : null}</td>
              </tr>)}
              {!filtered.length ? <tr><td colSpan="6">No students match filters.</td></tr> : null}
            </tbody></table></div>
        </> : null}
        {activeTab === 'onboard' ? <StudentOnboardingForm teachers={teachers} subjects={subjectsList} onDone={loadData} onNewSubjectAdded={(newSubj) => setSubjectsList(prev => [...prev, newSubj])} /> : null}
      </article>
    </section>
  );
}

/* ═══════ Today Classes ═══════ */
export function TodayClassesPage() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [fTeacher, setFTeacher] = useState('');
  const [fStudent, setFStudent] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [allTeachers, setAllTeachers] = useState([]);

  // Reschedule
  const [rescheduleData, setRescheduleData] = useState(null);
  const [rescheduleStudentClasses, setRescheduleStudentClasses] = useState([]);
  const [rescheduleTeacherClasses, setRescheduleTeacherClasses] = useState([]);
  const [rescheduleTeacherDemos, setRescheduleTeacherDemos] = useState([]);
  const [rescheduleLoadingSlots, setRescheduleLoadingSlots] = useState(false);
  // Edit
  const [editData, setEditData] = useState(null);
  const [editStudentClasses, setEditStudentClasses] = useState([]);
  const [editTeacherClasses, setEditTeacherClasses] = useState([]);
  const [editTeacherDemos, setEditTeacherDemos] = useState([]);
  const [editLoadingSlots, setEditLoadingSlots] = useState(false);
  // Delete
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [d, tRes] = await Promise.all([
        apiFetch('/students/sessions/today'),
        apiFetch('/teachers/pool')
      ]);
      setSessions(d.items || []);
      setAllTeachers(tRes.items || []);
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Availability for reschedule
  useEffect(() => {
    if (!rescheduleData?.date) return;
    setRescheduleLoadingSlots(true);
    const fs = rescheduleData.student_id
      ? apiFetch(`/students/${rescheduleData.student_id}/availability?start_date=${rescheduleData.date}&end_date=${rescheduleData.date}`)
        .then(r => setRescheduleStudentClasses(r.classes || [])).catch(() => setRescheduleStudentClasses([]))
      : Promise.resolve();
    const ft = rescheduleData.teacher_id
      ? apiFetch(`/teachers/${rescheduleData.teacher_id}/availability?start_date=${rescheduleData.date}&end_date=${rescheduleData.date}`)
        .then(r => { setRescheduleTeacherClasses(r.classes || []); setRescheduleTeacherDemos(r.demos || []); }).catch(() => { setRescheduleTeacherClasses([]); setRescheduleTeacherDemos([]); })
      : Promise.resolve();
    Promise.all([fs, ft]).finally(() => setRescheduleLoadingSlots(false));
  }, [rescheduleData?.date, rescheduleData?.student_id, rescheduleData?.teacher_id]);

  // Availability for edit
  useEffect(() => {
    if (!editData?.date) return;
    setEditLoadingSlots(true);
    const fs = editData.student_id
      ? apiFetch(`/students/${editData.student_id}/availability?start_date=${editData.date}&end_date=${editData.date}`)
        .then(r => setEditStudentClasses(r.classes || [])).catch(() => setEditStudentClasses([]))
      : Promise.resolve();
    const ft = editData.teacher_id
      ? apiFetch(`/teachers/${editData.teacher_id}/availability?start_date=${editData.date}&end_date=${editData.date}`)
        .then(r => { setEditTeacherClasses(r.classes || []); setEditTeacherDemos(r.demos || []); }).catch(() => { setEditTeacherClasses([]); setEditTeacherDemos([]); })
      : Promise.resolve();
    Promise.all([fs, ft]).finally(() => setEditLoadingSlots(false));
  }, [editData?.date, editData?.teacher_id, editData?.student_id]);

  async function submitReschedule(e) {
    e.preventDefault();
    try {
      await apiFetch(`/sessions/${rescheduleData.id}/reschedule`, {
        method: 'PUT',
        body: JSON.stringify({ session_date: rescheduleData.date, started_at: rescheduleData.time, duration_hours: Number(rescheduleData.duration) })
      });
      setRescheduleData(null);
      await load();
    } catch (e) { setError(e.message); }
  }

  async function submitEdit(e) {
    e.preventDefault();
    try {
      await apiFetch(`/sessions/${editData.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ subject: editData.subject, session_date: editData.date, started_at: editData.time, duration_hours: Number(editData.duration), status: editData.status, teacher_id: editData.teacher_id || undefined })
      });
      setEditData(null);
      await load();
    } catch (e) { setError(e.message); }
  }

  async function handleDelete(id) {
    try {
      await apiFetch(`/sessions/${id}`, { method: 'DELETE' });
      setDeleteConfirmId(null);
      await load();
    } catch (e) { setError(e.message); }
  }

  function checkOverlap(slotValue, duration, studentClasses, teacherClasses, teacherDemos, excludeId) {
    if (!duration || Number(duration) <= 0) return false;
    const [sH, sM] = slotValue.split(':').map(Number);
    const newStart = sH * 60 + sM, newEnd = newStart + Number(duration) * 60;
    for (const cls of studentClasses) {
      if (cls.id === excludeId) continue;
      const t = (cls.started_at || '').slice(0, 5); if (!t) continue;
      const [cH, cM] = t.split(':').map(Number);
      const cS = cH * 60 + cM, cE = cS + (cls.duration_hours || 1) * 60;
      if (newStart < cE && newEnd > cS) return 'student';
    }
    for (const cls of teacherClasses) {
      if (cls.id === excludeId) continue;
      const t = (cls.started_at || '').slice(0, 5); if (!t) continue;
      const [cH, cM] = t.split(':').map(Number);
      const cS = cH * 60 + cM, cE = cS + (cls.duration_hours || 1) * 60;
      if (newStart < cE && newEnd > cS) return 'teacher';
    }
    for (const demo of teacherDemos) {
      if (!demo.scheduled_at) continue;
      const ds = new Date(demo.scheduled_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      const [dH, dM] = ds.split(':').map(Number);
      const dS = dH * 60 + dM, dE = dS + 60;
      if (newStart < dE && newEnd > dS) return 'teacher';
    }
    return false;
  }

  // 15-min slots
  const timeSlots = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 22 && m > 0) break;
      timeSlots.push({ value: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, label: `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}` });
    }
  }

  function formatTime12(timeStr) {
    if (!timeStr) return '—';
    if (timeStr.includes('T')) return new Date(timeStr).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    const [h, m] = timeStr.split(':'); const hr = parseInt(h, 10);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  }

  const teacherOpts = useMemo(() => { const map = new Map(); sessions.forEach(s => { if (s.users?.full_name) map.set(s.teacher_id, s.users.full_name); }); return [...map.entries()].map(([v, l]) => ({ value: v, label: l })); }, [sessions]);
  const studentOpts = useMemo(() => { const map = new Map(); sessions.forEach(s => { if (s.students?.student_name) map.set(s.student_id, s.students.student_name); }); return [...map.entries()].map(([v, l]) => ({ value: v, label: l })); }, [sessions]);
  const DAY_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filtered = useMemo(() => sessions.filter(s =>
    (!fTeacher || s.teacher_id === fTeacher) &&
    (!fStudent || s.student_id === fStudent) &&
    (!fStatus || s.status === fStatus)
  ), [sessions, fTeacher, fStudent, fStatus]);

  const todayStr = new Date().toISOString().split('T')[0];
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card">
        <div className="filter-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', alignItems: 'end' }}>
          <SearchSelect label="Teacher" value={fTeacher} onChange={setFTeacher} options={teacherOpts} placeholder="All Teachers" />
          <SearchSelect label="Student" value={fStudent} onChange={setFStudent} options={studentOpts} placeholder="All Students" />
          <SearchSelect label="Status" value={fStatus} onChange={setFStatus} options={[
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' }
          ]} placeholder="All Status" />
        </div>
        <div className="table-wrap mobile-friendly-table" style={{ marginTop: '16px' }}>
          <table>
            <thead><tr>
              <th>Time</th><th>Student</th><th>Teacher</th><th>Subject</th><th>Hrs</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(s => {
                const isUpcoming = s.status === 'scheduled';
                return (
                  <tr key={s.id}>
                    <td data-label="Time">{formatTime12(s.started_at)}</td>
                    <td data-label="Student">{s.students?.student_name || s.student_id}</td>
                    <td data-label="Teacher">{s.users?.full_name || s.teacher_id}</td>
                    <td data-label="Subject">{s.subject || '—'}</td>
                    <td data-label="Hrs">{s.duration_hours}h</td>
                    <td data-label="Status">
                      <span className={`status-tag ${s.status === 'completed' ? 'primary' : s.status === 'scheduled' ? 'warning' : ''}`}>{s.status}</span>
                    </td>
                    <td className="actions" data-label="Actions" style={{ whiteSpace: 'nowrap' }}>
                      {isUpcoming && <button type="button" className="small secondary" onClick={() => setRescheduleData({
                        id: s.id, student_id: s.student_id || '', teacher_id: s.teacher_id || '',
                        date: s.session_date || '', time: s.started_at ? s.started_at.slice(11, 16) : '', duration: s.duration_hours || 1
                      })}>Reschedule</button>}
                      {s.status !== 'completed' && (
                        <button type="button" title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '2px 5px' }}
                          onClick={() => setEditData({ id: s.id, teacher_id: s.teacher_id || '', student_id: s.student_id || '', subject: s.subject || '', date: s.session_date || '', time: s.started_at ? s.started_at.slice(11, 16) : '', duration: s.duration_hours || 1, status: s.status || 'scheduled' })}>✏️</button>
                      )}
                      {s.status !== 'completed' && (
                        <button type="button" title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '2px 5px' }}
                          onClick={() => setDeleteConfirmId(s.id)}>🗑️</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!filtered.length ? <tr><td colSpan="9">No classes match filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </article>

      {/* Reschedule Modal */}
      {rescheduleData && (() => (
        <div className="modal-overlay" onClick={() => setRescheduleData(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <h3>Reschedule Session</h3>
            <form onSubmit={submitReschedule}>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
                <label>Date
                  <input type="date" value={rescheduleData.date} min={todayStr}
                    onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value, time: '' })} required />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label>Start Time
                    <select value={rescheduleData.time} onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })} required disabled={rescheduleLoadingSlots}>
                      <option value="">{rescheduleLoadingSlots ? 'Checking...' : 'Select time'}</option>
                      {timeSlots.map(t => {
                        const overlap = checkOverlap(t.value, rescheduleData.duration, rescheduleStudentClasses, rescheduleTeacherClasses, rescheduleTeacherDemos, rescheduleData.id);
                        const [tH, tM] = t.value.split(':').map(Number);
                        const isPast = rescheduleData.date === todayStr && (tH * 60 + tM) <= nowMins;
                        const disabled = !!overlap || isPast;
                        const suffix = overlap === 'student' ? ' (Student Busy)' : overlap === 'teacher' ? ' (Teacher Busy)' : isPast ? ' (Past)' : '';
                        return <option key={t.value} value={t.value} disabled={disabled}>{t.label}{suffix}</option>;
                      })}
                    </select>
                  </label>
                  <label>Duration (hrs)
                    <select value={rescheduleData.duration} onChange={e => setRescheduleData({ ...rescheduleData, duration: e.target.value })}>
                      {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(h => <option key={h} value={h}>{h}h</option>)}
                    </select>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="secondary" onClick={() => setRescheduleData(null)}>Cancel</button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      ))()}

      {/* Edit Modal */}
      {editData && (() => {
        const editTeacher = allTeachers.find(t => t.user_id === editData.teacher_id);
        const editSubjects = editTeacher
          ? (Array.isArray(editTeacher.subjects_taught) ? editTeacher.subjects_taught
            : (typeof editTeacher.subjects_taught === 'string' ? JSON.parse(editTeacher.subjects_taught || '[]') : []))
          : [];
        return (
          <div className="modal-overlay" onClick={() => setEditData(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <h3>Edit Session</h3>
              <form onSubmit={submitEdit}>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
                  <label>Teacher
                    <select value={editData.teacher_id} onChange={e => setEditData({ ...editData, teacher_id: e.target.value, subject: '', time: '' })} required>
                      <option value="">Select teacher</option>
                      {allTeachers.map(t => <option key={t.user_id} value={t.user_id}>{t.users?.full_name || t.user_id}</option>)}
                    </select>
                  </label>
                  <label>Subject
                    <select value={editData.subject} onChange={e => setEditData({ ...editData, subject: e.target.value })} required>
                      <option value="">{editData.teacher_id ? 'Select subject' : 'Pick teacher first'}</option>
                      {editSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>Date
                      <input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value, time: '' })} required />
                    </label>
                    <label>Duration (hrs)
                      <select value={editData.duration} onChange={e => setEditData({ ...editData, duration: e.target.value })}>
                        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(h => <option key={h} value={h}>{h}h</option>)}
                      </select>
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>Start Time
                      <select value={editData.time} onChange={e => setEditData({ ...editData, time: e.target.value })} required disabled={editLoadingSlots}>
                        <option value="">{editLoadingSlots ? 'Checking...' : 'Select time'}</option>
                        {timeSlots.map(t => {
                          const overlap = checkOverlap(t.value, editData.duration, editStudentClasses, editTeacherClasses, editTeacherDemos, editData.id);
                          const [tH, tM] = t.value.split(':').map(Number);
                          const isPast = editData.date === todayStr && (tH * 60 + tM) <= nowMins;
                          const disabled = !!overlap || isPast;
                          const suffix = overlap === 'student' ? ' (Student Busy)' : overlap === 'teacher' ? ' (Teacher Busy)' : isPast ? ' (Past)' : '';
                          return <option key={t.value} value={t.value} disabled={disabled}>{t.label}{suffix}</option>;
                        })}
                      </select>
                    </label>
                    <label>Status
                      <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="secondary" onClick={() => setEditData(null)}>Cancel</button>
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '360px', textAlign: 'center' }}>
            <h3>Delete Session?</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>This cannot be undone. The session will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button style={{ background: '#ef4444', color: '#fff', border: 'none' }} onClick={() => handleDelete(deleteConfirmId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
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

/* ═══════ All Sessions (no verification tab — that's now separate) ═══════ */
export function SessionsManagePage() {
  const [allSessions, setAllSessions] = useState([]);
  const [error, setError] = useState('');

  // Filters
  const [datePreset, setDatePreset] = useState('All');
  const [fStart, setFStart] = useState('');
  const [fEnd, setFEnd] = useState('');
  const [fTeacher, setFTeacher] = useState('');
  const [fStudent, setFStudent] = useState('');
  const [fStatus, setFStatus] = useState('');

  // Reschedule Modal
  const [rescheduleData, setRescheduleData] = useState(null);
  const [rescheduleStudentClasses, setRescheduleStudentClasses] = useState([]);
  const [rescheduleTeacherClasses, setRescheduleTeacherClasses] = useState([]);
  const [rescheduleTeacherDemos, setRescheduleTeacherDemos] = useState([]);
  const [rescheduleLoadingSlots, setRescheduleLoadingSlots] = useState(false);
  // Edit Modal
  const [editData, setEditData] = useState(null);
  const [editStudentClasses, setEditStudentClasses] = useState([]);
  const [editTeacherClasses, setEditTeacherClasses] = useState([]);
  const [editTeacherDemos, setEditTeacherDemos] = useState([]);
  const [editLoadingSlots, setEditLoadingSlots] = useState(false);
  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Master lists
  const [allTeachers, setAllTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const loadMasterData = useCallback(async () => {
    try {
      const [tRes, sRes] = await Promise.all([apiFetch('/teachers/pool'), apiFetch('/students')]);
      setAllTeachers(tRes.items || []);
      setAllStudents(sRes.items || []);
    } catch (e) { console.error('Error loading master data', e); }
  }, []);

  const loadAllSessions = useCallback(async () => {
    try {
      let url = '/sessions/all?';
      let start = fStart;
      let end = fEnd;

      const today = new Date();
      if (datePreset === 'Today') {
        const tStr = today.toISOString().split('T')[0];
        start = tStr; end = tStr;
      } else if (datePreset === 'Last Week') {
        const lwStart = new Date(today); lwStart.setDate(today.getDate() - 7);
        const lwEnd = new Date(today); lwEnd.setDate(today.getDate() - 1);
        start = lwStart.toISOString().split('T')[0];
        end = lwEnd.toISOString().split('T')[0];
      } else if (datePreset === 'Next Week') {
        const nwStart = new Date(today); nwStart.setDate(today.getDate() + 1);
        const nwEnd = new Date(today); nwEnd.setDate(today.getDate() + 7);
        start = nwStart.toISOString().split('T')[0];
        end = nwEnd.toISOString().split('T')[0];
      } else if (datePreset === 'All') {
        start = ''; end = '';
      }

      if (start) url += `start_date=${start}&`;
      if (end) url += `end_date=${end}&`;
      if (fTeacher) url += `teacher_id=${fTeacher}&`;
      if (fStudent) url += `student_id=${fStudent}&`;
      if (fStatus) url += `status=${fStatus}&`;
      const res = await apiFetch(url);
      setAllSessions(res.items || []);
    } catch (e) { setError(e.message); }
  }, [datePreset, fStart, fEnd, fTeacher, fStudent, fStatus]);

  useEffect(() => { loadMasterData(); }, [loadMasterData]);
  useEffect(() => { loadAllSessions(); }, [loadAllSessions]);

  // Fetch availability when reschedule date/student/teacher changes
  useEffect(() => {
    if (!rescheduleData?.date) return;
    setRescheduleLoadingSlots(true);
    const fetchStudent = rescheduleData.student_id
      ? apiFetch(`/students/${rescheduleData.student_id}/availability?start_date=${rescheduleData.date}&end_date=${rescheduleData.date}`)
        .then(res => setRescheduleStudentClasses(res.classes || []))
        .catch(() => setRescheduleStudentClasses([]))
      : Promise.resolve();
    const fetchTeacher = rescheduleData.teacher_id
      ? apiFetch(`/teachers/${rescheduleData.teacher_id}/availability?start_date=${rescheduleData.date}&end_date=${rescheduleData.date}`)
        .then(res => { setRescheduleTeacherClasses(res.classes || []); setRescheduleTeacherDemos(res.demos || []); })
        .catch(() => { setRescheduleTeacherClasses([]); setRescheduleTeacherDemos([]); })
      : Promise.resolve();
    Promise.all([fetchStudent, fetchTeacher]).finally(() => setRescheduleLoadingSlots(false));
  }, [rescheduleData?.date, rescheduleData?.student_id, rescheduleData?.teacher_id]);

  // Fetch availability when edit date or teacher changes
  useEffect(() => {
    if (!editData?.date || (!editData?.teacher_id && !editData?.student_id)) return;
    setEditLoadingSlots(true);
    const fetchTeacher = editData.teacher_id
      ? apiFetch(`/teachers/${editData.teacher_id}/availability?start_date=${editData.date}&end_date=${editData.date}`)
        .then(res => { setEditTeacherClasses(res.classes || []); setEditTeacherDemos(res.demos || []); })
        .catch(() => { setEditTeacherClasses([]); setEditTeacherDemos([]); })
      : Promise.resolve();
    const fetchStudent = editData.student_id
      ? apiFetch(`/students/${editData.student_id}/availability?start_date=${editData.date}&end_date=${editData.date}`)
        .then(res => setEditStudentClasses(res.classes || []))
        .catch(() => setEditStudentClasses([]))
      : Promise.resolve();
    Promise.all([fetchTeacher, fetchStudent]).finally(() => setEditLoadingSlots(false));
  }, [editData?.date, editData?.teacher_id, editData?.student_id]);

  async function submitReschedule(e) {
    e.preventDefault();
    try {
      await apiFetch(`/sessions/${rescheduleData.id}/reschedule`, {
        method: 'PUT',
        body: JSON.stringify({ session_date: rescheduleData.date, started_at: rescheduleData.time, duration_hours: Number(rescheduleData.duration) })
      });
      setRescheduleData(null);
      await loadAllSessions();
    } catch (e) { setError(e.message); }
  }

  function isRescheduleSlotOverlapping(slotValue) {
    if (!rescheduleData?.duration || Number(rescheduleData.duration) <= 0) return false;
    const [sH, sM] = slotValue.split(':').map(Number);
    const newStart = sH * 60 + sM;
    const newEnd = newStart + Number(rescheduleData.duration) * 60;
    for (const cls of rescheduleStudentClasses) {
      if (cls.id === rescheduleData.id) continue;
      const t = (cls.started_at || '').slice(0, 5);
      if (!t) continue;
      const [cH, cM] = t.split(':').map(Number);
      const cStart = cH * 60 + cM, cEnd = cStart + (cls.duration_hours || 1) * 60;
      if (newStart < cEnd && newEnd > cStart) return 'student';
    }
    for (const cls of rescheduleTeacherClasses) {
      if (cls.id === rescheduleData.id) continue;
      const t = (cls.started_at || '').slice(0, 5);
      if (!t) continue;
      const [cH, cM] = t.split(':').map(Number);
      const cStart = cH * 60 + cM, cEnd = cStart + (cls.duration_hours || 1) * 60;
      if (newStart < cEnd && newEnd > cStart) return 'teacher';
    }
    for (const demo of rescheduleTeacherDemos) {
      if (!demo.scheduled_at) continue;
      const ds = new Date(demo.scheduled_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      const [dH, dM] = ds.split(':').map(Number);
      const dStart = dH * 60 + dM, dEnd = dStart + 60;
      if (newStart < dEnd && newEnd > dStart) return 'teacher';
    }
    return false;
  }

  async function submitEdit(e) {
    e.preventDefault();
    try {
      await apiFetch(`/sessions/${editData.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          subject: editData.subject,
          session_date: editData.date,
          started_at: editData.time,
          duration_hours: Number(editData.duration),
          status: editData.status,
          teacher_id: editData.teacher_id || undefined
        })
      });
      setEditData(null);
      await loadAllSessions();
    } catch (e) { setError(e.message); }
  }

  function isEditSlotOverlapping(slotValue) {
    if (!editData?.duration || Number(editData.duration) <= 0) return false;
    const [sH, sM] = slotValue.split(':').map(Number);
    const newStart = sH * 60 + sM;
    const newEnd = newStart + Number(editData.duration) * 60;
    for (const cls of editStudentClasses) {
      if (cls.id === editData.id) continue;
      const t = (cls.started_at || '').slice(0, 5);
      if (!t) continue;
      const [cH, cM] = t.split(':').map(Number);
      const cStart = cH * 60 + cM;
      const cEnd = cStart + Number(cls.duration_hours || 1) * 60;
      if (newStart < cEnd && newEnd > cStart) return 'student';
    }
    for (const cls of editTeacherClasses) {
      if (cls.id === editData.id) continue;
      const t = (cls.started_at || '').slice(0, 5);
      if (!t) continue;
      const [cH, cM] = t.split(':').map(Number);
      const cStart = cH * 60 + cM;
      const cEnd = cStart + Number(cls.duration_hours || 1) * 60;
      if (newStart < cEnd && newEnd > cStart) return 'teacher';
    }
    for (const demo of editTeacherDemos) {
      if (!demo.scheduled_at) continue;
      const ds = new Date(demo.scheduled_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      const [dH, dM] = ds.split(':').map(Number);
      const dStart = dH * 60 + dM;
      const dEnd = dStart + 60;
      if (newStart < dEnd && newEnd > dStart) return 'teacher';
    }
    return false;
  }

  async function handleDelete(id) {
    try {
      await apiFetch(`/sessions/${id}`, { method: 'DELETE' });
      setDeleteConfirmId(null);
      await loadAllSessions();
    } catch (e) { setError(e.message); }
  }

  // 15-min time slots
  const timeSlots = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 22 && m > 0) break;
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const hr12 = h % 12 || 12;
      const ampm = h >= 12 ? 'PM' : 'AM';
      timeSlots.push({ value: `${hh}:${mm}`, label: `${hr12}:${mm} ${ampm}` });
    }
  }

  function formatTime12(timeStr) {
    if (!timeStr) return '—';
    if (timeStr.includes('T')) {
      return new Date(timeStr).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    }
    const [h, m] = timeStr.split(':');
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const dHr = hr % 12 || 12;
    return `${dHr}:${m} ${ampm}`;
  }

  const allTeacherOpts = useMemo(() => allTeachers.map(t => ({ value: t.user_id, label: t.users?.full_name || t.user_id })), [allTeachers]);
  const allStudentOpts = useMemo(() => allStudents.map(s => ({ value: s.id, label: s.student_name || s.id })), [allStudents]);
  const DAY_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card">
        <div className="filter-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', alignItems: 'end' }}>
          <SearchSelect label="Date Range" value={datePreset} onChange={setDatePreset} options={[
            { value: 'All', label: 'All Time' },
            { value: 'Today', label: 'Today' },
            { value: 'Last Week', label: 'Last Week' },
            { value: 'Next Week', label: 'Next Week' },
            { value: 'Custom', label: 'Custom Range' }
          ]} placeholder="Select Range" />

          {datePreset === 'Custom' && (
            <>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Start Date</label>
                <input type="date" value={fStart} onChange={e => setFStart(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>End Date</label>
                <input type="date" value={fEnd} onChange={e => setFEnd(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }} />
              </div>
            </>
          )}
          <SearchSelect label="Teacher" value={fTeacher} onChange={setFTeacher} options={allTeacherOpts} placeholder="All Teachers" />
          <SearchSelect label="Student" value={fStudent} onChange={setFStudent} options={allStudentOpts} placeholder="All Students" />
          <SearchSelect label="Status" value={fStatus} onChange={setFStatus} options={[
            { value: 'scheduled', label: 'Upcoming / Scheduled' },
            { value: 'completed', label: 'Taken / Completed' },
            { value: 'pending', label: 'Pending Verification' }
          ]} placeholder="All Status" />
        </div>

        <div className="table-wrap mobile-friendly-table" style={{ marginTop: '16px' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Day</th><th>Time</th><th>Student</th><th>Teacher</th><th>Subject</th><th>Hrs</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allSessions.map(s => {
                const dayName = s.session_date ? DAY_MAP[new Date(s.session_date).getUTCDay()] : '—';
                const isUpcoming = s.status === 'scheduled';
                return (
                  <tr key={s.id}>
                    <td data-label="Date">{s.session_date}</td>
                    <td data-label="Day">{dayName}</td>
                    <td data-label="Time">{formatTime12(s.started_at)}</td>
                    <td data-label="Student">{s.students?.student_name || s.student_id}</td>
                    <td data-label="Teacher">{s.users?.full_name || s.teacher_id}</td>
                    <td data-label="Subject">{s.subject || '—'}</td>
                    <td data-label="Hrs">{s.duration_hours}h</td>
                    <td data-label="Status">
                      <span className={`status-tag ${s.status === 'completed' ? 'primary' : s.status === 'scheduled' ? 'warning' : ''}`}>{s.status}</span>
                      {s.status === 'completed' && <span className={`status-tag small ${s.verification_status === 'approved' ? 'success' : 'muted'}`} style={{ marginLeft: 4 }}>{s.verification_status}</span>}
                    </td>
                    <td className="actions" data-label="Actions" style={{ whiteSpace: 'nowrap' }}>
                      {isUpcoming && <button type="button" className="small secondary" onClick={() => setRescheduleData({
                        id: s.id,
                        student_id: s.student_id || '',
                        teacher_id: s.teacher_id || '',
                        date: s.session_date || '',
                        time: s.started_at ? s.started_at.slice(11, 16) : '',
                        duration: s.duration_hours || 1
                      })}>Reschedule</button>}
                      {s.status !== 'completed' && (
                        <button
                          type="button" title="Edit session"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '2px 5px' }}
                          onClick={() => setEditData({
                            id: s.id,
                            teacher_id: s.teacher_id || '',
                            student_id: s.student_id || '',
                            subject: s.subject || '',
                            date: s.session_date || '',
                            time: s.started_at ? s.started_at.slice(11, 16) : '',
                            duration: s.duration_hours || 1,
                            status: s.status || 'scheduled'
                          })}>✏️</button>
                      )}
                      {s.status !== 'completed' && (
                        <button
                          type="button" title="Delete session"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '2px 5px' }}
                          onClick={() => setDeleteConfirmId(s.id)}>🗑️</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!allSessions.length ? <tr><td colSpan="9">No sessions match filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </article>

      {rescheduleData && (() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
        return (
          <div className="modal-overlay" onClick={() => setRescheduleData(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
              <h3>Reschedule Session</h3>
              <form onSubmit={submitReschedule}>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
                  <label>Date
                    <input type="date" value={rescheduleData.date} min={todayStr}
                      onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value, time: '' })} required />
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>Start Time
                      <select value={rescheduleData.time} onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })} required disabled={rescheduleLoadingSlots}>
                        <option value="">{rescheduleLoadingSlots ? 'Checking...' : 'Select time'}</option>
                        {timeSlots.map(t => {
                          const overlap = isRescheduleSlotOverlapping(t.value);
                          const [tH, tM] = t.value.split(':').map(Number);
                          const isPast = rescheduleData.date === todayStr && (tH * 60 + tM) <= nowMins;
                          const disabled = !!overlap || isPast;
                          const suffix = overlap === 'student' ? ' (Student Busy)' : overlap === 'teacher' ? ' (Teacher Busy)' : isPast ? ' (Past)' : '';
                          return <option key={t.value} value={t.value} disabled={disabled}>{t.label}{suffix}</option>;
                        })}
                      </select>
                    </label>
                    <label>Duration (hrs)
                      <select value={rescheduleData.duration} onChange={e => setRescheduleData({ ...rescheduleData, duration: e.target.value })}>
                        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(h => <option key={h} value={h}>{h}h</option>)}
                      </select>
                    </label>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="secondary" onClick={() => setRescheduleData(null)}>Cancel</button>
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Edit Session Modal */}
      {editData && (() => {
        const editTeacher = allTeachers.find(t => t.user_id === editData.teacher_id);
        const editSubjects = editTeacher
          ? (Array.isArray(editTeacher.subjects_taught)
            ? editTeacher.subjects_taught
            : (typeof editTeacher.subjects_taught === 'string'
              ? JSON.parse(editTeacher.subjects_taught || '[]')
              : []))
          : [];
        const todayStr = new Date().toISOString().split('T')[0];
        const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
        return (
          <div className="modal-overlay" onClick={() => setEditData(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <h3>Edit Session</h3>
              <form onSubmit={submitEdit}>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
                  {/* Teacher */}
                  <label>Teacher
                    <select value={editData.teacher_id} onChange={e => setEditData({ ...editData, teacher_id: e.target.value, subject: '', time: '' })} required>
                      <option value="">Select teacher</option>
                      {allTeachers.map(t => <option key={t.user_id} value={t.user_id}>{t.users?.full_name || t.user_id}</option>)}
                    </select>
                  </label>
                  {/* Subject */}
                  <label>Subject
                    <select value={editData.subject} onChange={e => setEditData({ ...editData, subject: e.target.value })} required>
                      <option value="">{editData.teacher_id ? 'Select subject' : 'Pick teacher first'}</option>
                      {editSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  {/* Date & Duration */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>Date
                      <input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value, time: '' })} required />
                    </label>
                    <label>Duration (hrs)
                      <select value={editData.duration} onChange={e => setEditData({ ...editData, duration: e.target.value })}>
                        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(h => <option key={h} value={h}>{h}h</option>)}
                      </select>
                    </label>
                  </div>
                  {/* Time (availability-gated) & Status */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>Start Time
                      <select value={editData.time} onChange={e => setEditData({ ...editData, time: e.target.value })} required disabled={editLoadingSlots}>
                        <option value="">{editLoadingSlots ? 'Checking availability...' : 'Select time'}</option>
                        {timeSlots.map(t => {
                          const overlap = isEditSlotOverlapping(t.value);
                          const [tH, tM] = t.value.split(':').map(Number);
                          const isPast = editData.date === todayStr && (tH * 60 + tM) <= nowMins;
                          const disabled = !!overlap || isPast;
                          const suffix = overlap === 'student' ? ' (Student Busy)' : overlap === 'teacher' ? ' (Teacher Busy)' : isPast ? ' (Past)' : '';
                          return <option key={t.value} value={t.value} disabled={disabled}>{t.label}{suffix}</option>;
                        })}
                      </select>
                    </label>
                    <label>Status
                      <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="secondary" onClick={() => setEditData(null)}>Cancel</button>
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '360px', textAlign: 'center' }}>
            <h3>Delete Session?</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>This action cannot be undone. The session will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button style={{ background: '#ef4444', color: '#fff', border: 'none' }} onClick={() => handleDelete(deleteConfirmId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════ Verifications (separate page — only teacher-submitted approvals) ═══════ */
function ApprovalTable({ items, fTeacher, fStudent, onVerify }) {
  const [durationOverrides, setDurationOverrides] = useState({});

  const filtered = items.filter(s => {
    if (fTeacher && s.teacher_id !== fTeacher) return false;
    if (fStudent && s.student_id !== fStudent) return false;
    return true;
  });

  return (
    <div className="table-wrap mobile-friendly-table" style={{ marginTop: '12px' }}>
      <table>
        <thead>
          <tr><th>Requested At</th><th>Date</th><th>Student</th><th>Teacher</th><th>Subject</th><th>Note / Reason</th><th>Duration (Override)</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filtered.map((item) => {
            const pendingV = Array.isArray(item.session_verifications)
              ? item.session_verifications.find(v => v.status === 'pending' && v.type === 'approval')
              : item.session_verifications;
            const requestedAt = pendingV?.created_at
              ? new Date(pendingV.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })
              : '—';
            return (
              <tr key={item.id}>
                <td data-label="Requested At">{requestedAt}</td>
                <td data-label="Date">{item.session_date || '-'}</td>
                <td data-label="Student">{item.students?.student_name || item.student_id}</td>
                <td data-label="Teacher">{item.users?.full_name || item.teacher_id}</td>
                <td data-label="Subject">{item.subject || '—'}</td>
                <td data-label="Note" style={{ maxWidth: '200px', fontSize: '13px' }}>{pendingV?.reason ? <span style={{ color: '#4b5563', fontStyle: 'italic' }}>"{pendingV.reason}"</span> : '—'}</td>
                <td data-label="Duration">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      style={{ width: '70px', padding: '4px', fontSize: '13px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                      value={durationOverrides[item.id] !== undefined ? durationOverrides[item.id] : (item.duration_hours || 1)}
                      onChange={(e) => setDurationOverrides(prev => ({ ...prev, [item.id]: e.target.value }))}
                    />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>hrs</span>
                  </div>
                </td>
                <td className="actions" data-label="Actions">
                  <button type="button" onClick={() => {
                    const finalDuration = durationOverrides[item.id] !== undefined ? Number(durationOverrides[item.id]) : Number(item.duration_hours || 1);
                    onVerify(item.id, true, 'approval', finalDuration);
                  }}>Approve</button>
                  <button type="button" className="danger" onClick={() => onVerify(item.id, false, 'approval')}>Reject</button>
                </td>
              </tr>
            );
          })}
          {!filtered.length ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>No pending session approvals.</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function RescheduleTable({ items, fTeacher, fStudent, onVerify }) {
  const filtered = items.filter(item => {
    const s = item.academic_sessions || {};
    if (fTeacher && s.teacher_id !== fTeacher) return false;
    if (fStudent && s.student_id !== fStudent) return false;
    return true;
  });

  return (
    <div className="table-wrap mobile-friendly-table" style={{ marginTop: '12px' }}>
      <table>
        <thead>
          <tr>
            <th>Requested At</th><th>Current Date</th><th>Student</th><th>Teacher</th><th>Reason</th><th>New Date</th><th>New Time</th><th>Duration</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => {
            const session = item.academic_sessions || {};
            const requestedAt = item.created_at
              ? new Date(item.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })
              : '—';
            return (
              <tr key={item.id}>
                <td data-label="Requested At">{requestedAt}</td>
                <td data-label="Current Date">{session.session_date || '-'}</td>
                <td data-label="Student">{session.students?.student_name || session.student_id || '—'}</td>
                <td data-label="Teacher">{session.users?.full_name || session.teacher_id || '—'}</td>
                <td data-label="Reason" style={{ maxWidth: '200px' }}>{item.reason || '—'}</td>
                <td data-label="New Date">
                  {item.new_date ? (
                    <span style={{ fontWeight: 600, color: '#1d4ed8' }}>{item.new_date}</span>
                  ) : <span className="text-muted">Same</span>}
                </td>
                <td data-label="New Time">
                  {item.new_time ? (
                    <span style={{ fontWeight: 600, color: '#1d4ed8' }}>{item.new_time}</span>
                  ) : <span className="text-muted">Same</span>}
                </td>
                <td data-label="Duration">
                  {item.new_duration ? (
                    <span style={{ fontWeight: 600, color: '#1d4ed8' }}>{item.new_duration}h</span>
                  ) : <span className="text-muted">Same ({session.duration_hours}h)</span>}
                </td>
                <td className="actions" data-label="Actions">
                  <button type="button" onClick={() => onVerify(session.id, true, 'reschedule')}>Approve</button>
                  <button type="button" className="danger" onClick={() => onVerify(session.id, false, 'reschedule')}>Reject</button>
                </td>
              </tr>
            );
          })}
          {!filtered.length ? (
            <tr><td colSpan="8" style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>No pending reschedule requests.</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export function VerificationsPage() {
  const [approvalItems, setApprovalItems] = useState([]);
  const [rescheduleItems, setRescheduleItems] = useState([]);
  const [activeTab, setActiveTab] = useState('approvals');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [fTeacher, setFTeacher] = useState('');
  const [fStudent, setFStudent] = useState('');

  const loadAll = useCallback(async () => {
    setError('');
    try {
      const [approvals, reschedules] = await Promise.all([
        apiFetch('/sessions/verification-queue'),
        apiFetch('/sessions/reschedule-queue')
      ]);
      setApprovalItems(approvals.items || []);
      setRescheduleItems(reschedules.items || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function verify(sessionId, approved, type, overrideDuration) {
    const action = approved ? 'approve' : 'reject';
    const reqName = type === 'approval' ? 'session completion and deduct student hours' : 'reschedule request';
    if (!window.confirm(`Are you sure you want to ${action} this ${reqName}?`)) return;

    setError('');
    try {
      const payload = { approved, type };
      if (typeof overrideDuration === 'number') {
        payload.override_duration = overrideDuration;
      }

      await apiFetch(`/sessions/${sessionId}/verify`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setMsg(approved ? 'Request approved!' : 'Request rejected.');
      setTimeout(() => setMsg(''), 4000);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  const teacherOpts = useMemo(() => {
    const m = new Map();
    approvalItems.forEach(s => { if (s.users?.full_name) m.set(s.teacher_id, s.users.full_name); });
    rescheduleItems.forEach(item => {
      const s = item.academic_sessions || {};
      if (s.users?.full_name) m.set(s.teacher_id, s.users.full_name);
    });
    return [...m.entries()].map(([value, label]) => ({ value, label }));
  }, [approvalItems, rescheduleItems]);

  const studentOpts = useMemo(() => {
    const m = new Map();
    approvalItems.forEach(s => { if (s.students?.student_name) m.set(s.student_id, s.students.student_name); });
    rescheduleItems.forEach(item => {
      const s = item.academic_sessions || {};
      if (s.students?.student_name) m.set(s.student_id, s.students.student_name);
    });
    return [...m.entries()].map(([value, label]) => ({ value, label }));
  }, [approvalItems, rescheduleItems]);

  const tabs = [
    { key: 'approvals', label: `Session Approvals (${approvalItems.length})` },
    { key: 'reschedules', label: `Reschedule Requests (${rescheduleItems.length})` }
  ];

  return (
    <section className="panel">
      <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Verifications</h2>
      {error ? <p className="error">{error}</p> : null}
      {msg ? <p style={{ color: '#15803d', fontWeight: 500 }}>{msg}</p> : null}

      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '0' }}>
        {tabs.map(t => (
          <button key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              border: 'none', background: 'none',
              borderBottom: activeTab === t.key ? '3px solid #4338ca' : '3px solid transparent',
              color: activeTab === t.key ? '#4338ca' : '#6b7280',
              marginBottom: '-2px', transition: 'all 0.2s'
            }}
          >{t.label}</button>
        ))}
      </div>

      <article className="card">
        <div className="filter-bar">
          <SearchSelect label="Teacher" value={fTeacher} onChange={setFTeacher} options={teacherOpts} placeholder="All Teachers" />
          <SearchSelect label="Student" value={fStudent} onChange={setFStudent} options={studentOpts} placeholder="All Students" />
        </div>
        {activeTab === 'approvals' ? (
          <ApprovalTable items={approvalItems} fTeacher={fTeacher} fStudent={fStudent} onVerify={verify} />
        ) : (
          <RescheduleTable items={rescheduleItems} fTeacher={fTeacher} fStudent={fStudent} onVerify={verify} />
        )}
      </article>
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
function formatTime12(t) {
  if (!t) return '';
  if (t.includes('T')) {
    return new Date(t).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  }
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

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
  const [viewTeacher, setViewTeacher] = useState(null);
  const [showSlotsFor, setShowSlotsFor] = useState(null);

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

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
  const fullDayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM (22)

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

      {view === 'table' ? <article className="card"><div className="table-wrap mobile-friendly-table"><table><thead><tr><th>Code</th><th>Name</th><th>Exp</th><th>Rate</th><th>Subjects</th><th>Languages</th><th>Syllabus</th><th>Pref. Time</th><th>View</th></tr></thead><tbody>{filtered.map(t => <tr key={t.id}><td data-label="Code">{t.teacher_code}</td><td data-label="Name">{t.users?.full_name || '—'}</td><td data-label="Exp">{t.experience_level || '—'}</td><td data-label="Rate">{t.per_hour_rate ? `₹${t.per_hour_rate}` : '—'}</td><td data-label="Subjects">{(t.subjects_taught || []).join(', ') || '—'}</td><td data-label="Languages">{(t.languages || []).join(', ') || '—'}</td><td data-label="Syllabus">{(t.syllabus || []).join(', ') || '—'}</td><td data-label="Pref. Time">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            className="secondary small"
            style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => { e.stopPropagation(); setShowSlotsFor(showSlotsFor === t.id ? null : t.id); }}
            title="View Availability"
          >
            <ClockIcon />
          </button>
          {showSlotsFor === t.id && (
            <div style={{
              position: 'absolute', top: '100%', right: '0', zIndex: 50,
              background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px',
              padding: '12px', minWidth: '220px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <strong style={{ fontSize: '12px', color: '#374151' }}>Preferred Slots</strong>
                <button type="button" onClick={() => setShowSlotsFor(null)} style={{ border: 'none', background: 'transparent', fontSize: '16px', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
              </div>
              {(t.teacher_availability && t.teacher_availability.length > 0) ? (
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {t.teacher_availability.map((s, idx) => (
                    <div key={idx} style={{ fontSize: '11px', marginBottom: '4px', paddingBottom: '4px', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontWeight: 600, color: '#4b5563', display: 'block' }}>{s.day_of_week}</span>
                      <span style={{ color: '#6b7280' }}>
                        {formatTime12(s.start_time)} - {formatTime12(s.end_time)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>No slots added.</p>
              )}
            </div>
          )}
        </div>
      </td><td data-label="View"><button onClick={() => setViewTeacher(t)} className="secondary small">View</button></td></tr>)}{!filtered.length ? <tr><td colSpan="9">No teachers match filters.</td></tr> : null}</tbody></table></div></article> : null}

      {view === 'map' ? <article className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p className="muted" style={{ fontSize: 13 }}>Availability for <strong>{dayLabels[selectedMapDay]}</strong> (Green = Available, Orange = Demo, Red = Scheduled)</p>
          <div className="day-tabs">
            {dayLabels.map((d, i) => <button key={d} type="button" className={`day-tab-btn ${selectedMapDay === i ? 'active' : ''}`} onClick={() => setSelectedMapDay(i)}>{d}</button>)}
          </div>
        </div>
        <div style={{ overflowX: 'hidden', width: '100%' }}>
          <table className="avail-map-table" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '150px', position: 'sticky', left: 0, zIndex: 10, background: 'white' }}>Teacher</th>
                {hours.map(h => <th key={h} colSpan={4} className="avail-map-th" style={{ textAlign: 'center', borderLeft: '1px solid #e5e7eb', fontSize: '10px', padding: '4px 0' }}>{h > 12 ? h - 12 : h}{h >= 12 ? 'p' : 'a'}</th>)}
              </tr>
              <tr>
                <th style={{ position: 'sticky', left: 0, zIndex: 10, background: 'white', height: '12px' }}></th>
                {hours.map(h => (
                  <Fragment key={h}>
                    {['00', '15', '30', '45'].map(m => (
                      <th key={m} style={{
                        padding: 0,
                        width: 'auto',
                        borderLeft: m === '00' ? '1px solid #e5e7eb' : 'none',
                      }} />
                    ))}
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody>{filtered.map(t => {
              const slots = (t.teacher_availability || []);
              const demos = (t.booked_demos || []);
              return <tr key={t.id}>
                <td style={{ width: '150px', whiteSpace: 'nowrap', fontWeight: 600, fontSize: 13, textAlign: 'left', padding: '4px 8px', position: 'sticky', left: 0, background: 'white', zIndex: 9, borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t.users?.full_name}>
                  {t.users?.full_name || t.teacher_code}
                  <br /><span className="muted" style={{ fontWeight: 400, fontSize: 11 }}>₹{t.per_hour_rate || '?'}/hr</span>
                </td>
                {hours.map(h => {
                  return [0, 15, 30, 45].map(m => {
                    const cellStart = h * 60 + m;
                    const cellEnd = cellStart + 15;

                    const isAvail = slots.some(s => {
                      if (s.day_of_week !== fullDayLabels[selectedMapDay]) return false;
                      const [sh, sm] = s.start_time.split(':').map(Number);
                      const [eh, em] = s.end_time.split(':').map(Number);
                      const startMins = sh * 60 + sm;
                      const endMins = eh * 60 + em;
                      return startMins <= cellStart && endMins > cellStart;
                    });

                    // Check if a demo is booked in this cell
                    const isDemo = demos.some(d => {
                      if (!d.scheduled_at) return false;
                      const dDate = new Date(d.scheduled_at);
                      const dDay = dDate.toLocaleDateString('en-US', { weekday: 'long' });
                      if (dDay !== fullDayLabels[selectedMapDay]) return false;
                      const dStartMins = dDate.getHours() * 60 + dDate.getMinutes();
                      const dEndMins = d.ends_at ? new Date(d.ends_at).getHours() * 60 + new Date(d.ends_at).getMinutes() : dStartMins + 60;
                      return dStartMins <= cellStart && dEndMins > cellStart;
                    });

                    // Check if a regular class is scheduled
                    const isScheduled = (t.assigned_classes || []).some(a => {
                      if (a.day !== fullDayLabels[selectedMapDay]) return false;
                      if (!a.time) return false;
                      const [sh, sm] = a.time.split(':').map(Number);
                      const startMins = sh * 60 + sm;
                      const endMins = startMins + 60; // Assuming 1 hour per regular class
                      return startMins <= cellStart && endMins > cellStart;
                    });

                    const cellClass = isScheduled ? 'avail-cell avail-no' : (isDemo ? 'avail-cell avail-demo' : (isAvail ? 'avail-cell avail-yes' : 'avail-cell'));

                    const timeWindow = `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'} - ${(() => {
                      const nextMins = cellStart + 15;
                      const nH = Math.floor(nextMins / 60);
                      const nM = nextMins % 60;
                      return `${nH > 12 ? nH - 12 : nH === 0 ? 12 : nH}:${nM.toString().padStart(2, '0')} ${nH >= 12 ? 'PM' : 'AM'}`;
                    })()}`;

                    const title = isScheduled
                      ? `${timeWindow} (Scheduled Class)`
                      : isDemo
                        ? `${timeWindow} (Demo Booked)`
                        : `${timeWindow} (${isAvail ? 'Available' : 'Unavailable'})`;

                    return (
                      <td
                        key={`${h}-${m}`}
                        className={cellClass}
                        style={{
                          borderLeft: 'none',
                          borderRight: 'none',
                          height: '30px',
                          padding: 0,
                          background: isScheduled ? '#ef4444' : (isDemo ? '#fb923c' : (isAvail ? '#22c55e' : 'transparent')),
                          boxShadow: m === 0 ? '-1px 0 0 #e5e7eb' : 'none'
                        }}
                        title={title}
                      />
                    );
                  });
                })}
              </tr>;
            })}</tbody>
          </table>
        </div>
      </article> : null}

      {viewTeacher && <ViewTeacherModal teacher={viewTeacher} onClose={() => setViewTeacher(null)} />}
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

/* ─── Helpers & Icons for ViewTeacherModal ─── */
const Icon = ({ d, color = 'currentColor', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

const ICONS = {
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  x: 'M18 6L6 18M6 6l12 12',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
  chevronDown: 'M6 9l6 6 6-6',
  chevronUp: 'M18 15l-6-6-6 6'
};

/* ─── Custom Dropdown ─── */
function CustomDropdown({ value, onChange, options, placeholder, icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="custom-dropdown" ref={ref}>
      <div className={`custom-dropdown-trigger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selected?.icon && <Icon d={selected.icon} size={14} color={open ? 'var(--primary)' : 'var(--muted)'} />}
          {selected ? <span>{selected.label}</span> : <span className="dd-placeholder">{placeholder || 'Select...'}</span>}
        </div>
        <Icon d={ICONS.chevronDown} size={12} className="custom-dropdown-arrow" />
      </div>
      {open && (
        <div className="custom-dropdown-menu">
          {options.map(o => (
            <div key={o.value}
              className={`custom-dropdown-item${o.value === value ? ' selected' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}>
              {o.icon && <Icon d={o.icon} size={14} />}
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Multi-Select Dropdown with "Create new" ─── */
function MultiSelectDropdown({ value = [], onChange, options, placeholder, onCreate }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));
  const exactMatch = options.some(o => o.toLowerCase() === search.toLowerCase());

  const toggle = (opt) => {
    const set = new Set(value);
    if (set.has(opt)) set.delete(opt);
    else set.add(opt);
    onChange(Array.from(set));
  };

  return (
    <div className="custom-dropdown" ref={ref}>
      <div className={`custom-dropdown-trigger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} style={{ minHeight: '42px', height: 'auto', flexWrap: 'wrap', gap: '4px' }}>
        {value.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
            {value.map(v => (
              <span key={v} style={{ background: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {v} <span onClick={(e) => { e.stopPropagation(); toggle(v); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Icon d="M18 6L6 18M6 6l12 12" size={12} /></span>
              </span>
            ))}
          </div>
        ) : <span className="dd-placeholder">{placeholder || 'Select...'}</span>}
        <Icon d="M6 9l6 6 6-6" size={14} />
      </div>
      {open && (
        <div className="custom-dropdown-menu">
          <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', border: 'none', borderBottom: '1px solid #eee', padding: '8px 12px', fontSize: '13px', outline: 'none', marginBottom: '4px' }} />
          <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {filtered.map(opt => (
              <div key={opt} className={`custom-dropdown-item${value.includes(opt) ? ' selected' : ''}`}
                onClick={() => toggle(opt)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {opt}
                {value.includes(opt) && <span style={{ color: '#3b82f6' }}><Icon d="M20 6L9 17l-5-5" size={14} /></span>}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: '8px 12px', fontSize: '12px', color: '#999' }}>No options found</div>}
          </div>
          {search && !exactMatch && onCreate && (
            <div onClick={() => { onCreate(search); setSearch(''); }}
              style={{ padding: '10px 12px', background: '#eff6ff', color: '#3b82f6', borderTop: '1px solid #dbeafe', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon d="M12 5v14M5 12h14" size={12} /> Create "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const STATUS_COLORS = {
  new: '#6366f1',
  contacted: '#8b5cf6',
  first_interview: '#f59e0b',
  first_interview_done: '#e67e22',
  second_interview: '#3b82f6',
  second_interview_done: '#0ea5e9',
  approved: '#10b981',
  rejected: '#ef4444',
  closed: '#6b7280'
};

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  first_interview: 'First Interview',
  first_interview_done: 'First Interview Done',
  second_interview: 'Second Interview',
  second_interview_done: 'Second Interview Done',
  approved: 'Approved',
  rejected: 'Rejected',
  closed: 'Closed'
};

function parseSubjects(s) {
  if (Array.isArray(s)) return s;
  if (typeof s === 'string') { try { const p = JSON.parse(s); return Array.isArray(p) ? p : []; } catch { return s ? [s] : []; } }
  return [];
}

/* ─── View Lead Modal (Reused for Teachers) ─── */
/* ─── View Lead Modal (Reused for Teachers) ─── */
function ViewTeacherModal({ teacher, onClose }) {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  // Adapt teacher object to lead structure if needed or use as is
  // The teacher object from pool has users.full_name, phone, etc.
  const lead = {
    ...teacher,
    full_name: teacher.users?.full_name || 'Unknown',
    email: teacher.users?.email,
    status: 'approved' // Teachers are approved
  };

  const subjects = parseSubjects(teacher.subjects_taught);
  const languages = parseSubjects(teacher.languages);
  const syllabus = parseSubjects(teacher.syllabus);

  const gridRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' };

  const ReadOnlyField = ({ label, value, full }) => (
    <div style={{ gridColumn: full ? 'span 2' : 'auto' }}>
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

  if (isEditing) {
    return <EditTeacherModal teacher={teacher} onClose={() => setIsEditing(false)} onSave={() => { setIsEditing(false); onClose(); /* Refresh triggers parent re-render? No, need to trigger reload or refetch */ window.location.reload(); }} />;
  }

  return (
    <div className="modal-overlay">
      <div className="modal card" style={{ maxWidth: '800px', width: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>
        <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>{lead.full_name}</h3>
            <Badge color="#10b981">Active Teacher</Badge>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}>
            <Icon d={ICONS.x} size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Personal Information</h4>
          <div style={gridRow}>
            <ReadOnlyField label="Full Name" value={lead.full_name} />
            <ReadOnlyField label="Teacher Code" value={teacher.teacher_code} />
          </div>
          <div style={gridRow}>
            <ReadOnlyField label="Phone" value={lead.phone} />
            <ReadOnlyField label="Email" value={lead.email} />
          </div>
          <div style={gridRow}>
            <ReadOnlyField label="Gender" value={teacher.gender} />
            <ReadOnlyField label="Date of Birth" value={teacher.dob} />
          </div>
          <div style={gridRow}>
            <ReadOnlyField label="Address" value={teacher.address} />
            <ReadOnlyField label="Pincode" value={teacher.pincode} />
          </div>
          <div style={gridRow}>
            <ReadOnlyField label="Place/Area" value={teacher.place} />
            <ReadOnlyField label="City" value={teacher.city} />
          </div>

          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginTop: '24px' }}>Professional Details</h4>
          <div style={{ ...gridRow, gridTemplateColumns: '1fr 1fr 1fr' }}>
            <ReadOnlyField label="Subjects" value={subjects.length ? subjects.map((s, i) => <Badge key={i} color="#3b82f6">{s}</Badge>) : null} />
            <ReadOnlyField label="Languages" value={languages.length ? languages.map((b, i) => <Badge key={i} color="#8b5cf6">{b}</Badge>) : null} />
            <ReadOnlyField label="Syllabus" value={syllabus.length ? syllabus.map((m, i) => <Badge key={i} color="#15803d">{m}</Badge>) : null} />
          </div>

          <div style={{ ...gridRow, gridTemplateColumns: '1fr 1fr 1fr' }}>
            <ReadOnlyField label="Experience" value={teacher.experience_level} />
            <ReadOnlyField label="Exp. Duration" value={teacher.experience_duration} />
            <ReadOnlyField label="Rate/hr" value={teacher.per_hour_rate ? `₹${teacher.per_hour_rate}` : '—'} />
          </div>
          <div style={gridRow}>
            <ReadOnlyField label="Communication Level" value={teacher.communication_level} />
            <ReadOnlyField label="Pref. Time" value={teacher.preferred_time} />
          </div>

          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginTop: '24px' }}>Bank Details</h4>
          <div style={gridRow}>
            <ReadOnlyField label="Account Holder" value={teacher.account_holder_name} />
            <ReadOnlyField label="Account Number" value={teacher.account_number} />
          </div>
          <div style={gridRow}>
            <ReadOnlyField label="IFSC Code" value={teacher.ifsc_code} />
            <ReadOnlyField label="UPI ID" value={teacher.upi_id} />
          </div>
          <div style={gridRow}>
            <ReadOnlyField label="GPay Name" value={teacher.gpay_holder_name} />
            <ReadOnlyField label="GPay Number" value={teacher.gpay_number} />
          </div>

          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginTop: '24px' }}>Availability Slots</h4>
          <div className="table-wrap mobile-friendly-table">
            <table>
              <thead><tr><th>Day</th><th>From</th><th>To</th></tr></thead>
              <tbody>
                {(teacher.teacher_availability || []).map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.day_of_week}</td>
                    <td>{formatTime12(s.start_time)}</td>
                    <td>{formatTime12(s.end_time)}</td>
                  </tr>
                ))}
                {!(teacher.teacher_availability || []).length && <tr><td colSpan="3" style={{ textAlign: 'center', color: '#9ca3af' }}>No slots added.</td></tr>}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button onClick={() => setIsEditing(true)} className="primary">Edit Details</button>
            <button onClick={onClose} className="secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditTeacherModal({ teacher, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Metadata state
  const [allSubjects, setAllSubjects] = useState([]);
  const [allBoards, setAllBoards] = useState([]);
  const [allMediums, setAllMediums] = useState([]);

  const [formData, setFormData] = useState({
    full_name: teacher.users?.full_name || '',
    phone: teacher.phone || '',
    email: teacher.users?.email || '', // Read-only usually
    gender: teacher.gender || '',
    dob: teacher.dob || '',
    address: teacher.address || '',
    pincode: teacher.pincode || '',
    city: teacher.city || '',
    place: teacher.place || '',
    qualification: teacher.qualification || '',

    // Dropdowns / MultiSelects
    subjects_taught: parseSubjects(teacher.subjects_taught),
    syllabus: parseSubjects(teacher.syllabus), // Boards
    languages: parseSubjects(teacher.languages), // Mediums

    experience_level: teacher.experience_level || 'fresher',
    experience_type: teacher.experience_type || '',
    experience_duration: teacher.experience_duration || '',
    per_hour_rate: teacher.per_hour_rate || '',
    communication_level: teacher.communication_level || '',

    // Bank
    account_holder_name: teacher.account_holder_name || '',
    account_number: teacher.account_number || '',
    ifsc_code: teacher.ifsc_code || '',
    upi_id: teacher.upi_id || '',
    gpay_holder_name: teacher.gpay_holder_name || '',
    gpay_number: teacher.gpay_number || ''
  });

  useEffect(() => {
    apiFetch('/subjects').then(r => r.ok && setAllSubjects(r.subjects.map(s => s.name)));
    apiFetch('/boards').then(r => r.ok && setAllBoards(r.boards.map(b => b.name)));
    apiFetch('/mediums').then(r => r.ok && setAllMediums(r.mediums.map(m => m.name)));
  }, []);

  const createSubject = async (name) => {
    const res = await apiFetch('/subjects', { method: 'POST', body: { name } });
    if (res.ok) {
      setAllSubjects(prev => [...prev, res.subject.name].sort());
      setFormData(f => ({ ...f, subjects_taught: [...f.subjects_taught, res.subject.name] }));
    }
  };

  const createBoard = async (name) => {
    const res = await apiFetch('/boards', { method: 'POST', body: { name } });
    if (res.ok) {
      setAllBoards(prev => [...prev, res.board.name].sort());
      setFormData(f => ({ ...f, syllabus: [...f.syllabus, res.board.name] }));
    }
  };

  const createMedium = async (name) => {
    const res = await apiFetch('/mediums', { method: 'POST', body: { name } });
    if (res.ok) {
      setAllMediums(prev => [...prev, res.medium.name].sort());
      setFormData(f => ({ ...f, languages: [...f.languages, res.medium.name] }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiFetch(`/teachers/${teacher.id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData)
      });
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', required, style }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{label} {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
        required={required}
      />
    </div>
  );

  const isExperienced = formData.experience_level !== 'fresher';

  return (
    <div className="modal-overlay">
      <div className="modal card" style={{ maxWidth: '800px', width: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>Edit Teacher Details</h3>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}>
              <Icon d={ICONS.x} size={20} />
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            {error && <div className="error-message" style={{ marginBottom: '16px', color: '#dc2626', background: '#fee2e2', padding: '12px', borderRadius: '6px' }}>{error}</div>}

            {/* Personal Details */}
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Personal Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <InputField label="Full Name" name="full_name" required />
              <InputField label="Phone" name="phone" />
              <InputField label="Gender" name="gender" />
              <InputField label="Date of Birth" name="dob" type="date" />
              <InputField label="Address" name="address" />
              <InputField label="Pincode" name="pincode" />
              <InputField label="Place/Area" name="place" />
              <InputField label="City" name="city" />
            </div>

            {/* Professional Details */}
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginTop: '20px', marginBottom: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>Professional Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <InputField label="Qualification" name="qualification" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Communication Level</label>
                <CustomDropdown
                  value={formData.communication_level}
                  onChange={v => updateField('communication_level', v)}
                  options={['Fluent', 'Mixed', 'Average', 'Poor'].map(l => ({ value: l, label: l }))}
                  placeholder="Select level"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Experience Level</label>
                <CustomDropdown
                  value={formData.experience_level}
                  onChange={v => updateField('experience_level', v)}
                  options={[{ value: 'fresher', label: 'Fresher' }, { value: 'experienced', label: 'Experienced' }]}
                  placeholder="Select level"
                />
              </div>
              {isExperienced && (
                <>
                  <InputField label="Exp. Type" name="experience_type" />
                  <InputField label="Exp. Duration" name="experience_duration" />
                </>
              )}
              <InputField label="Rate per Hour" name="per_hour_rate" type="number" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Subjects</label>
                <MultiSelectDropdown
                  value={formData.subjects_taught}
                  onChange={v => updateField('subjects_taught', v)}
                  options={allSubjects}
                  onCreate={createSubject}
                  placeholder="Select subjects..."
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Languages (Mediums)</label>
                <MultiSelectDropdown
                  value={formData.languages}
                  onChange={v => updateField('languages', v)}
                  options={allMediums}
                  onCreate={createMedium}
                  placeholder="Select languages..."
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Syllabus (Boards)</label>
                <MultiSelectDropdown
                  value={formData.syllabus}
                  onChange={v => updateField('syllabus', v)}
                  options={allBoards}
                  onCreate={createBoard}
                  placeholder="Select boards..."
                />
              </div>
            </div>

            {/* Bank Details */}
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginTop: '20px', marginBottom: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>Bank Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <InputField label="Account Holder Name" name="account_holder_name" />
              <InputField label="Account Number" name="account_number" />
              <InputField label="IFSC Code" name="ifsc_code" />
              <InputField label="UPI ID" name="upi_id" />
              <InputField label="GPay Name" name="gpay_holder_name" />
              <InputField label="GPay Number" name="gpay_number" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <button type="button" onClick={onClose} className="secondary">Cancel</button>
              <button type="submit" className="primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
