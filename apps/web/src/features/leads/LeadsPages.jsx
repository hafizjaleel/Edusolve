import { useEffect, useMemo, useState, useCallback } from 'react';
import { apiFetch } from '../../lib/api.js';
import { getSession } from '../../lib/auth.js';
import { AddLeadModal } from './components/AddLeadModal.jsx';
import { GenerateInvoiceModal, ReceiptModal } from '../finance/InvoiceTemplate.jsx';

import { LeadFilters } from './components/LeadFilters.jsx';
import { SearchSelect } from '../../components/ui/SearchSelect.jsx';
import { CreatableSelect } from '../../components/ui/CreatableSelect.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';

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

export const STUDENT_LEAD_NOTES = {
  new: ["Ringing, not picked up", "Switched off", "Call back later", "Busy", "Not reachable"],
  contacted: ["Asked to send details on WhatsApp", "Not interested right now", "Needs discussion with parents", "Wrong number"],
  demo_scheduled: ["Student requested reschedule", "Teacher unavailable", "Reminded about demo"],
  demo_done: ["Waiting for feedback", "Not completely satisfied", "Reviewing with parents"],
  payment_pending: ["Requested more time", "Payment link sent again", "Waiting for salary"],
  payment_verification: ["Document sent to finance", "Checking transaction ID"],
  joined: ["Onboarding complete"],
  dropped: ["Invalid number"]
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

function useLeads(scope, limit = 20) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function refresh(currentPage = page) {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`/leads?scope=${scope}&page=${currentPage}&limit=${limit}`);
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    refresh(page);
  }, [scope, page]);

  return { items, total, page, setPage, limit, loading, error, refresh };
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

function getRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

function MobileLeadCard({ lead, counselorMap, onOpenDetails, onViewInPipeline, onDrop, isCounselor, isSelected, onToggleSelect }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="card list-mobile-card"
      style={{ padding: '16px', position: 'relative', marginBottom: '0', border: (!isCounselor && isSelected) ? '2px solid #3b82f6' : '1px solid #e5e7eb', background: lead.counselor_id ? '#fff' : '#fffbeb' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, paddingRight: 8, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          {!isCounselor && (
            <div style={{ marginTop: '2px' }} onClick={e => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(lead.id)}
                style={{ width: '16px', height: '16px' }}
              />
            </div>
          )}
          <div onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', flex: 1 }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#2563eb' }}>
              {lead.student_name}
            </h4>
            <div style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
              {lead.contact_number || '-'} • {getRelativeTime(lead.created_at)}
            </div>
          </div>
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', cursor: 'pointer' }}
          onClick={() => setExpanded(!expanded)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StatusBadge status={lead.status} />
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', color: '#6b7280',
              transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, paddingRight: '32px' }}>{lead.class_level || '-'}</span>
            {!isCounselor && (
              <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 600, paddingRight: '32px' }}>
                {counselorMap[lead.counselor_id] || 'Unassigned'}
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '12px', animation: 'fadeIn 0.2s ease-in' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
            <div><span style={{ color: '#888' }}>Type:</span> <div style={{ fontWeight: 500 }}>{lead.lead_type || '-'}</div></div>
            {!isCounselor && (
              <div><span style={{ color: '#888' }}>Assigned:</span> <div style={{ fontWeight: 500 }}>{counselorMap[lead.counselor_id] || <span className="text-dim">Unassigned</span>}</div></div>
            )}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {isCounselor && onViewInPipeline && (
              <button type="button" className="secondary small" onClick={() => onViewInPipeline(lead.id, lead.status)} style={{ padding: '4px 8px' }}>
                📋 Pipeline
              </button>
            )}
            <button type="button" className="primary small" onClick={() => onOpenDetails(lead.id)}>View Form</button>
            {lead.status !== 'dropped' && lead.status !== 'joined' && (
              <button type="button" className="danger small" onClick={() => onDrop(lead)}>Drop</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AllLeadsPage({ onOpenDetails, onViewInPipeline, selectedLeadId }) {
  const session = getSession();
  const user = session?.user;
  const { items, total, page, setPage, limit, loading, error, refresh } = useLeads('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', counselorId: '' });
  const [assignCounselorId, setAssignCounselorId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [leadTab, setLeadTab] = useState(user?.role === 'counselor' ? 'all' : 'new'); // 'new', 'assigned', 'all'
  const [showDropModal, setShowDropModal] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(null);
  const [noteFilter, setNoteFilter] = useState('all');

  useEffect(() => {
    apiFetch('/counselors').then(data => setCounselors(data.items || [])).catch(() => { });
  }, []);

  const counselorMap = useMemo(() => {
    const map = {};
    counselors.forEach(c => map[c.id] = c.full_name || c.email);
    return map;
  }, [counselors]);

  // Tab-based filtering
  const tabbedItems = useMemo(() => {
    if (leadTab === 'unassigned') return items.filter(i => !i.counselor_id || !counselorMap[i.counselor_id]);
    if (leadTab === 'assigned') return items.filter(i => i.counselor_id && counselorMap[i.counselor_id]);
    // 'all': unassigned first, then assigned
    const unassigned = items.filter(i => !i.counselor_id || !counselorMap[i.counselor_id]);
    const assigned = items.filter(i => i.counselor_id && counselorMap[i.counselor_id]);
    return [...unassigned, ...assigned];
  }, [items, leadTab, counselorMap]);

  const unassignedCount = useMemo(() => items.filter(i => !i.counselor_id || !counselorMap[i.counselor_id]).length, [items, counselorMap]);
  const assignedCount = useMemo(() => items.filter(i => i.counselor_id && counselorMap[i.counselor_id]).length, [items, counselorMap]);

  // Client-side filtering
  const filteredItems = useMemo(() => {
    return tabbedItems.filter(item => {
      const searchLower = filters.search.toLowerCase();
      // Only exact matches for ID when searching, otherwise partial matches on names/phones work
      const matchSearch = !filters.search ||
        item.student_name.toLowerCase().includes(searchLower) ||
        (item.parent_name || '').toLowerCase().includes(searchLower) ||
        (item.contact_number || '').includes(filters.search) ||
        (item.id === filters.search.trim());
      const matchStatus = !filters.status || item.status === filters.status;
      const matchCounselor = !filters.counselorId || item.counselor_id === filters.counselorId;

      let matchNote = true;
      if (noteFilter !== 'all') {
        if (noteFilter === 'none') matchNote = !item.current_note;
        else if (noteFilter === 'other') matchNote = item.current_note && !(STUDENT_LEAD_NOTES[item.status] || []).includes(item.current_note);
        else matchNote = item.current_note === noteFilter;
      }

      return matchSearch && matchStatus && matchCounselor && matchNote;
    });
  }, [tabbedItems, filters, noteFilter]);

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
      {/* All / Unassigned / Assigned Tabs — visible to counselor_head and above */}
      {user?.role !== 'counselor' ? (
        <div className="tabs-row" style={{ marginBottom: 16 }}>
          {[
            { id: 'all', label: 'All', count: items.length },
            { id: 'unassigned', label: 'Unassigned', count: unassignedCount },
            { id: 'assigned', label: 'Assigned', count: assignedCount },
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${leadTab === tab.id ? 'active' : ''}`}
              onClick={() => { setLeadTab(tab.id); setSelectedIds([]); }}
            >
              {tab.label}
              <span style={{
                marginLeft: 6, fontSize: 11, fontWeight: 700,
                background: leadTab === tab.id ? 'rgba(255,255,255,0.25)' : (tab.id === 'unassigned' && unassignedCount > 0 ? '#fee2e2' : 'var(--surface-soft)'),
                color: leadTab === tab.id ? '#fff' : (tab.id === 'unassigned' && unassignedCount > 0 ? 'var(--danger)' : 'var(--muted)'),
                borderRadius: 99, padding: '1px 7px'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <LeadFilters
        onFilterChange={setFilters}
        counselors={counselors}
        userRole={user?.role}
        actionButton={<button onClick={() => setShowAddModal(true)} className="primary" style={{ whiteSpace: 'nowrap' }}>+ Add Lead</button>}
      >
        {filters.status && filters.status !== 'dropped' && filters.status !== 'joined' && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
              value={noteFilter}
              onChange={e => setNoteFilter(e.target.value)}
              className="filter-toggle-btn"
              style={{ paddingRight: '28px', appearance: 'none', outline: 'none', background: 'white' }}
            >
              <option value="all">Note: All</option>
              <option value="none">Note: None</option>
              {(STUDENT_LEAD_NOTES[filters.status] || []).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="other">Note: Other</option>
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px', color: 'var(--primary)' }}>▼</span>
          </div>
        )}
      </LeadFilters>

      {loading ? <p>Loading leads...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <article className="card desktop-only">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {user?.role !== 'counselor' && (
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
                )}
                <th>Name</th>
                <th>Phone</th>
                <th>Class</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                {user?.role !== 'counselor' ? (
                  <th>Assigned To</th>
                ) : null}
                {filters.status === 'joined' && (
                  <th>Assigned Coordinator</th>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((lead) => (
                <tr key={lead.id}
                  className={selectedIds.includes(lead.id) && user?.role !== 'counselor' ? 'selected-row' : ''}
                  style={leadTab === 'all' && (!lead.counselor_id || !counselorMap[lead.counselor_id]) ? { background: '#fffbeb' } : undefined}
                >
                  {user?.role !== 'counselor' && (
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
                  )}
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
                  <td style={{ whiteSpace: 'nowrap', color: '#6b7280', fontSize: '13px' }}>{getRelativeTime(lead.created_at)}</td>
                  {user?.role !== 'counselor' ? (
                    <td>{counselorMap[lead.counselor_id] || <span className="text-dim">Unassigned</span>}</td>
                  ) : null}
                  {filters.status === 'joined' && (
                    <td>{lead.students?.users?.full_name || lead.students?.users?.email || '-'}</td>
                  )}
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
                    {lead.status !== 'dropped' && lead.status !== 'joined' && (
                      <button type="button" className="danger small" onClick={() => setShowDropModal(lead)}>Drop</button>
                    )}
                  </td>
                </tr>
              ))}
              {!filteredItems.length ? (
                <tr><td colSpan="8">No matching leads found.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
        {!loading && total > 0 && (
          <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
        )}
      </article>

      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {/* Mobile Select All */}
        {user?.role !== 'counselor' && filteredItems.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px', marginBottom: '4px' }}>
            <input
              type="checkbox"
              checked={selectedIds.length === filteredItems.length}
              onChange={(e) => {
                if (e.target.checked) setSelectedIds(filteredItems.map(i => i.id));
                else setSelectedIds([]);
              }}
              style={{ width: '16px', height: '16px' }}
              id="mobile-select-all"
            />
            <label htmlFor="mobile-select-all" style={{ fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>Select All ({filteredItems.length})</label>
          </div>
        )}

        {filteredItems.map(lead => (
          <MobileLeadCard
            key={lead.id}
            lead={lead}
            counselorMap={counselorMap}
            onOpenDetails={onOpenDetails}
            onViewInPipeline={onViewInPipeline}
            onDrop={(lead) => setShowDropModal(lead)}
            isCounselor={user?.role === 'counselor'}
            isSelected={selectedIds.includes(lead.id)}
            onToggleSelect={(id) => {
              if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
              else setSelectedIds([...selectedIds, id]);
            }}
          />
        ))}
        {!filteredItems.length && !loading && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>No matching leads found.</div>
        )}
        {!loading && total > 0 && (
          <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
        )}
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

      {showDropModal && (
        <DropLeadModal
          lead={showDropModal}
          onClose={() => setShowDropModal(null)}
          onDone={() => { setShowDropModal(null); refresh(); }}
        />
      )}

      {showNoteModal && (
        <StudentLeadNoteModal
          lead={showNoteModal}
          onClose={() => setShowNoteModal(null)}
          onDone={() => { setShowNoteModal(null); refresh(); }}
        />
      )}

    </section>
  );
}

/* ─── Student Lead Note Modal ─── */
function StudentLeadNoteModal({ lead, onClose, onDone }) {
  const [note, setNote] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [saving, setSaving] = useState(false);

  const predefinedNotes = STUDENT_LEAD_NOTES[lead?.status] || [];

  async function handleSubmit(e) {
    e.preventDefault();
    const finalNote = note === 'other' ? customNote : note;
    if (!finalNote) return alert('Please select or enter a note.');

    setSaving(true);
    try {
      await apiFetch(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ current_note: finalNote })
      });
      onDone();
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
          <h3 style={{ margin: 0 }}>Add Note: {lead.student_name}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label>
            <span style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Select Note</span>
            <select
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              autoFocus
            >
              <option value="">-- Select Note --</option>
              {predefinedNotes.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="other">Other...</option>
            </select>
          </label>

          {note === 'other' && (
            <label>
              <span style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Custom Note</span>
              <textarea
                value={customNote}
                onChange={e => setCustomNote(e.target.value)}
                autoFocus
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '80px' }}
                placeholder="Enter custom note..."
              />
            </label>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="secondary" disabled={saving}>Cancel</button>
            <button type="submit" className="primary" disabled={saving}>{saving ? 'Saving...' : 'Save Note'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Drop Lead Modal ─── */
function DropLeadModal({ lead, onClose, onDone }) {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [reasonsList, setReasonsList] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch('/leads/drop-reasons').then(r => {
      if (r.ok) setReasonsList(r.reasons || []);
    }).catch(e => console.error(e));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const finalReason = reason === 'other' ? customReason : reason;
    if (!finalReason) return alert('Please select or enter a reason for dropping the lead.');

    setSaving(true);
    try {
      await apiFetch(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'dropped', drop_reason: finalReason })
      });
      onDone();
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
          <h3 style={{ margin: 0 }}>Drop Lead: {lead.student_name}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label>
            Reason for dropping:
            <select
              value={reason}
              onChange={e => { setReason(e.target.value); setCustomReason(''); }}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              required
            >
              <option value="">Select a reason</option>
              {reasonsList.map(r => (
                <option key={r.reason} value={r.reason}>{r.reason}</option>
              ))}
              <option value="other">Other (please specify)</option>
            </select>
          </label>

          {reason === 'other' && (
            <label>
              Custom Reason:
              <textarea
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '80px' }}
                placeholder="Enter custom reason"
                required
              />
            </label>
          )}

          <button type="submit" className="danger" disabled={saving} style={{ marginTop: '8px' }}>
            {saving ? 'Dropping...' : 'Confirm Drop'}
          </button>
        </form>
      </div>
    </div>
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

  // Generate 15-min time slots 06:00–00:00 (midnight)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 6; h <= 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = String(h).padStart(2, '0');
        const min = String(m).padStart(2, '0');
        slots.push(`${hour}:${min}`);
      }
    }
    slots.push('24:00'); // Midnight
    return slots;
  }, []);

  // Format 24h time to 12h AM/PM for display
  const format12h = (t) => {
    if (t === '24:00') return '12:00 AM';
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  };

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
      if (slotMins >= cStart && slotMins < cEnd) {
        const typeLabel = c.type === 'class' ? 'Class' : 'Demo';
        return `${typeLabel}: ${c.studentName}`;
      }
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
            studentName: b.student_name || 'another lead',
            type: b.type || 'demo'
          };
        }));
      })
      .catch(() => setConflictSlots([]))
      .finally(() => setCheckingConflict(false));
  }, [selectedTeacherId, date]);

  const teacherOptions = useMemo(() => {
    let filtered = teachers;
    if (subject) {
      filtered = teachers.filter(t => {
        const subjects = t.subjects_taught;
        if (Array.isArray(subjects)) return subjects.some(s => s.toLowerCase() === subject.toLowerCase());
        if (typeof subjects === 'string') return subjects.toLowerCase().includes(subject.toLowerCase());
        return false;
      });
    }
    return filtered.map(t => ({
      value: t.id,
      label: `${t.users?.full_name || t.full_name || 'Unknown'} (${t.teacher_code || 'N/A'})`
    }));
  }, [teachers, subject]);

  // Reset teacher selection when subject changes
  useEffect(() => {
    setSelectedTeacherId('');
    setConflictSlots([]);
  }, [subject]);

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
      if (selStart < cEnd && selEnd > cStart) {
        const typeLabel = c.type === 'class' ? 'Class' : 'Demo';
        return `${typeLabel} with ${c.studentName} (${String(c.startH).padStart(2, '0')}:${String(c.startM).padStart(2, '0')}–${String(c.endH).padStart(2, '0')}:${String(c.endM).padStart(2, '0')})`;
      }
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
          reason: `Demo scheduled with ${teacherName} for ${subject} on ${date} ${format12h(startTime)}-${format12h(endTime)}`
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
                      {format12h(t)}{conflict ? ` ⚠ ${conflict}` : past ? ' (past)' : ''}
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
                      {format12h(t)}{conflict ? ` ⚠ ${conflict}` : past ? ' (past)' : ''}
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
  if (current === 'dropped' || current === 'joined') return null;
  const idx = STATUS_STEPS.indexOf(current);
  if (idx === -1 || idx >= STATUS_STEPS.length - 1) return null;
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
function StudentLeadCard({ lead, onStatusChange, onDrop, onView, onVerifyPayment, onAddNote }) {
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
            {lead.current_note && (
              <div style={{ gridColumn: '1 / -1', background: '#fef9c3', borderLeft: '3px solid #eab308', padding: '6px 10px', marginTop: '4px', borderRadius: '4px' }}>
                <span className="text-muted" style={{ display: 'block', fontSize: '11px' }}>Current Note</span>
                <p style={{ margin: '2px 0 0', fontWeight: 500, color: '#854d0e', fontSize: '12px' }}>{lead.current_note}</p>
              </div>
            )}
            {lead.status === 'dropped' && lead.drop_reason ? (
              <div>
                <span className="text-muted">Drop Reason</span>
                <p style={{ margin: '2px 0 0', fontWeight: 600, color: '#dc2626' }}>{lead.drop_reason}</p>
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
            lead.status === 'demo_done' ? (
              <>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="small secondary" style={{ flex: 1, fontSize: '12px' }}
                    onClick={() => onStatusChange(lead.id, 'demo_scheduled')}>
                    📅 Another Demo
                  </button>
                  <button className="small secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                    onClick={() => onView(lead.id)}>
                    <Icon d={ICONS.eye} size={14} /> View
                  </button>
                  <button type="button" className="small secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                    onClick={(e) => { e.stopPropagation(); onAddNote && onAddNote(lead); }}>
                    📝 Note
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                    onClick={() => onStatusChange(lead.id, 'payment_pending')}>
                    💰 Requested payment
                  </button>
                  <button className="small danger" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                    onClick={() => onDrop(lead)}>
                    <Icon d={ICONS.x} size={12} /> Drop
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {lead.status === 'payment_pending' ? (
                  <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                    onClick={() => onVerifyPayment && onVerifyPayment(lead.id)}>
                    ⏳ Verify Payment
                  </button>
                ) : nextStatus && lead.status !== 'payment_verification' ? (
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
                <button type="button" className="small secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                  onClick={(e) => { e.stopPropagation(); onAddNote && onAddNote(lead); }}>
                  📝 Note
                </button>
                <button className="small danger" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                  onClick={() => onDrop(lead)}>
                  <Icon d={ICONS.x} size={12} /> Drop
                </button>
              </div>
            )
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="small secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', flex: 1 }}
                onClick={() => onView(lead.id)}>
                <Icon d={ICONS.eye} size={14} /> View Details
              </button>
              {lead.status === 'dropped' && (
                <button className="small primary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', flex: 1 }}
                  onClick={() => onStatusChange(lead.id, 'new')}>
                  Restore to New
                </button>
              )}
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
  const [showDropModal, setShowDropModal] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(null);
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [rejectionFilter, setRejectionFilter] = useState('all');
  const [noteFilter, setNoteFilter] = useState('all');

  useEffect(() => {
    apiFetch('/leads/drop-reasons').then(r => {
      if (r.ok) setRejectionReasons(r.reasons || []);
    }).catch(e => console.error(e));
  }, []);

  // Reset note filter when changing tabs
  useEffect(() => {
    setNoteFilter('all');
  }, [activeTab]);

  const STATUS_STEPS = ['new', 'contacted', 'demo_scheduled', 'demo_done', 'payment_pending', 'payment_verification', 'joined'];

  /* Helper functions removed as they are now top-level */

  async function handleStatusChange(leadId, newStatus) {
    if (newStatus === 'dropped') {
      const lead = items.find(l => l.id === leadId);
      if (lead) setShowDropModal(lead);
      return;
    }
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

  function handleDrop(lead) {
    setShowDropModal(lead);
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


  const filteredItems = items.filter(l => {
    if (activeTab !== 'all' && l.status !== activeTab) return false;
    if (activeTab === 'dropped' && rejectionFilter !== 'all') {
      return l.drop_reason === rejectionFilter;
    }
    if (activeTab !== 'dropped' && activeTab !== 'all' && activeTab !== 'joined' && noteFilter !== 'all') {
      if (noteFilter === 'none') return !l.current_note;
      if (noteFilter === 'other') return l.current_note && !(STUDENT_LEAD_NOTES[activeTab] || []).includes(l.current_note);
      return l.current_note === noteFilter;
    }
    return true;
  });

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
      if (newStatus === 'demo_done') {
        if (!window.confirm("Are you sure you want to mark this demo as done?")) return;
      }
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
      {showNoteModal && (
        <StudentLeadNoteModal
          lead={showNoteModal}
          onClose={() => setShowNoteModal(null)}
          onDone={() => { setShowNoteModal(null); refresh(); }}
        />
      )}
      {showDropModal && (
        <DropLeadModal
          lead={showDropModal}
          onClose={() => setShowDropModal(null)}
          onDone={() => { setShowDropModal(null); refresh(); }}
        />
      )}

      {activeTab === 'dropped' ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
              value={rejectionFilter}
              onChange={e => setRejectionFilter(e.target.value)}
              className="filter-toggle-btn"
              style={{ paddingRight: '28px', appearance: 'none', outline: 'none', background: 'white' }}
            >
              <option value="all">Drop Reason: All</option>
              {rejectionReasons.map(r => (
                <option key={r.reason} value={r.reason}>{r.reason}</option>
              ))}
              <option value="other">Drop Reason: Other</option>
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px', color: 'var(--primary)' }}>▼</span>
          </div>
        </div>
      ) : activeTab !== 'all' && activeTab !== 'joined' ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
              value={noteFilter}
              onChange={e => setNoteFilter(e.target.value)}
              className="filter-toggle-btn"
              style={{ paddingRight: '28px', appearance: 'none', outline: 'none', background: 'white' }}
            >
              <option value="all">Note: All</option>
              <option value="none">Note: None</option>
              {(STUDENT_LEAD_NOTES[activeTab] || []).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="other">Note: Other</option>
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px', color: 'var(--primary)' }}>▼</span>
          </div>
        </div>
      ) : null}

      <div className="tabs-row" style={{ marginTop: 0, marginBottom: '16px', flexWrap: 'wrap', borderBottom: '1px solid #e5e7eb', gap: '16px' }}>
        {TABS.map(tab => {
          const count = items.filter(i => tab.id === 'all' || i.status === tab.id).length;
          const statusColors = {
            all: '#6b7280',
            new: '#6366f1',
            contacted: '#8b5cf6',
            demo_scheduled: '#f59e0b',
            demo_done: '#8b5cf6',
            payment_pending: '#ec4899',
            payment_verification: '#06b6d4',
            joined: '#10b981',
            dropped: '#ef4444'
          };
          const color = statusColors[tab.id] || '#6b7280';
          const isActive = activeTab === tab.id;

          let shortLabel = tab.label;
          if (tab.id === 'payment_pending') shortLabel = 'Pay Pending';
          if (tab.id === 'payment_verification') shortLabel = 'Pay Verif';
          if (tab.id === 'demo_scheduled') shortLabel = 'Demo Sched';

          return (
            <button
              key={tab.id}
              className={`text-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}
            >
              <span>
                <span className="hide-mobile">{tab.label}</span>
                <span className="show-mobile-inline">{shortLabel}</span>
              </span>
              <span style={{
                background: isActive ? color : `${color}20`,
                color: isActive ? '#fff' : color,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                minWidth: '24px',
                textAlign: 'center'
              }}>
                {count}
              </span>
            </button>
          );
        })}
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
              onAddNote={(lead) => setShowNoteModal(lead)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Demo History Section (reusable) ─── */
function DemoHistorySection({ leadId }) {
  const [demos, setDemos] = useState([]);
  const [loadingDemos, setLoadingDemos] = useState(true);

  useEffect(() => {
    if (!leadId) return;
    setLoadingDemos(true);
    apiFetch(`/leads/${leadId}/demos`)
      .then(res => setDemos(res.items || []))
      .catch(() => setDemos([]))
      .finally(() => setLoadingDemos(false));
  }, [leadId]);

  if (loadingDemos) return <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '16px' }}>Loading demo history...</p>;
  if (!demos.length) return null;

  const statusStyle = (status) => ({
    padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
    background: status === 'done' ? '#dcfce7' : status === 'scheduled' ? '#fef3c7' : '#f3f4f6',
    color: status === 'done' ? '#15803d' : status === 'scheduled' ? '#d97706' : '#6b7280',
    textTransform: 'capitalize'
  });

  return (
    <>
      <div style={{ height: '1px', background: '#e5e7eb', margin: '24px 0' }} />
      <div className="flex-between">
        <h3 style={{ margin: 0 }}>Demo History ({demos.length})</h3>
      </div>
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {demos.map((d, i) => (
          <div key={d.id} style={{
            padding: '12px 16px', borderRadius: '8px',
            background: i === demos.length - 1 ? '#eff6ff' : '#f9fafb',
            border: `1px solid ${i === demos.length - 1 ? '#bfdbfe' : '#e5e7eb'}`,
            display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'center'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: d.status === 'done' ? '#dcfce7' : '#fef3c7',
              color: d.status === 'done' ? '#15803d' : '#d97706',
              fontWeight: 700, fontSize: '13px'
            }}>
              #{d.demo_number || i + 1}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                {d.subject || 'No subject'} — {d.teacher_name || 'Unknown Teacher'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                {d.scheduled_at
                  ? new Date(d.scheduled_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
                  : 'Not scheduled'}
                {d.ends_at && ` — ${new Date(d.ends_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}`}
              </div>
            </div>
            <span style={statusStyle(d.status)}>{d.status}</span>
          </div>
        ))}
      </div>
    </>
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
  const [showNoteModal, setShowNoteModal] = useState(null);

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
    const restricted = ['demo_scheduled', 'payment_verification', 'joined', 'dropped'];
    if (restricted.includes(newStatus)) {
      if (newStatus === 'dropped') {
        // Wait, handle custom dropped logic if we were using it here. For now, block it if it isn't via the modal.
      } else {
        return alert(`Cannot manually change status to ${newStatus.replace('_', ' ')} from here.`);
      }
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

                  if (step === 'dropped') {
                    // Cannot easily open modal from here cleanly without refactoring lead details. 
                    // Better to just alert to use the list view.
                    return alert('Please drop the lead from the My Leads pipeline view to provide a reason.');
                  }

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
                {lead.current_note && (
                  <div style={{ gridColumn: '1 / -1', background: '#fef9c3', borderLeft: '3px solid #eab308', padding: '10px 14px', borderRadius: '4px' }}>
                    <label style={{ fontSize: '11px', color: '#854d0e', marginBottom: '4px' }}>Current Note</label>
                    <p style={{ margin: 0, fontWeight: 500, color: '#a16207', fontSize: '13px' }}>{lead.current_note}</p>
                  </div>
                )}
                <div>
                  <label>Contact</label>
                  <p>{lead.contact_number || '-'}</p>
                </div>
                <div>
                  <label>Email</label>
                  <p>{lead.email || '-'}</p>
                </div>
                {lead.status === 'dropped' && (
                  <div>
                    <label>Drop Reason</label>
                    <p style={{ color: '#dc2626', fontWeight: 600 }}>{lead.drop_reason || '-'}</p>
                  </div>
                )}
                {lead.status === 'joined' && (
                  <div>
                    <label>Assigned Coordinator</label>
                    <p style={{ color: '#059669', fontWeight: 600 }}>{lead.students?.users?.full_name || lead.students?.users?.email || 'Unassigned'}</p>
                  </div>
                )}
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

              {/* Demo History Section */}
              <DemoHistorySection leadId={leadId} />
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
                    {item.created_at ? new Date(item.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, dateStyle: 'short', timeStyle: 'short' }) : '-'}
                  </p>
                  {isStatusChange && item.reason ? <p className="muted">{item.reason}</p> : null}
                </div>
              );
            })}
            {!history.length ? <p>No timeline updates yet.</p> : null}
          </div>
        </article>
      ) : null}

      {showNoteModal && (
        <StudentLeadNoteModal
          lead={showNoteModal}
          onClose={() => setShowNoteModal(null)}
          onDone={() => { setShowNoteModal(null); window.location.reload(); /* Dirty reload for detail view simplicity */ }}
        />
      )}
    </section>
  );
}

/* ═══════ Converted Leads Page (Counselor Head Only) ═══════ */
function MobileConvertedLeadCard({ lead, assignedMap, isSelected, onToggleSelect }) {
  const [expanded, setExpanded] = useState(false);
  const assignedStr = lead.ac_user?.full_name || lead.ac_user?.email || assignedMap[lead.id];

  return (
    <div className="card list-mobile-card" style={{ padding: '16px', position: 'relative', marginBottom: '0', border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb', background: assignedStr ? '#fff' : '#fffbeb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, paddingRight: 8, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <div style={{ marginTop: '2px' }} onClick={e => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              disabled={!!assignedStr}
              onChange={() => onToggleSelect(lead.id)}
              style={{ width: '16px', height: '16px' }}
            />
          </div>
          <div onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', flex: 1 }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#2563eb' }}>
              {lead.student_name}
            </h4>
            <div style={{ margin: 0, fontSize: '12px', color: '#4338ca', fontWeight: 600 }}>
              {lead.student_code || '—'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {assignedStr ? (
              <span style={{ padding: '4px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#15803d', whiteSpace: 'nowrap' }}>
                ✅ {assignedStr}
              </span>
            ) : (
              <span style={{ padding: '4px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: '#fef3c7', color: '#b45309', whiteSpace: 'nowrap' }}>
                Unassigned
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', color: '#6b7280', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '12px', animation: 'fadeIn 0.2s ease-in' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
            <div><span style={{ color: '#888' }}>Contact:</span> <div style={{ fontWeight: 500 }}>{lead.contact_number || '-'}</div></div>
            <div><span style={{ color: '#888' }}>Class:</span> <div style={{ fontWeight: 500 }}>{lead.class_level || '-'}</div></div>
            <div><span style={{ color: '#888' }}>Closed By:</span> <div style={{ fontWeight: 500 }}>{lead.counselor?.full_name || lead.counselor?.email || '-'}</div></div>
            <div><span style={{ color: '#888' }}>Joined Date:</span> <div style={{ fontWeight: 500 }}>{lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ConvertedLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [acs, setAcs] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [leadTypes, setLeadTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningId, setAssigningId] = useState(null);
  const [selectedAc, setSelectedAc] = useState({});
  const [assignedMap, setAssignedMap] = useState({});
  const [search, setSearch] = useState('');

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [counselorFilter, setCounselorFilter] = useState('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState('all');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAcId, setBulkAcId] = useState('');
  const [bulkAssigning, setBulkAssigning] = useState(false);
  const [tab, setTab] = useState('all'); // 'unassigned' | 'all'

  // Load initial dropdowns
  useEffect(() => {
    Promise.all([
      apiFetch('/leads/academic-coordinators'),
      apiFetch('/leads/counselors'),
      apiFetch('/leads/types')
    ]).then(([acsRes, counsRes, typeRes]) => {
      setAcs(acsRes.items || []);
      setCounselors(counsRes.items || []);
      setLeadTypes(typeRes.types || []);
    }).catch(console.error);
  }, []);

  // Load leads based on page and filters
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const query = new URLSearchParams({ scope: 'joined', page, limit });
        if (counselorFilter !== 'all') query.set('counselor_id', counselorFilter);
        if (leadTypeFilter !== 'all') query.set('lead_type', leadTypeFilter);

        const leadsRes = await apiFetch(`/leads?${query.toString()}`);
        const fetchedLeads = leadsRes.items || [];

        setLeads(fetchedLeads);
        setTotal(leadsRes.total || 0);

        // Prepopulate assigned map from backend `students` relation
        const initialAssignedMap = {};
        for (const lead of fetchedLeads) {
          if (lead.students?.users) {
            initialAssignedMap[lead.id] = lead.students.users.full_name || lead.students.users.email;
          }
        }
        setAssignedMap(initialAssignedMap);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, counselorFilter, leadTypeFilter]);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'nowrap', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
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
            All
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', flexShrink: 0 }}>
          <select
            value={counselorFilter}
            onChange={e => { setCounselorFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px' }}
          >
            <option value="all">All Counselors</option>
            {counselors.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>
          <select
            value={leadTypeFilter}
            onChange={e => { setLeadTypeFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px' }}
          >
            <option value="all">All Lead Types</option>
            {leadTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="text"
            placeholder="Search by name or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '220px', padding: '8px 12px' }}
          />
        </div>
      </div>

      {loading ? <p>Loading joined leads…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && (
        <>
          {/* Desktop Table */}
          <div className="card desktop-only">
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

          {/* Mobile expandable cards */}
          <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {filtered.length > 0 && selectableIds.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px', marginBottom: '4px' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  style={{ width: '16px', height: '16px' }}
                  id="mobile-select-all-converted"
                />
                <label htmlFor="mobile-select-all-converted" style={{ fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>Select All Unassigned</label>
              </div>
            )}
            {filtered.map(lead => (
              <MobileConvertedLeadCard
                key={lead.id}
                lead={lead}
                assignedMap={assignedMap}
                isSelected={selectedIds.includes(lead.id)}
                onToggleSelect={toggleOne}
              />
            ))}
            {!filtered.length && (
              <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>No leads found.</div>
            )}
          </div>
        </>
      )}

      {/* Pagination component */}
      {!loading && total > limit && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}>
          <button className="secondary small" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted)' }}>Page {page} of {Math.ceil(total / limit)}</span>
          <button className="secondary small" disabled={page * limit >= total} onClick={() => setPage(page + 1)}>Next</button>
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
  const [activeTab, setActiveTab] = useState('demo_scheduled');
  const { items, total, page, setPage, limit, loading, error, refresh } = useLeads(`mine&status=${activeTab}`);
  const [teachers, setTeachers] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    apiFetch('/teachers/pool').then(d => setTeachers(d.items || [])).catch(() => { });
  }, []);

  const demoLeads = items; // Already filtered by backend
  // We don't know total counts for both tabs from one query, so we'll just show the total for the current tab.

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
    if (!window.confirm("Are you sure you want to mark this demo as done?")) return;
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
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
        {[
          { id: 'demo_scheduled', label: '⏳ Upcoming Demos' },
          { id: 'demo_done', label: '✅ History' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setPage(1); }}
            className={activeTab === t.id ? 'primary' : 'secondary'}
            style={{ fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            {t.label}
          </button>
        ))}
      </div>



      {loading ? <p>Loading demos...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {msg ? <p style={{ color: '#10b981', marginBottom: '12px' }}>{msg}</p> : null}

      <div className="card" style={{ padding: activeTab === 'demo_scheduled' ? 0 : '16px', background: activeTab === 'demo_scheduled' ? '#fff' : 'transparent', border: activeTab === 'demo_scheduled' ? undefined : 'none', boxShadow: activeTab === 'demo_scheduled' ? undefined : 'none' }}>
        {activeTab === 'demo_scheduled' ? (
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
                {!loading && demoLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                      <p style={{ fontSize: '28px', margin: '0 0 8px' }}>📅</p>
                      <p style={{ fontWeight: 500, margin: 0 }}>No demos in this category.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="demo-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {demoLeads.map(lead => {
              const teacherMatched = teachers.find(t => t.user_id === lead.demo_teacher_id || t.id === lead.demo_teacher_id);
              const teacherName = teacherMatched?.users?.full_name || lead.teacher_profiles?.users?.full_name || (lead.demo_teacher_id ? `ID: ${lead.demo_teacher_id.slice(0, 8)}` : 'Not Assigned');

              return (
                <ExpandableMobileCard
                  key={lead.id}
                  title={lead.student_name}
                  subtitle={lead.contact_number}
                  borderColor="#3b82f6"
                  topRight={
                    <span style={{
                      padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      background: '#3b82f618', color: '#3b82f6', textTransform: 'capitalize', whiteSpace: 'nowrap'
                    }}>
                      Demo Done
                    </span>
                  }
                  mainStats={
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="text-muted" style={{ fontSize: '11px' }}>Demo Date</span>
                        <span style={{ fontWeight: 500 }}>
                          {lead.demo_scheduled_at ? new Date(lead.demo_scheduled_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="text-muted" style={{ fontSize: '11px' }}>Subject</span>
                        <span style={{ fontWeight: 500 }}>{lead.subject || '—'}</span>
                      </div>
                    </>
                  }
                  expandedContent={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                        <span className="text-muted">Teacher</span>
                        <span style={{ fontWeight: 500 }}>{teacherName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-muted">Exact Time</span>
                        <span style={{ fontWeight: 500 }}>
                          {lead.demo_scheduled_at ? new Date(lead.demo_scheduled_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/ AM| PM/g, m => m.toLowerCase()) : '—'}
                        </span>
                      </div>
                    </div>
                  }
                />
              );
            })}
            {!loading && demoLeads.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px', background: '#fff', borderRadius: '12px' }}>
                <p style={{ fontSize: '28px', margin: '0 0 8px' }}>📜</p>
                <p style={{ fontWeight: 500, margin: 0 }}>No demo history found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination component */}
      {!loading && total > limit && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}>
          <button className="secondary small" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted)' }}>Page {page} of {Math.ceil(total / limit)}</span>
          <button className="secondary small" disabled={page * limit >= total} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

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

/* ═══════ Upload Installment Modal ═══════ */
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
          reference_type: item._type || 'payment_request',
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

  const studentName = item.leads?.student_name || item.students?.student_name || 'Student';
  const remaining = Number(item.remaining_amount || (Number(item.total_amount || 0) - Number(item.amount || 0)));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', padding: '24px', borderRadius: '10px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Upload Installment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>×</button>
        </div>
        <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px', background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
          Student: <strong>{studentName}</strong><br />
          Total: ₹{item.total_amount} &nbsp;|&nbsp; Paid: ₹{item.amount || 0} &nbsp;|&nbsp;
          <span style={{ color: '#dc2626', fontWeight: 700 }}>Remaining: ₹{remaining}</span>
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Amount (₹) *
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="1"
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

/* ═══════ Payment Requests Page ═══════ */

function ExpandableMobileCard({ title, subtitle, topRight, mainStats, expandedContent, actions }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card" style={{ padding: '16px', position: 'relative' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: expanded ? '12px' : '0' }}
      >
        <div>
          <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>{title || '—'}</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>📞 {subtitle || '—'}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          {topRight}
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', color: '#6b7280',
            transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
      </div>

      {!expanded && mainStats && (
        <div onClick={() => setExpanded(true)} style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '13px', cursor: 'pointer' }}>
          {mainStats}
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: '12px', animation: 'fadeIn 0.2s ease-in' }}>
          {expandedContent}
          {actions && <div style={{ marginTop: '16px' }}>{actions}</div>}
        </div>
      )}
    </div>
  );
}

export function PaymentRequestsPage({ initialLeadId, onReady }) {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const [leads, setLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [counselorFilter, setCounselorFilter] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [role, setRole] = useState('');
  const [pageView, setPageView] = useState('requests'); // 'requests' | 'pending'
  const [pendingBalances, setPendingBalances] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [showInstallmentModal, setShowInstallmentModal] = useState(null);
  const [myInstallments, setMyInstallments] = useState([]);
  const [loadingMyInstallments, setLoadingMyInstallments] = useState(false);
  const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState(null);

  useEffect(() => {
    if (initialLeadId && leads.length > 0) {
      setShowNewModal(true);
      if (onReady) onReady();
    }
  }, [initialLeadId, leads, onReady]);

  async function loadData(currentPage = page) {
    setLoading(true);
    try {
      const session = getSession();
      const userRole = session?.user?.role || '';
      setRole(userRole);

      const promises = [
        apiFetch(`/leads/payment-requests?page=${currentPage}&limit=${limit}`),
        apiFetch('/leads?scope=my').catch(() => ({ items: [] })),
        apiFetch('/leads/counselors').catch(() => ({ items: [] }))
      ];
      const [prRes, leadsRes, counselorsRes] = await Promise.all(promises);
      setRequests(prRes.items || []);
      setTotal(prRes.total || 0);
      setLeads((leadsRes.items || []).filter(l => !l.deleted_at));
      setCounselors(counselorsRes?.items || []);
    } catch (e) { alert(e.message); }
    setLoading(false);
  }

  useEffect(() => { loadData(page); }, [page]);

  const loadPendingBalances = useCallback(async () => {
    setLoadingPending(true);
    try {
      const data = await apiFetch('/finance/pending-balances');
      setPendingBalances((data.items || []).filter(it => it._type === 'payment_request'));
    } catch (e) { console.error(e); } finally { setLoadingPending(false); }
  });

  const loadMyInstallments = useCallback(async () => {
    setLoadingMyInstallments(true);
    try {
      const data = await apiFetch('/finance/my-installments');
      setMyInstallments((data.items || []).filter(it => it.reference_type === 'payment_request'));
    } catch (e) { console.error(e); } finally { setLoadingMyInstallments(false); }
  });

  useEffect(() => { if (pageView === 'pending') { loadPendingBalances(); loadMyInstallments(); } }, [pageView]);

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
      <div className="tabs-row" style={{ marginBottom: '8px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px' }}>
        {[{ key: 'requests', label: 'Payment Requests' }, { key: 'pending', label: 'Pending Payments' }].map(t => (
          <button key={t.key} type="button" className={`tab-btn ${pageView === t.key ? 'active' : ''}`} onClick={() => setPageView(t.key)} style={{ whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {pageView === 'pending' && (
        <div>
          {loadingPending ? <p>Loading...</p> : (
            <>
              <div className="card desktop-only">
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
                          <td style={{ fontWeight: 500 }}>{item.leads?.student_name || '—'}</td>
                          <td>{item.leads?.contact_number || '—'}</td>
                          <td>₹{Number(item.total_amount).toLocaleString('en-IN')}</td>
                          <td style={{ color: '#16a34a', fontWeight: 600 }}>₹{Number(item.amount || 0).toLocaleString('en-IN')}</td>
                          <td style={{ color: '#dc2626', fontWeight: 700 }}>₹{Number(item.remaining_amount).toLocaleString('en-IN')}</td>
                          <td>
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

              {/* Mobile Cards for Pending Balances */}
              <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingBalances.map(item => (
                  <ExpandableMobileCard
                    key={item.id}
                    title={item.leads?.student_name}
                    subtitle={item.leads?.contact_number}
                    mainStats={
                      <>
                        <div><span className="text-muted" style={{ fontSize: '11px' }}>Paid</span><br /><strong style={{ color: '#16a34a' }}>₹{Number(item.amount || 0).toLocaleString('en-IN')}</strong></div>
                        <div><span className="text-muted" style={{ fontSize: '11px' }}>Remaining</span><br /><strong style={{ color: '#dc2626' }}>₹{Number(item.remaining_amount).toLocaleString('en-IN')}</strong></div>
                      </>
                    }
                    expandedContent={
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                        <div><span className="text-muted" style={{ fontSize: '11px' }}>Total</span><br /><strong style={{ fontSize: '14px' }}>₹{Number(item.total_amount).toLocaleString('en-IN')}</strong></div>
                        <div><span className="text-muted" style={{ fontSize: '11px' }}>Paid</span><br /><strong style={{ color: '#16a34a', fontSize: '14px' }}>₹{Number(item.amount || 0).toLocaleString('en-IN')}</strong></div>
                        <div style={{ gridColumn: '1 / -1' }}><span className="text-muted" style={{ fontSize: '11px' }}>Remaining</span><br /><strong style={{ color: '#dc2626', fontSize: '14px' }}>₹{Number(item.remaining_amount).toLocaleString('en-IN')}</strong></div>
                      </div>
                    }
                    actions={
                      <button className="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setShowInstallmentModal(item); }}>Upload Installment</button>
                    }
                  />
                ))}
                {!pendingBalances.length && (
                  <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>No pending balances.</p>
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

          {/* Submitted Installments History */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700 }}>My Submitted Installments</h3>
            {loadingMyInstallments ? <p style={{ color: '#6b7280' }}>Loading...</p> : (
              <>
                <div className="table-wrap desktop-only">
                  <table className="data-table">
                    <thead><tr>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Note</th>
                      <th>Screenshot</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Doc</th>
                    </tr></thead>
                    <tbody>
                      {myInstallments.map(inst => {
                        const statusMap = {
                          pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending Verification' },
                          verified: { bg: '#dcfce7', color: '#15803d', label: '✅ Verified' },
                          rejected: { bg: '#fee2e2', color: '#dc2626', label: '❌ Rejected' }
                        };
                        const s = statusMap[inst.status] || { bg: '#f3f4f6', color: '#6b7280', label: inst.status };
                        return (
                          <tr key={inst.id}>
                            <td style={{ fontWeight: 500 }}>{inst.student_name}</td>
                            <td style={{ fontWeight: 700, color: '#15803d' }}>₹{Number(inst.amount).toLocaleString('en-IN')}</td>
                            <td style={{ fontSize: '12px', color: '#6b7280', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inst.finance_note || '—'}</td>
                            <td>{inst.screenshot_url ? <a href={inst.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#4338ca', fontSize: '12px' }}>View</a> : '—'}</td>
                            <td><span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span></td>
                            <td style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(inst.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td>
                              {inst.status === 'verified' && (
                                <button 
                                  onClick={() => setReceiptPayment({ leads: { student_name: inst.student_name, contact_number: '—' }, amount: inst.amount, total_amount: inst.amount, hours: null, finance_note: inst.finance_note, created_at: inst.created_at, updated_at: inst.created_at, id: inst.id })}
                                  style={{ fontSize: '11px', padding: '3px 10px', background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
                                >🧾 Receipt</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {!myInstallments.length && (
                        <tr><td colSpan="7" style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>No installments submitted yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards for My Installments */}
                <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {myInstallments.map(inst => {
                    const statusMap = {
                      pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' },
                      verified: { bg: '#dcfce7', color: '#15803d', label: '✅ Verified' },
                      rejected: { bg: '#fee2e2', color: '#dc2626', label: '❌ Rejected' }
                    };
                    const s = statusMap[inst.status] || { bg: '#fef3c7', color: '#92400e', label: inst.status };
                    return (
                      <ExpandableMobileCard
                        key={inst.id}
                        title={inst.student_name}
                        subtitle={new Date(inst.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        topRight={<span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>}
                        mainStats={
                          <div><span className="text-muted" style={{ fontSize: '11px' }}>Amount</span><br /><strong style={{ color: '#15803d', fontSize: '14px' }}>₹{Number(inst.amount).toLocaleString('en-IN')}</strong></div>
                        }
                        expandedContent={
                          <>
                            {inst.finance_note && <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#6b7280', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>{inst.finance_note}</p>}
                            {inst.screenshot_url && (
                              <a href={inst.screenshot_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#4f46e5', fontWeight: 600 }}>🖼️ View Receipt</a>
                            )}
                            {inst.status === 'verified' && (
                              <button 
                                onClick={() => setReceiptPayment({ leads: { student_name: inst.student_name, contact_number: '—' }, amount: inst.amount, total_amount: inst.amount, hours: null, finance_note: inst.finance_note, created_at: inst.created_at, updated_at: inst.created_at, id: inst.id })}
                                style={{ padding: '6px 12px', margin: '8px 0 0', background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '11px', display: 'block', width: 'fit-content' }}
                              >🧾 Download Receipt</button>
                            )}
                          </>
                        }
                      />
                    );
                  })}
                  {!myInstallments.length && (
                    <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No installments submitted yet.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {pageView === 'requests' && (
        <>
          <div className="card filters-bar" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', alignItems: 'center', padding: '10px 12px', marginBottom: '10px', overflowX: 'auto' }}>
            <div className="filter-group" style={{ flex: '1 1 140px', minWidth: '140px' }}>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
            {isCounselorHead && counselors.length > 0 && (
              <div className="filter-group" style={{ flex: '0 0 auto' }}>
                <select
                  value={counselorFilter}
                  onChange={e => setCounselorFilter(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="all">All Counselors</option>
                  {counselors.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
                  ))}
                </select>
              </div>
            )}
            {!isCounselorHead && (
              <button className="primary" style={{ flexShrink: 0, padding: '8px 12px', fontSize: '13px', whiteSpace: 'nowrap' }} onClick={() => setShowNewModal(true)}>+ New</button>
            )}
            <button
              style={{ flexShrink: 0, padding: '8px 12px', fontSize: '13px', whiteSpace: 'nowrap', background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setShowGenerateInvoice(true)}
            >📄 Generate Invoice</button>
          </div>

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
          <>
            <div className="table-wrap desktop-only">
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
                          {r.leads?.counselor_name || (r.leads?.counselor_id ? (counselorMap[r.leads.counselor_id] || r.leads.counselor_id.substring(0,8)) : '—')}
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
                      <td>
                        {r.status === 'verified' && (
                          <button onClick={() => setReceiptPayment(r)} style={{ fontSize: '11px', padding: '3px 10px', background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>🧾 Receipt</button>
                        )}
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

            <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(r => (
                <ExpandableMobileCard
                  key={r.id}
                  title={r.leads?.student_name}
                  subtitle={r.leads?.contact_number}
                  topRight={statusBadge(r.status)}
                  mainStats={
                    <>
                      <div><span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Total</span><strong style={{ fontSize: '14px' }}>{r.total_amount ? `₹${Number(r.total_amount).toLocaleString('en-IN')}` : '—'}</strong></div>
                      <div><span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Paid</span><strong style={{ fontSize: '14px', color: '#15803d' }}>{r.amount ? `₹${Number(r.amount).toLocaleString('en-IN')}` : '—'}</strong></div>
                    </>
                  }
                  expandedContent={
                    <>
                      {isCounselorHead && <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#4338ca' }}>👤 {r.leads?.counselor_name || (r.leads?.counselor_id ? (counselorMap[r.leads.counselor_id] || r.leads.counselor_id.substring(0,8)) : '—')}</p>}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                        <div><span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Total</span><strong style={{ fontSize: '14px' }}>{r.total_amount ? `₹${Number(r.total_amount).toLocaleString('en-IN')}` : '—'}</strong></div>
                        <div><span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Paid</span><strong style={{ fontSize: '14px', color: '#15803d' }}>{r.amount ? `₹${Number(r.amount).toLocaleString('en-IN')}` : '—'}</strong></div>
                        <div><span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Hours</span><span style={{ fontSize: '13px', fontWeight: 600 }}>{r.hours || '—'}</span></div>
                        <div><span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Submitted</span><span style={{ fontSize: '12px', fontWeight: 500 }}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span></div>
                      </div>

                      {r.notes && <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}><strong>Note:</strong> {r.notes}</p>}
                      {r.finance_note && <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#92400e', background: '#fef3c7', padding: '6px 10px', borderRadius: '4px' }}><strong>Finance:</strong> {r.finance_note}</p>}

                      {r.screenshot_url && (
                        <a href={r.screenshot_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#4f46e5', fontWeight: 600, display: 'inline-block', marginBottom: '12px' }}>🖼️ Receipt</a>
                      )}
                    </>
                  }
                  actions={
                    isCounselorHead && r.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="primary small" style={{ flex: 1, justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setActiveApproval(r); setApprovalAction('approve'); }}>Approve</button>
                        <button className="danger small" style={{ flex: 1, justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setActiveApproval(r); setApprovalAction('reject'); }}>Reject</button>
                      </div>
                    ) : null
                  }
                />
              ))}
              {!filtered.length && <p className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>No requests found.</p>}
            </div>
          </>
          {!loading && total > 0 && (
            <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
          )}

          {showNewModal && (
            <NewPaymentRequestModal
              leads={leads}
              initialLeadId={initialLeadId}
              onClose={() => setShowNewModal(false)}
              onSuccess={() => { setShowNewModal(false); loadData(); }}
            />
          )}
        </>
      )}
      {showGenerateInvoice && <GenerateInvoiceModal onClose={() => setShowGenerateInvoice(false)} />}
      {receiptPayment && <ReceiptModal payment={receiptPayment} type="payment" onClose={() => setReceiptPayment(null)} />}
    </section>
  );
}


/* ═══════ Overdue Leads Page (Counselor Head) ═══════ */
function MobileOverdueLeadCard({ lead, counselors, days, selectedCounselor, onSelectCounselor, onReassign, reassigning }) {
  const [expanded, setExpanded] = useState(false);
  const isCritical = days >= 20;
  const isWarning = days >= 13 && days < 20;
  const daysColor = isCritical ? '#dc2626' : (isWarning ? '#ea580c' : '#6b7280');
  const bg = isCritical ? '#fef2f2' : '#fff';

  return (
    <div className="card list-mobile-card" style={{ padding: '16px', position: 'relative', marginBottom: '0', border: isCritical ? '2px solid #fecaca' : '1px solid #e5e7eb', background: bg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1, paddingRight: 8, display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer' }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111827' }}>
            {lead.student_name}
          </h4>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {lead.subject || '-'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: daysColor }}>
              {days}d Overdue
            </span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', color: '#6b7280', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 600, paddingRight: '32px' }}>
            {lead.users?.full_name || 'Unassigned'}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '12px', animation: 'fadeIn 0.2s ease-in' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginBottom: '12px' }}>
            <div><span style={{ color: '#888' }}>Contact:</span> <div style={{ fontWeight: 500 }}>{lead.contact_number || '-'}</div></div>
            <div><span style={{ color: '#888' }}>Status:</span> <div><span style={{ padding: '2px 6px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#fef3c7', color: '#92400e' }}>{lead.status}</span></div></div>
          </div>

          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
            <select
              value={selectedCounselor}
              onChange={e => onSelectCounselor(lead.id, e.target.value)}
              style={{ flex: 1, padding: '8px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              <option value="">Reassign to…</option>
              {counselors.filter(c => c.id !== lead.counselor_id).map(c => (
                <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
              ))}
            </select>
            <button
              className="primary small"
              onClick={() => onReassign(lead.id)}
              disabled={reassigning}
              style={{ whiteSpace: 'nowrap' }}
            >
              {reassigning ? '…' : 'Reassign'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function OverdueLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [reassigning, setReassigning] = useState({});
  const [selectedCounselor, setSelectedCounselor] = useState({});

  async function loadData(currentPage = page) {
    setLoading(true);
    try {
      const [overdueRes, counselorRes] = await Promise.all([
        apiFetch(`/leads/overdue?page=${currentPage}&limit=${limit}`),
        apiFetch('/leads/counselors').catch(() => ({ items: [] }))
      ]);
      setLeads(overdueRes.items || []);
      setTotal(overdueRes.total || 0);
      setCounselors(counselorRes.items || []);
    } catch (e) { alert(e.message); }
    setLoading(false);
  }

  useEffect(() => { loadData(page); }, [page]);

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
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
          Leads assigned 13+ days without Joined or Dropped status
        </p>
        <div style={{
          padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
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
      <div className="card desktop-only">
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
                            <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="primary small"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        disabled={reassigning[l.id]}
                        onClick={() => handleReassign(l.id)}
                      >
                        {reassigning[l.id] ? 'Wait..' : 'Reassign'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr><td colSpan="8" style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>No overdue leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile expandable cards */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {filtered.map(l => (
          <MobileOverdueLeadCard
            key={l.id}
            lead={l}
            days={daysOverdue(l.assigned_at)}
            counselors={counselors}
            selectedCounselor={selectedCounselor[l.id] || ''}
            onSelectCounselor={(id, val) => setSelectedCounselor(prev => ({ ...prev, [id]: val }))}
            onReassign={handleReassign}
            reassigning={reassigning[l.id]}
          />
        ))}
        {!filtered.length && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>No overdue leads found.</div>
        )}
      </div>
      {!loading && total > 0 && (
        <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
      )}
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
