import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

function TeacherPoolTable({ items, onOpenProfile }) {
  return (
    <div className="table-wrap mobile-friendly-table">
      <table>
        <thead>
          <tr>
            <th>Teacher ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Experience</th>
            <th>Rate</th>
            <th>Profile</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td data-label="Teacher ID">{item.teacher_code || '-'}</td>
              <td data-label="Name">{item.users?.full_name || '-'}</td>
              <td data-label="Email">{item.users?.email || '-'}</td>
              <td data-label="Experience">{item.experience_level || '-'}</td>
              <td data-label="Rate">{item.per_hour_rate || '-'}</td>
              <td data-label="Profile">
                <button type="button" className="secondary" onClick={() => onOpenProfile(item.id)}>Open</button>
              </td>
            </tr>
          ))}
          {!items.length ? (
            <tr>
              <td colSpan="6">No teachers in pool yet.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function SessionTable({ items, title }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <div className="table-wrap mobile-friendly-table">
        <table>
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Student</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td data-label="Date/Time">
                  {s.session_date || '-'}
                  {s.started_at ? ` ${new Date(s.started_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}` : ''}
                </td>
                <td data-label="Student">{s.students?.student_name || s.student_id}</td>
                <td data-label="Status">{s.status}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan="3">No session records.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function TodaySessionCards({ items }) {
  return (
    <div className="session-card-grid">
      {items.map((item) => (
        <article className="card session-card" key={item.id}>
          <div className="session-head">
            <strong>{item.students?.student_name || item.student_id}</strong>
            <span>{item.status}</span>
          </div>
          <p><strong>Time:</strong> {item.started_at ? new Date(item.started_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : '-'}</p>
          <p><strong>Teacher:</strong> {item.users?.full_name || item.teacher_id}</p>
          <p><strong>Subject:</strong> {item.subject || 'General'}</p>
        </article>
      ))}
      {!items.length ? <p>No sessions scheduled for today.</p> : null}
    </div>
  );
}

function InterviewAction({ onDone }) {
  const [userId, setUserId] = useState('');
  const [experience, setExperience] = useState('fresher');
  const [rate, setRate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = await apiFetch('/teachers/recruitment/success', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          experience_level: experience,
          per_hour_rate: rate ? Number(rate) : null
        })
      });
      setMessage(`Teacher added to pool as ${data.teacher.teacher_code}`);
      setUserId('');
      setRate('');
      await onDone();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card form-grid" onSubmit={onSubmit}>
      <h3>Interview Success to Pool</h3>
      <label>
        Teacher User ID
        <input value={userId} onChange={(e) => setUserId(e.target.value)} required placeholder="Supabase auth user id" />
      </label>
      <label>
        Experience
        <select value={experience} onChange={(e) => setExperience(e.target.value)}>
          <option value="fresher">Fresher</option>
          <option value="experienced">Experienced</option>
        </select>
      </label>
      <label>
        Per Hour Rate
        <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Optional" />
      </label>
      <button type="submit">Add to Teacher Pool</button>
      {message ? <p>{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}

export function TeachersHubPage({ role, onOpenProfile }) {
  const tabs = useMemo(() => {
    if (role === 'teacher_coordinator') {
      return [
        { id: 'pool', label: 'Teacher Pool' },
        { id: 'interviews', label: 'Interview Pipeline' }
      ];
    }

    if (role === 'teacher') {
      return [
        { id: 'today', label: 'Today Sessions' },
        { id: 'history', label: 'Session History' }
      ];
    }

    if (role === 'counselor') {
      return [{ id: 'pool', label: 'Teacher Pool' }];
    }

    return [{ id: 'pool', label: 'Teacher Pool' }];
  }, [role]);

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [pool, setPool] = useState([]);
  const [today, setToday] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  async function loadData() {
    setError('');
    try {
      if (tabs.some((t) => t.id === 'pool')) {
        const poolData = await apiFetch('/teachers/pool');
        setPool(poolData.items || []);
      }
      if (tabs.some((t) => t.id === 'today')) {
        const todayData = await apiFetch('/students/sessions/today');
        setToday(todayData.items || []);
      }
      if (tabs.some((t) => t.id === 'history')) {
        const historyData = await apiFetch('/students/sessions/history');
        setHistory(historyData.items || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [role]);

  useEffect(() => {
    setActiveTab(tabs[0].id);
  }, [tabs]);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <div className="tabs-row">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeTab === tab.id ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'pool' ? <article className="card"><TeacherPoolTable items={pool} onOpenProfile={onOpenProfile} /></article> : null}
      {activeTab === 'interviews' ? <InterviewAction onDone={loadData} /> : null}
      {activeTab === 'today' ? <TodaySessionCards items={today} /> : null}
      {activeTab === 'history' ? <SessionTable items={history} title="Session History" /> : null}
    </section>
  );
}

export function TeacherProfilePage({ teacherProfileId }) {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teacherProfileId) return;
    apiFetch(`/teachers/${teacherProfileId}`)
      .then((data) => setTeacher(data.teacher))
      .catch((err) => setError(err.message));
  }, [teacherProfileId]);

  if (!teacherProfileId) {
    return (
      <section className="panel">
        <p className="muted">Select a teacher from Teacher Pool to open profile.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card">
        <p><strong>Teacher ID:</strong> {teacher?.teacher_code || '-'}</p>
        <p><strong>Name:</strong> {teacher?.users?.full_name || '-'}</p>
        <p><strong>Email:</strong> {teacher?.users?.email || '-'}</p>
        <p><strong>Experience:</strong> {teacher?.experience_level || '-'}</p>
        <p><strong>Rate:</strong> {teacher?.per_hour_rate || '-'}</p>
      </article>
      <article className="card">
        <h3>Availability Slots</h3>
        <div className="table-wrap mobile-friendly-table">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {(teacher?.teacher_availability || []).map((slot, idx) => (
                <tr key={`${slot.day_of_week}-${idx}`}>
                  <td data-label="Day">{slot.day_of_week}</td>
                  <td data-label="From">{slot.start_time}</td>
                  <td data-label="To">{slot.end_time}</td>
                </tr>
              ))}
              {!(teacher?.teacher_availability || []).length ? (
                <tr>
                  <td colSpan="3">No slots added.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
