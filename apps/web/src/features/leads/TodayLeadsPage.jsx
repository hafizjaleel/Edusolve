import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

function StatusBadge({ status }) {
    const colors = {
        new: '#6366f1',
        demo_scheduled: '#f59e0b',
        demo_done: '#3b82f6',
        payment_pending: '#ef4444',
        payment_verification: '#f97316',
        joined: '#10b981',
        dropped: '#6b7280'
    };
    return (
        <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            background: `${colors[status] || '#6b7280'}18`,
            color: colors[status] || '#6b7280',
            textTransform: 'capitalize'
        }}>
            {(status || '').replace('_', ' ')}
        </span>
    );
}

export function TodayLeadsPage({ onOpenDetails, role }) {
    const isCounselor = role === 'counselor';
    const isHead = role === 'counselor_head';
    const scope = isCounselor ? 'mine' : 'all';

    const [items, setItems] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [assigningId, setAssigningId] = useState(null);

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
        if (isHead) {
            apiFetch('/counselors').then(data => setCounselors(data.items || [])).catch(() => { });
        }
    }, []);

    const counselorMap = useMemo(() => {
        const map = {};
        counselors.forEach(c => { map[c.id] = c.full_name || c.email; });
        return map;
    }, [counselors]);

    // Filter to today's leads only (IST)
    const todayLeads = useMemo(() => {
        const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        return items.filter(lead => {
            if (!lead.created_at) return false;
            const leadDate = new Date(lead.created_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            return leadDate === todayStr;
        });
    }, [items]);

    async function handleAssign(leadId, counselorId) {
        if (!counselorId) return;
        try {
            await apiFetch('/leads/assign', {
                method: 'POST',
                body: JSON.stringify({ lead_ids: [leadId], counselor_id: counselorId })
            });
            setAssigningId(null);
            refresh();
        } catch (err) {
            alert(err.message);
        }
    }

    function formatPhone(num) {
        if (!num) return null;
        // Strip non-digits, add 91 prefix if needed for Indian numbers
        let clean = num.replace(/[^0-9+]/g, '');
        if (!clean.startsWith('+') && !clean.startsWith('91') && clean.length === 10) {
            clean = '91' + clean;
        }
        return clean;
    }

    return (
        <section className="panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>Today's Leads</h2>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
                        {todayLeads.length} lead{todayLeads.length !== 1 ? 's' : ''} created today
                    </p>
                </div>
                <button className="small secondary" onClick={refresh} disabled={loading}>
                    {loading ? '...' : '↻ Refresh'}
                </button>
            </div>

            {error ? <p className="error">{error}</p> : null}

            {!loading && todayLeads.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    <p style={{ fontSize: '32px', margin: '0 0 8px' }}>📋</p>
                    <p style={{ fontWeight: 500 }}>No leads created today yet.</p>
                </div>
            ) : null}

            <div className="today-leads-grid">
                {todayLeads.map(lead => {
                    const phone = formatPhone(lead.contact_number);
                    return (
                        <div key={lead.id} className="card today-lead-card" style={{
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            borderLeft: `4px solid ${lead.counselor_id && counselorMap[lead.counselor_id] ? '#10b981' : isCounselor ? '#6366f1' : '#f59e0b'}`,
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <div style={{ minWidth: 0 }}>
                                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {lead.student_name}
                                    </h3>
                                    {lead.parent_name ? <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '12px' }}>Parent: {lead.parent_name}</p> : null}
                                </div>
                                <StatusBadge status={lead.status} />
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

                            {/* Counselor actions: Call + WhatsApp */}
                            {isCounselor && phone ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a
                                        href={`tel:+${phone}`}
                                        className="today-lead-action-btn call-btn"
                                    >
                                        📞 Call
                                    </a>
                                    <a
                                        href={`https://wa.me/${phone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="today-lead-action-btn wa-btn"
                                    >
                                        💬 WhatsApp
                                    </a>
                                </div>
                            ) : null}

                            {isCounselor && !phone ? (
                                <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>No phone number available</p>
                            ) : null}

                            {/* Head actions: Assign / Reassign */}
                            {isHead ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 10px',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    flexWrap: 'wrap',
                                    gap: '6px'
                                }}>
                                    <div>
                                        <span className="text-muted">Assigned: </span>
                                        <strong>
                                            {lead.counselor_id && counselorMap[lead.counselor_id]
                                                ? counselorMap[lead.counselor_id]
                                                : <span style={{ color: '#f59e0b' }}>Unassigned</span>
                                            }
                                        </strong>
                                    </div>
                                    <button
                                        className="small secondary"
                                        style={{ fontSize: '11px', padding: '3px 8px' }}
                                        onClick={() => setAssigningId(assigningId === lead.id ? null : lead.id)}
                                    >
                                        {lead.counselor_id && counselorMap[lead.counselor_id] ? 'Reassign' : 'Assign'}
                                    </button>
                                </div>
                            ) : null}

                            {/* Assign Dropdown (Head only) */}
                            {isHead && assigningId === lead.id ? (
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <select
                                        id={`assign-${lead.id}`}
                                        defaultValue=""
                                        style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                                    >
                                        <option value="" disabled>Select counselor...</option>
                                        {counselors.map(c => (
                                            <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
                                        ))}
                                    </select>
                                    <button
                                        className="small primary"
                                        onClick={() => {
                                            const val = document.getElementById(`assign-${lead.id}`).value;
                                            handleAssign(lead.id, val);
                                        }}
                                    >
                                        Go
                                    </button>
                                    <button className="small secondary" onClick={() => setAssigningId(null)}>✕</button>
                                </div>
                            ) : null}

                            {/* Footer: Time + View */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <span className="text-muted" style={{ fontSize: '12px' }}>
                                    {lead.created_at
                                        ? new Date(lead.created_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })
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
