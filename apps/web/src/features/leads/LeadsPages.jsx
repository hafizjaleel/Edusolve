import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { AddLeadModal } from './components/AddLeadModal.jsx';
import { LeadFilters } from './components/LeadFilters.jsx';

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
                <td colSpan={onToggleSelect ? 6 : 5}>No leads found.</td>
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
    demo_scheduled: 'orange',
    demo_done: 'purple',
    payment_pending: 'yellow',
    joined: 'green',
    dropped: 'red'
  };
  return <span className={`status-badge ${colors[status] || 'neutral'}`}>{status?.replace('_', ' ') || 'unknown'}</span>;
}

export function AllLeadsPage({ onOpenDetails, selectedLeadId }) {
  const { items, loading, error, refresh } = useLeads('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', counselorId: '' });
  const [assignCounselorId, setAssignCounselorId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [leadTab, setLeadTab] = useState('new'); // 'new', 'assigned', 'all'

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
      <div className="tabs" style={{ marginBottom: '16px' }}>
        {[
          { id: 'new', label: 'New', count: newCount },
          { id: 'assigned', label: 'Assigned', count: assignedCount },
          { id: 'all', label: 'All', count: items.length },
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
                <th>Status</th>
                <th>Assigned To</th>
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
                  <td><StatusBadge status={lead.status} /></td>
                  <td>{counselorMap[lead.counselor_id] || <span className="text-dim">Unassigned</span>}</td>
                  <td className="actions">
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

export function MyLeadsPage({ onOpenDetails }) {
  const { items, loading, error, refresh } = useLeads('mine');
  const [activeTab, setActiveTab] = useState('new');

  const STATUS_STEPS = ['new', 'demo_scheduled', 'demo_done', 'payment_pending', 'joined', 'dropped'];

  const TABS = [
    { id: 'new', label: 'New' },
    { id: 'demo_scheduled', label: 'Demo Scheduled' },
    { id: 'demo_done', label: 'Demo Done' },
    { id: 'payment_pending', label: 'Payment Pending' },
    { id: 'joined', label: 'Joined' },
    { id: 'dropped', label: 'Dropped' },
    { id: 'all', label: 'All' }
  ];

  const filteredItems = items.filter(i => activeTab === 'all' || i.status === activeTab);

  function getNextStatus(current) {
    const idx = STATUS_STEPS.indexOf(current);
    if (idx === -1 || idx >= STATUS_STEPS.length - 1) return null;
    if (current === 'dropped') return null;
    return STATUS_STEPS[idx + 1];
  }

  function getNextLabel(nextStatus) {
    const labels = {
      demo_scheduled: '📅 Schedule Demo',
      demo_done: '✅ Mark Demo Done',
      payment_pending: '💰 Payment Pending',
      joined: '🎉 Mark Joined',
    };
    return labels[nextStatus] || nextStatus;
  }

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

  function formatPhone(num) {
    if (!num) return null;
    let clean = num.replace(/[^0-9+]/g, '');
    if (!clean.startsWith('+') && !clean.startsWith('91') && clean.length === 10) {
      clean = '91' + clean;
    }
    return clean;
  }

  const statusColors = {
    new: '#6366f1',
    demo_scheduled: '#f59e0b',
    demo_done: '#3b82f6',
    payment_pending: '#ef4444',
    joined: '#10b981',
    dropped: '#6b7280'
  };

  return (
    <section className="panel">
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
        {filteredItems.map(lead => {
          const phone = formatPhone(lead.contact_number);
          const nextStatus = getNextStatus(lead.status);

          return (
            <div key={lead.id} className="card today-lead-card" style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              borderLeft: `4px solid ${statusColors[lead.status] || '#6b7280'}`,
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.student_name}
                  </h3>
                  {lead.parent_name ? <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '12px' }}>Parent: {lead.parent_name}</p> : null}
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: `${statusColors[lead.status] || '#6b7280'}18`,
                  color: statusColors[lead.status] || '#6b7280',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap'
                }}>
                  {(lead.status || '').replace('_', ' ')}
                </span>
              </div>

              {/* Details */}
              <div className="today-lead-details">
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
                {lead.email ? (
                  <div>
                    <span className="text-muted">Email</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 500, wordBreak: 'break-all', fontSize: '12px' }}>{lead.email}</p>
                  </div>
                ) : null}
              </div>

              {/* Call + WhatsApp */}
              {phone ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={`tel:+${phone}`} className="today-lead-action-btn call-btn">📞 Call</a>
                  <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="today-lead-action-btn wa-btn">💬 WhatsApp</a>
                </div>
              ) : null}

              {/* Next Status Action + Drop */}
              {lead.status !== 'joined' && lead.status !== 'dropped' ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {nextStatus ? (
                    <button
                      className="small primary"
                      style={{ flex: 1, fontSize: '12px' }}
                      onClick={() => handleStatusChange(lead.id, nextStatus)}
                    >
                      {getNextLabel(nextStatus)}
                    </button>
                  ) : null}
                  <button
                    className="small danger"
                    style={{ fontSize: '12px' }}
                    onClick={() => handleDrop(lead.id)}
                  >
                    ✕ Drop
                  </button>
                </div>
              ) : null}

              {/* Footer: Time + View */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' })
                    : ''}
                </span>
                <button className="small primary" onClick={() => onOpenDetails(lead.id)}>
                  View Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function LeadDetailsPage({ leadId }) {
  const [lead, setLead] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [form, setForm] = useState({ student_name: '', class_level: '', subject: '', status: 'new' });

  useEffect(() => {
    if (!leadId) return;
    let cancelled = false;
    async function load() {
      setError('');
      try {
        const data = await apiFetch(`/leads/${leadId}`);
        const historyData = await apiFetch(`/leads/${leadId}/history`);
        if (cancelled) return;
        setLead(data.lead);
        setHistory(historyData.items || []);
        setForm({
          student_name: data.lead.student_name || '',
          parent_name: data.lead.parent_name || '',
          class_level: data.lead.class_level || '',
          subject: data.lead.subject || '',
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

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/upload/screenshot', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setPaymentScreenshot(data.url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  }

  const STATUS_STEPS = ['new', 'demo_scheduled', 'demo_done', 'payment_pending', 'joined', 'dropped'];

  return (
    <section className="panel">
      <button
        onClick={() => window.history.back()}
        className="small secondary"
        style={{ marginBottom: '12px' }}
      >
        ← Go Back
      </button>

      <div className="card" style={{ marginBottom: '20px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 'max-content' }}>
          {STATUS_STEPS.map((step, idx) => {
            const isActive = lead?.status === step;
            const isPassed = STATUS_STEPS.indexOf(lead?.status) > idx && lead?.status !== 'dropped';
            return (
              <div
                key={step}
                onClick={() => updateStatus(step)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: isActive ? '#4f46e5' : isPassed ? '#e0e7ff' : '#f3f4f6',
                  color: isActive ? 'white' : isPassed ? '#4f46e5' : '#6b7280',
                  fontWeight: 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  border: isActive ? '1px solid #4f46e5' : '1px solid transparent'
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
          className={`tab-btn ${activeTab === 'finance' ? 'active' : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          Finance
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
                <button className="secondary small" onClick={() => setIsEditing(true)}>Edit Profile</button>
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
                  <label>Parent Name</label>
                  <p>{lead.parent_name || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <form className="card form-grid grid-2" onSubmit={onSave}>
              <div className="flex-between">
                <h3>Edit Profile</h3>
                <button type="button" className="text-danger" style={{ background: 'transparent', border: 'none' }} onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
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
              <label>
                Subject
                <input value={form.subject} onChange={(e) => setForm((v) => ({ ...v, subject: e.target.value }))} />
              </label>
              <div className="actions">
                <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
              {error ? <p className="error">{error}</p> : null}
            </form>
          )}
        </>
      ) : null}

      {activeTab === 'finance' ? (
        <form className="card form-grid" onSubmit={submitPaymentRequest}>
          <h3>Payment Request</h3>
          <p>Submit a payment verification request to the finance team.</p>
          <label>
            Amount
            <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} required />
          </label>
          <label>
            Screenshot (Upload)
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>
          {paymentScreenshot ? (
            <div style={{ marginTop: '8px' }}>
              <p style={{ fontSize: '12px', color: 'green' }}>✓ Screenshot uploaded</p>
              <a href={paymentScreenshot} target="_blank" rel="noreferrer" style={{ fontSize: '12px' }}>View Upload</a>
            </div>
          ) : null}
          <button type="submit">Submit for Finance Verification</button>
          {paymentMessage ? <p>{paymentMessage}</p> : null}
          {error ? <p className="error">{error}</p> : null}
        </form>
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

export function DemoManagementPage({ leadId }) {
  const { items, loading, error, refresh } = useLeads('mine');
  const [teachers, setTeachers] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [activeTab, setActiveTab] = useState('demo_scheduled');

  useEffect(() => {
    apiFetch('/teachers/pool').then(d => setTeachers(d.items || [])).catch(() => { });
  }, []);

  // Filter leads for demo statuses + new (for scheduling)
  const demoLeads = useMemo(() => {
    if (activeTab === 'all') return items.filter(i => ['new', 'demo_scheduled', 'demo_done'].includes(i.status));
    return items.filter(i => i.status === activeTab);
  }, [items, activeTab]);

  const scheduledCount = items.filter(i => i.status === 'demo_scheduled').length;
  const doneCount = items.filter(i => i.status === 'demo_done').length;
  const newCount = items.filter(i => i.status === 'new').length;

  // Leads eligible for scheduling (status = new)
  const newLeads = items.filter(i => i.status === 'new');

  async function handleScheduleDemo(e) {
    e.preventDefault();
    const targetId = selectedLeadId || leadId;
    if (!targetId) { setErr('Select a lead to schedule a demo for.'); return; }
    setErr('');
    setMsg('');
    try {
      await apiFetch(`/leads/${targetId}/demo-request`, {
        method: 'POST',
        body: JSON.stringify({ scheduled_at: scheduledAt || null, teacher_id: selectedTeacherId || null })
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

  async function handleMoveToPending(id) {
    try {
      await apiFetch(`/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'payment_pending', reason: 'Demo done, moved to payment pending' })
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
    demo_scheduled: '#f59e0b',
    demo_done: '#3b82f6',
  };

  return (
    <section className="panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Demo Management</h2>
          <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
            {scheduledCount} scheduled · {doneCount} done · {newCount} new (ready to schedule)
          </p>
        </div>
        <button className="primary" onClick={() => setShowScheduleModal(true)}>+ Schedule Demo</button>
      </div>

      {/* Tabs */}
      <div className="tabs-row" style={{ marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { id: 'demo_scheduled', label: 'Scheduled', count: scheduledCount },
          { id: 'demo_done', label: 'Done', count: doneCount },
          { id: 'new', label: 'New (Unscheduled)', count: newCount },
          { id: 'all', label: 'All', count: scheduledCount + doneCount + newCount },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
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

      <div className="today-leads-grid">
        {demoLeads.map(lead => {
          const phone = formatPhone(lead.contact_number);
          return (
            <div key={lead.id} className="card today-lead-card" style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              borderLeft: `4px solid ${statusColors[lead.status] || '#6b7280'}`,
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{lead.student_name}</h3>
                <span style={{
                  padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                  background: `${statusColors[lead.status] || '#6b7280'}18`,
                  color: statusColors[lead.status] || '#6b7280',
                  textTransform: 'capitalize', whiteSpace: 'nowrap'
                }}>
                  {(lead.status || '').replace(/_/g, ' ')}
                </span>
              </div>

              {/* Details */}
              <div className="today-lead-details">
                <div>
                  <span className="text-muted">Phone</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.contact_number || '—'}</p>
                </div>
                <div>
                  <span className="text-muted">Subject</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.subject || '—'}</p>
                </div>
                <div>
                  <span className="text-muted">Class</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.class_level || '—'}</p>
                </div>
                <div>
                  <span className="text-muted">Created</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 500, fontSize: '12px' }}>
                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' }) : '—'}
                  </p>
                </div>
              </div>

              {/* Contact Buttons */}
              {phone ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={`tel:+${phone}`} className="today-lead-action-btn call-btn">📞 Call</a>
                  <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="today-lead-action-btn wa-btn">💬 WhatsApp</a>
                </div>
              ) : null}

              {/* Status Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {lead.status === 'new' ? (
                  <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                    onClick={() => { setSelectedLeadId(lead.id); setShowScheduleModal(true); }}>
                    📅 Schedule Demo
                  </button>
                ) : null}
                {lead.status === 'demo_scheduled' ? (
                  <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                    onClick={() => handleMarkDone(lead.id)}>
                    ✅ Mark Demo Done
                  </button>
                ) : null}
                {lead.status === 'demo_done' ? (
                  <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                    onClick={() => handleMoveToPending(lead.id)}>
                    💰 Move to Payment Pending
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Demo Modal */}
      {showScheduleModal ? (
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
                    <option key={t.id} value={t.id}>{t.full_name || t.email} {t.subject ? `(${t.subject})` : ''}</option>
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
      ) : null}
    </section>
  );
}
