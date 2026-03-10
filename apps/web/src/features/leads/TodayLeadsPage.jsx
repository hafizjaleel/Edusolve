import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

function StatusBadge({ status }) {
    const colors = {
        new: '#6366f1',
        demo_scheduled: '#f59e0b',
        demo_done: '#3b82f6',
        payment_pending: '#ec4899',
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

function ExpandableMobileCard({ title, subtitle, topRight, topRightBottom, mainStats, expandedContent, actions, borderColor }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="card today-lead-card" style={{ padding: '16px', position: 'relative', borderLeft: borderColor ? `4px solid ${borderColor}` : undefined }}>
            <div
                onClick={() => setExpanded(!expanded)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: expanded ? '12px' : '0' }}
            >
                <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600 }}>{title || '—'}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                        {subtitle}
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    {topRightBottom && (
                        <div style={{ paddingRight: '32px' }}>
                            {topRightBottom}
                        </div>
                    )}
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

export function TodayLeadsPage({ onOpenDetails, onViewInPipeline, role }) {
    const isCounselor = role === 'counselor';
    const isHead = role === 'counselor_head';
    const scope = isCounselor ? 'mine' : 'all';

    const [items, setItems] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [assigningId, setAssigningId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(() => new Date());

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

    // Filter leads to the selected date (IST)
    const filteredLeads = useMemo(() => {
        const targetStr = selectedDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        return items.filter(lead => {
            if (!lead.created_at) return false;
            const leadDate = new Date(lead.created_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            return leadDate === targetStr;
        });
    }, [items, selectedDate]);

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

    function handlePrevDay() {
        setSelectedDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 1);
            return d;
        });
    }

    function handleNextDay() {
        setSelectedDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 1);
            return d;
        });
    }

    const isToday = selectedDate.toLocaleDateString() === new Date().toLocaleDateString();

    return (
        <section className="panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="secondary small" onClick={handlePrevDay}>« Prev</button>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {selectedDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            {isToday && <span style={{ fontSize: '12px', color: 'var(--primary)', background: 'var(--primary-soft)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>(Today)</span>}
                        </h2>
                        <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '13px' }}>
                            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} created
                        </p>
                    </div>
                    <button className="secondary small" onClick={handleNextDay} disabled={isToday} style={{ opacity: isToday ? 0.5 : 1 }}>Next »</button>
                </div>
                {!isToday && (
                    <button className="small primary" onClick={() => setSelectedDate(new Date())} disabled={loading}>
                        Today
                    </button>
                )}
            </div>

            {error ? <p className="error">{error}</p> : null}

            {!loading && filteredLeads.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    <p style={{ fontSize: '32px', margin: '0 0 8px' }}>📋</p>
                    <p style={{ fontWeight: 500 }}>No leads created on this date.</p>
                </div>
            ) : null}

            <div className="today-leads-grid">
                {filteredLeads.map(lead => {
                    const phone = formatPhone(lead.contact_number);
                    const borderColor = lead.counselor_id && counselorMap[lead.counselor_id] ? '#10b981' : isCounselor ? '#6366f1' : '#f59e0b';

                    return (
                        <ExpandableMobileCard
                            key={lead.id}
                            borderColor={borderColor}
                            title={lead.student_name}
                            subtitle={
                                <>
                                    📞 {lead.contact_number || '—'} <br />
                                    {lead.parent_name ? `Parent: ${lead.parent_name}` : ''}
                                </>
                            }
                            topRight={<StatusBadge status={lead.status} />}
                            topRightBottom={
                                isHead ? (
                                    <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 600 }}>
                                        {counselorMap[lead.counselor_id] || 'Unassigned'}
                                    </span>
                                ) : null
                            }
                            mainStats={
                                <>
                                    <div><span className="text-muted" style={{ fontSize: '11px', display: 'block' }}>Class</span><strong style={{ fontSize: '13px' }}>{lead.class_level || '—'}</strong></div>
                                    <div><span className="text-muted" style={{ fontSize: '11px', display: 'block' }}>Subject</span><strong style={{ fontSize: '13px' }}>{lead.subject || '—'}</strong></div>
                                </>
                            }
                            expandedContent={
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>
                                        <div><span className="text-muted" style={{ fontSize: '11px', display: 'block' }}>Class</span><strong>{lead.class_level || '—'}</strong></div>
                                        <div><span className="text-muted" style={{ fontSize: '11px', display: 'block' }}>Subject</span><strong>{lead.subject || '—'}</strong></div>
                                        {lead.lead_type && <div><span className="text-muted" style={{ fontSize: '11px', display: 'block' }}>Lead Type</span><strong>{lead.lead_type}</strong></div>}
                                        {lead.email && <div style={{ gridColumn: '1 / -1' }}><span className="text-muted" style={{ fontSize: '11px', display: 'block' }}>Email</span><strong style={{ wordBreak: 'break-all' }}>{lead.email}</strong></div>}
                                        {lead.status === 'dropped' && lead.drop_reason && (
                                            <div style={{ gridColumn: '1 / -1' }}><span className="text-muted" style={{ fontSize: '11px', display: 'block' }}>Drop Reason</span><strong style={{ color: '#dc2626' }}>{lead.drop_reason}</strong></div>
                                        )}
                                    </div>

                                    {/* Counselor actions: Call + WhatsApp */}
                                    {isCounselor && phone && (
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                            <a href={`tel:+${phone}`} className="today-lead-action-btn call-btn">📞 Call</a>
                                            <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="today-lead-action-btn wa-btn">💬 WhatsApp</a>
                                        </div>
                                    )}
                                    {isCounselor && !phone && (
                                        <p className="text-muted" style={{ fontSize: '12px', marginBottom: '12px' }}>No phone number available</p>
                                    )}

                                    {/* Head actions: Assign / Reassign */}
                                    {isHead && (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', flexWrap: 'wrap', gap: '6px', marginBottom: assigningId === lead.id ? '8px' : '0' }}>
                                            <div>
                                                <span className="text-muted">Assigned: </span>
                                                <strong>{lead.counselor_id && counselorMap[lead.counselor_id] ? counselorMap[lead.counselor_id] : <span style={{ color: '#f59e0b' }}>Unassigned</span>}</strong>
                                            </div>
                                            <button className="small secondary" style={{ fontSize: '11px', padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); setAssigningId(assigningId === lead.id ? null : lead.id) }}>
                                                {lead.counselor_id && counselorMap[lead.counselor_id] ? 'Reassign' : 'Assign'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Assign Dropdown (Head only) */}
                                    {isHead && assigningId === lead.id && (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                                            <select
                                                id={`assign-${lead.id}`}
                                                defaultValue=""
                                                style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <option value="" disabled>Select counselor...</option>
                                                {counselors.map(c => (
                                                    <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
                                                ))}
                                            </select>
                                            <button className="small primary" onClick={(e) => { e.stopPropagation(); const val = document.getElementById(`assign-${lead.id}`).value; handleAssign(lead.id, val); }}>Go</button>
                                            <button className="small secondary" onClick={(e) => { e.stopPropagation(); setAssigningId(null) }}>✕</button>
                                        </div>
                                    )}
                                </>
                            }
                            actions={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                                    <span className="text-muted" style={{ fontSize: '12px' }}>
                                        {lead.created_at ? new Date(lead.created_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {isCounselor && onViewInPipeline && (
                                            <button className="small secondary" title="View in Pipeline" onClick={(e) => { e.stopPropagation(); onViewInPipeline(lead.id, lead.status) }} style={{ fontSize: '11px' }}>
                                                📋 Pipeline
                                            </button>
                                        )}
                                        <button className="small primary" onClick={(e) => { e.stopPropagation(); onOpenDetails(lead.id) }}>
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            }
                        />
                    );
                })}
            </div>
        </section>
    );
}
