import { useEffect, useMemo, useState, useCallback, useRef, Fragment } from 'react';
import { apiFetch } from '../../lib/api.js';

function ExpandableMobileCard({ title, subtitle, topRight, mainStats, expandedContent, actions, borderColor }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card" style={{ padding: '16px', position: 'relative', borderLeft: borderColor ? `4px solid ${borderColor}` : undefined, width: '100%' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: expanded ? '12px' : '0' }}>
        <div>
          <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600 }}>{title || '—'}</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          {topRight}
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', color: '#6b7280', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </div>
      </div>
      {!expanded && mainStats && <div onClick={() => setExpanded(true)} style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '13px', cursor: 'pointer' }}>{mainStats}</div>}
      {expanded && <div style={{ marginTop: '12px', animation: 'fadeIn 0.2s ease-in' }}>{expandedContent}{actions && <div style={{ marginTop: '16px' }}>{actions}</div>}</div>}
    </div>
  );
}

// Map helper function to return proper colors
const getStatusColor = (status) => {
  switch (status) {
    case 'active': return '#22c55e'; // green
    case 'pending': return '#f97316'; // orange
    case 'inactive': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
};
import { SearchSelect } from '../../components/ui/SearchSelect.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';

/** Check if a scheduled session's class time has already passed */
function isSessionOverdue(s) {
  if (s.status !== 'scheduled') return false;
  if (!s.session_date) return false;
  try {
    const dur = Number(s.duration_hours || 1);
    let endMs;
    if (s.started_at && s.started_at.includes('T')) {
      endMs = new Date(s.started_at).getTime() + dur * 3600000;
    } else if (s.started_at) {
      endMs = new Date(`${s.session_date}T${s.started_at.slice(0, 5)}:00+05:30`).getTime() + dur * 3600000;
    } else {
      // No time info, compare date only — overdue if date is in the past
      endMs = new Date(s.session_date + 'T23:59:59+05:30').getTime();
    }
    return Date.now() > endMs;
  } catch { return false; }
}


/* ═══════ AC Dashboard ═══════ */
export function AcademicCoordinatorDashboardPage({ targetUserId }) {
  const [s, setS] = useState({ students: 0, today: 0, queue: 0, topups: 0 });
  const [weekSessions, setWeekSessions] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const uQ = targetUserId ? `?user_id=${targetUserId}` : '';
        const uQAnd = targetUserId ? `&user_id=${targetUserId}` : '';

        const [a, b, c, d, w, allSched] = await Promise.all([
          apiFetch(`/students${uQ}`),
          apiFetch(`/students/sessions/today${uQ}`),
          apiFetch(`/sessions/verification-queue${uQ}`),
          apiFetch(`/students/topup-requests?status=pending_finance${uQAnd}`),
          apiFetch(`/students/sessions/week?offset=0${uQAnd}`),
          apiFetch(`/sessions/all?status=scheduled${uQAnd}`)
        ]);
        setS({ students: (a.items || []).length, today: (b.items || []).length, queue: (c.items || []).length, topups: (d.items || []).length });
        setWeekSessions(w.items || []);
        setOverdueCount((allSched.items || []).filter(isSessionOverdue).length);
      } catch (e) { setError(e.message); }
    })();
  }, [targetUserId]);

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

  const subjectStats = useMemo(() => {
    const map = {};
    weekSessions.forEach(sess => {
      const subj = sess.subject || 'Unknown';
      if (!map[subj]) map[subj] = { name: subj, count: 0 };
      map[subj].count += 1;
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [weekSessions]);
  const maxSubj = Math.max(...subjectStats.map(s => s.count), 1);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <div className="grid-four">
        <article className="card stat-card"><p className="eyebrow">Total Students</p><h3>{s.students}</h3></article>
        <article className="card stat-card"><p className="eyebrow">Sessions Today</p><h3>{s.today}</h3></article>
        <article className="card stat-card"><p className="eyebrow">Verification Queue</p><h3>{s.queue}</h3></article>
        <article className="card stat-card warning"><p className="eyebrow">Pending Top-Ups</p><h3>{s.topups}</h3></article>
      </div>
      {overdueCount > 0 ? (
        <div className="card stat-card" style={{ background: '#fef2f2', borderColor: '#fca5a5', marginTop: '8px', maxWidth: '280px' }}>
          <p className="eyebrow" style={{ color: '#dc2626' }}>⚠ Overdue Sessions</p>
          <h3 style={{ color: '#dc2626' }}>{overdueCount}</h3>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Classes not marked completed</p>
        </div>
      ) : null}

      <div className="grid-three">
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
        <article className="card">
          <h3>Top Subjects (This Week)</h3>
          {!subjectStats.length ? <p className="muted" style={{ marginTop: 20 }}>No data yet.</p> :
            <div className="top-teachers-list">
              {subjectStats.map((s, i) => (
                <div key={i} className="teacher-stat-row">
                  <div className="teacher-stat-info" title={s.name}>{s.name}</div>
                  <div className="teacher-stat-bar-bg">
                    <div className="teacher-stat-bar" style={{ width: `${(s.count / maxSubj) * 100}%`, backgroundColor: '#3b82f6' }}></div>
                  </div>
                  <div className="teacher-stat-val">{s.count}</div>
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
  const [logPage, setLogPage] = useState(1);
  const [scheduleResult, setScheduleResult] = useState(null); // { count, conflicts }
  const [schedulePreview, setSchedulePreview] = useState(null); // [{date, status, conflict_type, conflict_with}]

  const [teacherAvail, setTeacherAvail] = useState(null);
  const [studentAvail, setStudentAvail] = useState(null);
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
      setStudentAvail(null);
      return;
    }
    setAvailLoading(true);
    const fetchTeacher = apiFetch(`/teachers/${fTeacher}/availability?start_date=${fStart}&end_date=${fEnd}`)
      .then(d => setTeacherAvail(d)).catch(() => setTeacherAvail(null));
    const fetchStudent = apiFetch(`/students/${studentId}/availability?start_date=${fStart}&end_date=${fEnd}`)
      .then(d => setStudentAvail(d)).catch(() => setStudentAvail(null));

    Promise.all([fetchTeacher, fetchStudent]).finally(() => { setAvailLoading(false); setFTime(''); });
  }, [fTeacher, fStart, fEnd, studentId]);

  const { allStarts, slotChecks } = useMemo(() => {
    if (!teacherAvail || !studentAvail || !fDays.length) return { allStarts: [], slotChecks: {} };

    const times = [];
    for (let h = 6; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    times.push('24:00');

    const targetDates = [];
    const startObj = new Date(fStart + 'T00:00:00Z');
    const endObj = new Date(fEnd + 'T00:00:00Z');

    for (let d = new Date(startObj); d <= endObj; d.setDate(d.getDate() + 1)) {
      if (fDays.includes(DAY_MAP[d.getUTCDay()])) {
        targetDates.push({ dateStr: d.toISOString().split('T')[0] });
      }
    }

    if (!targetDates.length) return { allStarts: [], slotChecks: {} };

    function checkOverlapType(start, end) {
      if (start >= end) return 'invalid';
      for (const td of targetDates) {
        // Teacher class clash
        const tClash = teacherAvail.classes.some(c => {
          if (c.session_date !== td.dateStr || !c.started_at) return false;
          const cStart = c.started_at.slice(0, 5);
          const [ch, cm] = cStart.split(':').map(Number);
          const cDur = Number(c.duration_hours || 0);
          const ceH = ch + Math.floor(cDur) + Math.floor((cm + (cDur % 1) * 60) / 60);
          const ceM = (cm + (cDur % 1) * 60) % 60;
          const cEnd = `${String(ceH).padStart(2, '0')}:${String(ceM).padStart(2, '0')}`;
          return (start < cEnd && end > cStart);
        });
        if (tClash) return 'teacher';

        // Teacher demo clash
        const dClash = teacherAvail.demos.some(d => {
          const dDate = d.scheduled_at.split('T')[0];
          if (dDate !== td.dateStr) return false;
          const dStart = new Date(d.scheduled_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
          const dEnd = d.ends_at ? new Date(d.ends_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) :
            `${String(Number(dStart.split(':')[0]) + 1).padStart(2, '0')}:${dStart.split(':')[1]}`;
          return (start < dEnd && end > dStart);
        });
        if (dClash) return 'teacher';

        // Student class clash
        const sClash = studentAvail.classes.some(c => {
          if (c.session_date !== td.dateStr || !c.started_at) return false;
          const cStart = c.started_at.slice(0, 5);
          const [ch, cm] = cStart.split(':').map(Number);
          const cDur = Number(c.duration_hours || 0);
          const ceH = ch + Math.floor(cDur) + Math.floor((cm + (cDur % 1) * 60) / 60);
          const ceM = (cm + (cDur % 1) * 60) % 60;
          const cEnd = `${String(ceH).padStart(2, '0')}:${String(ceM).padStart(2, '0')}`;
          return (start < cEnd && end > cStart);
        });
        if (sClash) return 'student';
      }
      return false; // free
    }

    const checks = {};
    // Check every starting time (slot against the very next slot = 15 mins assumed base)
    for (let i = 0; i < times.length - 1; i++) {
      checks[times[i]] = checkOverlapType(times[i], times[i + 1]);
    }
    checks[times[times.length - 1]] = 'invalid';

    return { allStarts: times.slice(0, -1), slotChecks: checks };
  }, [teacherAvail, studentAvail, fDays, fStart, fEnd]);

  const validEnds = useMemo(() => {
    if (!fTime || !teacherAvail || !studentAvail || !fDays.length) return [];

    // Find the fTime in the base times
    const times = [];
    for (let h = 6; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    times.push('24:00'); // Midnight

    const targetDates = [];
    for (let d = new Date(fStart + 'T00:00:00Z'); d <= new Date(fEnd + 'T00:00:00Z'); d.setDate(d.getDate() + 1)) {
      if (fDays.includes(DAY_MAP[d.getUTCDay()])) targetDates.push({ dateStr: d.toISOString().split('T')[0] });
    }

    function checkSlot(start, end) {
      return targetDates.every(td => {
        const classClash = teacherAvail.classes.some(c => {
          if (c.session_date !== td.dateStr || !c.started_at) return false;
          const cStart = c.started_at.slice(0, 5);
          const [ch, cm] = cStart.split(':').map(Number);
          const cDur = Number(c.duration_hours || 0);
          const ceH = ch + Math.floor(cDur) + Math.floor((cm + (cDur % 1) * 60) / 60);
          const ceM = (cm + (cDur % 1) * 60) % 60;
          return (start < `${String(ceH).padStart(2, '0')}:${String(ceM).padStart(2, '0')}` && end > cStart);
        });
        const demoClash = teacherAvail.demos.some(d => {
          const dDate = d.scheduled_at.split('T')[0];
          if (dDate !== td.dateStr) return false;
          const dStart = new Date(d.scheduled_at).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
          let dh = Number(dStart.split(':')[0]);
          return (start < `${String(dh + 1).padStart(2, '0')}:${dStart.split(':')[1]}` && end > dStart);
        });
        const studClash = studentAvail.classes.some(c => {
          if (c.session_date !== td.dateStr || !c.started_at) return false;
          const cStart = c.started_at.slice(0, 5);
          const [ch, cm] = cStart.split(':').map(Number);
          const cDur = Number(c.duration_hours || 0);
          const ceH = ch + Math.floor(cDur) + Math.floor((cm + (cDur % 1) * 60) / 60);
          return (start < `${String(ceH).padStart(2, '0')}:${String((cm + (cDur % 1) * 60) % 60).padStart(2, '0')}` && end > cStart);
        });
        return !classClash && !demoClash && !studClash;
      });
    }

    const valid = [];
    const startIndex = times.indexOf(fTime);
    if (startIndex !== -1) {
      const minEndIndex = startIndex + 4; // minimum 1 hour (4 slots)
      for (let i = startIndex + 1; i < times.length; i++) {
        if (checkSlot(fTime, times[i])) {
          if (i >= minEndIndex) valid.push(times[i]);
        } else {
          break; // Can't span past an overlap
        }
      }
    }
    return valid;
  }, [fTime, fDays, fStart, fEnd, teacherAvail, studentAvail]);

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
  for (let h = 6; h <= 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const hr12 = h % 12 || 12;
      const ampm = h >= 12 ? 'PM' : 'AM';
      rescheduleTimeSlots.push({ value: `${hh}:${mm}`, label: `${hr12}:${mm} ${ampm}` });
    }
  }
  rescheduleTimeSlots.push({ value: '24:00', label: '12:00 AM' });

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

  function computePreview() {
    if (!fTime || !fEndTime || !fStart || !fEnd || !fDays.length || !teacherAvail || !studentAvail) return;
    const DAY_MAP_P = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [sh, sm] = fTime.split(':').map(Number);
    const [eh, em] = fEndTime.split(':').map(Number);
    const newStartMins = sh * 60 + sm;
    const newEndMins = eh * 60 + em;

    function toMins(timeStr) {
      if (!timeStr) return 0;
      if (timeStr.includes('T')) {
        const s = new Date(timeStr).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
        const [h, m] = s.split(':').map(Number); return h * 60 + m;
      }
      const [h, m] = timeStr.split(':').map(Number); return h * 60 + m;
    }

    const rows = [];
    for (let d = new Date(fStart + 'T00:00:00Z'); d <= new Date(fEnd + 'T00:00:00Z'); d.setDate(d.getDate() + 1)) {
      const dayName = DAY_MAP_P[d.getUTCDay()];
      if (!fDays.includes(dayName)) continue;
      const dateStr = d.toISOString().split('T')[0];

      const tConflict = teacherAvail.classes.find(c => {
        if (c.session_date !== dateStr || !c.started_at) return false;
        const cs = toMins(c.started_at), ce = cs + Number(c.duration_hours || 1) * 60;
        return newStartMins < ce && newEndMins > cs;
      }) || teacherAvail.demos.find(dem => {
        if (!dem.scheduled_at || dem.scheduled_at.split('T')[0] !== dateStr) return false;
        const ds = toMins(dem.scheduled_at);
        const de = dem.ends_at ? toMins(dem.ends_at) : ds + 60;
        return newStartMins < de && newEndMins > ds;
      });

      const sConflict = !tConflict && studentAvail.classes.find(c => {
        if (c.session_date !== dateStr || !c.started_at) return false;
        const cs = toMins(c.started_at), ce = cs + Number(c.duration_hours || 1) * 60;
        return newStartMins < ce && newEndMins > cs;
      });

      rows.push({
        date: dateStr,
        day: dayName,
        status: tConflict ? 'teacher' : sConflict ? 'student' : 'ok',
        conflict_with: tConflict
          ? (tConflict.leads?.student_name || tConflict.subject || 'another class')
          : sConflict
            ? (sConflict.users?.full_name || sConflict.subject || 'another teacher')
            : null
      });
    }
    setSchedulePreview(rows);
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
      setShowForm(false);
      setSchedulePreview(null);
      onClassesChanged();
      setScheduleResult({ count: res.count, conflicts: res.conflicts || [] });
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
          duration_hours: rescheduleData.duration,
          subject: rescheduleData.subject || undefined,
          teacher_id: rescheduleData.teacher_id || undefined
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
  for (let h = 6; h <= 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      editTimeSlots.push({ value: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, label: `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}` });
    }
  }
  editTimeSlots.push({ value: '24:00', label: '12:00 AM' });

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
                {dayNames.filter(d => {
                  if (!fStart || !fEnd || fStart > fEnd) return true; // show all if invalid
                  const startObj = new Date(fStart + 'T00:00:00Z');
                  const endObj = new Date(fEnd + 'T00:00:00Z');
                  const daysDiff = Math.floor((endObj - startObj) / (1000 * 60 * 60 * 24));
                  if (daysDiff >= 6) return true; // all days exist in a >= 7 day span

                  // Check if this day of week falls between start Date and end Date
                  for (let tempD = new Date(startObj); tempD <= endObj; tempD.setDate(tempD.getDate() + 1)) {
                    if (DAY_MAP[tempD.getUTCDay()] === d) return true;
                  }
                  return false;
                }).map(d => (
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
                  {allStarts.map(t => {
                    const overlap = slotChecks[t];
                    const disabled = !!overlap;
                    const suffix = overlap === 'student' ? ' (Student Busy)' : overlap === 'teacher' ? ' (Teacher Busy)' : '';
                    return <option key={t} value={t} disabled={disabled}>{format24to12(t)}{suffix}</option>;
                  })}
                </select>
                {fTeacher && fDays.length > 0 && allStarts.every(t => slotChecks[t]) && !availLoading && (
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

            <button type="button" style={{ gridColumn: '1 / -1', marginTop: '8px' }} disabled={availLoading || !fEndTime}
              onClick={computePreview}
            >
              Preview Schedule
            </button>
          </form>

          {/* Per-date preview table */}
          {schedulePreview && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '14px' }}>
                  Preview: {schedulePreview.filter(r => r.status === 'ok').length} will be scheduled,{' '}
                  <span style={{ color: '#dc2626' }}>{schedulePreview.filter(r => r.status !== 'ok').length} conflict{schedulePreview.filter(r => r.status !== 'ok').length !== 1 ? 's' : ''}</span>
                </strong>
                <button type="button" className="secondary small" onClick={() => setSchedulePreview(null)}>Clear Preview</button>
              </div>
              <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {schedulePreview.map(row => (
                  <div key={row.date} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '7px 12px', borderRadius: '6px', fontSize: '13px',
                    background: row.status === 'ok' ? '#f0fdf4' : row.status === 'teacher' ? '#fef3c7' : '#faf5ff',
                    border: `1px solid ${row.status === 'ok' ? '#86efac' : row.status === 'teacher' ? '#fcd34d' : '#c4b5fd'}`
                  }}>
                    <span style={{ flex: '0 0 24px', fontSize: '16px' }}>
                      {row.status === 'ok' ? '✅' : '⚠️'}
                    </span>
                    <span style={{ flex: '0 0 120px', fontWeight: 600 }}>
                      {new Date(row.date + 'T00:00:00Z').toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
                    </span>
                    {row.status !== 'ok' && (
                      <>
                        <span style={{
                          padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                          background: row.status === 'teacher' ? '#fde68a' : '#ddd6fe',
                          color: row.status === 'teacher' ? '#92400e' : '#5b21b6'
                        }}>
                          {row.status === 'teacher' ? '🧑‍🏫 Teacher busy' : '🎓 Student busy'}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>with {row.conflict_with}</span>
                      </>
                    )}
                    {row.status === 'ok' && <span style={{ color: '#15803d' }}>Will be scheduled</span>}
                  </div>
                ))}
              </div>
              {schedulePreview.some(r => r.status === 'ok') ? (
                <button
                  style={{ marginTop: '12px', width: '100%' }}
                  onClick={handleBulkSubmit}
                >
                  Confirm &amp; Schedule ({schedulePreview.filter(r => r.status === 'ok').length} sessions)
                </button>
              ) : (
                <p style={{ marginTop: '10px', color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>
                  All dates conflict — please choose a different time or days.
                </p>
              )}
            </div>
          )}
        </article>
      )}

      {/* Schedule Result Modal - shows conflicts after bulk scheduling */}
      {scheduleResult && (
        <div className="modal-overlay" onClick={() => setScheduleResult(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ margin: '0 0 4px' }}>Scheduling Complete</h3>
            <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: '13px' }}>
              {scheduleResult.count > 0
                ? `✅ ${scheduleResult.count} session${scheduleResult.count > 1 ? 's' : ''} scheduled successfully.`
                : 'No sessions were scheduled.'}
              {scheduleResult.conflicts.length > 0 && (
                <span> {scheduleResult.conflicts.length} date{scheduleResult.conflicts.length > 1 ? 's were' : ' was'} skipped due to conflicts.</span>
              )}
            </p>

            {scheduleResult.conflicts.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: '13px', color: '#dc2626' }}>⚠️ Skipped Dates (Conflicts)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {scheduleResult.conflicts.map(c => (
                    <div key={c.date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600 }}>
                        {new Date(c.date + 'T00:00:00Z').toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{
                        padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700,
                        background: c.reason === 'teacher' ? '#fef3c7' : '#ede9fe',
                        color: c.reason === 'teacher' ? '#92400e' : '#5b21b6'
                      }}>
                        {c.reason === 'teacher' ? '🧑‍🏫 Teacher busy' : '🎓 Student busy'}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>with {c.conflict_with}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setScheduleResult(null)}>Done</button>
            </div>
          </div>
        </div>
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
                      {isSessionOverdue(s) && <span className="status-tag small" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', marginLeft: 4 }}>Overdue</span>}
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
                  {isSessionOverdue(selectedSession) && <span className="status-tag small" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', marginLeft: 4 }}>Overdue</span>}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
              {selectedSession.status === 'scheduled' && (
                <button type="button" className="secondary" onClick={() => {
                  setRescheduleData({
                    id: selectedSession.id,
                    teacher_id: selectedSession.teacher_id,
                    subject: selectedSession.subject || '',
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
                <label>Teacher
                  <select value={rescheduleData.teacher_id} onChange={e => setRescheduleData({ ...rescheduleData, teacher_id: e.target.value, subject: '', time: '' })} required>
                    <option value="">Select Teacher</option>
                    {teachers.map(t => <option key={t.user_id} value={t.user_id}>{t.users?.full_name || t.teacher_code}</option>)}
                  </select>
                </label>
                <label>Subject
                  <select value={rescheduleData.subject} onChange={e => setRescheduleData({ ...rescheduleData, subject: e.target.value })} required>
                    <option value="">{rescheduleData.teacher_id ? 'Select subject' : 'Pick teacher first'}</option>
                    {(() => { const t = teachers.find(x => x.user_id === rescheduleData.teacher_id); const subs = t ? (Array.isArray(t.subjects_taught) ? t.subjects_taught : (typeof t.subjects_taught === 'string' ? JSON.parse(t.subjects_taught || '[]') : [])) : []; return subs.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>); })()}
                  </select>
                </label>
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
  const [topupRequests, setTopupRequests] = useState([]);
  const [verifiedSessions, setVerifiedSessions] = useState([]);
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
  const [boardsList, setBoardsList] = useState([]);
  const [mediumsList, setMediumsList] = useState([]);
  const [logPage, setLogPage] = useState(1);

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 6; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        const mins = m.toString().padStart(2, '0');
        times.push(`${hour12}:${mins} ${ampm}`);
      }
    }
    times.push('12:00 AM');
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
      setTopupRequests(d.topupRequests || []);

      const vRes = await apiFetch(`/students/${studentId}/sessions/verified`);
      setVerifiedSessions(vRes.items || []);

      const p = await apiFetch('/teachers/pool');
      setTeachers(p.items || []);
      const subjs = await apiFetch('/subjects');
      setSubjectOptions((subjs.subjects || []).map(s => s.name));
      const bRes = await apiFetch('/boards');
      setBoardsList(bRes.boards || []);
      const mRes = await apiFetch('/mediums');
      setMediumsList(mRes.mediums || []);
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

  const parsePhone = (raw) => {
    if (!raw) return { code: '+91', num: '' };
    const codes = ['+971', '+966', '+91', '+44', '+61', '+65', '+60', '+1'];
    for (const c of codes) {
      if (raw.startsWith(c)) {
        return { code: c, num: raw.substring(c.length).trim() };
      }
    }
    return { code: '+91', num: raw.trim() };
  };

  function openEditModal() {
    const mainPhone = parsePhone(student.contact_number);
    const altPhone = parsePhone(student.alternative_number);
    const parPhone = parsePhone(student.parent_phone);

    setEditForm({
      student_name: student.student_name || '',
      parent_name: student.parent_name || '',
      country_code: student.country_code || mainPhone.code,
      contact_number: mainPhone.num || student.contact_number || '',
      alt_country_code: altPhone.code,
      alternative_number: altPhone.num,
      parent_country_code: parPhone.code,
      parent_phone: parPhone.num,
      class_level: student.class_level || '',
      board: student.board || '',
      medium: student.medium || '',
      package_name: student.package_name || '',
      messaging_number: student.messaging_number || 'contact',
      status: student.status || 'active'
    });
    setShowEdit(true);
  }

  async function saveEdit(e) {
    e.preventDefault();
    setEditSaving(true); setError('');
    try {
      const payload = { ...editForm };
      
      const stripNum = (n) => (n || '').replace(/[^0-9]/g, '');

      if (payload.contact_number) payload.contact_number = (payload.country_code || '+91') + stripNum(payload.contact_number);
      if (payload.alternative_number) payload.alternative_number = (payload.alt_country_code || '+91') + stripNum(payload.alternative_number);
      if (payload.parent_phone) payload.parent_phone = (payload.parent_country_code || '+91') + stripNum(payload.parent_phone);

      delete payload.alt_country_code;
      delete payload.parent_country_code;

      await apiFetch(`/students/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      setShowEdit(false);
      await load();
    } catch (e) { setError(e.message); }
    finally { setEditSaving(false); }
  }

  const messagingLabel = { contact: 'Contact Number', alternative: 'Alternative Number', parent: 'Parent Phone' };
  const activeSubjects = (assignments || []).filter(a => a.is_active).map(a => a.subject).filter(Boolean);
  const uniqueSubjects = [...new Set(activeSubjects)];

  const teacherSessionCounts = useMemo(() => {
    const counts = {};
    sessions.forEach(s => {
      const name = s.users?.full_name || s.teacher_id;
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [sessions]);

  if (!student) return <section className="panel">{error ? <p className="error">{error}</p> : <p>Loading...</p>}</section>;
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'classes', label: `Classes (${sessions.length})` },
    { id: 'session_logs', label: 'Session Logs' },
    { id: 'lead_data', label: 'Lead Data' }
  ];

  const displayPhone = (raw, code) => {
    if (!raw) return '—';
    if (raw.startsWith('+')) return raw;
    return (code ? code + ' ' : '') + raw;
  };

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
            <div><span className="eyebrow">Board</span><p>{student.board || '—'}</p></div>
            <div><span className="eyebrow">Medium</span><p>{student.medium || '—'}</p></div>
            <div><span className="eyebrow">Subjects</span><p>{uniqueSubjects.length ? uniqueSubjects.join(', ') : '—'}</p></div>
            <div><span className="eyebrow">Parent</span><p>{student.parent_name || student.leads?.parent_name || '—'}</p></div>
            <div><span className="eyebrow">Contact No.</span><p>{displayPhone(student.contact_number, student.country_code)}</p></div>
            <div><span className="eyebrow">Alternative No.</span><p>{displayPhone(student.alternative_number)}</p></div>
            <div><span className="eyebrow">Parent Phone</span><p>{displayPhone(student.parent_phone)}</p></div>
            <div><span className="eyebrow">Messaging No.</span><p>{messagingLabel[student.messaging_number] || 'Contact Number'}</p></div>
            <div><span className="eyebrow">Package</span><p>{student.package_name || student.leads?.package_name || '—'}</p></div>
            <div><span className="eyebrow">Source</span><p>{student.counselor_id ? (student.leads?.source || 'Lead') : 'Manual'}</p></div>
            <div><span className="eyebrow">Joined</span><p>{student.joined_at ? new Date(student.joined_at).toLocaleDateString('en-IN') : '—'}</p></div>
          </div>
        </article>
        <article className="card">
          <h3>Hours</h3>
          <div className="grid-two" style={{ gap: 12, marginBottom: '20px' }}>
            <div className="stat-card card" style={{ textAlign: 'center' }}><p className="eyebrow">Total</p><h3>{student.total_hours}</h3></div>
            <div className={`stat-card card ${Number(student.remaining_hours) <= 5 ? 'danger' : 'success'}`} style={{ textAlign: 'center' }}><p className="eyebrow">Left</p><h3>{student.remaining_hours}</h3></div>
          </div>
          {(() => {
            // Initial payment (from payment_requests)
            // total_amount = full bill, amount = paid so far, outstanding = bill - paid
            const initBill = paymentRequests.reduce((s, p) => s + Number(p.total_amount || 0), 0);
            const initPaid = paymentRequests.reduce((s, p) => s + Number(p.amount || 0), 0);
            const initOutstanding = initBill - initPaid;
            // Topup (from student_topups)
            const topupBill = topupRequests.reduce((s, t) => s + Number(t.total_amount || 0), 0);
            const topupPaid = topupRequests.reduce((s, t) => s + Number(t.amount || 0), 0);
            const topupOutstanding = topupBill - topupPaid;

            const row = (label, amount, variant) => {
              const bg = variant === 'paid' ? '#f0fdf4' : variant === 'due' ? '#fef2f2' : '#f9fafb';
              const color = variant === 'paid' ? '#15803d' : variant === 'due' ? '#dc2626' : '#374151';
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', background: bg, borderRadius: '7px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 700, fontSize: '14px', color }}>{amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : '—'}</span>
                </div>
              );
            };

            return (
              <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Initial Payment</p>
                {row('Bill (Total)', initBill, 'neutral')}
                {row('Paid', initPaid, 'paid')}
                {initOutstanding > 0 && row('Outstanding', initOutstanding, 'due')}
                {topupBill > 0 && <>
                  <p style={{ margin: '8px 0 4px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topup</p>
                  {row('Bill (Total)', topupBill, 'neutral')}
                  {row('Paid', topupPaid, 'paid')}
                  {topupOutstanding > 0 && row('Outstanding', topupOutstanding, 'due')}
                </>}
              </div>
            );
          })()}

          <h4 style={{ margin: '0 0 12px 0' }}>Teachers & Sessions</h4>
          <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {teacherSessionCounts.length ? teacherSessionCounts.map(([name, count]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="eyebrow" style={{ display: 'block' }}>{name}</span>
                <span className="status-tag secondary small">{count} session{count !== 1 ? 's' : ''}</span>
              </div>
            )) : <p className="muted" style={{ gridColumn: '1/-1' }}>No sessions scheduled yet.</p>}
          </div>
        </article>

        {/* Edit Details Modal */}
        {showEdit && (
          <div className="modal-overlay" onClick={() => setShowEdit(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                    <label style={{ gridColumn: 'span 1' }}>Contact Number
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <select value={editForm.country_code || '+91'} onChange={e => setEditForm({ ...editForm, country_code: e.target.value })} style={{ width: '90px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+971">+971</option>
                          <option value="+966">+966</option>
                          <option value="+61">+61</option>
                          <option value="+65">+65</option>
                          <option value="+60">+60</option>
                        </select>
                        <input value={editForm.contact_number} onChange={e => setEditForm({ ...editForm, contact_number: e.target.value })} placeholder="Phone" style={{ flex: 1 }} />
                      </div>
                    </label>
                    <label style={{ gridColumn: 'span 1' }}>Alternative No.
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <select value={editForm.alt_country_code || '+91'} onChange={e => setEditForm({ ...editForm, alt_country_code: e.target.value })} style={{ width: '90px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+971">+971</option>
                          <option value="+966">+966</option>
                          <option value="+61">+61</option>
                          <option value="+65">+65</option>
                          <option value="+60">+60</option>
                        </select>
                        <input value={editForm.alternative_number} onChange={e => setEditForm({ ...editForm, alternative_number: e.target.value })} placeholder="Alt Phone" style={{ flex: 1 }} />
                      </div>
                    </label>
                    <label style={{ gridColumn: 'span 1' }}>Parent Phone
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <select value={editForm.parent_country_code || '+91'} onChange={e => setEditForm({ ...editForm, parent_country_code: e.target.value })} style={{ width: '90px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+971">+971</option>
                          <option value="+966">+966</option>
                          <option value="+61">+61</option>
                          <option value="+65">+65</option>
                          <option value="+60">+60</option>
                        </select>
                        <input value={editForm.parent_phone} onChange={e => setEditForm({ ...editForm, parent_phone: e.target.value })} placeholder="Parent Phone" style={{ flex: 1 }} />
                      </div>
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    <label>Class / Level
                      <input value={editForm.class_level} onChange={e => setEditForm({ ...editForm, class_level: e.target.value })} />
                    </label>
                    <label>Board
                      <select value={editForm.board} onChange={e => setEditForm({ ...editForm, board: e.target.value })}>
                        <option value="">Select Board</option>
                        {boardsList.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                      </select>
                    </label>
                    <label>Medium
                      <select value={editForm.medium} onChange={e => setEditForm({ ...editForm, medium: e.target.value })}>
                        <option value="">Select Medium</option>
                        {mediumsList.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
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
                    <label>Status
                      <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                        <option value="active">Active</option>
                        <option value="vacation">Vacation</option>
                        <option value="inactive">Inactive</option>
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

      {tab === 'session_logs' ? (
        <article className="card">
          <h3>Verified Session Logs</h3>
          <div className="table-wrap mobile-friendly-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Teacher</th>
                  <th>Subject</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {verifiedSessions.slice((logPage - 1) * 10, logPage * 10).map(vs => (
                  <tr key={vs.id}>
                    <td data-label="Date">{vs.session_date} {vs.started_at ? vs.started_at.slice(11, 16) : ''}</td>
                    <td data-label="Teacher">{vs.users?.full_name || vs.teacher_id}</td>
                    <td data-label="Subject">{vs.subject || '—'}</td>
                    <td data-label="Hours">{vs.duration_hours}h</td>
                    <td data-label="Status">
                      <span className="status-tag primary">Verified</span>
                    </td>
                  </tr>
                ))}
                {!verifiedSessions.length && <tr><td colSpan="5">No verified sessions found.</td></tr>}
              </tbody>
            </table>
          </div>
          {verifiedSessions.length > 10 && (
            <Pagination page={logPage} limit={10} total={verifiedSessions.length} onPageChange={setLogPage} />
          )}
        </article>
      ) : null}

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
function StudentOnboardingForm({ onDone }) {
  const [f, setF] = useState({
    student_name: '',
    parent_name: '',
    country_code: '+91',
    contact_number: '',
    class_level: '',
    status: 'active',
    onboarding_fee: '',
    onboarding_paid: ''
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // New fields for Onboarding Payments
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  async function submit(e) {
    e.preventDefault(); setError(''); setMsg('');

    if (!screenshotFile) {
      setError('A payment screenshot is required for onboarding.');
      return;
    }

    setSaving(true);
    setUploading(true);

    try {
      // 1. Get presigned URL
      const presignData = await apiFetch('/upload/presigned-url', {
        method: 'POST',
        body: JSON.stringify({
          filename: screenshotFile.name,
          contentType: screenshotFile.type
        })
      });

      // 2. Upload directly to R2/S3
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        body: screenshotFile,
        headers: { 'Content-Type': screenshotFile.type }
      });

      if (!uploadRes.ok) throw new Error('Failed to upload screenshot');

      setUploading(false);

      // 3. Submit Student Onboarding
      await apiFetch('/students', {
        method: 'POST',
        body: JSON.stringify({
          ...f,
          screenshot_url: presignData.publicUrl
        })
      });
      setMsg('Student created and payment submitted to finance successfully!');
      setTimeout(() => {
        if (onDone) onDone();
      }, 1500);
    } catch (err) {
      setUploading(false);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label>Student Name
              <input value={f.student_name} onChange={e => set('student_name', e.target.value)} required />
            </label>
            <label>Parent Name
              <input value={f.parent_name} onChange={e => set('parent_name', e.target.value)} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <label style={{ gridColumn: 'span 2' }}>Contact Number
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <select value={f.country_code} onChange={e => set('country_code', e.target.value)} style={{ width: '120px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="+91">+91 (IND)</option>
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+971">+971 (UAE)</option>
                  <option value="+966">+966 (KSA)</option>
                  <option value="+61">+61 (AUS)</option>
                  <option value="+65">+65 (SG)</option>
                  <option value="+60">+60 (MY)</option>
                </select>
                <input value={f.contact_number} onChange={e => set('contact_number', e.target.value)} placeholder="Phone Number" style={{ flex: 1 }} />
              </div>
            </label>
            <label>Class / Level
              <input value={f.class_level} onChange={e => set('class_level', e.target.value)} style={{ marginTop: '4px' }} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <label>Status
              <select value={f.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="vacation">Vacation</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
            <label>Total Onboarding Fee (Bill)
              <input type="number" min="0" value={f.onboarding_fee} onChange={e => set('onboarding_fee', e.target.value)} required />
            </label>
            <label>Amount Paid Now
              <input type="number" min="0" max={f.onboarding_fee || undefined} value={f.onboarding_paid} onChange={e => set('onboarding_paid', e.target.value)} required />
            </label>
            <label>Allocated Hours
              <input type="number" min="1" value={f.hours || ''} onChange={e => set('hours', e.target.value)} placeholder="Total hours enrolled" required />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
            <label>Payment Screenshot *
              <input type="file" accept="image/*" onChange={e => setScreenshotFile(e.target.files[0])} required style={{ width: '100%', marginTop: '4px' }} />
            </label>
            <label>Finance Note (Optional)
              <textarea value={f.finance_note} onChange={e => set('finance_note', e.target.value)} rows={1} placeholder="Any notes for the finance team..." />
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button type="button" className="secondary" onClick={() => onDone && onDone()}>Cancel</button>
          <button type="submit" disabled={saving || uploading}>{saving || uploading ? (uploading ? 'Uploading...' : 'Saving...') : 'Submit to Finance'}</button>
        </div>
        {msg ? <div className="status-tag success" style={{ marginTop: 12 }}>{msg}</div> : null}
        {error ? <p className="error" style={{ marginTop: 12 }}>{error}</p> : null}
      </form>
    </div>
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
  const [classFilter, setClassFilter] = useState('');
  const [acFilter, setAcFilter] = useState(''); // super_admin filter by AC
  const [paymentFilter, setPaymentFilter] = useState(''); // initial / topup / clear
  const [originFilter, setOriginFilter] = useState(''); // ac_direct / converted / old
  const [minHours, setMinHours] = useState('');
  const [maxHours, setMaxHours] = useState('');

  // Add new student form
  const [showAddForm, setShowAddForm] = useState(false);

  // Group creation modal
  const [groupModal, setGroupModal] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);

  const isAC = role === 'academic_coordinator';
  const isSuperAdmin = role === 'super_admin';

  const loadData = useCallback(async () => {
    setError('');
    try {
      const d = await apiFetch('/students');
      setStudents(d.items || []);
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

  const uniqueClasses = useMemo(() => {
    return [...new Set(students.map(s => s.class_level).filter(Boolean))].sort();
  }, [students]);

  // Derive unique ACs from loaded students (ac_user is already joined)
  const uniqueAcs = useMemo(() => {
    const seen = {};
    for (const s of students) {
      if (s.ac_user?.id) seen[s.ac_user.id] = s.ac_user.full_name;
    }
    return Object.entries(seen).map(([id, full_name]) => ({ id, full_name })).sort((a, b) => a.full_name.localeCompare(b.full_name));
  }, [students]);

  const filtered = useMemo(() => {
    let items = students;
    if (statusFilter) items = items.filter(s => s.status === statusFilter);
    if (classFilter) items = items.filter(s => s.class_level === classFilter);
    if (acFilter) items = items.filter(s => s.academic_coordinator_id === acFilter);
    if (paymentFilter === 'initial') items = items.filter(s => s.pending_payment === 'initial');
    else if (paymentFilter === 'topup') items = items.filter(s => s.pending_payment === 'topup');
    else if (paymentFilter === 'clear') items = items.filter(s => !s.pending_payment);

    if (originFilter === 'ac_direct') items = items.filter(s => s.leads?.source === 'AC Direct Onboarding');
    else if (originFilter === 'converted') items = items.filter(s => s.lead_id && s.leads?.source !== 'AC Direct Onboarding');
    else if (originFilter === 'old') items = items.filter(s => !s.lead_id);

    if (minHours !== '') items = items.filter(s => Number(s.remaining_hours) >= Number(minHours));
    if (maxHours !== '') items = items.filter(s => Number(s.remaining_hours) <= Number(maxHours));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(s =>
        (s.student_name || '').toLowerCase().includes(q) ||
        (s.student_code || '').toLowerCase().includes(q)
      );
    }
    return items;
  }, [students, statusFilter, classFilter, acFilter, paymentFilter, originFilter, minHours, maxHours, search]);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Students</h2>
        {(isAC || isSuperAdmin) && (
          <button type="button" onClick={() => setShowAddForm(true)}>+ Add Student</button>
        )}
      </div>

      {error ? <p className="error">{error}</p> : null}
      <article className="card">
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'end', flexWrap: 'wrap' }}>
          <label style={{ flex: '1.5', margin: 0, minWidth: '140px' }}>Search
            <input
              type="text" placeholder="Search name or code..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginTop: '4px' }}
            />
          </label>
          <label style={{ flex: '1', margin: 0, minWidth: '110px' }}>Status
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ marginTop: '4px' }}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="vacation">Vacation</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label style={{ flex: '1', margin: 0, minWidth: '110px' }}>Class / Level
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)} style={{ marginTop: '4px' }}>
              <option value="">All Classes</option>
              {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          {isSuperAdmin && uniqueAcs.length > 0 && (
            <label style={{ flex: '1', margin: 0, minWidth: '130px' }}>Coordinator
              <select value={acFilter} onChange={e => setAcFilter(e.target.value)} style={{ marginTop: '4px' }}>
                <option value="">All Coordinators</option>
                {uniqueAcs.map(ac => <option key={ac.id} value={ac.id}>{ac.full_name}</option>)}
              </select>
            </label>
          )}
          <label style={{ flex: '1', margin: 0, minWidth: '120px' }}>Payment
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} style={{ marginTop: '4px' }}>
              <option value="">All Payments</option>
              <option value="initial">Initial Pending</option>
              <option value="topup">Topup Pending</option>
              <option value="clear">Clear</option>
            </select>
          </label>
          <label style={{ flex: '1', margin: 0, minWidth: '130px' }}>Origin
            <select value={originFilter} onChange={e => setOriginFilter(e.target.value)} style={{ marginTop: '4px' }}>
              <option value="">All Origins</option>
              <option value="converted">Converted from Leads</option>
              <option value="ac_direct">Added by Coordinator</option>
              <option value="old">Old Data (Direct)</option>
            </select>
          </label>
          <label style={{ flex: '1.5', margin: 0, minWidth: '140px' }}>Hours Left
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <input type="number" placeholder="Min" value={minHours} onChange={e => setMinHours(e.target.value)} style={{ width: '50%' }} />
              <input type="number" placeholder="Max" value={maxHours} onChange={e => setMaxHours(e.target.value)} style={{ width: '50%' }} />
            </div>
          </label>
        </div>
        <div className="table-wrap mobile-friendly-table"><table><thead><tr>
          <th>ID</th><th>Name</th><th>Group</th><th>Class</th><th>Status</th><th>Hours Left</th>
          {isSuperAdmin && <th>Coordinator</th>}
          <th>Payment</th>
        </tr></thead><tbody>
            {filtered.map(s => <tr key={s.id} onClick={() => setSelId(s.id)} className="clickable-row" style={{ cursor: 'pointer' }}>
              <td data-label="ID" style={{ padding: '16px 12px' }}>{s.student_code || '—'}</td>
              <td data-label="Name" style={{ padding: '16px 12px', fontWeight: '600', color: '#0f172a' }}>{s.student_name}</td>
              <td data-label="Group" style={{ padding: '16px 12px' }}>
                {s.group_jid ? (
                  <span style={{ color: '#10b981', fontWeight: '600', fontSize: '13px' }} title={s.group_jid}>✅ {s.group_name || 'Group'}</span>
                ) : (
                  <button type="button" className="secondary small" onClick={(e) => { e.stopPropagation(); setGroupModal(s); setGroupName(s.student_name ? `Edusolve - ${s.student_name}` : 'Edusolve Group'); }}>Create Group</button>
                )}
              </td>
              <td data-label="Class" style={{ padding: '16px 12px' }}>{s.class_level || '—'}</td>
              <td data-label="Status" style={{ padding: '16px 12px' }}>
                <span className={`status-tag ${statusColor[s.status] || ''}`}>{s.status}</span>
              </td>
              <td data-label="Hours Left" style={{ padding: '16px 12px' }}><span className={Number(s.remaining_hours) <= 5 ? 'text-danger' : ''}>{s.remaining_hours}</span></td>
              {isSuperAdmin && <td data-label="Coordinator" style={{ padding: '16px 12px', fontSize: '13px', color: '#4b5563' }}>{s.ac_user?.full_name || '—'}</td>}
              <td data-label="Payment" style={{ padding: '16px 12px' }}>
                {s.pending_payment === 'topup' && <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>Topup Pending</span>}
                {s.pending_payment === 'initial' && <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, background: '#fce7f3', color: '#9d174d' }}>Initial Pending</span>}
                {!s.pending_payment && <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: '#d1fae5', color: '#065f46' }}>✓ Clear</span>}
              </td>
            </tr>)}
            {!filtered.length ? <tr><td colSpan={isSuperAdmin ? 8 : 7}>No students match filters.</td></tr> : null}
          </tbody></table></div>
      </article>

      {/* Create Group Modal */}
      {groupModal && (
        <div className="modal-overlay" onClick={() => !creatingGroup && setGroupModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <h3>Create WhatsApp Group</h3>
            <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Student Details:</strong></p>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563' }}>
                <li><strong>ID:</strong> {groupModal.student_code || 'N/A'}</li>
                <li><strong>Name:</strong> {groupModal.student_name || 'N/A'}</li>
              </ul>
              <p style={{ margin: '12px 0 8px 0' }}><strong>Numbers to be added:</strong></p>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563' }}>
                {groupModal.contact_number && <li><strong>Student:</strong> {groupModal.contact_number}</li>}
                {groupModal.alternative_number && <li><strong>Alternative:</strong> {groupModal.alternative_number}</li>}
                {groupModal.parent_phone && <li><strong>Parent:</strong> {groupModal.parent_phone}</li>}
              </ul>
            </div>
            <p className="muted" style={{ marginBottom: '16px', fontSize: '13px' }}>
              This will create a WhatsApp group with the coordinator and all registered numbers above.
            </p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setCreatingGroup(true);
              try {
                const res = await apiFetch(`/students/${groupModal.id}/whatsapp-group`, {
                  method: 'POST',
                  body: JSON.stringify({ name: groupName })
                });
                setStudents(prev => prev.map(s => s.id === groupModal.id ? { ...s, group_jid: res.group_jid, group_name: res.group_name } : s));
                setGroupModal(null);
                setGroupName('');
              } catch (err) {
                alert(err.message);
              } finally {
                setCreatingGroup(false);
              }
            }}>
              <label>Group Name
                <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} required disabled={creatingGroup} />
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button type="button" className="secondary" onClick={() => setGroupModal(null)} disabled={creatingGroup}>Cancel</button>
                <button type="submit" disabled={creatingGroup}>{creatingGroup ? 'Creating...' : 'Create Group'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Add New Student</h3>
              <button type="button" className="icon-btn" onClick={() => setShowAddForm(false)}>✕</button>
            </div>
            <StudentOnboardingForm onDone={() => {
              setShowAddForm(false);
              loadData();
            }} />
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════ New Student Pipeline ═══════ */
export function NewStudentPipelinePage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageView, setPageView] = useState('requests'); // 'requests' | 'pending'
  const [statusFilter, setStatusFilter] = useState('all');

  // Pending payments
  const [pendingBalances, setPendingBalances] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [showInstallmentModal, setShowInstallmentModal] = useState(null);
  const [myInstallments, setMyInstallments] = useState([]);
  const [loadingMyInstallments, setLoadingMyInstallments] = useState(false);

  const loadData = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const d = await apiFetch('/leads/payment-requests');
      // Show all AC-submitted requests (the backend already filters by requested_by for AC role)
      setRequests(d.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPendingBalances = useCallback(async () => {
    setLoadingPending(true);
    try {
      const data = await apiFetch('/finance/pending-balances');
      setPendingBalances((data.items || []).filter(it => it._type === 'payment_request'));
    } catch (e) { console.error(e); } finally { setLoadingPending(false); }
  }, []);

  const loadMyInstallments = useCallback(async () => {
    setLoadingMyInstallments(true);
    try {
      const data = await apiFetch('/finance/my-installments');
      setMyInstallments((data.items || []).filter(it => it.reference_type === 'payment_request'));
    } catch (e) { console.error(e); } finally { setLoadingMyInstallments(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (pageView === 'pending') { loadPendingBalances(); loadMyInstallments(); } }, [pageView]);

  const statusBadge = (status) => {
    const map = {
      pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' },
      verified: { bg: '#dcfce7', color: '#15803d', label: '✅ Verified' },
      rejected: { bg: '#fee2e2', color: '#dc2626', label: '❌ Rejected' }
    };
    const s = map[status] || { bg: '#f3f4f6', color: '#6b7280', label: status };
    return (
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
        fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color
      }}>{s.label}</span>
    );
  };

  const counts = useMemo(() => {
    const c = { all: requests.length, pending: 0, verified: 0, rejected: 0 };
    requests.forEach(r => { if (c[r.status] !== undefined) c[r.status]++; });
    return c;
  }, [requests]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return requests;
    return requests.filter(r => r.status === statusFilter);
  }, [requests, statusFilter]);

  if (loading) return <section className="panel"><p>Loading pipeline...</p></section>;

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}

      {/* Tabs */}
      <div className="tabs-row" style={{ marginBottom: '8px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px' }}>
        {[{ key: 'requests', label: 'Verification Requests' }, { key: 'pending', label: 'Pending Payments' }].map(t => (
          <button key={t.key} type="button" className={`tab-btn ${pageView === t.key ? 'active' : ''}`} onClick={() => setPageView(t.key)} style={{ whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ Tab: Pending Payments ═══ */}
      {pageView === 'pending' && (
        <div>
          {loadingPending ? <p>Loading...</p> : (
            <>
              <div className="card">
                <div className="table-wrap mobile-friendly-table">
                  <table className="data-table">
                    <thead><tr>
                      <th>Student</th>
                      <th>Phone</th>
                      <th>Total ₹</th>
                      <th>Paid ₹</th>
                      <th>Remaining</th>
                      <th>Action</th>
                    </tr></thead>
                    <tbody>
                      {pendingBalances.map(item => (
                        <tr key={item.id}>
                          <td data-label="Student" style={{ fontWeight: 500 }}>{item.leads?.student_name || item.students?.student_name || '—'}</td>
                          <td data-label="Phone">{item.leads?.contact_number || '—'}</td>
                          <td data-label="Total ₹">₹{Number(item.total_amount).toLocaleString('en-IN')}</td>
                          <td data-label="Paid ₹" style={{ color: '#16a34a', fontWeight: 600 }}>₹{Number(item.amount || 0).toLocaleString('en-IN')}</td>
                          <td data-label="Remaining" style={{ color: '#dc2626', fontWeight: 700 }}>₹{Number(item.remaining_amount).toLocaleString('en-IN')}</td>
                          <td data-label="Action">
                            <button className="primary small" onClick={() => setShowInstallmentModal(item)}>Upload Installment</button>
                          </td>
                        </tr>
                      ))}
                      {!pendingBalances.length && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>No pending balances.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* My Submitted Installments */}
              <div className="card" style={{ marginTop: '24px' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700 }}>My Submitted Installments</h3>
                {loadingMyInstallments ? <p style={{ color: '#6b7280' }}>Loading...</p> : (
                  <div className="table-wrap mobile-friendly-table">
                    <table className="data-table">
                      <thead><tr>
                        <th>Student</th>
                        <th>Amount</th>
                        <th>Note</th>
                        <th>Screenshot</th>
                        <th>Status</th>
                        <th>Submitted</th>
                      </tr></thead>
                      <tbody>
                        {myInstallments.map(inst => {
                          const statusMap = {
                            pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' },
                            verified: { bg: '#dcfce7', color: '#15803d', label: '✅ Verified' },
                            rejected: { bg: '#fee2e2', color: '#dc2626', label: '❌ Rejected' }
                          };
                          const s = statusMap[inst.status] || { bg: '#f3f4f6', color: '#6b7280', label: inst.status };
                          return (
                            <tr key={inst.id}>
                              <td data-label="Student" style={{ fontWeight: 500 }}>{inst.student_name || '—'}</td>
                              <td data-label="Amount" style={{ fontWeight: 700, color: '#15803d' }}>₹{Number(inst.amount).toLocaleString('en-IN')}</td>
                              <td data-label="Note" style={{ fontSize: '12px', color: '#6b7280', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inst.finance_note || '—'}</td>
                              <td data-label="Screenshot">{inst.screenshot_url ? <a href={inst.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#4338ca', fontSize: '12px' }}>View</a> : '—'}</td>
                              <td data-label="Status"><span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span></td>
                              <td data-label="Submitted" style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(inst.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            </tr>
                          );
                        })}
                        {!myInstallments.length && (
                          <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>No installments submitted yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
          {showInstallmentModal && (
            <UploadInstallmentModal
              item={showInstallmentModal}
              onClose={() => setShowInstallmentModal(null)}
              onSuccess={() => { setShowInstallmentModal(null); loadPendingBalances(); loadMyInstallments(); }}
            />
          )}
        </div>
      )}

      {/* ═══ Tab: Verification Requests ═══ */}
      {pageView === 'requests' && (
        <>
          {/* Stats Cards */}
          <div className="grid-four pill-stats-grid" style={{ marginBottom: '12px' }}>
            {[
              { key: 'all', label: 'Total', value: counts.all, color: '#111' },
              { key: 'pending', label: 'Pending', value: counts.pending, color: '#92400e' },
              { key: 'verified', label: 'Verified', value: counts.verified, color: '#15803d' },
              { key: 'rejected', label: 'Rejected', value: counts.rejected, color: '#dc2626' }
            ].map(s => (
              <div key={s.key} className="card"
                onClick={() => setStatusFilter(s.key)}
                style={{
                  padding: '14px', textAlign: 'center', cursor: 'pointer',
                  border: statusFilter === s.key ? '2px solid #2563eb' : '2px solid transparent',
                  transition: 'border 0.2s'
                }}>
                <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</p>
                <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '11px' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="card">
            <div className="table-wrap mobile-friendly-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Phone</th>
                    <th>Class</th>
                    <th>Total Amt</th>
                    <th>Hours</th>
                    <th>Paid Amt</th>
                    <th>Screenshot</th>
                    <th>Status</th>
                    <th>Finance Note</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td data-label="Student" style={{ fontWeight: 500 }}>{r.leads?.student_name || '—'}</td>
                      <td data-label="Phone">{r.leads?.contact_number || '—'}</td>
                      <td data-label="Class">{r.leads?.class_level || '—'}</td>
                      <td data-label="Total Amt" style={{ fontWeight: 600 }}>{r.total_amount ? `₹${Number(r.total_amount).toLocaleString('en-IN')}` : '—'}</td>
                      <td data-label="Hours">{r.hours || '—'}</td>
                      <td data-label="Paid Amt" style={{ fontWeight: 600, color: '#15803d' }}>₹{Number(r.amount).toLocaleString('en-IN')}</td>
                      <td data-label="Screenshot">
                        {r.screenshot_url ? (
                          <a href={r.screenshot_url} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#2563eb', fontSize: '12px' }}>View</a>
                        ) : '—'}
                      </td>
                      <td data-label="Status">{statusBadge(r.status)}</td>
                      <td data-label="Finance Note" style={{ fontSize: '12px', color: '#6b7280', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.finance_note || '—'}
                      </td>
                      <td data-label="Submitted" style={{ fontSize: '12px', color: '#6b7280' }}>
                        {new Date(r.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr><td colSpan="10" style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                      No onboarding requests found. Add a new student from the Students page to see them here.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
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
  const [page, setPage] = useState(1);

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
        body: JSON.stringify({ session_date: rescheduleData.date, started_at: rescheduleData.time, duration_hours: Number(rescheduleData.duration), subject: rescheduleData.subject || undefined, teacher_id: rescheduleData.teacher_id || undefined })
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
              {filtered.slice((page - 1) * 10, page * 10).map(s => {
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
                      {isSessionOverdue(s) && <span className="status-tag small" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', marginLeft: 4 }}>Overdue</span>}
                    </td>
                    <td className="actions" data-label="Actions" style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '85px' }}>
                          {isUpcoming && <button type="button" className="small secondary" style={{ width: '100%', padding: '4px 8px' }} onClick={() => setRescheduleData({
                            id: s.id, student_id: s.student_id || '', teacher_id: s.teacher_id || '',
                            subject: s.subject || '', date: s.session_date || '', time: s.started_at ? s.started_at.slice(11, 16) : '', duration: s.duration_hours || 1
                          })}>Reschedule</button>}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', width: '64px' }}>
                          {s.status !== 'completed' && (
                            <button type="button" title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '2px 5px', width: '28px' }}
                              onClick={() => setEditData({ id: s.id, teacher_id: s.teacher_id || '', student_id: s.student_id || '', subject: s.subject || '', date: s.session_date || '', time: s.started_at ? s.started_at.slice(11, 16) : '', duration: s.duration_hours || 1, status: s.status || 'scheduled' })}>✏️</button>
                          )}
                          {s.status !== 'completed' && (
                            <button type="button" title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '2px 5px', width: '28px' }}
                              onClick={() => setDeleteConfirmId(s.id)}>🗑️</button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length ? <tr><td colSpan="9">No classes match filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        {filtered.length > 10 && (
          <Pagination page={page} limit={10} total={filtered.length} onPageChange={setPage} />
        )}
      </article>

      {/* Reschedule Modal */}
      {rescheduleData && (() => (
        <div className="modal-overlay" onClick={() => setRescheduleData(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <h3>Reschedule Session</h3>
            <form onSubmit={submitReschedule}>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
                <label>Teacher
                  <select value={rescheduleData.teacher_id} onChange={e => setRescheduleData({ ...rescheduleData, teacher_id: e.target.value, subject: '', time: '' })} required>
                    <option value="">Select teacher</option>
                    {allTeachers.map(t => <option key={t.user_id} value={t.user_id}>{t.users?.full_name || t.user_id}</option>)}
                  </select>
                </label>
                {(() => {
                  const rTeacher = allTeachers.find(t => t.user_id === rescheduleData.teacher_id); const rSubjects = rTeacher ? (Array.isArray(rTeacher.subjects_taught) ? rTeacher.subjects_taught : (typeof rTeacher.subjects_taught === 'string' ? JSON.parse(rTeacher.subjects_taught || '[]') : [])) : []; return (
                    <label>Subject
                      <select value={rescheduleData.subject} onChange={e => setRescheduleData({ ...rescheduleData, subject: e.target.value })} required>
                        <option value="">{rescheduleData.teacher_id ? 'Select subject' : 'Pick teacher first'}</option>
                        {rSubjects.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </label>
                  );
                })()}
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
  const [fOverdue, setFOverdue] = useState(false);
  const [page, setPage] = useState(1);

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
      // Filters are applied on frontend, so we don't need to append them to the URL anymore
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
        body: JSON.stringify({ session_date: rescheduleData.date, started_at: rescheduleData.time, duration_hours: Number(rescheduleData.duration), subject: rescheduleData.subject || undefined, teacher_id: rescheduleData.teacher_id || undefined })
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

  const filteredSessions = useMemo(() => {
    return allSessions.filter(s => {
      if (fTeacher && s.teacher_id !== fTeacher) return false;
      if (fStudent && s.student_id !== fStudent) return false;
      if (fStatus && s.status !== fStatus) return false;
      if (fOverdue && !isSessionOverdue(s)) return false;
      return true;
    });
  }, [allSessions, fTeacher, fStudent, fStatus, fOverdue]);

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
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Overdue</label>
            <button
              type="button"
              onClick={() => setFOverdue(v => !v)}
              style={{
                padding: '8px 14px', border: '1px solid', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                background: fOverdue ? '#fee2e2' : '#fff',
                borderColor: fOverdue ? '#fca5a5' : '#d1d5db',
                color: fOverdue ? '#dc2626' : '#6b7280'
              }}
            >
              {fOverdue ? '⚠️ Overdue Only' : '⚠️ Show Overdue'}
            </button>
          </div>
        </div>

        <div className="table-wrap mobile-friendly-table" style={{ marginTop: '16px' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Day</th><th>Time</th><th>Student</th><th>Teacher</th><th>Subject</th><th>Hrs</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.slice((page - 1) * 10, page * 10).map(s => {
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
                      {isSessionOverdue(s) && <span className="status-tag small" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', marginLeft: 4 }}>Overdue</span>}
                      {s.status === 'completed' && <span className={`status-tag small ${s.verification_status === 'approved' ? 'success' : 'muted'}`} style={{ marginLeft: 4 }}>{s.verification_status}</span>}
                    </td>
                    <td className="actions" data-label="Actions" style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '85px' }}>
                          {isUpcoming && <button type="button" className="small secondary" style={{ width: '100%', padding: '4px 8px' }} onClick={() => setRescheduleData({
                            id: s.id,
                            student_id: s.student_id || '',
                            teacher_id: s.teacher_id || '',
                            subject: s.subject || '',
                            date: s.session_date || '',
                            time: s.started_at ? s.started_at.slice(11, 16) : '',
                            duration: s.duration_hours || 1
                          })}>Reschedule</button>}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', width: '64px' }}>
                          {s.status !== 'completed' && (
                            <button
                              type="button" title="Edit session"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '2px 5px', width: '28px' }}
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
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '2px 5px', width: '28px' }}
                              onClick={() => setDeleteConfirmId(s.id)}>🗑️</button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filteredSessions.length ? <tr><td colSpan="9">No sessions match filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        {filteredSessions.length > 10 && (
          <Pagination page={page} limit={10} total={filteredSessions.length} onPageChange={setPage} />
        )}
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
                  <label>Teacher
                    <select value={rescheduleData.teacher_id} onChange={e => setRescheduleData({ ...rescheduleData, teacher_id: e.target.value, subject: '', time: '' })} required>
                      <option value="">Select teacher</option>
                      {allTeachers.map(t => <option key={t.user_id} value={t.user_id}>{t.users?.full_name || t.user_id}</option>)}
                    </select>
                  </label>
                  {(() => {
                    const rTeacher = allTeachers.find(t => t.user_id === rescheduleData.teacher_id); const rSubjects = rTeacher ? (Array.isArray(rTeacher.subjects_taught) ? rTeacher.subjects_taught : (typeof rTeacher.subjects_taught === 'string' ? JSON.parse(rTeacher.subjects_taught || '[]') : [])) : []; return (
                      <label>Subject
                        <select value={rescheduleData.subject} onChange={e => setRescheduleData({ ...rescheduleData, subject: e.target.value })} required>
                          <option value="">{rescheduleData.teacher_id ? 'Select subject' : 'Pick teacher first'}</option>
                          {rSubjects.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </label>
                    );
                  })()}
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
  const [page, setPage] = useState(1);

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
          {filtered.slice((page - 1) * 10, page * 10).map((item) => {
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
      {filtered.length > 10 && (
        <Pagination page={page} limit={10} total={filtered.length} onPageChange={setPage} />
      )}
    </div>
  );
}

function RescheduleTable({ items, fTeacher, fStudent, onVerify }) {
  const [page, setPage] = useState(1);
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
          {filtered.slice((page - 1) * 10, page * 10).map((item) => {
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
      {filtered.length > 10 && (
        <Pagination page={page} limit={10} total={filtered.length} onPageChange={setPage} />
      )}
    </div>
  );
}

export function VerificationsPage() {
  const [approvalItems, setApprovalItems] = useState([]);
  const [rescheduleItems, setRescheduleItems] = useState([]);
  const [logItems, setLogItems] = useState([]);
  const [logFilterType, setLogFilterType] = useState('all'); // 'all' | 'approval' | 'reschedule'
  const [logFilterStatus, setLogFilterStatus] = useState('all'); // 'all' | 'approved' | 'rejected' | 'pending'
  const [activeTab, setActiveTab] = useState('approvals');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [fTeacher, setFTeacher] = useState('');
  const [fStudent, setFStudent] = useState('');

  const loadAll = useCallback(async () => {
    setError('');
    try {
      const [approvals, reschedules, logs] = await Promise.all([
        apiFetch('/sessions/verification-queue'),
        apiFetch('/sessions/reschedule-queue'),
        apiFetch('/sessions/verification-logs')
      ]);
      setApprovalItems(approvals.items || []);
      setRescheduleItems(reschedules.items || []);
      setLogItems(logs.items || []);
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
    { key: 'reschedules', label: `Reschedule Requests (${rescheduleItems.length})` },
    { key: 'logs', label: `📋 Verification Logs (${logItems.length})` }
  ];

  return (
    <section className="panel">
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
          {activeTab === 'logs' && (
            <>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Type</label>
                <select value={logFilterType} onChange={e => setLogFilterType(e.target.value)}
                  style={{ display: 'block', width: '100%', padding: '8px 10px', marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
                  <option value="all">All Types</option>
                  <option value="approval">Session Approval</option>
                  <option value="reschedule">Reschedule</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Status</label>
                <select value={logFilterStatus} onChange={e => setLogFilterStatus(e.target.value)}
                  style={{ display: 'block', width: '100%', padding: '8px 10px', marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </>
          )}
        </div>
        {activeTab === 'approvals' ? (
          <ApprovalTable items={approvalItems} fTeacher={fTeacher} fStudent={fStudent} onVerify={verify} />
        ) : activeTab === 'reschedules' ? (
          <RescheduleTable items={rescheduleItems} fTeacher={fTeacher} fStudent={fStudent} onVerify={verify} />
        ) : (
          /* ── Verification Logs Tab ── */
          <div>

            <div className="table-wrap mobile-friendly-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Student</th>
                    <th>Teacher</th>
                    <th>Subject</th>
                    <th>Session Date</th>
                    <th>Received At</th>
                    <th>Actioned At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logItems
                    .filter(v => logFilterType === 'all' || v.type === logFilterType)
                    .filter(v => logFilterStatus === 'all' || v.status === logFilterStatus)
                    .map(v => {
                      const sess = v.academic_sessions || {};
                      const typeLabel = v.type === 'approval' ? '✅ Approval' : '🔄 Reschedule';
                      const statusColor = v.status === 'approved' ? '#15803d' : v.status === 'rejected' ? '#dc2626' : '#92400e';
                      const statusBg = v.status === 'approved' ? '#dcfce7' : v.status === 'rejected' ? '#fee2e2' : '#fef9c3';
                      return (
                        <tr key={v.id}>
                          <td data-label="Type">
                            <span style={{ fontSize: 12, fontWeight: 600 }}>{typeLabel}</span>
                          </td>
                          <td data-label="Student">{sess.students?.student_name || '—'}</td>
                          <td data-label="Teacher">{sess.users?.full_name || '—'}</td>
                          <td data-label="Subject">{sess.subject || '—'}</td>
                          <td data-label="Session Date" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                            {sess.session_date ? new Date(sess.session_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                          <td data-label="Received At" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                            {v.created_at ? new Date(v.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                          <td data-label="Actioned At" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                            {v.verified_at ? new Date(v.verified_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : <span style={{ color: '#9ca3af' }}>Pending</span>}
                          </td>
                          <td data-label="Status">
                            <span style={{ background: statusBg, color: statusColor, padding: '2px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  }
                  {logItems.filter(v => logFilterType === 'all' || v.type === logFilterType).filter(v => logFilterStatus === 'all' || v.status === logFilterStatus).length === 0 && (
                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: 28, color: '#6b7280' }}>No verification logs found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

/* ═══════ Top-Ups ═══════ */
function UploadInstallmentModal({ item, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [financeNote, setFinanceNote] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return alert('Enter a valid amount');
    if (!screenshotFile) return alert('Please upload a screenshot');
    setSaving(true);
    try {
      setUploading(true);
      const presignData = await apiFetch('/upload/presigned-url', {
        method: 'POST', body: JSON.stringify({ filename: screenshotFile.name, contentType: screenshotFile.type })
      });
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: 'PUT', headers: { 'Content-Type': screenshotFile.type }, body: screenshotFile
      });
      if (!uploadRes.ok) throw new Error('Failed to upload file');
      setUploading(false);
      await apiFetch('/finance/installments', {
        method: 'POST',
        body: JSON.stringify({
          reference_type: 'student_topup',
          reference_id: item.id,
          amount: Number(amount),
          finance_note: financeNote,
          screenshot_url: presignData.publicUrl
        })
      });
      alert('Installment submitted!');
      onSuccess();
    } catch (err) {
      setUploading(false);
      alert('Error: ' + err.message);
    } finally { setSaving(false); }
  }

  const studentName = item.students?.student_name || item.student_id;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', padding: '24px', borderRadius: '10px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Upload Installment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>×</button>
        </div>
        <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px', background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
          Student: <strong>{studentName}</strong><br />
          Total: ₹{item.total_amount} &nbsp;|&nbsp; Paid: ₹{item.amount || 0} &nbsp;|&nbsp; <span style={{ color: '#dc2626', fontWeight: 700 }}>Remaining: ₹{Number(item.total_amount) - Number(item.amount || 0)}</span>
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Amount (₹) *
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="1" max={Number(item.total_amount) - Number(item.amount || 0)}
              style={{ width: '100%', padding: '8px 12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
          </label>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Payment Screenshot *
            <input type="file" accept="image/*" onChange={e => setScreenshotFile(e.target.files[0])} required style={{ width: '100%', marginTop: '4px' }} />
          </label>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Note
            <textarea value={financeNote} onChange={e => setFinanceNote(e.target.value)} rows={2}
              style={{ width: '100%', padding: '8px 12px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }} />
          </label>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="secondary">Cancel</button>
            <button type="submit" className="primary" disabled={saving || uploading}>{saving || uploading ? 'Submitting...' : 'Submit Installment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TopUpsPage() {
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pendingBalances, setPendingBalances] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [sid, setSid] = useState('');
  const [hrs, setHrs] = useState('');
  const [totalAmt, setTotalAmt] = useState('');
  const [amt, setAmt] = useState('');
  const [fNote, setFNote] = useState('');
  const [scrFile, setScrFile] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showInstallmentModal, setShowInstallmentModal] = useState(null);
  const [loadingPending, setLoadingPending] = useState(false);
  const [myInstallments, setMyInstallments] = useState([]);
  const [loadingMyInstallments, setLoadingMyInstallments] = useState(false);

  // Warning State
  const [warningAck, setWarningAck] = useState(false);
  const [pendingWarning, setPendingWarning] = useState(null); // { type: 'topup'|'initial', amount: 0 }

  const load = useCallback(async () => {
    try {
      const [s, t] = await Promise.all([apiFetch('/students'), apiFetch('/students/topup-requests?status=all')]);
      setStudents(s.items || []);
      setRequests(t.items || []);
    } catch (e) { setError(e.message); }
  }, []);

  const loadPending = useCallback(async () => {
    setLoadingPending(true);
    try {
      const data = await apiFetch('/finance/pending-balances');
      setPendingBalances((data.items || []).filter(it => it._type === 'student_topup'));
    } catch (e) { setError(e.message); } finally { setLoadingPending(false); }
  }, []);

  const loadMyInstallments = useCallback(async () => {
    setLoadingMyInstallments(true);
    try {
      const data = await apiFetch('/finance/my-installments');
      setMyInstallments((data.items || []).filter(it => it.reference_type === 'student_topup'));
    } catch (e) { console.error(e); } finally { setLoadingMyInstallments(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (activeTab === 'pending') { loadPending(); loadMyInstallments(); } }, [activeTab, loadPending, loadMyInstallments]);

  // Reset warning if student changes
  useEffect(() => {
    setWarningAck(false);
    setPendingWarning(null);
  }, [sid, hrs, totalAmt, amt]);

  async function submit(e) {
    if (e) e.preventDefault();
    setError(''); setMsg('');

    // Warning Check
    const student = students.find(s => String(s.id) === String(sid));
    if (student && student.pending_payment && !warningAck) {
      setPendingWarning({
        type: student.pending_payment,
        amount: student.pending_amount || 0
      });
      return; // Stop submission to show warning
    }

    let scrUrl = null;
    if (scrFile) {
      try {
        const formData = new FormData();
        formData.append('file', scrFile);
        const res = await apiFetch('/upload/screenshot', { method: 'POST', body: formData });
        scrUrl = res.url;
      } catch (e) { setError('Upload failed: ' + e.message); return; }
    }
    try {
      await apiFetch(`/students/${sid}/topup-requests`, {
        method: 'POST',
        body: JSON.stringify({ hours_added: Number(hrs), total_amount: Number(totalAmt), amount: Number(amt), finance_note: fNote || null, screenshot_url: scrUrl })
      });
      setMsg('Sent to finance.'); setHrs(''); setTotalAmt(''); setAmt(''); setFNote(''); setScrFile(null); await load();
    } catch (e) { setError(e.message); }
  }

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card"><h3>Create Top-Up</h3>
        {pendingWarning && !warningAck && (
          <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span> WARNING: Pending Payment Detected
            </h4>
            <p style={{ fontSize: '14px', color: '#92400e', marginTop: '8px', marginBottom: '12px' }}>
              This student currently has a pending <strong>{pendingWarning.type === 'topup' ? 'Top-up' : 'Initial'}</strong> payment of <strong style={{ color: '#dc2626' }}>₹{Number(pendingWarning.amount).toLocaleString('en-IN')}</strong>.
              Are you sure you want to request another top-up before this is cleared?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="secondary small" onClick={() => setPendingWarning(null)}>Cancel</button>
              <button type="button" className="primary small" style={{ background: '#d97706', borderColor: '#d97706' }} onClick={() => {
                setWarningAck(true);
                setPendingWarning(null);
                // We use setTimeout to ensure state updates before submitting again
                setTimeout(() => submit(), 0);
              }}>Yes, Proceed Anyway</button>
            </div>
          </div>
        )}
        <form className="form-grid form-row" onSubmit={submit}><label>Student<select value={sid} onChange={e => setSid(e.target.value)} required><option value="">Select</option>{students.map(s => <option key={s.id} value={s.id}>{s.student_code || s.id} — {s.student_name} ({s.remaining_hours}h)</option>)}</select></label><label>Hours<input type="number" value={hrs} onChange={e => setHrs(e.target.value)} required /></label><label>Total Amount (₹)<input type="number" value={totalAmt} onChange={e => setTotalAmt(e.target.value)} required /></label><label>Paid Amount (₹)<input type="number" value={amt} onChange={e => setAmt(e.target.value)} required /></label><label>Finance Note<textarea value={fNote} onChange={e => setFNote(e.target.value)} rows={2} style={{ resize: 'vertical' }} /></label><label>Screenshot (Upload)<input type="file" accept="image/*" onChange={e => setScrFile(e.target.files[0])} /></label><button type="submit" style={{ alignSelf: 'flex-end', marginTop: '16px' }}>Submit</button></form>{msg ? <p>{msg}</p> : null}
      </article>

      <article className="card" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e5e7eb', marginBottom: '16px' }}>
          {[{ key: 'all', label: 'All Requests' }, { key: 'pending', label: 'Pending Payments' }].map(t => (
            <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} style={{
              padding: '8px 16px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', background: 'none', border: 'none',
              borderBottom: activeTab === t.key ? '3px solid #4338ca' : '3px solid transparent',
              color: activeTab === t.key ? '#4338ca' : '#6b7280', marginBottom: '-2px'
            }}>{t.label}</button>
          ))}
        </div>

        {activeTab === 'all' && (
          <div className="table-wrap mobile-friendly-table"><table><thead><tr><th>Student</th><th>Hrs</th><th>Total ₹</th><th>Paid ₹</th><th>Note</th><th>Screenshot</th><th>Status</th><th>Date</th></tr></thead><tbody>{requests.map(r => <tr key={r.id}><td data-label="Student">{r.students?.student_name || '—'} <span className="text-muted" style={{ fontSize: '11px' }}>({r.students?.student_code || r.student_id})</span></td><td data-label="Hrs">{r.hours_added}</td><td data-label="Total ₹">₹{r.total_amount ? r.total_amount : '—'}</td><td data-label="Paid ₹">₹{r.amount}</td><td data-label="Note" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.finance_note || '—'}</td><td data-label="Screenshot">{r.screenshot_url ? <a href={r.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#4338ca' }}>View</a> : '—'}</td><td data-label="Status"><span className={`status-tag ${r.status === 'approved' ? 'success' : ''}`}>{r.status}</span></td><td data-label="Date">{new Date(r.created_at).toLocaleDateString('en-IN')}</td></tr>)}{!requests.length ? <tr><td colSpan="8">No requests.</td></tr> : null}</tbody></table></div>
        )}

        {activeTab === 'pending' && (
          loadingPending ? <p>Loading...</p> : (
            <>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Student</th><th>Total ₹</th><th>Paid ₹</th><th>Remaining</th><th>Action</th></tr></thead>
                  <tbody>
                    {pendingBalances.map(item => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 500 }}>{item.students?.student_name || item.student_id}</td>
                        <td>₹{item.total_amount}</td>
                        <td style={{ color: '#16a34a', fontWeight: 600 }}>₹{item.amount || 0}</td>
                        <td style={{ color: '#dc2626', fontWeight: 700 }}>₹{item.remaining_amount}</td>
                        <td>
                          <button className="primary small" onClick={() => setShowInstallmentModal(item)}>Upload Installment</button>
                        </td>
                      </tr>
                    ))}
                    {!pendingBalances.length && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#6b7280', padding: '24px' }}>No pending balances.</td></tr>}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>My Submitted Installments</h3>
                {loadingMyInstallments ? <p style={{ color: '#6b7280' }}>Loading...</p> : (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Student</th><th>Amount</th><th>Note</th><th>Screenshot</th><th>Status</th><th>Submitted</th></tr></thead>
                      <tbody>
                        {myInstallments.map(inst => {
                          const sm = { pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' }, verified: { bg: '#dcfce7', color: '#15803d', label: '✅ Verified' }, rejected: { bg: '#fee2e2', color: '#dc2626', label: '❌ Rejected' } };
                          const s = sm[inst.status] || { bg: '#f3f4f6', color: '#6b7280', label: inst.status };
                          return (
                            <tr key={inst.id}>
                              <td style={{ fontWeight: 500 }}>{inst.student_name}</td>
                              <td style={{ fontWeight: 700, color: '#15803d' }}>₹{Number(inst.amount).toLocaleString('en-IN')}</td>
                              <td style={{ fontSize: '12px', color: '#6b7280', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inst.finance_note || '—'}</td>
                              <td>{inst.screenshot_url ? <a href={inst.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#4338ca', fontSize: '12px' }}>View</a> : '—'}</td>
                              <td><span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span></td>
                              <td style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(inst.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            </tr>
                          );
                        })}
                        {!myInstallments.length && <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No installments submitted yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </article>

      {showInstallmentModal && (
        <UploadInstallmentModal
          item={showInstallmentModal}
          onClose={() => setShowInstallmentModal(null)}
          onSuccess={() => { setShowInstallmentModal(null); loadPending(); loadMyInstallments(); }}
        />
      )}
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
  const [fStartTime, setFStartTime] = useState('');
  const [fEndTime, setFEndTime] = useState('');
  const [selectedMapDay, setSelectedMapDay] = useState(new Date().getDay()); // Default to today
  const [viewTeacher, setViewTeacher] = useState(null);
  const [showSlotsFor, setShowSlotsFor] = useState(null);
  const [fSearch, setFSearch] = useState('');
  const [page, setPage] = useState(1);

  // Reset page when filters or view changes
  useEffect(() => { setPage(1); }, [fSearch, fExp, fLang, fSubj, fSyllabus, fStartTime, fEndTime, view]);

  const [weekOffsetMap, setWeekOffsetMap] = useState(0);
  const [weekStartMap, setWeekStartMap] = useState('');
  const [weekEndMap, setWeekEndMap] = useState('');

  const loadWeekMap = useCallback(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - dayOfWeek + weekOffsetMap * 7);

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    const fDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    setWeekStartMap(fDate(sunday));
    setWeekEndMap(fDate(saturday));
  }, [weekOffsetMap]);

  useEffect(() => { loadWeekMap(); }, [loadWeekMap]);

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  useEffect(() => {
    if (!weekStartMap || !weekEndMap) return;
    (async () => {
      try {
        const d = await apiFetch(`/teachers/pool?start_date=${weekStartMap}&end_date=${weekEndMap}`);
        setTeachers(d.items || []);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [weekStartMap, weekEndMap]);
  useEffect(() => { function close(e) { if (!e.target.closest('.filter-panel') && !e.target.closest('.filter-toggle-btn')) setFiltersOpen(false); } if (filtersOpen) document.addEventListener('click', close); return () => document.removeEventListener('click', close); }, [filtersOpen]);

  const allLangs = useMemo(() => { const s = new Set(); teachers.forEach(t => (t.languages || []).forEach(l => s.add(l))); return [...s].sort(); }, [teachers]);
  const allSubjs = useMemo(() => { const s = new Set(); teachers.forEach(t => (t.subjects_taught || []).forEach(l => s.add(l))); return [...s].sort(); }, [teachers]);
  const allSyllabus = useMemo(() => { const s = new Set(); teachers.forEach(t => (t.syllabus || []).forEach(l => s.add(l))); return [...s].sort(); }, [teachers]);

  const activeFilterCount = [fExp, fLang, fSubj, fSyllabus, fStartTime, fEndTime].filter(Boolean).length;

  const filtered = useMemo(() => {
    let items = teachers;
    if (fSearch) {
      const qs = fSearch.toLowerCase();
      items = items.filter(t => (
        (t.users?.full_name || '').toLowerCase().includes(qs) ||
        (t.teacher_code || '').toLowerCase().includes(qs)
      ));
    }
    if (fExp) items = items.filter(t => t.experience_level === fExp);
    if (fLang) items = items.filter(t => (t.languages || []).includes(fLang));
    if (fSubj) items = items.filter(t => (t.subjects_taught || []).includes(fSubj));
    if (fSyllabus) items = items.filter(t => (t.syllabus || []).includes(fSyllabus));
    if (fStartTime || fEndTime) {
      items = items.filter(t => {
        if (!t.teacher_availability || t.teacher_availability.length === 0) return false;

        // Helper to convert HH:mm or HH:mm:ss to minutes
        const toMinutes = (timeStr) => {
          if (!timeStr) return null;
          const [h, m] = timeStr.split(':').map(Number);
          return h * 60 + m;
        };

        const filterStart = fStartTime ? toMinutes(fStartTime) : 0;
        const filterEnd = fEndTime ? toMinutes(fEndTime) : 24 * 60;

        return t.teacher_availability.some(slot => {
          const slotStart = toMinutes(slot.start_time);
          const slotEnd = toMinutes(slot.end_time);
          if (slotStart === null || slotEnd === null) return false;
          // Check if slot overlaps or contains the requested time
          return slotStart <= filterEnd && slotEnd >= filterStart;
        });
      });
    }
    return items;
  }, [teachers, fSearch, fExp, fLang, fSubj, fSyllabus, fStartTime, fEndTime]);

  function clearFilters() { setFSearch(''); setFExp(''); setFLang(''); setFSubj(''); setFSyllabus(''); setFStartTime(''); setFEndTime(''); }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mapDateLabels = useMemo(() => {
    if (!weekStartMap) return dayLabels;
    const parts = weekStartMap.split('-');
    const startObj = new Date(parts[0], parts[1] - 1, parts[2]);
    return dayLabels.map((lbl, i) => {
      const d = new Date(startObj);
      d.setDate(startObj.getDate() + i);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${lbl} ${dd}/${mm}`;
    });
  }, [weekStartMap, dayLabels]);

  const fullDayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const targetDateStr = useMemo(() => {
    if (!weekStartMap) return '';
    const parts = weekStartMap.split('-');
    const targetDateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    targetDateObj.setDate(targetDateObj.getDate() + selectedMapDay);
    return `${targetDateObj.getFullYear()}-${String(targetDateObj.getMonth() + 1).padStart(2, '0')}-${String(targetDateObj.getDate()).padStart(2, '0')}`;
  }, [weekStartMap, selectedMapDay]);

  const hours = Array.from({ length: 19 }, (_, i) => i + 6); // 6 AM to 12 AM (24)

  const timeOptions = useMemo(() => {
    const opts = [];
    for (let h = 6; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const val = `${hh}:${mm}`;
        opts.push({ value: val, label: formatTime12(val) });
      }
    }
    opts.push({ value: '24:00', label: '12:00 AM' });
    return opts;
  }, []);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or code..."
          value={fSearch}
          onChange={(e) => setFSearch(e.target.value)}
          style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', minWidth: '200px', flex: '1 1 auto' }}
        />
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
              <SearchSelect label="From Time" value={fStartTime} onChange={setFStartTime} options={timeOptions} placeholder="Any" />
              <SearchSelect label="To Time" value={fEndTime} onChange={setFEndTime} options={timeOptions} placeholder="Any" />
            </div>
            {activeFilterCount ? <button type="button" className="secondary small" onClick={clearFilters} style={{ marginTop: 12 }}>Clear All</button> : null}
          </div> : null}
        </div>
        <div style={{ marginRight: 'auto', display: 'flex', gap: 4 }}>
          <button type="button" className={view === 'table' ? 'tab-btn active' : 'tab-btn'} onClick={() => setView('table')}>Table</button>
          <button type="button" className={view === 'map' ? 'tab-btn active' : 'tab-btn'} onClick={() => setView('map')}>Map</button>
        </div>
        <span className="muted" style={{ fontSize: 13, marginLeft: 'auto' }}>{filtered.length} of {teachers.length} teachers</span>
      </div>

      {view === 'table' ? (
        <>
          <article className="card desktop-only"><div className="table-wrap mobile-friendly-table"><table><thead><tr><th>Code</th><th>Name</th><th>Exp</th><th>Subjects</th><th>Languages</th><th>Syllabus</th><th>Pref. Time</th></tr></thead><tbody>{filtered.slice((page - 1) * 10, page * 10).map(t => <tr key={t.id}><td data-label="Code">{t.teacher_code}</td><td data-label="Name">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {t.users?.full_name || '—'}
              {t.phone && (
                <a href={`https://wa.me/${t.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp Message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.575-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.433-9.879 9.885-9.879 2.64 0 5.122 1.029 6.988 2.895a9.82 9.82 0 012.893 6.983c-.002 5.446-4.437 9.88-9.883 9.88zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
          </td><td data-label="Exp">{t.experience_level || '—'}</td><td data-label="Subjects">{(t.subjects_taught || []).join(', ') || '—'}</td><td data-label="Languages">{(t.languages || []).join(', ') || '—'}</td><td data-label="Syllabus">{(t.syllabus || []).join(', ') || '—'}</td><td data-label="Pref. Time">
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
            </td></tr>)}{!filtered.length ? <tr><td colSpan="8">No teachers match filters.</td></tr> : null}</tbody></table></div>
            {filtered.length > 10 && <Pagination page={page} limit={10} total={filtered.length} onPageChange={setPage} />}
          </article>

          <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.slice((page - 1) * 10, page * 10).map(t => (
              <ExpandableMobileCard
                key={t.id}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t.users?.full_name || 'Unknown Teacher'}
                    {t.phone && (
                      <a href={`https://wa.me/${t.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp Message" onClick={(e) => e.stopPropagation()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.575-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.433-9.879 9.885-9.879 2.64 0 5.122 1.029 6.988 2.895a9.82 9.82 0 012.893 6.983c-.002 5.446-4.437 9.88-9.883 9.88zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    )}
                  </div>
                }
                subtitle={t.teacher_code}
                topRight={<span style={{ fontWeight: 600, fontSize: '13px', background: '#f3f4f6', padding: '2px 8px', borderRadius: '12px' }}>{t.experience_level || 'N/A'}</span>}
                mainStats={
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ color: '#4f46e5', fontWeight: 600 }}>{t.teacher_availability?.length || 0} Slots</div>
                  </div>
                }
                expandedContent={
                  <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                    <div><span className="text-muted">Subjects:</span> {(t.subjects_taught || []).join(', ') || '—'}</div>
                    <div><span className="text-muted">Languages:</span> {(t.languages || []).join(', ') || '—'}</div>
                    <div><span className="text-muted">Syllabus:</span> {(t.syllabus || []).join(', ') || '—'}</div>
                  </div>
                }
                actions={
                  <div style={{ display: 'flex', gap: '8px', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ width: '100%' }}>
                      <strong style={{ fontSize: '12px', marginBottom: '6px', display: 'block', color: '#4b5563' }}>Availability</strong>
                      {(t.teacher_availability && t.teacher_availability.length > 0) ? (
                        <div style={{ display: 'grid', gap: '4px' }}>
                          {t.teacher_availability.slice(0, 3).map((s, idx) => (
                            <div key={idx} style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{s.day_of_week}</span>
                              <span style={{ color: '#6b7280' }}>
                                {formatTime12(s.start_time)} - {formatTime12(s.end_time)}
                              </span>
                            </div>
                          ))}
                          {t.teacher_availability.length > 3 && <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center', marginTop: '4px' }}>+{t.teacher_availability.length - 3} more</div>}
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>No slots</span>
                      )}
                    </div>
                  </div>
                }
              />
            ))}
            {!filtered.length && <div className="card" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No teachers match filters.</div>}
            {filtered.length > 10 && <Pagination page={page} limit={10} total={filtered.length} onPageChange={setPage} />}
          </div>
        </>
      ) : null}

      {view === 'map' ? <article className="card mobile-map-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 12, paddingLeft: '12px', paddingRight: '12px' }}>
          <div>
            <p className="muted" style={{ margin: '0 0 8px 0', fontSize: 13 }}>Availability for <strong>{mapDateLabels[selectedMapDay]}</strong> (Green = Available, Orange = Demo, Red = Scheduled)</p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" className="secondary small" onClick={() => setWeekOffsetMap(prev => prev - 1)}>&lt; Prev Week</button>
              <button type="button" className={weekOffsetMap === 0 ? "primary small" : "secondary small"} onClick={() => setWeekOffsetMap(0)}>Current Week</button>
              <button type="button" className="secondary small" onClick={() => setWeekOffsetMap(prev => prev + 1)}>Next Week &gt;</button>
            </div>
          </div>
          <div className="day-tabs">
            {mapDateLabels.map((lbl, i) => <button key={lbl} type="button" className={`day-tab-btn ${selectedMapDay === i ? 'active' : ''}`} onClick={() => setSelectedMapDay(i)}>{lbl}</button>)}
          </div>
        </div>
        <div className="table-wrap" style={{ overflowX: 'auto', width: '100%' }}>
          <table className="avail-map-table" style={{ tableLayout: 'fixed', minWidth: '800px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '150px', position: 'sticky', left: 0, zIndex: 10, background: 'white' }}>Teacher</th>
                {hours.map(h => <th key={h} colSpan={4} className="avail-map-th" style={{ textAlign: 'center', borderLeft: '1px solid #e5e7eb', fontSize: '10px', padding: '4px 0' }}>{h === 24 ? 12 : (h > 12 ? h - 12 : h)}{h >= 12 && h < 24 ? 'p' : 'a'}</th>)}
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
              const slots = (t.teacher_availability || []).filter(s => s.day_of_week === fullDayLabels[selectedMapDay]);

              // Pre-filter demos and classes for the selected day to avoid repeated calculations
              const demosForDay = (t.booked_demos || []).filter(d => {
                if (!d.scheduled_at || !targetDateStr) return false;
                const dDate = new Date(d.scheduled_at);
                const dDateStr = `${dDate.getFullYear()}-${String(dDate.getMonth() + 1).padStart(2, '0')}-${String(dDate.getDate()).padStart(2, '0')}`;
                return dDateStr === targetDateStr;
              });

              const classesForDay = (t.assigned_classes || []).filter(a => {
                return a.session_date === targetDateStr;
              });

              return <tr key={t.id}>
                <td style={{ width: '150px', whiteSpace: 'nowrap', fontWeight: 600, fontSize: 13, textAlign: 'left', padding: '4px 8px', position: 'sticky', left: 0, background: 'white', zIndex: 9, borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t.users?.full_name}>
                  {t.users?.full_name || t.teacher_code}
                  <br /><span className="muted" style={{ fontWeight: 400, fontSize: 11, textTransform: 'capitalize' }}>{t.experience_level || 'N/A'}</span>
                </td>
                {hours.map(h => {
                  return [0, 15, 30, 45].map(m => {
                    const cellStart = h * 60 + m;
                    const cellEnd = cellStart + 15;

                    const isAvail = slots.some(s => {
                      const [sh, sm] = s.start_time.split(':').map(Number);
                      const [eh, em] = s.end_time.split(':').map(Number);
                      const startMins = sh * 60 + sm;
                      const endMins = eh * 60 + em;
                      return startMins <= cellStart && endMins > cellStart;
                    });

                    // Check if a demo is booked in this cell
                    const isDemo = demosForDay.some(d => {
                      const dDate = new Date(d.scheduled_at);
                      const dStartMins = dDate.getHours() * 60 + dDate.getMinutes();
                      const dEndMins = d.ends_at
                        ? (new Date(d.ends_at).getHours() * 60 + new Date(d.ends_at).getMinutes())
                        : dStartMins + 60;
                      return dStartMins <= cellStart && dEndMins > cellStart;
                    });

                    // Check if a regular class is scheduled
                    const isScheduled = classesForDay.some(a => {
                      if (!a.started_at) return false;
                      const dDate = new Date(a.started_at);
                      const startMins = dDate.getHours() * 60 + dDate.getMinutes();
                      const dur = a.duration_hours ? Number(a.duration_hours) * 60 : 60;
                      const endMins = startMins + dur;
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
        {filtered.length > 10 && <Pagination page={page} limit={10} total={filtered.length} onPageChange={setPage} />}
      </article> : null}

      {viewTeacher && <ViewTeacherModal teacher={viewTeacher} onClose={() => setViewTeacher(null)} />}
    </section>
  );
}

/* ═══════ AckTick: WhatsApp-style delivery/read ticks ═══════ */
function AckTick({ ack }) {
  if (ack === -1) return <span title="Error" style={{ color: '#e53935' }}>⚠</span>;
  if (ack === 0 || ack == null) return <span title="Pending" style={{ color: '#aaa', fontSize: 10 }}>🕐</span>;
  if (ack === 1) {
    // single grey tick (sent to server)
    return <span title="Sent" style={{ color: '#aaa', fontSize: 13, letterSpacing: '-2px' }}>✓</span>;
  }
  if (ack === 2) {
    // double grey tick (delivered to device)
    return <span title="Delivered" style={{ color: '#aaa', fontSize: 13, letterSpacing: '-2px' }}>✓✓</span>;
  }
  // ack >= 3: READ or PLAYED — double blue ticks
  return <span title="Read" style={{ color: '#34B7F1', fontSize: 13, letterSpacing: '-2px' }}>✓✓</span>;
}

/* ═══════ Automation Hub ═══════ */
export function AutomationPage() {
  const [tab, setTab] = useState('messages');
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [selContact, setSelContact] = useState(null); // { id, name, role, type }
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [error, setError] = useState('');

  // Campaigns State
  const [cMsg, setCMsg] = useState('');
  const [cRole, setCRole] = useState('all'); // 'all' | 'student' | 'teacher'
  const [cClass, setCClass] = useState('');
  const [cSearch, setCSearch] = useState('');
  const [recipients, setRecipients] = useState([]); // Array of IDs
  const [sending, setSending] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [campaignMedia, setCampaignMedia] = useState(null); // { file, previewUrl, mimetype }

  // Data Loading
  const [allStudents, setAllStudents] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);

  // WhatsApp States
  const [waSession, setWaSession] = useState(null);
  const [waLoading, setWaLoading] = useState(false);
  const [qrKey, setQrKey] = useState(Date.now());
  const [showQr, setShowQr] = useState(false);
  const chatBodyRef = useRef(null);
  const [msgOffset, setMsgOffset] = useState(0);
  const [hasMoreMsgs, setHasMoreMsgs] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pendingFile, setPendingFile] = useState(null); // { file, previewUrl, mimetype }

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Load students and teachers (don't block on waappa)
    Promise.all([
      apiFetch('/students'),
      apiFetch('/teachers/pool'),
    ]).then(([s, t]) => {
      setAllStudents(s.items || []);
      setAllTeachers(t.items || []);
    }).catch(e => setError(e.message));

    // Load waappa session separately so it never blocks the UI
    apiFetch('/waappa/sessions')
      .then(ws => { if (ws && ws.session) setWaSession(ws.session); })
      .catch(e => console.warn('[waappa] session load failed:', e.message));
  }, []);

  const fetchSession = async () => {
    try {
      const res = await apiFetch('/waappa/sessions');
      setWaSession(res.session || null);
    } catch (e) { console.error(e); }
    finally { setWaLoading(false); }
  };

  const handleWaAction = async (action) => {
    setWaLoading(true);
    try {
      if (action === 'create') {
        // Derive session name from logged-in coordinator's email
        const session = JSON.parse(localStorage.getItem('ehms_auth') || '{}');
        const email = session?.user?.email || 'coordinator';
        const sessionName = email.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 50);
        await apiFetch('/waappa/sessions', { method: 'POST', body: JSON.stringify({ sessionName }) });
      } else {
        const sessionName = waSession?.session_name || 'coordinator';
        await apiFetch(`/waappa/sessions/${sessionName}/${action}`, { method: 'POST', body: JSON.stringify({}) });
      }
      if (action === 'start') setQrKey(Date.now());
      await fetchSession(); // fetch immediately and unlocks loading
    } catch (e) {
      alert(e.message);
      setWaLoading(false);
    }
  };

  // Build contacts from students + teachers always
  useEffect(() => {
    // Only include students who have a WhatsApp group created
    const sList = allStudents
      .filter(s => s.group_jid)
      .map(s => ({
        ...s,
        id: s.group_jid.split('@')[0], // UI usually expects an ID string without domain or just pure numbers, but it's safe as string
        chatId: s.group_jid,
        name: s.group_name || `Edusolve - ${s.student_name}`,
        role: 'Student Group',
        type: 'student',
        phone: s.group_jid,
        avatar: (s.group_name || s.student_name || 'G').charAt(0).toUpperCase()
      }));

    // allTeachers are teacher_profiles rows with users join
    const tList = allTeachers
      .filter(t => t.phone) // teacher_profiles.phone column
      .map(t => {
        const cleanPhone = String(t.phone).replace(/\D/g, '');
        return {
          ...t,
          id: cleanPhone,
          chatId: `${cleanPhone}@c.us`,
          name: t.users?.full_name || t.teacher_code,
          role: 'Teacher',
          type: 'teacher',
          phone: cleanPhone,
          avatar: (t.users?.full_name || 'T').charAt(0).toUpperCase()
        };
      });

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
      let phone = contact.chatId || contact.phone || contact.id || '';
      if (phone && !phone.includes('@g.us')) {
        phone = phone.replace(/[^0-9]/g, '').slice(-10);
      }
      if (!phone) { setMessages([]); return; }
      const d = await apiFetch(`/waappa/messages?phone=${encodeURIComponent(phone)}&limit=15&offset=0`);
      if (d.ok) {
        setMessages(d.messages.map(m => ({
          id: m.id,
          content: m.body,
          direction: m.from_me ? 'outgoing' : 'incoming',
          created_at: m.timestamp * 1000,
          has_media: m.has_media,
          media_url: m.media_url,
          media_name: m.media_name,
          media_type: m.media_type,
          sender_role: m.sender_role,
          ack: m.ack,
          ack_name: m.ack_name
        })));
        setMsgOffset(15);
        setHasMoreMsgs(d.hasMore || false);
      } else {
        setMessages([]);
      }
    } catch (e) { console.error(e); setMessages([]); }
  }, []);

  const loadMoreMessages = async () => {
    if (!selContact || loadingMore || !hasMoreMsgs) return;
    setLoadingMore(true);
    try {
      let phone = selContact.chatId || selContact.phone || selContact.id || '';
      if (phone && !phone.includes('@g.us')) {
        phone = phone.replace(/[^0-9]/g, '').slice(-10);
      }
      const d = await apiFetch(`/waappa/messages?phone=${encodeURIComponent(phone)}&limit=15&offset=${msgOffset}`);
      if (d.ok) {
        const older = d.messages.map(m => ({
          id: m.id,
          content: m.body,
          direction: m.from_me ? 'outgoing' : 'incoming',
          created_at: m.timestamp * 1000,
          has_media: m.has_media,
          media_url: m.media_url,
          media_name: m.media_name,
          media_type: m.media_type,
          sender_role: m.sender_role,
          ack: m.ack,
          ack_name: m.ack_name
        }));
        // Preserve scroll position when prepending old messages
        const el = chatBodyRef.current;
        const prevScrollHeight = el ? el.scrollHeight : 0;
        setMessages(prev => [...older, ...prev]);
        setMsgOffset(prev => prev + 15);
        setHasMoreMsgs(d.hasMore || false);
        // Restore scroll position so viewport doesn't jump to top
        if (el) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight - prevScrollHeight; });
      }
    } catch (e) { console.error(e); } finally { setLoadingMore(false); }
  };

  useEffect(() => { loadChat(selContact); }, [selContact, loadChat]);

  async function sendChat(e) {
    e.preventDefault();
    if ((!msgText.trim() && !pendingFile) || !selContact || isSending) return;
    if (!waSession || waSession.status !== 'WORKING') {
      alert('WhatsApp session not connected.');
      return;
    }
    setIsSending(true);
    try {
      if (pendingFile) {
        // Convert to base64 → upload to R2 → send via Waappa
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(pendingFile.file);
        });
        const uploaded = await apiFetch('/waappa/messages/upload', {
          method: 'POST',
          body: JSON.stringify({ base64, filename: pendingFile.file.name, mimetype: pendingFile.mimetype })
        });
        if (!uploaded.ok) throw new Error('Upload failed');
        await apiFetch('/waappa/messages/send', {
          method: 'POST',
          body: JSON.stringify({
            chatId: selContact.chatId || `${selContact.phone}@c.us`,
            mediaUrl: uploaded.url,
            mediaName: pendingFile.file.name,
            mimetype: uploaded.mimetype,
            caption: msgText.trim(),
            sessionName: waSession.session_name
          })
        });
        setPendingFile(null);
        setMsgText('');
      } else {
        await apiFetch('/waappa/messages/send', {
          method: 'POST',
          body: JSON.stringify({
            chatId: selContact.chatId || `${selContact.phone}@c.us`,
            text: msgText,
            sessionName: waSession.session_name
          })
        });
        setMsgText('');
      }
      await loadChat(selContact);
    } catch (e) { setError(e.message); }
    finally { setIsSending(false); }
  }

  // Campaigns Filtering
  const filteredRecipients = useMemo(() => {
    let pool = contacts;

    if (cRole !== 'all') {
      pool = pool.filter(c => c.type === cRole);
    }

    if (cClass && (cRole === 'all' || cRole === 'student')) {
      pool = pool.filter(c => c.type !== 'student' || c.class_level === cClass);
    }

    if (cSearch) {
      const q = cSearch.toLowerCase();
      pool = pool.filter(c => c.name?.toLowerCase().includes(q) || c.phone?.includes(q));
    }

    return pool.map(c => ({
      ...c,
      desc: c.type === 'student' ? c.class_level : (c.subjects_taught?.join(', ') || '')
    }));
  }, [contacts, cRole, cClass, cSearch]);

  const toggleRecipient = (id) => setRecipients(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setRecipients(recipients.length === filteredRecipients.length && filteredRecipients.length > 0 ? [] : filteredRecipients.map(r => r.id));

  async function sendCampaign() {
    if (!cMsg.trim() || !recipients.length) return;

    const selectedContacts = filteredRecipients.filter(r => recipients.includes(r.id));
    setSending(true);
    setBulkStatus('');

    let uploadedMedia = null;
    if (campaignMedia) {
      try {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(campaignMedia.file);
        });
        const uploaded = await apiFetch('/waappa/messages/upload', {
          method: 'POST',
          body: JSON.stringify({ base64, filename: campaignMedia.file.name, mimetype: campaignMedia.mimetype })
        });
        if (uploaded.ok) uploadedMedia = { url: uploaded.url, mimetype: uploaded.mimetype };
      } catch (e) { console.error('Campaign media upload failed:', e.message); }
    }

    try {
      const result = await apiFetch('/waappa/campaigns/send', {
        method: 'POST',
        body: JSON.stringify({
          recipients: selectedContacts.map(r => ({ name: r.name, phone: r.phone, chatId: r.chatId, type: r.type })),
          message: cMsg,
          ...(uploadedMedia ? { mediaUrl: uploadedMedia.url, mimetype: uploadedMedia.mimetype } : {}),
          sentAt: new Date().toISOString()
        })
      });
      if (result.ok) {
        setBulkStatus(`✅ Sent to n8n for ${selectedContacts.length} recipients`);
        setCampaignHistory(prev => [{ id: Date.now(), sentAt: new Date().toLocaleString(), message: cMsg.slice(0, 80), count: selectedContacts.length, hasMedia: !!uploadedMedia }, ...prev]);
        setCMsg('');
        setCampaignMedia(null);
        setRecipients([]);
      } else {
        setBulkStatus(`⚠️ ${result.error || 'n8n webhook error'}`);
      }
    } catch (e) {
      setBulkStatus(`❌ ${e.message}`);
    }
    setSending(false);
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
        <div style={{ display: 'flex', height: 'calc(100vh - 200px)', minHeight: 500, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)' }}>
          {/* Sidebar */}
          <div style={{ width: 300, minWidth: 260, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface-alt, #f8f9fa)' }}>
            <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--border)' }}>
              <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 20, border: '1px solid var(--border)', fontSize: 13, background: 'var(--input-bg, #fff)', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredContacts.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13 }}>No contacts found</div>
              )}
              {filteredContacts.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelContact(c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer',
                    background: selContact?.id === c.id ? 'var(--primary-faint, #e8f5e9)' : 'transparent',
                    borderLeft: selContact?.id === c.id ? '3px solid #25D366' : '3px solid transparent',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: c.type === 'teacher' ? '#1565C0' : '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 17, flexShrink: 0 }}>
                    {c.avatar}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{c.role} &bull; {c.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#e5ddd5' }}>
            {selContact ? (
              <>
                {/* Header */}
                <div style={{ padding: '12px 16px', background: '#075E54', color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: selContact.type === 'teacher' ? '#1E88E5' : '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff', flexShrink: 0 }}>
                    {selContact.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{selContact.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{selContact.role} &bull; +{selContact.phone}</div>
                  </div>
                  <button type="button" onClick={() => loadChat(selContact)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, opacity: 0.85 }}>
                    ↻ Refresh
                  </button>
                </div>

                {/* Messages body */}
                <div ref={chatBodyRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {/* Load Earlier */}
                  {hasMoreMsgs && (
                    <div style={{ textAlign: 'center', marginBottom: 8 }}>
                      <button type="button" onClick={loadMoreMessages} disabled={loadingMore}
                        style={{ padding: '6px 16px', borderRadius: 16, border: '1px solid #ccc', background: '#fff', fontSize: 12, color: '#555', cursor: 'pointer' }}>
                        {loadingMore ? 'Loading...' : '⬆ Load Earlier Messages'}
                      </button>
                    </div>
                  )}
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', marginTop: 40, fontSize: 14 }}>No messages yet. Send the first one!</div>
                  ) : messages.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: m.direction === 'outgoing' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: '8px 12px', borderRadius: m.direction === 'outgoing' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        background: m.direction === 'outgoing' ? '#DCF8C6' : '#fff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.12)', fontSize: 14, lineHeight: 1.4
                      }}>
                        {m.has_media && m.media_url && (() => {
                          // Detect type from media_type or URL extension
                          const mt = m.media_type || (() => {
                            const ext = m.media_url.split('.').pop()?.split('?')[0]?.toLowerCase();
                            const extMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', mp4: 'video/mp4', mov: 'video/mp4', ogg: 'audio/ogg', opus: 'audio/opus', mp3: 'audio/mpeg', aac: 'audio/aac', pdf: 'application/pdf' };
                            return extMap[ext] || null;
                          })();
                          if (mt?.startsWith('video/')) return (
                            <div style={{ marginBottom: 4 }}>
                              <video controls style={{ maxWidth: 240, borderRadius: 8, display: 'block' }}>
                                <source src={m.media_url} type={mt} />
                              </video>
                            </div>
                          );
                          if (mt?.startsWith('audio/')) return (
                            <div style={{ marginBottom: 4 }}>
                              <audio controls style={{ maxWidth: 240 }}>
                                <source src={m.media_url} type={mt} />
                              </audio>
                            </div>
                          );
                          if (!mt || mt.startsWith('image/')) return (
                            <div style={{ marginBottom: 4 }}>
                              <img src={m.media_url} alt="Attachment" style={{ maxWidth: 220, borderRadius: 8, display: 'block' }}
                                onError={e => { e.target.style.display = 'none'; }} />
                            </div>
                          );
                          // Unknown type (PDF, doc, etc.) — show download link
                          return (
                            <div style={{ marginBottom: 4 }}>
                              <a href={m.media_url} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#f0f0f0', borderRadius: 8, fontSize: 13, color: '#1565C0', textDecoration: 'none' }}>
                                📄 {m.media_name || 'Download attachment'}
                              </a>
                            </div>
                          );
                        })()}
                        {m.has_media && !m.media_url && (
                          <div style={{ padding: '8px 4px', color: '#666', fontSize: 13 }}>📎 Media (loading...)</div>
                        )}
                        {m.content && <p style={{ margin: 0 }}>{m.content}</p>}
                        <div style={{ fontSize: 11, color: '#999', textAlign: 'right', marginTop: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                          {m.sender_role === 'teacher' && (
                            <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>👩‍🏫 Teacher</span>
                          )}
                          {new Date(m.created_at).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                          {m.direction === 'outgoing' && <AckTick ack={m.ack} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* File Preview Bar (shown when file is selected but not yet sent) */}
                {pendingFile && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#e3f2fd', borderTop: '1px solid #90caf9' }}>
                    {pendingFile.mimetype?.startsWith('image/') ? (
                      <img src={pendingFile.previewUrl} alt="Preview" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 52, height: 52, background: '#1565C0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>📄</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1565C0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pendingFile.file.name}</div>
                      <div style={{ fontSize: 11, color: '#555' }}>{(pendingFile.file.size / 1024).toFixed(1)} KB — type caption in the message box</div>
                    </div>
                    <button type="button" onClick={() => { setPendingFile(null); setMsgText(''); }}
                      style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: '#e53935', padding: 4, lineHeight: 1 }} title="Remove">✕</button>
                  </div>
                )}

                {/* Input bar */}
                <form onSubmit={sendChat} style={{ display: 'flex', gap: 8, padding: '10px 12px', background: '#f0f0f0', borderTop: '1px solid #ddd', alignItems: 'center' }}>
                  {/* Hidden file input */}
                  <input
                    id="wa-file-input"
                    type="file"
                    accept="image/*,video/*,audio/*,application/pdf"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setPendingFile({ file, previewUrl, mimetype: file.type });
                      }
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('wa-file-input').click()}
                    disabled={!waSession || waSession.status !== 'WORKING'}
                    style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: pendingFile ? '#1565C0' : '#e0e0e0', color: pendingFile ? '#fff' : '#333', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    title="Attach file"
                  >📎</button>
                  <input
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                    placeholder={pendingFile ? 'Add a caption (optional)...' : 'Type a message...'}
                    style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: 'none', outline: 'none', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
                    disabled={!waSession || waSession.status !== 'WORKING'}
                  />
                  <button
                    type="submit"
                    disabled={(!msgText.trim() && !pendingFile) || !waSession || waSession.status !== 'WORKING' || isSending}
                    style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: isSending ? '#a5d6a7' : '#25D366', color: '#fff', fontSize: 20, cursor: isSending ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
                  >
                    {isSending ? <span style={{ fontSize: 16, animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span> : '➤'}
                  </button>
                </form>
                {waSession?.status !== 'WORKING' && (
                  <div style={{ textAlign: 'center', padding: '4px 0 8px', fontSize: 12, color: '#e53935', background: '#f0f0f0' }}>
                    WhatsApp not connected — connect in the Account tab to send messages
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: 15 }}>
                👈 Select a contact to start chatting
              </div>
            )}
          </div>
        </div>
      ) : null}

      {tab === 'campaigns' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 260px', gap: 16, height: 580 }}>
            {/* ── LEFT: Recipient Panel ── */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Recipients</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {['all', 'student', 'teacher'].map(r => (
                    <button key={r} type="button" onClick={() => { setCRole(r); setRecipients([]); }}
                      style={{ flex: 1, padding: '5px 0', borderRadius: 20, border: 'none', fontSize: 12, cursor: 'pointer', fontWeight: 600, background: cRole === r ? '#1a73e8' : '#f0f0f0', color: cRole === r ? '#fff' : '#333' }}>
                      {r === 'all' ? 'All' : r === 'student' ? '👨‍🎓 Student' : '👩‍🏫 Teacher'}
                    </button>
                  ))}
                </div>
                {(cRole === 'student' || cRole === 'all') && (
                  <select value={cClass} onChange={e => setCClass(e.target.value)}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 12, marginBottom: 8 }}>
                    <option value="">All Classes</option>
                    {['10th', '11th', '12th'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
                <input value={cSearch} onChange={e => setCSearch(e.target.value)} placeholder="🔍 Search name or phone..."
                  style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 12, boxSizing: 'border-box' }} />
              </div>
              <div style={{ padding: '8px 14px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={recipients.length === filteredRecipients.length && filteredRecipients.length > 0} onChange={toggleAll} />
                  Select All ({filteredRecipients.length})
                </label>
                {recipients.length > 0 && <span style={{ fontSize: 12, color: '#1a73e8', fontWeight: 600 }}>{recipients.length} selected</span>}
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredRecipients.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13 }}>
                    No recipients match filters<br />
                    <span style={{ fontSize: 11, opacity: 0.6 }}>(Loaded: {allStudents.length} students, {allTeachers.length} teachers)</span>
                  </div>
                ) : filteredRecipients.map(r => (
                  <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer', borderBottom: '1px solid #fafafa', background: recipients.includes(r.id) ? '#e8f0fe' : 'transparent', transition: 'background 0.2s' }}>
                    <input type="checkbox" checked={recipients.includes(r.id)} onChange={() => toggleRecipient(r.id)} style={{ flexShrink: 0, width: 16, height: 16, cursor: 'pointer' }} />
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: r.type === 'teacher' ? '#f3e5f5' : '#e8f4fd', color: r.type === 'teacher' ? '#7b1fa2' : '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {r.avatar}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: '#5f6368', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.type === 'student' ? r.phone : `👩‍🏫 ${r.desc} • ${r.phone}`}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* ── CENTER: Compose Panel ── */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>✉️ Compose Message</div>
              </div>

              {/* Variable tokens */}
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['{name}', '{phone}'].map(token => (
                  <button key={token} type="button" onClick={() => setCMsg(m => m + token)}
                    style={{ padding: '3px 10px', borderRadius: 20, border: '1px solid #cce5ff', background: '#e8f4fd', fontSize: 11, cursor: 'pointer', color: '#1565C0', fontWeight: 600 }}>
                    + {token}
                  </button>
                ))}
                <span style={{ fontSize: 11, color: '#999', alignSelf: 'center' }}>— click to insert variable</span>
              </div>

              <textarea
                value={cMsg}
                onChange={e => setCMsg(e.target.value)}
                placeholder={`Hi {name}, this is a message from EduSolve...`}
                style={{ flex: 1, padding: 16, border: 'none', resize: 'none', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6, outline: 'none' }}
              />

              {/* Media Preview */}
              {campaignMedia && (
                <div style={{ margin: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#e3f2fd', borderRadius: 8 }}>
                  {campaignMedia.mimetype?.startsWith('image/') ? (
                    <img src={campaignMedia.previewUrl} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                  ) : <span style={{ fontSize: 28 }}>📄</span>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1565C0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{campaignMedia.file.name}</div>
                    <div style={{ fontSize: 11, color: '#555' }}>{(campaignMedia.file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button type="button" onClick={() => setCampaignMedia(null)}
                    style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: '#e53935' }}>✕</button>
                </div>
              )}

              <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <input id="campaign-file" type="file" accept="image/*,video/*,audio/*,application/pdf" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files[0]; if (f) setCampaignMedia({ file: f, previewUrl: URL.createObjectURL(f), mimetype: f.type }); e.target.value = ''; }} />
                <button type="button" onClick={() => document.getElementById('campaign-file').click()}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: campaignMedia ? '#1565C0' : '#f0f0f0', color: campaignMedia ? '#fff' : '#333', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Attach media">📎</button>
                <span style={{ fontSize: 12, color: '#999', flex: 1 }}>{cMsg.length} chars</span>
                <button type="button" onClick={sendCampaign}
                  disabled={sending || !recipients.length || !cMsg.trim()}
                  style={{ padding: '9px 24px', borderRadius: 24, border: 'none', background: (!recipients.length || !cMsg.trim() || sending) ? '#ccc' : 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: sending ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
                  {sending ? <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span> : `🚀 Send to ${recipients.length} recipients`}
                </button>
              </div>
            </div>

            {/* ── RIGHT: History ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bulkStatus ? (
                <div style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8, background: bulkStatus.includes('✅') ? '#e8f5e9' : bulkStatus.includes('❌') ? '#fdecea' : '#fff8e1' }}>{bulkStatus}</div>
              ) : null}

              {/* History */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', padding: 14, flex: 1, overflowY: 'auto' }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>🕐 History</div>
                {campaignHistory.length === 0 ? (
                  <div style={{ color: '#bbb', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No campaigns this session</div>
                ) : campaignHistory.map(h => (
                  <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 2 }}>📢 {h.count} recipients {h.hasMedia ? '· 📎' : ''}</div>
                    <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>{h.message}{h.message.length >= 80 ? '...' : ''}</div>
                    <div style={{ fontSize: 10, color: '#aaa' }}>{h.sentAt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {tab === 'account' ? <div className="grid-two">
        <article className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>WhatsApp Connection</h3>
            {waLoading && <span className="muted" style={{ fontSize: 13 }}>Loading...</span>}
          </div>

          <div className="detail-grid">
            <div>
              <span className="eyebrow">Status</span>
              <p>
                {waSession ? (
                  <span className={`status-tag ${waSession.status === 'WORKING' ? 'success' : waSession.status === 'FAILED' ? 'error' : 'warning'}`}>
                    {waSession.status}
                  </span>
                ) : <span className="status-tag error">Not Configured</span>}
              </p>
            </div>
            {waSession && (
              <div><span className="eyebrow">Session</span><p>{waSession.display_name || waSession.session_name}</p></div>
            )}

            {waSession && waSession.status === 'WORKING' && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
                {waSession.profile_pic_url ? (
                  <img
                    src={waSession.profile_pic_url}
                    alt="Profile"
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #25D366' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22 }}>
                    {(waSession.push_name || '?')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{waSession.push_name || 'Unknown'}</div>
                  <div className="muted" style={{ fontSize: 13 }}>+{waSession.connected_phone}</div>
                </div>
              </div>
            )}

            {/* QR panel - shown when showQr=true and not yet WORKING */}
            {waSession && showQr && waSession.status !== 'WORKING' && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', margin: '16px 0' }}>
                <p className="muted" style={{ marginBottom: 12 }}>Scan this QR code with your WhatsApp app to link.</p>
                <img
                  src={`http://localhost:4000/waappa/sessions/${waSession.session_name}/qr?t=${qrKey}`}
                  alt="WhatsApp QR Code"
                  style={{ width: 250, height: 250, border: '1px solid #ddd', borderRadius: 8, display: 'block', margin: '0 auto' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
            {!waSession ? (
              <button type="button" className="primary" onClick={() => handleWaAction('create')} disabled={waLoading}>Create Session</button>
            ) : (
              <>
                {/* Get QR / Refresh QR — only when not WORKING */}
                {waSession.status !== 'WORKING' && (
                  <button type="button" className="primary"
                    onClick={() => { setShowQr(true); setQrKey(Date.now()); }}
                    disabled={waLoading}>
                    {showQr ? 'Refresh QR' : 'Get QR'}
                  </button>
                )}
                {waSession.status === 'STOPPED' || waSession.status === 'FAILED' ? (
                  <button type="button" className="secondary" onClick={() => handleWaAction('start')} disabled={waLoading}>Start Session</button>
                ) : (
                  <button type="button" className="secondary" onClick={() => handleWaAction('stop')} disabled={waLoading}>Stop Session</button>
                )}
                <button type="button" className="secondary error" onClick={() => { handleWaAction('delete'); setShowQr(false); }} disabled={waLoading}>Delete Session</button>
                <button type="button" className="secondary" onClick={fetchSession} disabled={waLoading}>Refresh Status</button>
              </>
            )}
          </div>
        </article>
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
export function ViewTeacherModal({ teacher, onClose }) {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  const [isActive, setIsActive] = useState(!!teacher.is_in_pool);

  const toggleStatus = async () => {
    const nextStatus = !isActive;
    setIsActive(nextStatus);
    try {
      await apiFetch(`/teachers/${teacher.id}/pool-status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_in_pool: nextStatus })
      });
    } catch (e) {
      setIsActive(!nextStatus);
      alert('Failed to change status: ' + e.message);
    }
  };

  const lead = {
    ...teacher,
    full_name: teacher.users?.full_name || 'Unknown',
    email: teacher.users?.email,
    status: 'approved'
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
    return <EditTeacherModal teacher={teacher} onClose={() => setIsEditing(false)} onSave={() => { setIsEditing(false); onClose(); window.location.reload(); }} />;
  }

  return (
    <div className="modal-overlay">
      <div className="modal card" style={{ maxWidth: '800px', width: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>
        <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>{lead.full_name}</h3>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', background: isActive ? '#10b98115' : '#f3f4f6', padding: '4px 12px', borderRadius: '16px', border: isActive ? '1px solid #10b98150' : '1px solid #d1d5db' }}>
              <input type="checkbox" checked={isActive} onChange={toggleStatus} style={{ width: 16, height: 16, accentColor: '#10b981', cursor: 'pointer', margin: 0 }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: isActive ? '#10b981' : '#6b7280' }}>
                {isActive ? 'Active Teacher' : 'Inactive Teacher'}
              </span>
            </label>
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
