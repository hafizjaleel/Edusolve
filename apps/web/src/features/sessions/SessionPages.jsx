import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { getSessionDisplayStatus } from '../teachers/TeacherDashboardPages.jsx';

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

  useEffect(() => {
    apiFetch('/sessions/logs')
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card">
        <div className="table-wrap mobile-friendly-table">
          <table>
            <thead>
              <tr><th>Date</th><th>Student</th><th>Teacher</th><th>Status</th></tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const st = getSessionDisplayStatus(item);
                return (
                  <tr key={item.id}>
                    <td data-label="Date">{item.session_date || '-'}</td>
                    <td data-label="Student">{item.students?.student_name || item.student_id}</td>
                    <td data-label="Teacher">{item.users?.full_name || item.teacher_id}</td>
                    <td data-label="Status">
                      <span style={{
                        padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                        background: st.bg, color: st.color, textTransform: 'capitalize'
                      }}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
              {!items.length ? (
                <tr><td colSpan="4">No records found.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
