import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

function SessionTable({ items, showActions = false, onVerify }) {
  return (
    <div className="table-wrap mobile-friendly-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Teacher</th>
            <th>Status</th>
            {showActions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td data-label="Date">{item.session_date || '-'}</td>
              <td data-label="Student">{item.students?.student_name || item.student_id}</td>
              <td data-label="Teacher">{item.users?.full_name || item.teacher_id}</td>
              <td data-label="Status">{item.verification_status || item.status || 'pending'}</td>
              {showActions ? (
                <td className="actions" data-label="Actions">
                  <button type="button" onClick={() => onVerify(item.id, true)}>Verify</button>
                  <button type="button" className="danger" onClick={() => onVerify(item.id, false)}>Reject</button>
                </td>
              ) : null}
            </tr>
          ))}
          {!items.length ? (
            <tr>
              <td colSpan={showActions ? 5 : 4}>No records found.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export function VerificationQueuePage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      const data = await apiFetch('/sessions/verification-queue');
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function verify(sessionId, approved) {
    setError('');
    try {
      await apiFetch(`/sessions/${sessionId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ approved })
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="panel">
      {error ? <p className="error">{error}</p> : null}
      <article className="card">
        <SessionTable items={items} showActions onVerify={verify} />
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
        <SessionTable items={items} />
      </article>
    </section>
  );
}
