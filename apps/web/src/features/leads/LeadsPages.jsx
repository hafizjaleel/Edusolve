import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { getSession } from '../../lib/auth.js';
import { AddLeadModal } from './components/AddLeadModal.jsx';

import { LeadFilters } from './components/LeadFilters.jsx';
import { SearchSelect } from '../../components/ui/SearchSelect.jsx';
import { CreatableSelect } from '../../components/ui/CreatableSelect.jsx';

const CORE_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'Computer Science', 'History', 'Geography', 'Economics',
  'Accountancy', 'Business Studies', 'Hindi', 'French', 'German',
  'Spanish', 'Psychology', 'Sociology', 'Political Science'
].map(s => ({ value: s, label: s }));

/* ─── Inline SVG Icons ─── */
const Icon = ({ d, color = 'currentColor', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

const ICONS = {
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  x: 'M18 6L6 18M6 6l12 12',
  fileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  messageCircle: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
  chevronDown: 'M6 9l6 6 6-6',
  chevronUp: 'M18 15l-6-6-6 6'
};
const STATUS_STEPS = ['new', 'contacted', 'demo_scheduled', 'demo_done', 'payment_pending', 'payment_verification', 'joined'];

const STATUS_COLORS = {
  new: '#6366f1',
  contacted: '#8b5cf6',
  demo_scheduled: '#f59e0b',
  demo_done: '#3b82f6',
  payment_pending: '#ec4899',
  payment_verification: '#f97316',
  joined: '#10b981',
  dropped: '#6b7280'
};

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  demo_scheduled: 'Demo Scheduled',
  demo_done: 'Demo Done',
  payment_pending: 'Payment Pending',
  payment_verification: 'Payment Verification',
  joined: 'Joined',
  dropped: 'Dropped'
};

/* ─── Progress Tracker ─── */
function ProgressTracker({ currentStatus }) {
  const isDropped = currentStatus === 'dropped';
  const currentIdx = isDropped ? 5 : STATUS_STEPS.indexOf(currentStatus);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '8px 0 4px', overflow: 'hidden' }}>
      {STATUS_STEPS.map((step, idx) => {
        const isDone = !isDropped && idx < currentIdx;
        const isCurrent = !isDropped && idx === currentIdx;
        const color = isDropped ? '#6b7280' : isDone ? STATUS_COLORS[step] : isCurrent ? STATUS_COLORS[step] : '#d1d5db';

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: idx < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
            <div title={STATUS_LABELS[step]} style={{
              width: isCurrent ? 22 : 16,
              height: isCurrent ? 22 : 16,
              borderRadius: '50%',
              background: isDone || isCurrent ? color : 'transparent',
              border: `2px solid ${color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontWeight: 700,
              color: isDone || isCurrent ? '#fff' : color,
              flexShrink: 0,
              transition: 'all 0.2s ease',
              boxShadow: isCurrent ? `0 0 0 3px ${color}30` : 'none',
            }}>
              {idx + 1}
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div style={{
                flex: 1,
                height: '2px',
                background: isDone ? color : '#e5e7eb',
                minWidth: '6px',
                transition: 'background 0.2s ease',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function useLeads(scope) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`/leads?scope=${scope}`);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [scope]);

  return { items, loading, error, refresh };
}

function LeadsTable({ items, onSelect, onDelete, showDelete = true, selectedIds = [], onToggleSelect, showContact = false }) {
  const allSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  function toggleAll() {
    if (allSelected) {
      onToggleSelect([]);
    } else {
      onToggleSelect(items.map((i) => i.id));
    }
  }

  return (
    <div className="card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {onToggleSelect ? (
                <th style={{ width: '40px' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
              ) : null}
              <th>Name</th>
              <th>Contact</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((lead) => (
              <tr key={lead.id} className={selectedIds.includes(lead.id) ? 'selected-row' : ''}>
                {onToggleSelect ? (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(lead.id)}
                      onChange={() => {
                        if (selectedIds.includes(lead.id)) {
                          onToggleSelect(selectedIds.filter((id) => id !== lead.id));
                        } else {
                          onToggleSelect([...selectedIds, lead.id]);
                        }
                      }}
                    />
                  </td>
                ) : null}
                <td>{lead.student_name}</td>
                <td>{showContact ? (lead.contact_number || '-') : null}</td>
                <td>{lead.class_level || '-'}</td>
                <td>{lead.subject || '-'}</td>
                <td>{lead.lead_type || '-'}</td>
                <td>{lead.status}</td>
                <td className="actions">
                  <button type="button" className="secondary" onClick={() => onSelect(lead.id)}>View</button>
                  {showDelete ? (
                    <button type="button" className="danger" onClick={() => onDelete(lead.id)}>Delete</button>
                  ) : null}
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={onToggleSelect ? 8 : 7}>No leads found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    new: 'blue',
    contacted: 'purple',
    demo_scheduled: 'orange',
    demo_done: 'purple',
    payment_pending: 'pink',
    payment_verification: 'cyan',
    joined: 'green',
    dropped: 'red'
  };
  return <span className={`status-badge ${colors[status] || 'neutral'}`}>{status?.replace('_', ' ') || 'unknown'}</span>;
}

export function AllLeadsPage({ onOpenDetails, onViewInPipeline, selectedLeadId }) {
  const session = getSession();
  const user = session?.user;
  const { items, loading, error, refresh } = useLeads('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', counselorId: '' });
  const [assignCounselorId, setAssignCounselorId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [leadTab, setLeadTab] = useState(user?.role === 'counselor' ? 'all' : 'new'); // 'new', 'assigned', 'all'

  useEffect(() => {
    apiFetch('/counselors').then(data => setCounselors(data.items || [])).catch(() => { });
  }, []);

  const counselorMap = useMemo(() => {
    const map = {};
    counselors.forEach(c => map[c.id] = c.full_name || c.email);
    return map;
  }, [counselors]);

  // Tab-based filtering: "new" = no counselor_id OR counselor_id not in counselor list
  const tabbedItems = useMemo(() => {
    if (leadTab === 'new') return items.filter(i => !i.counselor_id || !counselorMap[i.counselor_id]);
    if (leadTab === 'assigned') return items.filter(i => i.counselor_id && counselorMap[i.counselor_id]);
    return items;
  }, [items, leadTab, counselorMap]);

  const newCount = useMemo(() => items.filter(i => !i.counselor_id || !counselorMap[i.counselor_id]).length, [items, counselorMap]);
  const assignedCount = useMemo(() => items.filter(i => i.counselor_id && counselorMap[i.counselor_id]).length, [items, counselorMap]);

  // Client-side filtering
  const filteredItems = useMemo(() => {
    return tabbedItems.filter(item => {
      const matchSearch = !filters.search ||
        item.student_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.contact_number?.includes(filters.search);
      const matchStatus = !filters.status || item.status === filters.status;
      const matchCounselor = !filters.counselorId || item.counselor_id === filters.counselorId;
      return matchSearch && matchStatus && matchCounselor;
    });
  }, [tabbedItems, filters]);

  async function onDelete(id) {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await apiFetch(`/leads/${id}`, { method: 'DELETE', body: JSON.stringify({ reason: 'deleted by counselor head' }) });
      await refresh();
    } catch { }
  }

  async function onBulkAssign(e) {
    e.preventDefault();
    if (!assignCounselorId || !selectedIds.length) return;
    setAssigning(true);
    try {
      await apiFetch('/leads/assign', {
        method: 'POST',
        body: JSON.stringify({ lead_ids: selectedIds, counselor_id: assignCounselorId })
      });
      setSelectedIds([]);
      setAssignCounselorId('');
      refresh();
      alert('Leads assigned successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      setAssigning(false);
    }
  }


  return (
    <section className="panel">
      {/* New / Assigned / All Tabs */}
      {user?.role !== 'counselor' ? (
        <div className="tabs" style={{ marginBottom: '16px' }}>
          {[
            { id: 'new', label: 'New', count: newCount },
            { id: 'assigned', label: 'Assigned', count: assignedCount }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${leadTab === tab.id ? 'active' : ''}`}
              onClick={() => { setLeadTab(tab.id); setSelectedIds([]); }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      ) : null}

      <LeadFilters onFilterChange={setFilters} counselors={counselors}>
        <button onClick={() => setShowAddModal(true)} className="primary" style={{ whiteSpace: 'nowrap' }}>+ Add Lead</button>
      </LeadFilters>

      {loading ? <p>Loading leads...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filteredItems.map(i => i.id));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th>Name</th>
                <th>Phone</th>
                <th>Class</th>
                <th>Type</th>
                <th>Status</th>
                {user?.role !== 'counselor' ? (
                  <th>Assigned To</th>
                ) : null}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((lead) => (
                <tr key={lead.id} className={selectedIds.includes(lead.id) ? 'selected-row' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(lead.id)}
                      onChange={() => {
                        if (selectedIds.includes(lead.id)) setSelectedIds(selectedIds.filter(id => id !== lead.id));
                        else setSelectedIds([...selectedIds, lead.id]);
                      }}
                    />
                  </td>
                  <td>
                    <div
                      style={{ fontWeight: 500, cursor: 'pointer', color: '#2563eb' }}
                      onClick={() => onOpenDetails(lead.id)}
                    >
                      {lead.student_name}
                    </div>
                  </td>
                  <td>{lead.contact_number || '-'}</td>
                  <td>{lead.class_level || '-'}</td>
                  <td>{lead.lead_type || '-'}</td>
                  <td><StatusBadge status={lead.status} /></td>
                  {user?.role !== 'counselor' ? (
                    <td>{counselorMap[lead.counselor_id] || <span className="text-dim">Unassigned</span>}</td>
                  ) : null}
                  <td className="actions" style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap' }}>
                    {user?.role === 'counselor' && onViewInPipeline && (
                      <button
                        type="button"
                        className="secondary small"
                        title="View in Pipeline"
                        onClick={() => onViewInPipeline(lead.id, lead.status)}
                        style={{ fontSize: '11px', padding: '3px 7px' }}
                      >
                        📋
                      </button>
                    )}
                    <button type="button" className="secondary small" onClick={() => onOpenDetails(lead.id)}>View</button>
                  </td>
                </tr>
              ))}
              {!filteredItems.length ? (
                <tr><td colSpan="8">No matching leads found.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIds.length > 0 ? (
        <div className="floating-actions" style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#1f2937', color: 'white', padding: '12px 24px', borderRadius: '50px',
          display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 100
        }}>
          <span>{selectedIds.length} selected</span>
          <div style={{ height: '20px', width: '1px', background: '#4b5563' }} />

          <form onSubmit={onBulkAssign} style={{ display: 'flex', gap: '8px' }}>
            <select
              value={assignCounselorId}
              onChange={e => setAssignCounselorId(e.target.value)}
              required
              style={{ background: '#374151', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
            >
              <option value="">Assign to...</option>
              {counselors.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
            <button type="submit" disabled={assigning} className="primary small" style={{ padding: '4px 12px' }}>
              {assigning ? '...' : 'Assign'}
            </button>
          </form>

          <button className="text-danger" type="button" onClick={() => setSelectedIds([])} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>Cancel</button>
        </div>
      ) : null}

      {showAddModal ? (
        <AddLeadModal onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); refresh(); }} />
      ) : null}

    </section>
  );
}

/* ─── Schedule Demo Modal ─── */
function ScheduleDemoModal({ lead, onClose, onSuccess }) {
  const initialDate = lead.demo_scheduled_at ? lead.demo_scheduled_at.split('T')[0] : '';
  const initialStart = lead.demo_scheduled_at ? new Date(lead.demo_scheduled_at).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '';
  const initialEnd = lead.demo_ends_at ? new Date(lead.demo_ends_at).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '';

  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(initialEnd);
  const [subject, setSubject] = useState(lead.subject || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  const [saving, setSaving] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [conflictSlots, setConflictSlots] = useState([]); // list of {start, end, studentName}
  const [checkingConflict, setCheckingConflict] = useState(false);

  // Generate 15-min time slots 06:00–22:00
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 6; h <= 22; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 22 && m > 0) break;
        const hour = String(h).padStart(2, '0');
        const min = String(m).padStart(2, '0');
        slots.push(`${hour}:${min}`);
      }
    }
    return slots;
  }, []);

  // IST "now" helpers
  const nowIST = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const todayIST = () => nowIST().toISOString().split('T')[0];

  // Slots disabled because they are in the past (only when date = today)
  const isPastSlot = (slot) => {
    if (date !== todayIST()) return false;
    const [h, m] = slot.split(':').map(Number);
    const now = nowIST();
    return h < now.getHours() || (h === now.getHours() && m <= now.getMinutes());
  };

  // Slots that overlap with existing bookings
  const isConflictSlot = (slot) => {
    if (!conflictSlots.length) return null;
    const [h, m] = slot.split(':').map(Number);
    const slotMins = h * 60 + m;
    for (const c of conflictSlots) {
      const cStart = c.startH * 60 + c.startM;
      const cEnd = c.endH * 60 + c.endM;
      if (slotMins >= cStart && slotMins < cEnd) return c.studentName;
    }
    return null;
  };



  // Fetch teacher's existing demos when teacher or date changes
  useEffect(() => {
    if (!selectedTeacherId || !date) { setConflictSlots([]); return; }
    setCheckingConflict(true);
    apiFetch(`/leads/teacher-demos?teacher_id=${selectedTeacherId}&date=${date}`)
      .then(res => {
        const bookings = (res.items || []).filter(b => b.id !== lead.id); // exclude current lead
        setConflictSlots(bookings.map(b => {
          const s = new Date(b.demo_scheduled_at);
          const e = new Date(b.demo_ends_at);
          // Convert UTC to IST
          const ist = (d) => new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
          const sIST = ist(s); const eIST = ist(e);
          return {
            startH: sIST.getHours(), startM: sIST.getMinutes(),
            endH: eIST.getHours(), endM: eIST.getMinutes(),
            studentName: b.student_name || 'another lead'
          };
        }));
      })
      .catch(() => setConflictSlots([]))
      .finally(() => setCheckingConflict(false));
  }, [selectedTeacherId, date]);

  const teacherOptions = useMemo(() => {
    return teachers.map(t => ({
      value: t.id,
      label: `${t.users?.full_name || t.full_name || 'Unknown'} (${t.teacher_code || 'N/A'})`
    }));
  }, [teachers]);

  useEffect(() => {
    setLoadingTeachers(true);
    apiFetch('/teachers/pool')
      .then(res => setTeachers(res.items || []))
      .catch(err => alert('Failed to fetch teachers: ' + err.message))
      .finally(() => setLoadingTeachers(false));
  }, []);

  const hasConflict = useMemo(() => {
    if (!startTime || !endTime || !conflictSlots.length) return null;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const selStart = sh * 60 + sm;
    const selEnd = eh * 60 + em;
    for (const c of conflictSlots) {
      const cStart = c.startH * 60 + c.startM;
      const cEnd = c.endH * 60 + c.endM;
      if (selStart < cEnd && selEnd > cStart)
        return `${c.studentName} (${String(c.startH).padStart(2, '0')}:${String(c.startM).padStart(2, '0')}–${String(c.endH).padStart(2, '0')}:${String(c.endM).padStart(2, '0')})`;
    }
    return null;
  }, [startTime, endTime, conflictSlots]);
  async function handleSave() {
    if (!date || !startTime || !endTime) return alert('Please select date and time range');
    if (!subject) return alert('Subject is mandatory for demo');
    if (!selectedTeacherId) return alert('Please select a teacher');
    if (startTime >= endTime) return alert('End time must be after start time');
    if (isPastSlot(startTime)) return alert('Cannot schedule in the past. Please select a future time.');
    if (hasConflict) return alert(`Time conflict! Teacher already has a demo with ${hasConflict}.`);

    setSaving(true);
    try {
      const startDateTime = new Date(`${date}T${startTime}:00`).toISOString();
      const endDateTime = new Date(`${date}T${endTime}:00`).toISOString();

      const teacher = teachers.find(t => t.id === selectedTeacherId);
      const teacherName = teacher?.users?.full_name || teacher?.full_name || 'Teacher';

      await apiFetch(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          demo_scheduled_at: startDateTime,
          demo_ends_at: endDateTime,
          subject: subject,
          demo_teacher_id: selectedTeacherId,
          status: 'demo_scheduled',
          reason: `Demo scheduled with ${teacherName} for ${subject} on ${date} ${startTime}-${endTime}`
        })
      });

      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Schedule Demo</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SearchSelect
            label="Subject (Mandatory)"
            value={subject}
            onChange={setSubject}
            options={CORE_SUBJECTS}
            placeholder="Search Subject..."
          />
          <SearchSelect
            label="Teacher"
            value={selectedTeacherId}
            onChange={setSelectedTeacherId}
            options={teacherOptions}
            placeholder={loadingTeachers ? 'Loading teachers...' : 'Select Teacher...'}
          />
          <label>
            Date
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px' }} min={new Date().toISOString().split('T')[0]} />
          </label>
          {checkingConflict && <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Checking teacher availability...</p>}
          {!checkingConflict && conflictSlots.length > 0 && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#92400e' }}>
              ⚠️ Teacher already has {conflictSlots.length} demo{conflictSlots.length > 1 ? 's' : ''} on this date. Conflicting slots are marked below.
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ flex: 1 }}>
              From
              <select value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
                <option value="">Start Time</option>
                {timeSlots.map(t => {
                  const past = isPastSlot(t);
                  const conflict = isConflictSlot(t);
                  return (
                    <option key={t} value={t} disabled={past || !!conflict}
                      style={{ color: conflict ? '#dc2626' : past ? '#9ca3af' : undefined }}>
                      {t}{conflict ? ` ⚠ ${conflict}` : past ? ' (past)' : ''}
                    </option>
                  );
                })}
              </select>
            </label>
            <label style={{ flex: 1 }}>
              To
              <select value={endTime} onChange={e => setEndTime(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
                <option value="">End Time</option>
                {timeSlots.map(t => {
                  const past = isPastSlot(t);
                  const conflict = isConflictSlot(t);
                  return (
                    <option key={t} value={t} disabled={past || !!conflict}
                      style={{ color: conflict ? '#dc2626' : past ? '#9ca3af' : undefined }}>
                      {t}{conflict ? ` ⚠ ${conflict}` : past ? ' (past)' : ''}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          {hasConflict && (
            <div style={{ background: '#fee2e2', border: '1px solid #dc2626', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#dc2626' }}>
              ❌ Conflict: Teacher is already booked with {hasConflict}
            </div>
          )}
          <button className="primary" onClick={handleSave} disabled={saving || loadingTeachers || !!hasConflict} style={{ marginTop: '8px' }}>
            {saving ? 'Scheduling...' : 'Schedule Demo'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Helper Functions ─── */
function getNextStatus(current) {
  const idx = STATUS_STEPS.indexOf(current);
  if (idx === -1 || idx >= STATUS_STEPS.length - 1) return null;
  if (current === 'dropped') return null;
  return STATUS_STEPS[idx + 1];
}

function getNextLabel(nextStatus) {
  const labels = {
    contacted: '📞 Mark Contacted',
    demo_scheduled: '📅 Schedule Demo',
    demo_done: '✅ Mark Demo Done',
    payment_pending: '💬 Mark Payment Pending',
    payment_verification: '⏳ Verify Payment',
    joined: '🎉 Mark Joined',
  };
  return labels[nextStatus] || nextStatus?.replace('_', ' ');
}

function formatPhone(num) {
  if (!num) return null;
  let clean = num.replace(/[^0-9+]/g, '');
  if (!clean.startsWith('+') && !clean.startsWith('91') && clean.length === 10) {
    clean = '91' + clean;
  }
  return clean;
}

/* ─── Student Lead Card ─── */
function StudentLeadCard({ lead, onStatusChange, onDrop, onView, onVerifyPayment }) {
  const [expanded, setExpanded] = useState(false);
  const phone = formatPhone(lead.contact_number);
  const nextStatus = getNextStatus(lead.status);

  return (
    <div className="card today-lead-card"
      style={{
        padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
        borderLeft: `4px solid ${STATUS_COLORS[lead.status] || '#6b7280'}`,
        borderImage: lead.status === 'dropped' ? 'none' : `linear-gradient(to bottom, ${STATUS_COLORS[lead.status] || '#6b7280'}, ${STATUS_COLORS[lead.status] || '#6b7280'}44) 1`,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header (Always Visible) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{lead.student_name}</h3>
            <Icon d={expanded ? ICONS.chevronUp : ICONS.chevronDown} size={16} color="#9ca3af" />
          </div>
          {lead.parent_name && !expanded && (
            <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '12px' }}>Parent: {lead.parent_name}</p>
          )}
          {/* Date always visible */}
          {!expanded && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className="text-muted" style={{ fontSize: '11px' }}>
                {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' }) : ''}
              </span>
            </div>
          )}
        </div>
        <span style={{
          padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
          background: `${STATUS_COLORS[lead.status] || '#6b7280'}18`,
          color: STATUS_COLORS[lead.status] || '#6b7280',
          whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[lead.status] || '#6b7280' }} />
          {STATUS_LABELS[lead.status] || lead.status?.replace('_', ' ')}
        </span>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
          {/* Progress Tracker */}
          <ProgressTracker currentStatus={lead.status} />

          {/* Details */}
          <div className="today-lead-details">
            {lead.parent_name && (
              <div>
                <span className="text-muted">Parent</span>
                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.parent_name}</p>
              </div>
            )}
            <div>
              <span className="text-muted">Phone</span>
              <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.contact_number || '—'}</p>
            </div>
            <div>
              <span className="text-muted">Class</span>
              <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.class_level || '—'}</p>
            </div>
            <div>
              <span className="text-muted">Subject</span>
              <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.subject || '—'}</p>
            </div>
            {lead.lead_type && (
              <div>
                <span className="text-muted">Lead Type</span>
                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.lead_type}</p>
              </div>
            )}
            {lead.email ? (
              <div>
                <span className="text-muted">Email</span>
                <p style={{ margin: '2px 0 0', fontWeight: 500, wordBreak: 'break-all', fontSize: '12px' }}>{lead.email}</p>
              </div>
            ) : null}
          </div>

          {/* Contact */}
          {phone ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={`tel:+${phone}`} className="today-lead-action-btn call-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon d={ICONS.phone} size={12} /> Call
              </a>
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="today-lead-action-btn wa-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon d={ICONS.messageCircle} size={12} /> WhatsApp
              </a>
            </div>
          ) : null}

          {/* Actions */}
          {lead.status !== 'joined' && lead.status !== 'dropped' ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {lead.status === 'demo_done' ? (
                <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => onStatusChange(lead.id, 'payment_pending')}>
                  💰 Requested payment
                </button>
              ) : null}
              {lead.status === 'payment_pending' ? (
                <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => onVerifyPayment && onVerifyPayment(lead.id)}>
                  ⏳ Verify Payment
                </button>
              ) : nextStatus && lead.status !== 'demo_done' && lead.status !== 'payment_verification' ? (
                <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => onStatusChange(lead.id, nextStatus)}>
                  {getNextLabel(nextStatus)}
                </button>
              ) : null}
              {lead.status === 'payment_verification' && (
                <span style={{ flex: 1, fontSize: '12px', textAlign: 'center', padding: '6px', background: '#f3f4f6', borderRadius: '4px', color: '#6b7280' }}>
                  Verification in process
                </span>
              )}
              <button className="small secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                onClick={() => onView(lead.id)}>
                <Icon d={ICONS.eye} size={14} /> View
              </button>
              <button className="small danger" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                onClick={() => onDrop(lead.id)}>
                <Icon d={ICONS.x} size={12} /> Drop
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="small secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', flex: 1 }}
                onClick={() => onView(lead.id)}>
                <Icon d={ICONS.eye} size={14} /> View Details
              </button>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <span className="text-muted" style={{ fontSize: '12px' }}>
              Created: {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' }) : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function MyLeadsPage({ onOpenDetails, initialLeadId = '', onPipelineReady, onVerifyPayment }) {
  const { items, loading, error, refresh } = useLeads('mine');
  const [activeTab, setActiveTab] = useState('new');
  const [highlightedLeadId, setHighlightedLeadId] = useState('');

  const STATUS_STEPS = ['new', 'contacted', 'demo_scheduled', 'demo_done', 'payment_pending', 'payment_verification', 'joined'];

  /* Helper functions removed as they are now top-level */

  async function handleStatusChange(leadId, newStatus) {
    try {
      await apiFetch(`/leads/${leadId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, reason: `Status moved to ${newStatus}` })
      });
      refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDrop(leadId) {
    if (!confirm('Are you sure you want to mark this lead as dropped?')) return;
    try {
      await apiFetch(`/leads/${leadId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'dropped', reason: 'Dropped by counselor' })
      });
      refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  const TABS = [
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'demo_scheduled', label: 'Demo Scheduled' },
    { id: 'demo_done', label: 'Demo Done' },
    { id: 'payment_pending', label: 'Payment Pending' },
    { id: 'payment_verification', label: 'Payment Verification' },
    { id: 'joined', label: 'Joined' },
    { id: 'dropped', label: 'Dropped' }
  ];


  const filteredItems = items.filter(i => activeTab === 'all' || i.status === activeTab);

  /* statusColors map removed - use global STATUS_COLORS */

  const [leadForDemo, setLeadForDemo] = useState(null);

  // Auto-switch to the correct tab and scroll to the lead when coming from pipeline nav
  useEffect(() => {
    if (!initialLeadId || loading || !items.length) return;
    const target = items.find(i => i.id === initialLeadId);
    if (!target) return;
    // Switch to the lead's status tab
    setActiveTab(target.status || 'all');
    setHighlightedLeadId(initialLeadId);
    // Scroll to the card after render
    setTimeout(() => {
      const el = document.getElementById(`pipeline-lead-${initialLeadId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Clear highlight after 3 seconds
      setTimeout(() => setHighlightedLeadId(''), 3000);
    }, 100);
    if (onPipelineReady) onPipelineReady();
  }, [initialLeadId, loading, items]);

  const onStatusChangeAction = async (leadId, newStatus) => {
    if (newStatus === 'demo_scheduled') {
      const lead = items.find(i => i.id === leadId);
      setLeadForDemo(lead);
    } else {
      await handleStatusChange(leadId, newStatus);
    }
  };

  return (
    <section className="panel">
      {leadForDemo && (
        <ScheduleDemoModal
          lead={leadForDemo}
          onClose={() => setLeadForDemo(null)}
          onSuccess={() => { refresh(); /* Keep modal open for step 2 comes from internal state of modal, but we need to ensure background refresh */ }}
        />
      )}
      <div className="tabs-row" style={{ marginTop: 0, marginBottom: '16px', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} ({items.filter(i => tab.id === 'all' || i.status === tab.id).length})
          </button>
        ))}
      </div>

      {loading ? <p>Loading my leads...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && filteredItems.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          <p style={{ fontSize: '28px', margin: '0 0 8px' }}>📭</p>
          <p style={{ fontWeight: 500 }}>No leads in this status.</p>
        </div>
      ) : null}

      <div className="today-leads-grid">
        {filteredItems.map(lead => (
          <div
            id={`pipeline-lead-${lead.id}`}
            key={lead.id}
            style={highlightedLeadId === lead.id ? {
              outline: '2px solid #f59e0b',
              boxShadow: '0 0 0 4px #fef3c7',
              borderRadius: '10px',
              transition: 'all 0.3s'
            } : {}}
          >
            <StudentLeadCard
              key={lead.id}
              lead={lead}
              onStatusChange={onStatusChangeAction}
              onDrop={handleDrop}
              onView={onOpenDetails}
              onVerifyPayment={onVerifyPayment}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function LeadDetailsPage({ leadId, initialTab = 'profile' }) {
  const [lead, setLead] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentTotalAmount, setPaymentTotalAmount] = useState('');
  const [paymentHours, setPaymentHours] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [form, setForm] = useState({ student_name: '', class_level: '', subject: '', lead_type: '', status: 'new' });
  const [leadTypes, setLeadTypes] = useState([]);

  async function handleAddType(name) {
    const res = await apiFetch('/leads/types', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      setLeadTypes(prev => [...prev, name].sort());
    } else {
      console.error('Failed to save lead type:', res.error);
    }
  }

  useEffect(() => {
    if (!leadId) return;
    let cancelled = false;
    async function load() {
      setError('');
      try {
        const data = await apiFetch(`/leads/${leadId}`);
        const historyData = await apiFetch(`/leads/${leadId}/history`);
        const typesData = await apiFetch('/leads/types').catch(() => ({ types: [] }));
        if (cancelled) return;
        setLead(data.lead);
        setHistory(historyData.items || []);
        setLeadTypes(typesData.types || []);
        setForm({
          student_name: data.lead.student_name || '',
          parent_name: data.lead.parent_name || '',
          class_level: data.lead.class_level || '',
          subject: data.lead.subject || '',
          lead_type: data.lead.lead_type || '',
          status: data.lead.status || 'new',
          email: data.lead.email || '',
          contact_number: data.lead.contact_number || ''
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  const title = useMemo(() => (lead ? lead.student_name : 'Lead Details'), [lead]);

  async function onSave(e) {
    e.preventDefault();
    if (!leadId) return;
    setSaving(true);
    setError('');
    try {
      const data = await apiFetch(`/leads/${leadId}`, {
        method: 'PATCH',
        body: JSON.stringify(form)
      });
      setLead(data.lead);
      const historyData = await apiFetch(`/leads/${leadId}/history`);
      setHistory(historyData.items || []);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function submitPaymentRequest(e) {
    e.preventDefault();
    if (!leadId) return;
    setPaymentMessage('');
    setError('');
    try {
      await apiFetch(`/leads/${leadId}/payment-request`, {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(paymentAmount),
          total_amount: Number(paymentTotalAmount) || null,
          hours: Number(paymentHours) || null,
          screenshot_url: paymentScreenshot || null
        })
      });
      setPaymentMessage('Payment request submitted to finance for verification.');
      const latest = await apiFetch(`/leads/${leadId}`);
      setLead(latest.lead);
      const historyData = await apiFetch(`/leads/${leadId}/history`);
      setHistory(historyData.items || []);
    } catch (err) {
      setError(err.message);
    }
  }

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!leadId) {
    return (
      <section className="panel">
        <p style={{ padding: '20px' }}>Select a lead from All Leads or My Leads.</p>
      </section>
    );
  }

  if (!lead) {
    return <section className="panel"><p style={{ padding: '20px' }}>Loading lead details...</p></section>;
  }

  async function updateStatus(newStatus) {
    if (!leadId) return;

    // Restricted statuses that cannot be manually set from this general UI
    const restricted = ['demo_scheduled', 'payment_verification', 'joined'];
    if (restricted.includes(newStatus)) {
      return alert(`Cannot manually change status to ${newStatus.replace('_', ' ')} from here.`);
    }

    try {
      const data = await apiFetch(`/leads/${leadId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setLead(data.lead);
      const historyData = await apiFetch(`/leads/${leadId}/history`);
      setHistory(historyData.items || []);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const presignData = await apiFetch(`/upload/presigned-url`, {
        method: 'POST',
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type
        })
      });

      const uploadRes = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      if (!uploadRes.ok) throw new Error('Failed to upload file to storage');

      setPaymentScreenshot(presignData.publicUrl);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  }

  const STATUS_STEPS = ['new', 'contacted', 'demo_scheduled', 'demo_done', 'payment_pending', 'payment_verification', 'joined', 'dropped'];

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <button
          onClick={() => window.history.back()}
          className="small secondary"
        >
          ← Go Back
        </button>
        <button
          className="small primary"
          onClick={() => { setActiveTab('profile'); setIsEditing(true); }}
        >
          ✎ Edit Details
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 'max-content' }}>
          {STATUS_STEPS.map((step, idx) => {
            const isActive = lead?.status === step;
            const isPassed = STATUS_STEPS.indexOf(lead?.status) > idx && lead?.status !== 'dropped';
            return (
              <div
                key={step}
                onClick={() => {
                  const restricted = ['demo_scheduled', 'payment_verification', 'joined', 'dropped'];
                  // allow selecting 'dropped' but not anything else that isn't handled here natively
                  if (restricted.includes(step) && step !== 'dropped') return;
                  if (lead?.status === 'payment_verification' || lead?.status === 'joined' || lead?.status === 'dropped') return;

                  if (step === 'dropped' && !window.confirm('Are you sure you want to mark this lead as dropped?')) return;

                  updateStatus(step);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: isActive ? (step === 'dropped' ? '#ef4444' : '#4f46e5') : isPassed ? '#e0e7ff' : '#f3f4f6',
                  color: isActive ? 'white' : isPassed ? '#4f46e5' : '#6b7280',
                  fontWeight: 500,
                  fontSize: '13px',
                  cursor: (['demo_scheduled', 'payment_verification', 'joined'].includes(step) || ['payment_verification', 'joined', 'dropped'].includes(lead?.status)) ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  border: isActive ? `1px solid ${step === 'dropped' ? '#ef4444' : '#4f46e5'}` : '1px solid transparent',
                  opacity: (['demo_scheduled', 'payment_verification', 'joined'].includes(step) && !isActive) ? 0.6 : 1
                }}
              >
                {step.replace('_', ' ')}
              </div>
            );
          })}
        </div>
      </div>

      <div className="tabs-row">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
      </div>

      {activeTab === 'profile' ? (
        <>
          {!isEditing ? (
            <div className="card">
              <div className="flex-between">
                <h3>Profile Details</h3>
              </div>
              <div className="form-grid grid-2" style={{ marginTop: '16px' }}>
                <div>
                  <label>Student Name</label>
                  <p className="text-large">{lead.student_name}</p>
                </div>
                <div>
                  <label>Current Status</label>
                  <p><StatusBadge status={lead.status} /></p>
                </div>
                <div>
                  <label>Contact</label>
                  <p>{lead.contact_number || '-'}</p>
                </div>
                <div>
                  <label>Email</label>
                  <p>{lead.email || '-'}</p>
                </div>
                <div>
                  <label>Class</label>
                  <p>{lead.class_level || '-'}</p>
                </div>
                <div>
                  <label>Subject</label>
                  <p>{lead.subject || '-'}</p>
                </div>
                <div>
                  <label>Lead Type</label>
                  <p>{lead.lead_type || '-'}</p>
                </div>
                <div>
                  <label>Parent Name</label>
                  <p>{lead.parent_name || '-'}</p>
                </div>
              </div>

              {lead.demo_scheduled_at && (
                <>
                  <div style={{ height: '1px', background: '#e5e7eb', margin: '24px 0' }} />
                  <div className="flex-between">
                    <h3>Demo Details</h3>
                  </div>
                  <div className="form-grid grid-2" style={{ marginTop: '16px' }}>
                    <div>
                      <label>Scheduled Date & Time</label>
                      <p>{new Date(lead.demo_scheduled_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                    <div>
                      <label>Ends At</label>
                      <p>{lead.demo_ends_at ? new Date(lead.demo_ends_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : '-'}</p>
                    </div>
                    {lead.subject && (
                      <div>
                        <label>Demo Subject</label>
                        <p>{lead.subject}</p>
                      </div>
                    )}
                    {lead.teacher_profiles && (
                      <div>
                        <label>Demo Teacher</label>
                        <p style={{ fontWeight: 500 }}>
                          {lead.teacher_profiles?.users?.full_name || 'Unknown Teacher'} ({lead.teacher_profiles?.teacher_code || 'N/A'})
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <form className="card" onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Edit Profile</h3>
                <div style={{ height: '1px', background: '#e5e7eb', marginTop: '12px' }} />
              </div>

              <div className="form-grid grid-2">
                <label>
                  Student Name
                  <input value={form.student_name} onChange={(e) => setForm((v) => ({ ...v, student_name: e.target.value }))} required />
                </label>
                <label>
                  Parent Name
                  <input value={form.parent_name} onChange={(e) => setForm((v) => ({ ...v, parent_name: e.target.value }))} />
                </label>
                <label>
                  Email
                  <input type="email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
                </label>
                <label>
                  Contact Number
                  <input value={form.contact_number} onChange={(e) => setForm((v) => ({ ...v, contact_number: e.target.value }))} />
                </label>
                <label>
                  Class
                  <input value={form.class_level} onChange={(e) => setForm((v) => ({ ...v, class_level: e.target.value }))} />
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Subject</label>
                  <SearchSelect
                    label=""
                    value={form.subject}
                    onChange={(val) => setForm((v) => ({ ...v, subject: val }))}
                    options={CORE_SUBJECTS}
                    placeholder="Select Subject"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <CreatableSelect
                    label="Lead Type"
                    value={form.lead_type}
                    onChange={(val) => setForm((v) => ({ ...v, lead_type: val }))}
                    options={leadTypes}
                    placeholder="Select or Add New"
                    onAdd={handleAddType}
                  />
                </div>
              </div>

              <div>
                <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '12px' }} />
                <div className="actions" style={{ justifyContent: 'flex-end', display: 'flex', gap: '12px' }}>
                  <button type="button" className="secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </div>
              {error ? <p className="error">{error}</p> : null}
            </form>
          )}
        </>
      ) : null}



      {activeTab === 'timeline' ? (
        <article className="card">
          <h3>Lead Timeline</h3>
          <div className="timeline">
            {history.map((item) => {
              // Determine event type for display
              const isAssignment = item.reason && item.reason.toLowerCase().includes('assign');
              const isStatusChange = item.from_status && item.to_status && item.from_status !== item.to_status;
              const isInitial = item.from_status === null && item.to_status;

              return (
                <div key={item.id} className="timeline-item">
                  <p>
                    {isStatusChange ? (
                      <span>Status changed from <strong>{item.from_status}</strong> → <strong>{item.to_status}</strong></span>
                    ) : isAssignment ? (
                      <span>🔄 <strong>{item.reason}</strong></span>
                    ) : isInitial ? (
                      <span>🟢 Lead created with status <strong>{item.to_status}</strong></span>
                    ) : (
                      <strong>{item.reason || 'Update'}</strong>
                    )}
                  </p>
                  <p className="timeline-meta">
                    <strong>{item.changed_by_name || 'System'}</strong>
                    {' · '}
                    {item.created_at ? new Date(item.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '-'}
                  </p>
                  {isStatusChange && item.reason ? <p className="muted">{item.reason}</p> : null}
                </div>
              );
            })}
            {!history.length ? <p>No timeline updates yet.</p> : null}
          </div>
        </article>
      ) : null}
    </section>
  );
}

/* ═══════ Converted Leads Page (Counselor Head Only) ═══════ */
export function ConvertedLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [acs, setAcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningId, setAssigningId] = useState(null);
  const [selectedAc, setSelectedAc] = useState({});
  const [assignedMap, setAssignedMap] = useState({});
  const [search, setSearch] = useState('');
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAcId, setBulkAcId] = useState('');
  const [bulkAssigning, setBulkAssigning] = useState(false);
  const [tab, setTab] = useState('unassigned'); // 'unassigned' | 'all'

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [leadsRes, acsRes] = await Promise.all([
          apiFetch('/leads?scope=joined'),
          apiFetch('/leads/academic-coordinators')
        ]);
        setLeads(leadsRes.items || []);
        setAcs(acsRes.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleAssign(leadId) {
    const acId = selectedAc[leadId];
    if (!acId) return alert('Please select an Academic Coordinator');
    setAssigningId(leadId);
    try {
      await apiFetch(`/leads/${leadId}/assign-ac`, {
        method: 'POST',
        body: JSON.stringify({ ac_user_id: acId })
      });
      const ac = acs.find(a => a.id === acId);
      setAssignedMap(prev => ({ ...prev, [leadId]: ac?.full_name || ac?.email || 'Assigned' }));
    } catch (err) {
      alert('Assignment failed: ' + err.message);
    } finally {
      setAssigningId(null);
    }
  }

  async function handleBulkAssign(e) {
    e.preventDefault();
    if (!bulkAcId || !selectedIds.length) return;
    setBulkAssigning(true);
    try {
      const res = await apiFetch('/leads/bulk-assign-ac', {
        method: 'POST',
        body: JSON.stringify({ lead_ids: selectedIds, ac_user_id: bulkAcId })
      });
      const ac = acs.find(a => a.id === bulkAcId);
      const acName = ac?.full_name || ac?.email || 'Assigned';
      const newMap = { ...assignedMap };
      selectedIds.forEach(id => { newMap[id] = acName; });
      setAssignedMap(newMap);
      setSelectedIds([]);
      setBulkAcId('');
      alert(`${res.count} lead(s) assigned successfully`);
    } catch (err) {
      alert('Bulk assignment failed: ' + err.message);
    } finally {
      setBulkAssigning(false);
    }
  }

  const filtered = leads.filter(l => {
    const matchesSearch = !search ||
      l.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.contact_number?.includes(search);
    const isAssigned = !!(l.ac_user?.full_name || l.ac_user?.email || assignedMap[l.id]);
    const matchesTab = tab === 'all' || !isAssigned;
    return matchesSearch && matchesTab;
  });

  // Only unassigned leads are selectable
  const selectableIds = filtered.filter(l => !assignedMap[l.id]).map(l => l.id);
  const allSelected = selectableIds.length > 0 && selectableIds.every(id => selectedIds.includes(id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectableIds);
    }
  }

  function toggleOne(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={tab === 'unassigned' ? 'primary' : 'secondary'}
            style={{ fontSize: '13px' }}
            onClick={() => setTab('unassigned')}
          >
            Unassigned ({leads.filter(l => !(l.ac_user?.full_name || assignedMap[l.id])).length})
          </button>
          <button
            className={tab === 'all' ? 'primary' : 'secondary'}
            style={{ fontSize: '13px' }}
            onClick={() => setTab('all')}
          >
            All ({leads.length})
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '220px', padding: '8px 12px' }}
        />
      </div>

      {loading ? <p>Loading joined leads…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                  </th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Class</th>
                  <th>Closed By</th>
                  <th>Joined Date</th>
                  <th>AC Coordinator</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => {
                  const alreadyAssigned = assignedMap[lead.id];
                  return (
                    <tr key={lead.id} className={selectedIds.includes(lead.id) ? 'selected-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(lead.id)}
                          disabled={!!(lead.ac_user?.full_name || lead.ac_user?.email || assignedMap[lead.id])}
                          onChange={() => toggleOne(lead.id)}
                        />
                      </td>
                      <td style={{ fontSize: '12px', color: '#4338ca', fontWeight: 600 }}>
                        {lead.student_code || '—'}
                      </td>
                      <td style={{ fontWeight: 500 }}>{lead.student_name}</td>
                      <td>{lead.contact_number || '—'}</td>
                      <td>{lead.class_level || '—'}</td>
                      <td style={{ fontSize: '12px' }}>{lead.counselor?.full_name || lead.counselor?.email || '—'}</td>
                      <td>{lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td>
                        {(lead.ac_user?.full_name || lead.ac_user?.email || assignedMap[lead.id]) ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                            fontWeight: 600, background: '#dcfce7', color: '#15803d'
                          }}>
                            ✅ {lead.ac_user?.full_name || lead.ac_user?.email || assignedMap[lead.id]}
                          </span>
                        ) : (
                          <span style={{
                            padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                            fontWeight: 600, background: '#f3f4f6', color: '#6b7280'
                          }}>
                            Unassigned
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No leads found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Bulk Assign Bar */}
      {selectedIds.length > 0 ? (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#1f2937', color: 'white', padding: '12px 24px', borderRadius: '50px',
          display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 100
        }}>
          <span>{selectedIds.length} selected</span>
          <div style={{ height: '20px', width: '1px', background: '#4b5563' }} />

          <form onSubmit={handleBulkAssign} style={{ display: 'flex', gap: '8px' }}>
            <select
              value={bulkAcId}
              onChange={e => setBulkAcId(e.target.value)}
              required
              style={{ background: '#374151', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
            >
              <option value="">Assign AC to…</option>
              {acs.map(ac => <option key={ac.id} value={ac.id}>{ac.full_name}</option>)}
            </select>
            <button type="submit" disabled={bulkAssigning} className="primary small" style={{ padding: '4px 12px' }}>
              {bulkAssigning ? '…' : 'Assign'}
            </button>
          </form>

          <button type="button" onClick={() => setSelectedIds([])} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>Cancel</button>
        </div>
      ) : null}
    </section>
  );
}

export function DemoManagementPage({ leadId, onOpenDetails }) {
  const { items, loading, error, refresh } = useLeads('mine');
  const [teachers, setTeachers] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [activeTab, setActiveTab] = useState('demo_done');

  useEffect(() => {
    apiFetch('/teachers/pool').then(d => setTeachers(d.items || [])).catch(() => { });
  }, []);

  const demoLeads = useMemo(() => {
    return items.filter(i => ['demo_scheduled', 'demo_done'].includes(i.status));
  }, [items]);

  const scheduledCount = items.filter(i => i.status === 'demo_scheduled').length;
  const doneCount = items.filter(i => i.status === 'demo_done').length;

  async function handleScheduleDemo(e) {
    e.preventDefault();
    const targetId = selectedLeadId || leadId;
    if (!targetId) { setErr('Select a lead to schedule a demo for.'); return; }
    setErr('');
    setMsg('');
    try {
      await apiFetch(`/leads/${targetId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'demo_scheduled',
          demo_scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          demo_teacher_id: selectedTeacherId || null
        })
      });
      setMsg('Demo scheduled!');
      setShowScheduleModal(false);
      setSelectedLeadId('');
      setSelectedTeacherId('');
      setScheduledAt('');
      refresh();
    } catch (err) {
      setErr(err.message);
    }
  }

  async function handleMarkDone(id) {
    try {
      await apiFetch(`/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'demo_done', reason: 'Demo completed' })
      });
      refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  function formatPhone(num) {
    if (!num) return null;
    let clean = num.replace(/[^0-9+]/g, '');
    if (!clean.startsWith('+') && !clean.startsWith('91') && clean.length === 10) clean = '91' + clean;
    return clean;
  }

  const statusColors = {
    new: '#6366f1',
    contacted: '#8b5cf6',
    demo_scheduled: '#f59e0b',
    demo_done: '#3b82f6',
    payment_pending: '#ec4899',
    payment_verification: '#f97316',
  };

  return (
    <section className="panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Demo Management</h2>
          <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
            {scheduledCount} upcoming · {doneCount} demos taken
          </p>
        </div>
      </div>



      {loading ? <p>Loading demos...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {msg ? <p style={{ color: '#10b981', marginBottom: '12px' }}>{msg}</p> : null}

      {!loading && demoLeads.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          <p style={{ fontSize: '28px', margin: '0 0 8px' }}>📅</p>
          <p style={{ fontWeight: 500 }}>No demos in this category.</p>
        </div>
      ) : null}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap mobile-friendly-table">
          <table>
            <thead>
              <tr>
                <th>Demo Date</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demoLeads.map(lead => {
                const isScheduled = lead.status === 'demo_scheduled';
                return (
                  <tr key={lead.id}>
                    <td data-label="Demo Date">
                      <span style={{ fontWeight: 500 }}>
                        {lead.demo_scheduled_at ? new Date(lead.demo_scheduled_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/ AM| PM/g, m => m.toLowerCase()) : '—'}
                      </span>
                    </td>
                    <td data-label="Student">
                      {lead.student_name}
                      <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>{lead.contact_number}</div>
                    </td>
                    <td data-label="Subject">{lead.subject || '—'}</td>
                    <td data-label="Teacher">
                      {(() => {
                        const matched = teachers.find(t => t.user_id === lead.demo_teacher_id || t.id === lead.demo_teacher_id);
                        const name = matched?.users?.full_name || lead.teacher_profiles?.users?.full_name;
                        if (name) return name;
                        if (lead.demo_teacher_id) return `ID: ${lead.demo_teacher_id.slice(0, 8)}`;
                        return <span className="text-muted">Not Assigned</span>;
                      })()}
                    </td>
                    <td data-label="Status">
                      <span style={{
                        padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                        background: isScheduled ? '#f59e0b18' : '#3b82f618',
                        color: isScheduled ? '#f59e0b' : '#3b82f6',
                        textTransform: 'capitalize', whiteSpace: 'nowrap'
                      }}>
                        {isScheduled ? 'Scheduled' : 'Demo Done'}
                      </span>
                    </td>
                    <td data-label="Actions" style={{ textAlign: 'center' }}>
                      {isScheduled ? (
                        <button className="small primary" style={{ fontSize: '11px', padding: '4px 10px' }}
                          onClick={() => handleMarkDone(lead.id)}>
                          ✅ Mark Done
                        </button>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '12px' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Demo Modal */}
      {
        showScheduleModal ? (
          <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '420px' }}>
              <h3>Schedule Demo</h3>
              <form className="form-grid" onSubmit={handleScheduleDemo}>
                <label>
                  Lead
                  <select value={selectedLeadId} onChange={e => setSelectedLeadId(e.target.value)} required>
                    <option value="">Select a lead...</option>
                    {newLeads.map(l => (
                      <option key={l.id} value={l.id}>{l.student_name} — {l.subject || 'No subject'}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Teacher
                  <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} required>
                    <option value="">Select a teacher...</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.user_id}>{t.users?.full_name || 'Unknown'} ({t.teacher_code})</option>
                    ))}
                  </select>
                </label>
                <label>
                  Schedule Date & Time (optional)
                  <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
                </label>
                {err ? <p className="error">{err}</p> : null}
                <div className="actions">
                  <button type="button" className="secondary" onClick={() => { setShowScheduleModal(false); setErr(''); }}>Cancel</button>
                  <button type="submit">Schedule Demo</button>
                </div>
              </form>
            </div>
          </div>
        ) : null
      }
    </section >
  );
}

/* ═══════ Payment Requests Page ═══════ */
export function PaymentRequestsPage({ initialLeadId, onReady }) {
  const [requests, setRequests] = useState([]);
  const [leads, setLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [counselorFilter, setCounselorFilter] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    if (initialLeadId && leads.length > 0) {
      setShowNewModal(true);
      if (onReady) onReady();
    }
  }, [initialLeadId, leads, onReady]);

  async function loadData() {
    setLoading(true);
    try {
      const session = getSession();
      const userRole = session?.user?.role || '';
      setRole(userRole);

      const promises = [
        apiFetch('/leads/payment-requests'),
        apiFetch('/leads?scope=my').catch(() => ({ items: [] })),
        apiFetch('/leads/counselors').catch(() => ({ items: [] }))
      ];
      const [prRes, leadsRes, counselorsRes] = await Promise.all(promises);
      setRequests(prRes.items || []);
      setLeads((leadsRes.items || []).filter(l => !l.deleted_at));
      setCounselors(counselorsRes?.items || []);
    } catch (e) { alert(e.message); }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const isCounselorHead = role === 'counselor_head' || role === 'super_admin';

  // Build counselor name map from the counselors list
  const counselorMap = useMemo(() => {
    const m = {};
    counselors.forEach(c => { m[c.id] = c.full_name || c.email || 'Unknown'; });
    return m;
  }, [counselors]);

  const filtered = useMemo(() => {
    let list = requests;
    if (statusFilter !== 'all') list = list.filter(r => r.status === statusFilter);
    if (isCounselorHead && counselorFilter !== 'all') {
      list = list.filter(r => r.leads?.counselor_id === counselorFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        (r.leads?.student_name || '').toLowerCase().includes(q) ||
        (r.leads?.contact_number || '').includes(q) ||
        String(r.amount).includes(q) ||
        (counselorMap[r.leads?.counselor_id] || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, statusFilter, counselorFilter, search, counselorMap, isCounselorHead]);

  const statusBadge = (status) => {
    const map = {
      pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' },
      approved: { bg: '#dcfce7', color: '#15803d', label: '✅ Approved' },
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

  if (loading) return <section className="panel"><p>Loading payment requests...</p></section>;

  return (
    <section className="panel">
      {/* Filters row - single line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Search by student, phone, amount…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '220px', flexShrink: 0, padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        />
        {isCounselorHead && counselors.length > 0 && (
          <select
            value={counselorFilter}
            onChange={e => setCounselorFilter(e.target.value)}
            style={{ width: '180px', flexShrink: 0, padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          >
            <option value="all">All Counselors</option>
            {counselors.map(c => (
              <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
            ))}
          </select>
        )}
        {!isCounselorHead && (
          <button className="primary" style={{ marginLeft: 'auto', fontSize: '13px', flexShrink: 0 }} onClick={() => setShowNewModal(true)}>+ New Request</button>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '16px' }}>
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
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Phone</th>
              {isCounselorHead && <th>Counselor</th>}
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
                <td style={{ fontWeight: 500 }}>{r.leads?.student_name || '—'}</td>
                <td>{r.leads?.contact_number || '—'}</td>
                {isCounselorHead && (
                  <td style={{ fontSize: '12px', color: '#4338ca' }}>
                    {counselorMap[r.leads?.counselor_id] || '—'}
                  </td>
                )}
                <td style={{ fontWeight: 600 }}>{r.total_amount ? `₹${Number(r.total_amount).toLocaleString('en-IN')}` : '—'}</td>
                <td>{r.hours || '—'}</td>
                <td style={{ fontWeight: 600, color: '#15803d' }}>₹{Number(r.amount).toLocaleString('en-IN')}</td>
                <td>
                  {r.screenshot_url ? (
                    <a href={r.screenshot_url} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#2563eb', fontSize: '12px' }}>View</a>
                  ) : '—'}
                </td>
                <td>{statusBadge(r.status)}</td>
                <td style={{ fontSize: '12px', color: '#6b7280', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.finance_note || '—'}
                </td>
                <td style={{ fontSize: '12px', color: '#6b7280' }}>
                  {new Date(r.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={isCounselorHead ? 10 : 9} style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                No payment requests found.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      {showNewModal && (
        <NewPaymentRequestModal
          leads={leads}
          initialLeadId={initialLeadId}
          onClose={() => setShowNewModal(false)}
          onSuccess={() => { setShowNewModal(false); loadData(); }}
        />
      )}
    </section>
  );
}

/* ═══════ Overdue Leads Page (Counselor Head) ═══════ */
export function OverdueLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [reassigning, setReassigning] = useState({});
  const [selectedCounselor, setSelectedCounselor] = useState({});

  async function loadData() {
    setLoading(true);
    try {
      const [overdueRes, counselorRes] = await Promise.all([
        apiFetch('/leads/overdue'),
        apiFetch('/leads/counselors').catch(() => ({ items: [] }))
      ]);
      setLeads(overdueRes.items || []);
      setCounselors(counselorRes.items || []);
    } catch (e) { alert(e.message); }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  function daysOverdue(assignedAt) {
    if (!assignedAt) return '—';
    const days = Math.floor((Date.now() - new Date(assignedAt).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  }

  async function handleReassign(leadId) {
    const newCounselorId = selectedCounselor[leadId];
    if (!newCounselorId) return alert('Please select a counselor');
    setReassigning(prev => ({ ...prev, [leadId]: true }));
    try {
      await apiFetch(`/leads/${leadId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ counselor_id: newCounselorId })
      });
      alert('Lead reassigned successfully!');
      await loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setReassigning(prev => ({ ...prev, [leadId]: false }));
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter(l =>
      (l.student_name || '').toLowerCase().includes(q) ||
      (l.contact_number || '').includes(q) ||
      (l.users?.full_name || '').toLowerCase().includes(q)
    );
  }, [leads, search]);

  if (loading) return <section className="panel"><p>Loading overdue leads...</p></section>;

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Overdue Leads</h2>
          <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>
            Leads assigned for more than 13 days without reaching Joined or Dropped status
          </p>
        </div>
        <div style={{
          padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
          background: leads.length > 0 ? '#fee2e2' : '#dcfce7',
          color: leads.length > 0 ? '#dc2626' : '#15803d'
        }}>
          {leads.length} overdue
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Search by student name, phone, or counselor…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '360px', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        />
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Current Counselor</th>
              <th>Days Overdue</th>
              <th>Reassign To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => {
              const days = daysOverdue(l.assigned_at);
              return (
                <tr key={l.id} style={{ background: days >= 20 ? '#fef2f2' : 'transparent' }}>
                  <td style={{ fontWeight: 500 }}>{l.student_name}</td>
                  <td>{l.contact_number || '—'}</td>
                  <td>{l.subject || '—'}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                      background: '#fef3c7', color: '#92400e'
                    }}>{l.status}</span>
                  </td>
                  <td style={{ fontSize: '13px' }}>{l.users?.full_name || '—'}</td>
                  <td>
                    <span style={{
                      fontWeight: 700, fontSize: '14px',
                      color: days >= 20 ? '#dc2626' : days >= 13 ? '#ea580c' : '#6b7280'
                    }}>
                      {days}d
                    </span>
                  </td>
                  <td>
                    <select
                      value={selectedCounselor[l.id] || ''}
                      onChange={e => setSelectedCounselor(prev => ({ ...prev, [l.id]: e.target.value }))}
                      style={{ fontSize: '12px', padding: '4px 8px', minWidth: '140px' }}
                    >
                      <option value="">Select…</option>
                      {counselors
                        .filter(c => c.id !== l.counselor_id)
                        .map(c => (
                          <option key={c.id} value={c.id}>{c.full_name}</option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="small primary"
                      disabled={!selectedCounselor[l.id] || reassigning[l.id]}
                      onClick={() => handleReassign(l.id)}
                      style={{ fontSize: '12px' }}
                    >
                      {reassigning[l.id] ? '…' : 'Reassign'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {!filtered.length && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#15803d', padding: '40px', fontWeight: 500 }}>
                ✅ No overdue leads — all assignments are within the 13-day window.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NewPaymentRequestModal({ leads, onClose, onSuccess, initialLeadId }) {
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeadId || '');
  const [totalAmount, setTotalAmount] = useState('');
  const [hours, setHours] = useState('');
  const [amount, setAmount] = useState('');
  const [financeNote, setFinanceNote] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');

  const leadOptions = useMemo(() => {
    return leads.map(l => ({
      value: l.id,
      label: `${l.student_name} — ${l.contact_number || 'No phone'} (${l.status})`
    }));
  }, [leads]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotUrl(''); // Clear any old URL if they select a new file
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedLeadId) return alert('Please select a lead');
    if (!amount || Number(amount) <= 0) return alert('Please enter a valid amount');
    if (!screenshotFile && !screenshotUrl) return alert('Please upload a screenshot');

    setSaving(true);
    try {
      let finalUrl = screenshotUrl;

      if (screenshotFile) {
        setUploading(true);
        // 1. Get presigned URL
        const presignData = await apiFetch(`/upload/presigned-url`, {
          method: 'POST',
          body: JSON.stringify({
            filename: screenshotFile.name,
            contentType: screenshotFile.type
          })
        });

        // 2. Upload directly to R2/S3
        const uploadRes = await fetch(presignData.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': screenshotFile.type
          },
          body: screenshotFile
        });

        if (!uploadRes.ok) {
          setUploading(false);
          throw new Error('Failed to upload file to storage');
        }

        setUploading(false);
        finalUrl = presignData.publicUrl;
        setScreenshotUrl(finalUrl);
      }

      await apiFetch(`/leads/${selectedLeadId}/payment-request`, {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(amount),
          total_amount: Number(totalAmount) || null,
          hours: Number(hours) || null,
          screenshot_url: finalUrl,
          finance_note: financeNote || null
        })
      });
      alert('Payment request submitted!');
      onSuccess();
    } catch (err) {
      setUploading(false);
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}
        style={{ maxWidth: '440px', background: 'white', padding: '24px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>New Payment Request</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Lead Search/Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <SearchSelect
              label="Select Lead *"
              value={selectedLeadId}
              onChange={setSelectedLeadId}
              options={leadOptions}
              placeholder="Search and select a lead…"
            />
          </div>

          {/* Total Amount */}
          <label style={{ fontSize: '13px', fontWeight: 600 }}>
            Total Amount (₹) *
            <input
              type="number"
              min="1"
              step="0.01"
              value={totalAmount}
              onChange={e => setTotalAmount(e.target.value)}
              required
              placeholder="e.g. 15000"
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', marginTop: '4px' }}
            />
          </label>

          {/* Hours */}
          <label style={{ fontSize: '13px', fontWeight: 600 }}>
            Hours *
            <input
              type="number"
              min="1"
              step="0.5"
              value={hours}
              onChange={e => setHours(e.target.value)}
              required
              placeholder="e.g. 24"
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', marginTop: '4px' }}
            />
          </label>

          {/* Paid Amount */}
          <label style={{ fontSize: '13px', fontWeight: 600 }}>
            Paid Amount (₹) *
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              placeholder="e.g. 5000"
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', marginTop: '4px' }}
            />
          </label>

          {/* Screenshot Upload */}
          <label style={{ fontSize: '13px', fontWeight: 600 }}>
            Payment Screenshot *
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!screenshotFile && !screenshotUrl}
              style={{ width: '100%', padding: '8px 0', fontSize: '13px', marginTop: '4px' }}
            />
            {screenshotFile && !uploading && <p style={{ fontSize: '12px', color: '#15803d', margin: '4px 0 0' }}>✅ File selected: {screenshotFile.name}</p>}
            {uploading && <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>Uploading screenshot…</p>}
          </label>

          {/* Finance Note */}
          <label style={{ fontSize: '13px', fontWeight: 600 }}>
            Finance Note
            <textarea
              value={financeNote}
              onChange={e => setFinanceNote(e.target.value)}
              placeholder="Optional note for finance team…"
              rows={2}
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px', marginTop: '4px', resize: 'vertical' }}
            />
          </label>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="secondary" style={{ fontSize: '13px' }}>Cancel</button>
            <button type="submit" className="primary" disabled={saving || uploading || (!screenshotFile && !screenshotUrl)} style={{ fontSize: '13px' }}>
              {saving || uploading ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
