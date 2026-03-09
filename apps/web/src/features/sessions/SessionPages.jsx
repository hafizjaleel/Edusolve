import { useEffect, useState, useMemo, useCallback } from 'react';
import { apiFetch } from '../../lib/api.js';
import { getSessionDisplayStatus } from '../teachers/TeacherDashboardPages.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { SearchSelect } from '../../components/ui/SearchSelect.jsx';

function ApprovalTable({ items, onVerify }) {
  return (
    <div className="table-wrap mobile-friendly-table">
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Student</th><th>Teacher</th><th>Subject</th><th>Duration</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td data-label="Date">{item.session_date || '-'}</td>
              <td data-label="Student">{item.students?.student_name || item.student_id}</td>
              <td data-label="Teacher">{item.users?.full_name || item.teacher_id}</td>
              <td data-label="Subject">{item.subject || '—'}</td>
              <td data-label="Duration">{item.duration_hours ? `${item.duration_hours}h` : '—'}</td>
              <td className="actions" data-label="Actions">
                <button type="button" onClick={() => onVerify(item.id, true, 'approval')}>✅ Approve</button>
                <button type="button" className="danger" onClick={() => onVerify(item.id, false, 'approval')}>❌ Reject</button>
              </td>
            </tr>
          ))}
          {!items.length ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>No pending session approvals.</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function RescheduleTable({ items, onVerify }) {
  return (
    <div className="table-wrap mobile-friendly-table">
      <table>
        <thead>
          <tr>
            <th>Current Date</th><th>Student</th><th>Teacher</th><th>Reason</th><th>New Date</th><th>New Time</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const session = item.academic_sessions || {};
            return (
              <tr key={item.id}>
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
                <td className="actions" data-label="Actions">
                  <button type="button" onClick={() => onVerify(session.id, true, 'reschedule')}>✅ Approve</button>
                  <button type="button" className="danger" onClick={() => onVerify(session.id, false, 'reschedule')}>❌ Reject</button>
                </td>
              </tr>
            );
          })}
          {!items.length ? (
            <tr><td colSpan="7" style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>No pending reschedule requests.</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export function VerificationQueuePage() {
  const [approvalItems, setApprovalItems] = useState([]);
  const [rescheduleItems, setRescheduleItems] = useState([]);
  const [activeTab, setActiveTab] = useState('approvals');
  const [error, setError] = useState('');

  async function loadAll() {
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
  }

  async function verify(sessionId, approved, type) {
    setError('');
    try {
      await apiFetch(`/sessions/${sessionId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ approved, type })
      });
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const tabs = [
    { key: 'approvals', label: `Session Approvals (${approvalItems.length})` },
    { key: 'reschedules', label: `Reschedule Requests (${rescheduleItems.length})` }
  ];

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}

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
        {activeTab === 'approvals' ? (
          <ApprovalTable items={approvalItems} onVerify={verify} />
        ) : (
          <RescheduleTable items={rescheduleItems} onVerify={verify} />
        )}
      </article>
    </section>
  );
}

export function SessionLogsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const [fTeacher, setFTeacher] = useState('');
  const [fStudent, setFStudent] = useState('');
  const [fStart, setFStart] = useState('');
  const [fEnd, setFEnd] = useState('');
  const [fSubject, setFSubject] = useState('');

  const [allTeachers, setAllTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  const loadMasterData = useCallback(async () => {
    try {
      const [tRes, sRes, subRes] = await Promise.all([
        apiFetch('/teachers/pool'),
        apiFetch('/students'),
        apiFetch('/subjects')
      ]);
      setAllTeachers(tRes.items || []);
      setAllStudents(sRes.items || []);
      setSubjectsList(subRes.subjects || []);
    } catch (e) { console.error('Error loading master data', e); }
  }, []);

  useEffect(() => { loadMasterData(); }, [loadMasterData]);

  useEffect(() => {
    apiFetch('/sessions/logs')
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message));
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(s => {
      if (fTeacher && s.teacher_id !== fTeacher) return false;
      if (fStudent && s.student_id !== fStudent) return false;
      if (fSubject && s.subject !== fSubject) return false;
      if (fStart && (!s.session_date || s.session_date < fStart)) return false;
      if (fEnd && (!s.session_date || s.session_date > fEnd)) return false;
      return true;
    });
  }, [items, fTeacher, fStudent, fSubject, fStart, fEnd]);

  const allTeacherOpts = useMemo(() => allTeachers.map(t => ({ value: t.user_id, label: t.users?.full_name || t.user_id })), [allTeachers]);
  const allStudentOpts = useMemo(() => allStudents.map(s => ({ value: s.id, label: s.student_name || s.id })), [allStudents]);
  const allSubjectOpts = useMemo(() => subjectsList.map(s => ({ value: s.name, label: s.name })), [subjectsList]);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card">
        <div className="filter-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', alignItems: 'end', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>Start Date</label>
            <input type="date" value={fStart} onChange={e => setFStart(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>End Date</label>
            <input type="date" value={fEnd} onChange={e => setFEnd(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <SearchSelect label="Teacher" value={fTeacher} onChange={setFTeacher} options={allTeacherOpts} placeholder="All Teachers" />
          <SearchSelect label="Student" value={fStudent} onChange={setFStudent} options={allStudentOpts} placeholder="All Students" />
          <SearchSelect label="Subject" value={fSubject} onChange={setFSubject} options={allSubjectOpts} placeholder="All Subjects" />
        </div>
        <div className="table-wrap mobile-friendly-table">
          <table>
            <thead>
              <tr><th>Date</th><th>Student</th><th>Teacher</th><th>Subject</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filteredItems.slice((page - 1) * 10, page * 10).map((item) => {
                const st = getSessionDisplayStatus(item);
                return (
                  <tr key={item.id}>
                    <td data-label="Date">{item.session_date || '-'}</td>
                    <td data-label="Student">{item.students?.student_name || item.student_id}</td>
                    <td data-label="Teacher">{item.users?.full_name || item.teacher_id}</td>
                    <td data-label="Subject">{item.subject || '—'}</td>
                    <td data-label="Status">
                      <span style={{
                        padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                        background: st.bg, color: st.color, textTransform: 'capitalize'
                      }}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
              {!filteredItems.length ? (
                <tr><td colSpan="5">No records found.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
        {filteredItems.length > 10 && (
          <Pagination page={page} limit={10} total={filteredItems.length} onPageChange={setPage} />
        )}
      </article>
    </section>
  );
}
