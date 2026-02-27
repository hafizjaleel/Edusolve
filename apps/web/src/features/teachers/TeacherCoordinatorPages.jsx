import { useEffect, useMemo, useRef, useState } from 'react';

import { apiFetch } from '../../lib/api.js';
import DateTimePicker from '../../components/DateTimePicker.jsx';

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
                    {search && !exactMatch && (
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

const StatusIcon = ({ status, size = 16 }) => {
    const iconPaths = {
        new: 'M12 5v14M5 12h14',                     // plus
        contacted: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z',
        first_interview: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
        first_interview_done: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
        second_interview: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
        second_interview_done: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
        approved: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3',
        rejected: 'M18 6L6 18M6 6l12 12',
    };
    const color = STATUS_COLORS[status] || '#6b7280';
    return <Icon d={iconPaths[status] || 'M12 5v14M5 12h14'} color={color} size={size} />;
};

/* ─── Shared helpers ─── */
const STATUS_STEPS = ['new', 'contacted', 'first_interview', 'first_interview_done', 'second_interview', 'second_interview_done', 'approved', 'closed'];
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

function getNextStatus(current) {
    if (current === 'rejected' || current === 'approved' || current === 'closed') return null;
    const idx = STATUS_STEPS.indexOf(current);
    if (idx === -1 || idx >= STATUS_STEPS.length - 1) return null;
    return STATUS_STEPS[idx + 1];
}

function getNextLabel(next) {
    const labels = {
        contacted: 'Mark Contacted',
        first_interview: 'Schedule 1st Interview',
        first_interview_done: '1st Interview Done',
        second_interview: 'Schedule 2nd Interview',
        second_interview_done: '2nd Interview Done',
        approved: 'Approve',
        closed: 'Close'
    };
    return labels[next] || next;
}

/* ─── Progress Tracker ─── */
function ProgressTracker({ currentStatus }) {
    const currentIdx = STATUS_STEPS.indexOf(currentStatus);
    const isRejected = currentStatus === 'rejected';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '8px 0 4px', overflow: 'hidden' }}>
            {STATUS_STEPS.map((step, idx) => {
                const isDone = !isRejected && idx < currentIdx;
                const isCurrent = !isRejected && idx === currentIdx;
                const color = isRejected ? '#ef4444' : isDone ? STATUS_COLORS[step] : isCurrent ? STATUS_COLORS[step] : '#d1d5db';

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

/* ═══════ TC Dashboard ═══════ */
export function TCDashboardPage() {
    const [stats, setStats] = useState({});
    const [pool, setPool] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [s, p, l] = await Promise.all([
                    apiFetch('/teacher-leads/stats'),
                    apiFetch('/teachers/pool'),
                    apiFetch('/teacher-leads')
                ]);
                setStats(s.stats || {});
                setPool(p.items || []);
                setLeads(l.items || []);
            } catch (e) { }
            setLoading(false);
        })();
    }, []);

    const totalLeads = Object.values(stats).reduce((a, b) => a + b, 0);
    const pipelineActive = (stats.new || 0) + (stats.contacted || 0) + (stats.first_interview || 0) + (stats.first_interview_done || 0) + (stats.second_interview || 0) + (stats.second_interview_done || 0) + (stats.approved || 0);
    const conversionRate = totalLeads > 0 ? Math.round(((stats.onboarded || 0) / totalLeads) * 100) : 0;

    // Recent 5 leads
    const recentLeads = leads.slice(0, 5);

    if (loading) return <section className="panel"><p>Loading dashboard...</p></section>;

    return (
        <section className="panel">
            <div className="grid-four">
                <StatCard label="Total Teacher Leads" value={totalLeads} />
                <StatCard label="Pipeline Active" value={pipelineActive} />
                <StatCard label="Teachers in Pool" value={pool.length} tone="success" />
            </div>

            <div className="grid-three" style={{ marginTop: '16px' }}>
                {/* Pipeline Breakdown */}
                <article className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Recruitment Pipeline</h3>
                    {STATUS_STEPS.map(status => (
                        <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <StatusIcon status={status} size={14} />
                                <span style={{ fontSize: '13px' }}>{STATUS_LABELS[status]}</span>
                            </div>
                            <strong style={{ fontSize: '14px' }}>{stats[status] || 0}</strong>
                        </div>
                    ))}
                    {/* Rejected */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <StatusIcon status="rejected" size={14} />
                            <span style={{ fontSize: '13px' }}>Rejected</span>
                        </div>
                        <strong style={{ fontSize: '14px' }}>{stats.rejected || 0}</strong>
                    </div>
                </article>

                {/* Outcomes */}
                <article className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>Outcomes</h3>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                        <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#fee2e2', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#dc2626' }}>{stats.rejected || 0}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#dc2626' }}>Rejected</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px', background: '#eff6ff', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1d4ed8' }}>{pool.length}</p>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#1d4ed8' }}>Active in Pool</p>
                    </div>
                </article>

                {/* Recent Leads */}
                <article className="card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Recent Teacher Leads</h3>
                    {recentLeads.length ? recentLeads.map(lead => (
                        <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}>
                            <span style={{ fontWeight: 500 }}>{lead.full_name}</span>
                            <span style={{
                                padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                                background: `${STATUS_COLORS[lead.status] || '#6b7280'}18`,
                                color: STATUS_COLORS[lead.status] || '#6b7280',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                <StatusIcon status={lead.status} size={12} />
                                {STATUS_LABELS[lead.status] || lead.status}
                            </span>
                        </div>
                    )) : <p className="text-muted" style={{ fontSize: '13px' }}>No teacher leads yet</p>}
                </article>
            </div>
        </section>
    );
}

function StatCard({ label, value, tone }) {
    const bg = tone === 'success' ? '#dcfce7' : tone === 'danger' ? '#fee2e2' : tone === 'info' ? '#e0e7ff' : '#f3f4f6';
    const color = tone === 'success' ? '#15803d' : tone === 'danger' ? '#dc2626' : tone === 'info' ? '#4338ca' : '#111';
    return (
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color }}>{value}</p>
            <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>{label}</p>
        </div>
    );
}



/* ─── Expandable Lead Card ─── */
function parseSubjects(s) {
    if (Array.isArray(s)) return s;
    if (typeof s === 'string') { try { const p = JSON.parse(s); return Array.isArray(p) ? p : []; } catch { return s ? [s] : []; } }
    return [];
}

function formatPhone(num) {
    if (!num) return null;
    let clean = num.replace(/[^0-9+]/g, '');
    if (!clean.startsWith('+') && !clean.startsWith('91') && clean.length === 10) clean = '91' + clean;
    return clean;
}

function LeadCard({ lead, onStatusChange, onReject, onView, onConvert }) {
    const [expanded, setExpanded] = useState(false);
    const phone = formatPhone(lead.phone);
    const nextStatus = getNextStatus(lead.status);

    return (
        <div className="card today-lead-card"
            style={{
                padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                borderLeft: `4px solid ${STATUS_COLORS[lead.status] || '#6b7280'}`,
                borderImage: lead.status === 'rejected' ? 'none' : `linear-gradient(to bottom, ${STATUS_COLORS[lead.status] || '#6b7280'}, ${STATUS_COLORS[lead.status] || '#6b7280'}44) 1`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
            onClick={() => setExpanded(!expanded)}
        >
            {/* Header (Always Visible) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{lead.full_name}</h3>
                        <Icon d={expanded ? ICONS.chevronUp : ICONS.chevronDown} size={16} color="#9ca3af" />
                    </div>
                    {/* Date always visible as per requirement (initially see name, status, date) */}
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
                    <StatusIcon status={lead.status} size={12} />
                    {STATUS_LABELS[lead.status] || lead.status}
                </span>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                    {lead.qualification ? <p className="text-muted" style={{ margin: '0', fontSize: '12px' }}>{lead.qualification}</p> : null}

                    {/* Progress Tracker */}
                    <ProgressTracker currentStatus={lead.status} />

                    {/* Details */}
                    <div className="today-lead-details">
                        <div>
                            <span className="text-muted">Phone</span>
                            <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.phone || '—'}</p>
                        </div>
                        <div>
                            <span className="text-muted">Experience</span>
                            <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{lead.experience_level || '—'}</p>
                        </div>
                        {(lead.city || lead.place) ? (
                            <div>
                                <span className="text-muted">Location</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{[lead.place, lead.city].filter(Boolean).join(', ') || '—'}</p>
                            </div>
                        ) : null}
                        {lead.email ? (
                            <div>
                                <span className="text-muted">Email</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500, wordBreak: 'break-all', fontSize: '12px' }}>{lead.email}</p>
                            </div>
                        ) : null}
                    </div>

                    {/* Notes */}
                    {lead.notes ? (
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontStyle: 'italic', display: 'flex', gap: '6px', alignItems: 'start' }}>
                            <Icon d={ICONS.fileText} size={14} color="#9ca3af" />
                            <span>{lead.notes}</span>
                        </p>
                    ) : null}

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
                    {lead.status !== 'rejected' && lead.status !== 'approved' ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {nextStatus ? (
                                <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                                    onClick={() => onStatusChange(lead.id, nextStatus)}>
                                    {getNextLabel(nextStatus)}
                                </button>
                            ) : null}
                            <button className="small secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                                onClick={() => onView(lead)}>
                                <Icon d={ICONS.eye} size={14} /> View
                            </button>
                            <button className="small danger" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                                onClick={() => onReject(lead)}>
                                <Icon d={ICONS.x} size={12} /> Reject
                            </button>
                        </div>
                    ) : null}

                    {/* Approved / Converted Actions */}
                    {lead.status === 'approved' ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {!lead.converted_teacher_id ? (
                                <button className="small primary" style={{ flex: 1, fontSize: '12px' }}
                                    onClick={() => onConvert(lead)}>
                                    Convert to Teacher
                                </button>
                            ) : (
                                <p style={{ margin: 0, fontSize: '12px', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                                    <StatusIcon status="approved" size={14} /> Converted to teacher
                                </p>
                            )}
                            <button className="small secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                                onClick={() => onView(lead)}>
                                <Icon d={ICONS.eye} size={14} /> View
                            </button>
                            {!lead.converted_teacher_id && (
                                <button className="small danger" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                                    onClick={() => onReject(lead)}>
                                    <Icon d={ICONS.x} size={12} /> Reject
                                </button>
                            )}
                        </div>
                    ) : null}

                    {/* Rejected Actions */}
                    {lead.status === 'rejected' && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button className="small secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', flex: 1 }}
                                onClick={() => onView(lead)}>
                                <Icon d={ICONS.eye} size={14} /> View Details
                            </button>
                            <button className="small primary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', flex: 1 }}
                                onClick={() => onStatusChange(lead.id, 'new')}>
                                Restore to New
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

/* ═══════ Teacher Leads Pipeline ═══════ */
export function TeacherLeadsPage({ onNavigate }) {
    const [leads, setLeads] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('new');
    const [showConvertModal, setShowConvertModal] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(null);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showViewModal, setShowViewModal] = useState(null);
    const [showScheduleModal, setShowScheduleModal] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(null);
    const [rejectionFilter, setRejectionFilter] = useState('all');
    const [rejectionReasons, setRejectionReasons] = useState([]);

    async function loadLeads() {
        try {
            const d = await apiFetch('/teacher-leads');
            setLeads(d.items || []);
        } catch (e) { setError(e.message); }
        setLoading(false);
    }

    useEffect(() => {
        loadLeads();
        apiFetch('/teacher-leads/rejection-reasons').then(r => {
            if (r.ok) setRejectionReasons(r.items || []);
        });
    }, []);

    const TABS = [
        { id: 'new', label: 'New' },
        { id: 'contacted', label: 'Contacted' },
        { id: 'first_interview', label: '1st Interview' },
        { id: 'first_interview_done', label: '1st Done' },
        { id: 'second_interview', label: '2nd Interview' },
        { id: 'second_interview_done', label: '2nd Done' },
        { id: 'approved', label: 'Approved' },
        { id: 'rejected', label: 'Rejected' },
        { id: 'closed', label: 'Closed' },
        { id: 'all', label: 'All' }
    ];

    const filteredLeads = leads.filter(l => {
        if (activeTab !== 'all' && l.status !== activeTab) return false;
        if (activeTab === 'rejected' && rejectionFilter !== 'all') {
            return l.rejection_reason === rejectionFilter;
        }
        return true;
    });

    async function handleStatusChange(id, newStatus) {
        const lead = leads.find(l => l.id === id);
        if (!lead) return;

        // Intercept: if moving to approved, open ApprovalModal
        if (newStatus === 'approved') {
            setShowApprovalModal(lead);
            return;
        }

        // Intercept: if moving to scheduled_interview, open ScheduleInterviewModal
        if (newStatus === 'first_interview' || newStatus === 'second_interview') {
            setShowScheduleModal({ lead, status: newStatus });
            return;
        }

        // Intercept: if moving to rejected, open RejectLeadModal
        if (newStatus === 'rejected') {
            setShowRejectModal(lead);
            return;
        }

        try {
            await apiFetch(`/teacher-leads/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            await loadLeads();
        } catch (e) { alert(e.message); }
    }

    function handleReject(lead) {
        setShowRejectModal(lead);
    }



    return (
        <section className="panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>Teacher Leads</h2>
                {activeTab === 'rejected' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: 600 }}>Filter by Reason:</span>
                        <div style={{ minWidth: '240px' }}>
                            <CustomDropdown
                                value={rejectionFilter}
                                onChange={setRejectionFilter}
                                options={[
                                    { value: 'all', label: 'All Rejection Reasons', icon: ICONS.eye },
                                    ...rejectionReasons.map(r => {
                                        let icon = ICONS.x;
                                        if (r.reason.includes('salary')) icon = 'M12 1v22M17 5H9.5a4.5 4.5 0 0 0 0 9h5a4.5 4.5 0 0 1 0 9H6';
                                        if (r.reason.includes('qualified')) icon = 'M12 14l9-5-9-5-9 5 9 5z M12 14v7 M7 11.5v4.5 M17 11.5v4.5';
                                        if (r.reason.includes('interview')) icon = 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z';
                                        if (r.reason.includes('Location')) icon = 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';
                                        if (r.reason.includes('response')) icon = 'M15.05 5A5 5 0 0 1 19 8.95 M15.05 1A9 9 0 0 1 23 8.95 M18 10a8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8h1';
                                        if (r.reason.includes('another')) icon = 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M8.5 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4';
                                        return { value: r.reason, label: r.reason, icon };
                                    }),
                                    { value: 'other', label: 'Other / Custom', icon: ICONS.edit }
                                ]}
                            />
                        </div>
                    </div>
                ) : (
                    <button className="primary" onClick={() => setShowAddModal(true)}>+ Add Teacher Lead</button>
                )}
            </div>

            <div className="tabs-row" style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '4px' }}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                        {tab.id !== 'all' && <StatusIcon status={tab.id} size={13} />}
                        {tab.label} ({tab.id === 'all' ? leads.length : leads.filter(l => l.status === tab.id).length})
                    </button>
                ))}
            </div>

            {loading ? <p>Loading teacher leads...</p> : null}
            {error ? <p className="error">{error}</p> : null}

            {!loading && filteredLeads.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px' }}>👩‍🏫</p>
                    <p style={{ fontWeight: 500 }}>No teacher leads in this stage.</p>
                </div>
            ) : null}

            <div className="today-leads-grid">
                {filteredLeads.map(lead => (
                    <LeadCard
                        key={lead.id}
                        lead={lead}
                        onStatusChange={handleStatusChange}
                        onReject={handleReject}
                        onView={setShowViewModal}
                        onConvert={setShowConvertModal}
                    />
                ))}
            </div>

            {/* Add Lead Modal */}
            {showAddModal ? <AddTeacherLeadModal onClose={() => setShowAddModal(false)} onDone={() => { setShowAddModal(false); loadLeads(); }} /> : null}

            {/* Approval Modal */}
            {showApprovalModal ? <ApprovalModal lead={showApprovalModal} onClose={() => setShowApprovalModal(null)} onDone={() => { setShowApprovalModal(null); loadLeads(); }} /> : null}

            {/* View Lead Modal */}
            {showViewModal ? <ViewLeadModal lead={showViewModal} onClose={() => setShowViewModal(null)} onEdit={() => { setShowViewModal(null); setShowEditModal(showViewModal); }} /> : null}

            {/* Edit Lead Modal */}
            {showEditModal ? <EditLeadModal lead={showEditModal} onClose={() => setShowEditModal(null)} onDone={() => { setShowEditModal(null); loadLeads(); }} /> : null}

            {/* Convert to Teacher Modal */}
            {showConvertModal ? <ConvertToTeacherModal lead={showConvertModal} onClose={() => setShowConvertModal(null)} onDone={() => { setShowConvertModal(null); loadLeads(); }} /> : null}

            {/* Schedule Interview Modal */}
            {showScheduleModal ? <ScheduleInterviewModal lead={showScheduleModal.lead} targetStatus={showScheduleModal.status} onClose={() => setShowScheduleModal(null)} onDone={() => { setShowScheduleModal(null); loadLeads(); }} /> : null}

            {/* Reject Lead Modal */}
            {showRejectModal ? <RejectLeadModal lead={showRejectModal} onClose={() => setShowRejectModal(null)} onDone={() => { setShowRejectModal(null); loadLeads(); }} /> : null}
        </section>
    );
}

/* ─── Schedule Interview Modal ─── */
function ScheduleInterviewModal({ lead, targetStatus, onClose, onDone }) {
    const isSecond = targetStatus === 'second_interview';
    const [date, setDate] = useState(isSecond ? (lead.second_interview_date || '') : (lead.interview_date || ''));
    const [time, setTime] = useState(isSecond ? (lead.second_interview_time || '') : (lead.interview_time || ''));
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setErr('');
        if (!date || !time) { setErr('Date and Time are required.'); return; }
        setSaving(true);
        try {
            await apiFetch(`/teacher-leads/${lead.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: targetStatus,
                    [isSecond ? 'second_interview_date' : 'interview_date']: date,
                    [isSecond ? 'second_interview_time' : 'interview_time']: time,
                    reason: `${isSecond ? 'Second' : 'First'} interview scheduled for ${date} at ${time}`
                })
            });
            onDone();
        } catch (e) { setErr(e.message); }
        setSaving(false);
    }

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '400px', width: '90%' }}>
                <h3 style={{ margin: '0 0 16px' }}>Schedule Interview</h3>
                <p className="text-muted" style={{ margin: '0 0 16px', fontSize: '13px' }}>
                    Moving <b>{lead.full_name}</b> to <b>{STATUS_LABELS[targetStatus]}</b>.
                </p>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <DateTimePicker
                            date={date}
                            time={time}
                            onChange={({ date, time }) => { setDate(date); setTime(time); }}
                        />
                    </div>
                    {err ? <p className="error" style={{ marginBottom: '12px' }}>{err}</p> : null}
                    <div className="actions" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={saving}>{saving ? 'Schedule' : 'Confirm'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── View Lead Modal ─── */
function ViewLeadModal_OLD({ lead, onClose, onEdit }) {
    function parseSubjects(s) {
        if (Array.isArray(s)) return s;
        if (typeof s === 'string') { try { const p = JSON.parse(s); return Array.isArray(p) ? p : []; } catch { return s ? [s] : []; } }
        return [];
    }
    const subjects = parseSubjects(lead.subjects || lead.subject);
    const boards = parseSubjects(lead.boards);

    const DetailItem = ({ label, value, full }) => (
        <div style={{ width: full ? '100%' : '48%', marginBottom: '12px' }}>
            <span className="text-muted" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>{label}</span>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{value || '—'}</div>
        </div>
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Lead Details</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>×</button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <DetailItem label="Full Name" value={lead.full_name} />
                    <DetailItem label="Status" value={<span style={{ padding: '2px 8px', borderRadius: '4px', background: `${STATUS_COLORS[lead.status] || '#6b7280'}18`, color: STATUS_COLORS[lead.status] || '#6b7280', fontSize: '12px', fontWeight: 600 }}>{lead.status}</span>} />

                    <DetailItem label="Phone" value={lead.phone} />
                    <DetailItem label="Email" value={lead.email} />

                    <DetailItem label="Experience" value={lead.experience_level} />
                    <DetailItem label="Type" value={lead.experience_type} />

                    <div style={{ width: '100%', marginBottom: '12px' }}>
                        <span className="text-muted" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Subjects</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {subjects.length ? subjects.map((s, i) => (
                                <span key={i} style={{ background: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>{s}</span>
                            )) : '—'}
                        </div>
                    </div>

                    <div style={{ width: '100%', marginBottom: '12px' }}>
                        <span className="text-muted" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Boards</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {boards.length ? boards.map((b, i) => (
                                <span key={i} style={{ background: '#f0fdf4', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>{b}</span>
                            )) : '—'}
                        </div>
                    </div>

                    <DetailItem label="Qualification" value={lead.qualification} full />
                    <DetailItem label="Location" value={[lead.place, lead.city].filter(Boolean).join(', ')} full />
                    <DetailItem label="Notes" value={lead.notes} full />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>Close</button>
                    <button onClick={onEdit} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icon d={ICONS.edit} size={16} /> Edit Details
                    </button>
                </div>
            </div>
        </div>
    );
}


/* ─── Add Teacher Lead Modal (wide, multi-column) ─── */
function AddTeacherLeadModal({ onClose, onDone }) {
    const [form, setForm] = useState({
        full_name: '', phone: '', email: '', subjects: [], boards: [], mediums: [], experience_level: 'fresher',
        experience_type: '', experience_duration: '', qualification: '', place: '', city: '', notes: ''
    });
    const [allSubjects, setAllSubjects] = useState([]);
    const [allBoards, setAllBoards] = useState([]);
    const [allMediums, setAllMediums] = useState([]);
    const [err, setErr] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiFetch('/subjects').then(r => r.ok && setAllSubjects(r.subjects.map(s => s.name)));
        apiFetch('/boards').then(r => r.ok && setAllBoards(r.boards.map(b => b.name)));
        apiFetch('/mediums').then(r => r.ok && setAllMediums(r.mediums.map(m => m.name)));
    }, []);

    const createSubject = async (name) => {
        const res = await apiFetch('/subjects', { method: 'POST', body: { name } });
        if (res.ok) {
            setAllSubjects(prev => [...prev, res.subject.name].sort());
            setForm(f => ({ ...f, subjects: [...f.subjects, res.subject.name] }));
        }
    };

    const createBoard = async (name) => {
        const res = await apiFetch('/boards', { method: 'POST', body: { name } });
        if (res.ok) {
            setAllBoards(prev => [...prev, res.board.name].sort());
            setForm(f => ({ ...f, boards: [...f.boards, res.board.name] }));
        }
    };

    const createMedium = async (name) => {
        const res = await apiFetch('/mediums', { method: 'POST', body: { name } });
        if (res.ok) {
            setAllMediums(prev => [...prev, res.medium.name].sort());
            setForm(f => ({ ...f, mediums: [...f.mediums, res.medium.name] }));
        }
    };

    function upd(key, val) { setForm(f => ({ ...f, [key]: val })); }

    async function handleSubmit(e) {
        e.preventDefault();
        setErr('');
        if (!form.full_name.trim() || !form.phone.trim()) { setErr('Name and Phone are required.'); return; }
        setSaving(true);
        try {
            await apiFetch('/teacher-leads', { method: 'POST', body: JSON.stringify(form) });
            onDone();
        } catch (e) { setErr(e.message); }
        setSaving(false);
    }

    const isExperienced = form.experience_level !== 'fresher';
    const gridRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '800px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Add Teacher Lead</h3>
                <form onSubmit={handleSubmit}>
                    {/* Row 1: Name + Phone */}
                    <div style={gridRow}>
                        <label>Full Name *<input value={form.full_name} onChange={e => upd('full_name', e.target.value)} required placeholder="Full name" /></label>
                        <label>Phone *<input value={form.phone} onChange={e => upd('phone', e.target.value)} required placeholder="Phone number" /></label>
                    </div>
                    {/* Row 2: Email + Qualification */}
                    <div style={{ ...gridRow, marginTop: '10px' }}>
                        <label>Email<input type="email" value={form.email} onChange={e => upd('email', e.target.value)} placeholder="Email address" /></label>
                        <label>Qualification<input value={form.qualification} onChange={e => upd('qualification', e.target.value)} placeholder="e.g. B.Ed, M.Sc" /></label>
                    </div>

                    {/* Subjects & Boards & Mediums */}
                    <div style={{ ...gridRow, marginTop: '14px', gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <label style={{ display: 'block' }}>Subjects
                            <MultiSelectDropdown value={form.subjects} onChange={v => upd('subjects', v)}
                                options={allSubjects} onCreate={createSubject} placeholder="Select subjects..." />
                        </label>
                        <label style={{ display: 'block' }}>Boards
                            <MultiSelectDropdown value={form.boards} onChange={v => upd('boards', v)}
                                options={allBoards} onCreate={createBoard} placeholder="Select boards..." />
                        </label>
                        <label style={{ display: 'block' }}>Mediums
                            <MultiSelectDropdown value={form.mediums} onChange={v => upd('mediums', v)}
                                options={allMediums} onCreate={createMedium} placeholder="Select mediums..." />
                        </label>
                    </div>

                    {/* Row 3: Experience Level + Type + Duration */}
                    <div style={{ ...gridRow, marginTop: '14px', gridTemplateColumns: isExperienced ? '1fr 1fr 1fr' : '1fr 1fr' }}>
                        <label>Experience Level
                            <CustomDropdown value={form.experience_level} onChange={v => upd('experience_level', v)}
                                options={[{ value: 'fresher', label: 'Fresher' }, { value: 'experienced', label: 'Experienced' }]} />
                        </label>
                        {isExperienced && (
                            <>
                                <label>Exp. Type<input value={form.experience_type} onChange={e => upd('experience_type', e.target.value)} placeholder="e.g. School Teaching" /></label>
                                <label>Exp. Duration<input value={form.experience_duration} onChange={e => upd('experience_duration', e.target.value)} placeholder="e.g. 3 years" /></label>
                            </>
                        )}
                    </div>

                    {/* Row 4: Place + City */}
                    <div style={{ ...gridRow, marginTop: '10px' }}>
                        <label>Place<input value={form.place} onChange={e => upd('place', e.target.value)} placeholder="Locality / Area" /></label>
                        <label>City<input value={form.city} onChange={e => upd('city', e.target.value)} placeholder="City" /></label>
                    </div>

                    {/* Notes - full width */}
                    <div style={{ marginTop: '10px' }}>
                        <label>Notes<textarea value={form.notes} onChange={e => upd('notes', e.target.value)} rows={2} placeholder="Any additional notes..." style={{ width: '100%' }} /></label>
                    </div>

                    {err ? <p className="error" style={{ marginTop: '8px' }}>{err}</p> : null}
                    <div className="actions" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Lead'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/* ─── Approval Modal (account details + communication level) ─── */
function ApprovalModal({ lead, onClose, onDone }) {
    const [form, setForm] = useState({
        account_holder_name: lead.account_holder_name || '',
        account_number: lead.account_number || '',
        ifsc_code: lead.ifsc_code || '',
        gpay_holder_name: lead.gpay_holder_name || '',
        gpay_number: lead.gpay_number || '',
        upi_id: lead.upi_id || '',
        communication_level: lead.communication_level || ''
    });
    const [err, setErr] = useState('');
    const [saving, setSaving] = useState(false);

    function upd(key, val) { setForm(f => ({ ...f, [key]: val })); }

    async function handleSaveDraft() {
        setErr('');
        setSaving(true);
        try {
            await apiFetch(`/teacher-leads/${lead.id}`, { method: 'PATCH', body: JSON.stringify(form) });
            onDone();
        } catch (e) { setErr(e.message); }
        setSaving(false);
    }

    async function handleApprove(e) {
        e.preventDefault();
        setErr('');
        if (!form.communication_level) { setErr('Please specify the communication level.'); return; }
        setSaving(true);
        try {
            await apiFetch(`/teacher-leads/${lead.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ ...form, status: 'approved' })
            });
            onDone();
        } catch (e) { setErr(e.message); }
        setSaving(false);
    }

    const inputStyle = { width: '100%' };

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '800px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 4px' }}>Approve: {lead.full_name}</h3>
                <p className="text-muted" style={{ margin: '0 0 16px', fontSize: '13px' }}>Fill in the account and communication details before approval.</p>

                <form onSubmit={handleApprove}>
                    {/* Bank Details */}
                    <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <legend style={{ fontSize: '13px', fontWeight: 600, color: '#374151', padding: '0 8px' }}>Bank Account Details</legend>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <label>Account Holder Name <input value={form.account_holder_name} onChange={e => upd('account_holder_name', e.target.value)} style={inputStyle} /></label>
                            <label>Account Number <input value={form.account_number} onChange={e => upd('account_number', e.target.value)} style={inputStyle} /></label>
                            <label>IFSC Code <input value={form.ifsc_code} onChange={e => upd('ifsc_code', e.target.value)} style={inputStyle} placeholder="e.g. SBIN0001234" /></label>
                        </div>
                    </fieldset>

                    {/* GPay Details */}
                    <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <legend style={{ fontSize: '13px', fontWeight: 600, color: '#374151', padding: '0 8px' }}>GPay Details</legend>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <label>GPay Holder Name <input value={form.gpay_holder_name} onChange={e => upd('gpay_holder_name', e.target.value)} style={inputStyle} /></label>
                            <label>GPay Number <input value={form.gpay_number} onChange={e => upd('gpay_number', e.target.value)} style={inputStyle} /></label>
                            <label>UPI ID <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span><input value={form.upi_id} onChange={e => upd('upi_id', e.target.value)} style={inputStyle} placeholder="e.g. name@upi" /></label>
                        </div>
                    </fieldset>

                    {/* Communication Level */}
                    <fieldset style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <legend style={{ fontSize: '13px', fontWeight: 600, color: '#374151', padding: '0 8px' }}>Communication Level *</legend>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {['Fluent', 'Mixed', 'Average', 'Poor'].map(level => (
                                <label key={level} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                    padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
                                    border: `2px solid ${form.communication_level === level ? '#6366f1' : '#e5e7eb'}`,
                                    background: form.communication_level === level ? '#eef2ff' : '#fff',
                                    color: form.communication_level === level ? '#4338ca' : '#374151',
                                    transition: 'all 0.15s ease'
                                }}>
                                    <input type="radio" name="comm_level" value={level} checked={form.communication_level === level}
                                        onChange={() => upd('communication_level', level)} style={{ display: 'none' }} />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {err ? <p className="error" style={{ marginBottom: '12px' }}>{err}</p> : null}

                    <div className="actions" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="button" onClick={handleSaveDraft} disabled={saving}
                            style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}>
                            Save Draft
                        </button>
                        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Approve'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/* ─── Edit Lead Modal ─── */
function EditLeadModal({ lead, onClose, onDone }) {


    const [form, setForm] = useState({
        full_name: lead.full_name || '', phone: lead.phone || '', email: lead.email || '',
        subjects: parseSubjects(lead.subjects || lead.subject),
        boards: parseSubjects(lead.boards),
        mediums: parseSubjects(lead.mediums),
        experience_level: lead.experience_level || 'fresher',
        experience_type: lead.experience_type || '', experience_duration: lead.experience_duration || '',
        qualification: lead.qualification || '', place: lead.place || '', city: lead.city || '', notes: lead.notes || '',
        // Additional Details
        interview_date: lead.interview_date || '', interview_time: lead.interview_time || '',
        second_interview_date: lead.second_interview_date || '', second_interview_time: lead.second_interview_time || '',
        account_holder_name: lead.account_holder_name || '', account_number: lead.account_number || '', ifsc_code: lead.ifsc_code || '',
        gpay_holder_name: lead.gpay_holder_name || '', gpay_number: lead.gpay_number || '', upi_id: lead.upi_id || '',
        communication_level: lead.communication_level || '',
        rejection_reason: lead.rejection_reason || ''
    });
    const [allSubjects, setAllSubjects] = useState([]);
    const [allBoards, setAllBoards] = useState([]);
    const [allMediums, setAllMediums] = useState([]);
    const [err, setErr] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiFetch('/subjects').then(r => r.ok && setAllSubjects(r.subjects.map(s => s.name)));
        apiFetch('/boards').then(r => r.ok && setAllBoards(r.boards.map(b => b.name)));
        apiFetch('/mediums').then(r => r.ok && setAllMediums(r.mediums.map(m => m.name)));
    }, []);

    const createSubject = async (name) => {
        const res = await apiFetch('/subjects', { method: 'POST', body: { name } });
        if (res.ok) {
            setAllSubjects(prev => [...prev, res.subject.name].sort());
            setForm(f => ({ ...f, subjects: [...f.subjects, res.subject.name] }));
        }
    };

    const createBoard = async (name) => {
        const res = await apiFetch('/boards', { method: 'POST', body: { name } });
        if (res.ok) {
            setAllBoards(prev => [...prev, res.board.name].sort());
            setForm(f => ({ ...f, boards: [...f.boards, res.board.name] }));
        }
    };

    const createMedium = async (name) => {
        const res = await apiFetch('/mediums', { method: 'POST', body: { name } });
        if (res.ok) {
            setAllMediums(prev => [...prev, res.medium.name].sort());
            setForm(f => ({ ...f, mediums: [...f.mediums, res.medium.name] }));
        }
    };

    function upd(key, val) { setForm(f => ({ ...f, [key]: val })); }

    async function handleSubmit(e) {
        e.preventDefault();
        setErr('');
        if (!form.full_name.trim() || !form.phone.trim()) { setErr('Name and Phone are required.'); return; }
        setSaving(true);
        try {
            await apiFetch(`/teacher-leads/${lead.id}`, { method: 'PATCH', body: JSON.stringify(form) });
            onDone();
        } catch (e) { setErr(e.message); }
        setSaving(false);
    }

    const isExperienced = form.experience_level !== 'fresher';

    const gridRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '800px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Edit Lead: {lead.full_name}</h3>
                <form onSubmit={handleSubmit}>
                    {/* Row 1: Name + Phone */}
                    <div style={gridRow}>
                        <label>Full Name *<input value={form.full_name} onChange={e => upd('full_name', e.target.value)} required /></label>
                        <label>Phone *<input value={form.phone} onChange={e => upd('phone', e.target.value)} required /></label>
                    </div>
                    {/* Row 2: Email + Qualification */}
                    <div style={{ ...gridRow, marginTop: '10px' }}>
                        <label>Email<input type="email" value={form.email} onChange={e => upd('email', e.target.value)} /></label>
                        <label>Qualification<input value={form.qualification} onChange={e => upd('qualification', e.target.value)} /></label>
                    </div>

                    {/* Subjects & Boards & Mediums */}
                    <div style={{ ...gridRow, marginTop: '14px', gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <label style={{ display: 'block' }}>Subjects
                            <MultiSelectDropdown value={form.subjects} onChange={v => upd('subjects', v)}
                                options={allSubjects} onCreate={createSubject} placeholder="Select subjects..." />
                        </label>
                        <label style={{ display: 'block' }}>Boards
                            <MultiSelectDropdown value={form.boards} onChange={v => upd('boards', v)}
                                options={allBoards} onCreate={createBoard} placeholder="Select boards..." />
                        </label>
                        <label style={{ display: 'block' }}>Mediums
                            <MultiSelectDropdown value={form.mediums} onChange={v => upd('mediums', v)}
                                options={allMediums} onCreate={createMedium} placeholder="Select mediums..." />
                        </label>
                    </div>

                    {/* Row 3: Experience Level + Type + Duration */}
                    <div style={{ ...gridRow, marginTop: '14px', gridTemplateColumns: isExperienced ? '1fr 1fr 1fr' : '1fr 1fr' }}>
                        <label>Experience Level
                            <CustomDropdown value={form.experience_level} onChange={v => upd('experience_level', v)}
                                options={[{ value: 'fresher', label: 'Fresher' }, { value: 'experienced', label: 'Experienced' }]} />
                        </label>
                        {isExperienced && (
                            <>
                                <label>Exp. Type<input value={form.experience_type} onChange={e => upd('experience_type', e.target.value)} placeholder="e.g. School Teaching" /></label>
                                <label>Exp. Duration<input value={form.experience_duration} onChange={e => upd('experience_duration', e.target.value)} placeholder="e.g. 3 years" /></label>
                            </>
                        )}
                    </div>

                    <div style={{ ...gridRow, marginTop: '10px' }}>
                        <label>Place<input value={form.place} onChange={e => upd('place', e.target.value)} placeholder="Locality / Area" /></label>
                        <label>City<input value={form.city} onChange={e => upd('city', e.target.value)} placeholder="City" /></label>
                    </div>

                    {/* Interview Details - Conditional (First & Second) */}
                    {(lead.interview_date || lead.interview_time || lead.second_interview_date || lead.second_interview_time || lead.status === 'approved') && (
                        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {/* First Interview */}
                            {(lead.interview_date || lead.interview_time || lead.status === 'approved') && (
                                <div style={{ flex: 1, minWidth: '300px', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#111827' }}>First Interview Schedule</h4>
                                    <DateTimePicker
                                        date={form.interview_date}
                                        time={form.interview_time}
                                        onChange={({ date, time }) => { upd('interview_date', date); upd('interview_time', time); }}
                                    />
                                </div>
                            )}
                            {/* Second Interview */}
                            {(lead.second_interview_date || lead.second_interview_time) && (
                                <div style={{ flex: 1, minWidth: '300px', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#111827' }}>Second Interview Schedule</h4>
                                    <DateTimePicker
                                        date={form.second_interview_date}
                                        time={form.second_interview_time}
                                        onChange={({ date, time }) => { upd('second_interview_date', date); upd('second_interview_time', time); }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bank Details - Conditional */}
                    {(lead.account_holder_name || lead.account_number || lead.status === 'approved') && (
                        <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                            <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#111827' }}>Bank & GPay Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <label>Account Holder<input value={form.account_holder_name} onChange={e => upd('account_holder_name', e.target.value)} /></label>
                                <label>Account Number<input value={form.account_number} onChange={e => upd('account_number', e.target.value)} /></label>
                                <label>IFSC Code<input value={form.ifsc_code} onChange={e => upd('ifsc_code', e.target.value)} /></label>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <label>GPay Name<input value={form.gpay_holder_name} onChange={e => upd('gpay_holder_name', e.target.value)} /></label>
                                <label>GPay Number<input value={form.gpay_number} onChange={e => upd('gpay_number', e.target.value)} /></label>
                                <label>UPI ID<input value={form.upi_id} onChange={e => upd('upi_id', e.target.value)} /></label>
                            </div>
                        </div>
                    )}

                    {/* Communication Level */}
                    <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#111827' }}>Communication Level</h4>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {['Fluent', 'Mixed', 'Average', 'Poor'].map(level => (
                                <label key={level} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                    padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
                                    border: `2px solid ${form.communication_level === level ? '#6366f1' : '#e5e7eb'}`,
                                    background: form.communication_level === level ? '#eef2ff' : '#fff',
                                    color: form.communication_level === level ? '#4338ca' : '#374151',
                                    transition: 'all 0.15s ease'
                                }}>
                                    <input type="radio" name="comm_level_edit" value={level} checked={form.communication_level === level}
                                        onChange={() => upd('communication_level', level)} style={{ display: 'none' }} />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Notes - full width */}
                    <div style={{ marginTop: '10px' }}>
                        <label>Notes<textarea value={form.notes} onChange={e => upd('notes', e.target.value)} rows={2} placeholder="Any additional notes..." style={{ width: '100%' }} /></label>
                    </div>

                    {/* Rejection Reason (If status is rejected) */}
                    {lead.status === 'rejected' && (
                        <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', border: '1px solid #fee2e2', background: '#fef2f2' }}>
                            <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#991b1b' }}>Rejection Details</h4>
                            <label>Rejection Reason
                                <textarea value={form.rejection_reason} onChange={e => upd('rejection_reason', e.target.value)}
                                    rows={2} style={{ width: '100%', borderColor: '#fecaca' }} />
                            </label>
                        </div>
                    )}

                    {err ? <p className="error" style={{ marginTop: '8px' }}>{err}</p> : null}
                    <div className="actions" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button type="button" className="secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/* ─── Convert to Teacher Modal ─── */
/* ─── Convert to Teacher Modal ─── */
function ConvertToTeacherModal({ lead, onClose, onDone }) {
    const [teacherCode, setTeacherCode] = useState('');
    const [email, setEmail] = useState(lead.email || '');
    const [password, setPassword] = useState('');
    const [rate, setRate] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch next teacher code
        apiFetch('/teacher-leads/next-teacher-code')
            .then(data => {
                if (data.teacherCode) {
                    setTeacherCode(data.teacherCode);
                    setPassword(data.teacherCode); // Default password = Teacher ID
                }
            })
            .catch(e => console.error('Failed to fetch next teacher code', e));
    }, []);

    async function handleConvert(e) {
        e.preventDefault();
        setErr('');
        if (!email.trim() || !password.trim()) { setErr('Email and Password are required.'); return; }

        setLoading(true);
        try {
            await apiFetch(`/teacher-leads/${lead.id}/convert`, {
                method: 'POST',
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim(),
                    per_hour_rate: rate ? Number(rate) : null
                })
            });
            onDone();
        } catch (e) { setErr(e.message); }
        setLoading(false);
    }

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '450px' }}>
                <h3>Convert to Teacher</h3>
                <p className="text-muted" style={{ margin: '0 0 12px', fontSize: '13px' }}>
                    Converting <strong>{lead.full_name}</strong> to a teacher in the pool.
                    <br />A new login will be created automatically.
                </p>
                <form className="form-grid" onSubmit={handleConvert}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <label>
                            Teacher ID (Auto)
                            <input value={teacherCode} readOnly style={{ background: '#f3f4f6', cursor: 'not-allowed' }} />
                        </label>
                        <label>
                            Per Hour Rate
                            <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="Optional" />
                        </label>
                    </div>

                    <label style={{ marginTop: '4px' }}>
                        Login Email *
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </label>

                    <label>
                        Login Password *
                        <input type="text" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Visible Password" />
                        <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>Default set to Teacher ID. You can change it.</span>
                    </label>

                    {err ? <p className="error">{err}</p> : null}
                    <div className="actions" style={{ marginTop: '16px' }}>
                        <button type="button" className="secondary" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Converting...' : '🚀 Convert & Onboard'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/* ═══════ Teacher Pool Page (TC view) ═══════ */
export function TCTeacherPoolPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewTeacher, setViewTeacher] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const d = await apiFetch('/teachers/pool');
                setTeachers(d.items || []);
            } catch (e) { setError(e.message); }
            setLoading(false);
        })();
    }, []);

    if (loading) return <section className="panel"><p>Loading teacher pool...</p></section>;

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Teacher Pool ({teachers.length})</h2>
            {error ? <p className="error">{error}</p> : null}

            {!teachers.length ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px' }}>👩‍🏫</p>
                    <p style={{ fontWeight: 500 }}>No teachers in pool yet. Convert leads to add teachers.</p>
                </div>
            ) : null}

            <div className="today-leads-grid">
                {teachers.map(t => (
                    <div key={t.id} className="card today-lead-card" style={{
                        padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                        borderLeft: '4px solid #10b981',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{t.users?.full_name || 'Unknown'}</h3>
                                <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '12px' }}>{t.teacher_code}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 10 }}>
                                <span style={{
                                    padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                                    background: '#dcfce7', color: '#15803d'
                                }}>Active</span>
                                <button onClick={(e) => { e.stopPropagation(); setViewTeacher(t); }} title="View Details"
                                    style={{
                                        background: '#fff',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: '#374151',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        fontSize: '11px',
                                        fontWeight: 600
                                    }}>
                                    <Icon d={ICONS.eye} size={14} /> View
                                </button>
                            </div>
                        </div>
                        <div className="today-lead-details">
                            <div>
                                <span className="text-muted">Contact</span>
                                <div style={{ fontSize: '12px', fontWeight: 500 }}>{t.users?.email || '—'}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.phone || ''}</div>
                                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{[t.place, t.city].filter(Boolean).join(', ')}</div>
                            </div>
                            <div>
                                <span className="text-muted">Experience</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{t.experience_level || '—'}</p>
                                <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>{t.qualification || ''}</p>
                            </div>
                            <div>
                                <span className="text-muted">Rate/hr</span>
                                <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{t.per_hour_rate ? `₹${t.per_hour_rate}` : '—'}</p>
                            </div>
                        </div>

                        {(t.subjects_taught?.length > 0 || t.languages?.length > 0) && (
                            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                    {(t.subjects_taught || []).slice(0, 3).map((s, i) => (
                                        <span key={i} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8' }}>{s}</span>
                                    ))}
                                    {(t.subjects_taught?.length > 3) && <span style={{ fontSize: '10px', color: '#6b7280' }}>+{t.subjects_taught.length - 3}</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {(t.languages || []).slice(0, 3).map((l, i) => (
                                        <span key={i} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: '#fdf4ff', color: '#86198f' }}>{l}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {t.teacher_availability?.length ? (
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                📅 {t.teacher_availability.length} availability slots
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>

            {viewTeacher && <ViewTeacherModal teacher={viewTeacher} onClose={() => setViewTeacher(null)} />}
        </section>
    );
}


/* ═══════ Teacher Performance Page ═══════ */
export function TeacherPerformancePage() {
    const [teachers, setTeachers] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [p] = await Promise.all([
                    apiFetch('/teachers/pool'),
                ]);
                setTeachers(p.items || []);
                // Try fetching session data if available
                try {
                    const s = await apiFetch('/students/sessions/history');
                    setSessions(s.items || []);
                } catch (e) { }
            } catch (e) { }
            setLoading(false);
        })();
    }, []);

    // Group sessions by teacher
    const teacherStats = useMemo(() => {
        const map = {};
        teachers.forEach(t => {
            map[t.user_id] = {
                name: t.users?.full_name || 'Unknown',
                code: t.teacher_code,
                rate: t.per_hour_rate,
                experience: t.experience_level,
                totalSessions: 0,
                completedSessions: 0,
                pendingSessions: 0,
            };
        });
        sessions.forEach(s => {
            if (map[s.teacher_id]) {
                map[s.teacher_id].totalSessions++;
                if (s.status === 'completed' || s.status === 'verified') {
                    map[s.teacher_id].completedSessions++;
                } else {
                    map[s.teacher_id].pendingSessions++;
                }
            }
        });
        return Object.values(map).sort((a, b) => b.completedSessions - a.completedSessions);
    }, [teachers, sessions]);

    if (loading) return <section className="panel"><p>Loading performance data...</p></section>;

    return (
        <section className="panel">
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>Teacher Performance</h2>

            <div className="grid-three" style={{ marginBottom: '16px' }}>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{teachers.length}</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Total Teachers</p>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{sessions.filter(s => s.status === 'completed' || s.status === 'verified').length}</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Sessions Completed</p>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>{sessions.filter(s => s.status !== 'completed' && s.status !== 'verified').length}</p>
                    <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>Sessions Pending</p>
                </div>
            </div>

            {/* Leaderboard */}
            <article className="card" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Teacher Leaderboard</h3>
                <div className="table-wrap mobile-friendly-table">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Teacher</th>
                                <th>Code</th>
                                <th>Experience</th>
                                <th>Sessions</th>
                                <th>Completed</th>
                                <th>Rate/hr</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacherStats.map((t, idx) => (
                                <tr key={idx}>
                                    <td data-label="#">{idx + 1}</td>
                                    <td data-label="Teacher">{t.name}</td>
                                    <td data-label="Code">{t.code || '—'}</td>
                                    <td data-label="Experience">{t.experience || '—'}</td>
                                    <td data-label="Sessions">{t.totalSessions}</td>
                                    <td data-label="Completed">{t.completedSessions}</td>
                                    <td data-label="Rate/hr">{t.rate ? `₹${t.rate}` : '—'}</td>
                                </tr>
                            ))}
                            {!teacherStats.length ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No teachers yet.</td></tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
    );
}


/* ─── Reject Lead Modal ─── */
function RejectLeadModal({ lead, onClose, onDone }) {
    const [reasons, setReasons] = useState([]);
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() => {
        apiFetch('/teacher-leads/rejection-reasons').then(r => {
            if (r.ok) setReasons(r.items);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reason = selectedReason === 'other' || !selectedReason ? customReason : selectedReason;
        if (!reason) { setErr('Please specify a reason.'); return; }
        setSaving(true);
        try {
            await apiFetch(`/teacher-leads/${lead.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: 'rejected',
                    rejection_reason: reason,
                    reason: `Rejected: ${reason}`
                })
            });
            onDone();
        } catch (e) { setErr(e.message); }
        setSaving(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '440px', width: '90%', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Reject Lead</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <Icon d={ICONS.x} size={20} />
                    </button>
                </div>

                <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#374151' }}>
                    Select a reason for rejecting <b>{lead.full_name}</b>:
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {reasons.map(r => (
                            <label key={r.id} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                cursor: 'pointer', fontSize: '14px', color: '#1f2937',
                                padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb',
                                background: selectedReason === r.reason ? '#f9fafb' : 'transparent',
                                transition: 'all 0.2s'
                            }}>
                                <input type="radio" name="rejection_reason" value={r.reason}
                                    checked={selectedReason === r.reason}
                                    onChange={e => setSelectedReason(e.target.value)}
                                    style={{ width: '16px', height: '16px' }} />
                                {r.reason}
                            </label>
                        ))}
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            cursor: 'pointer', fontSize: '14px', color: '#1f2937',
                            padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb',
                            background: selectedReason === 'other' ? '#f9fafb' : 'transparent',
                            transition: 'all 0.2s'
                        }}>
                            <input type="radio" name="rejection_reason" value="other"
                                checked={selectedReason === 'other'}
                                onChange={e => setSelectedReason(e.target.value)}
                                style={{ width: '16px', height: '16px' }} />
                            Other / Custom Reason
                        </label>
                    </div>

                    {(selectedReason === 'other' || reasons.length === 0) && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Specify Reason</label>
                            <textarea
                                value={customReason}
                                onChange={e => setCustomReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                rows={3}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                            />
                        </div>
                    )}

                    {err ? <p className="error" style={{ marginBottom: '16px', fontSize: '13px' }}>{err}</p> : null}

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button type="button" className="secondary" onClick={onClose} style={{ minWidth: '100px' }}>Cancel</button>
                        <button type="submit" className="danger" disabled={saving} style={{ minWidth: '120px' }}>
                            {saving ? 'Processing...' : 'Reject Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── View Lead Modal ─── */
/* ─── View Lead Modal ─── */
function ViewLeadModal({ lead, onClose, onEdit }) {
    const [activeTab, setActiveTab] = useState('details');
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (activeTab === 'history' && history.length === 0) {
            setLoadingHistory(true);
            apiFetch(`/teacher-leads/${lead.id}/history`)
                .then(data => {
                    if (data.items) setHistory(data.items);
                })
                .catch(e => console.error(e))
                .finally(() => setLoadingHistory(false));
        }
    }, [activeTab, lead.id]);

    const subjects = parseSubjects(lead.subjects || lead.subject);
    const boards = parseSubjects(lead.boards);
    const mediums = parseSubjects(lead.mediums);

    const gridRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' };

    const ReadOnlyField = ({ label, value, full }) => (
        <div style={{ gridSize: full ? 'span 2' : 'span 1' }}>
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

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: '800px', width: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>

                {/* Header */}
                <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>{lead.full_name}</h3>
                        <Badge color={STATUS_COLORS[lead.status]}>{STATUS_LABELS[lead.status] || lead.status}</Badge>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}>
                        <Icon d={ICONS.x} size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ padding: '0 24px', marginTop: '20px', display: 'flex', gap: '20px', borderBottom: '1px solid #e5e7eb' }}>
                    <button
                        style={{
                            padding: '0 0 12px',
                            background: 'none',
                            border: 'none',
                            borderBottom: `2px solid ${activeTab === 'details' ? '#3b82f6' : 'transparent'}`,
                            color: activeTab === 'details' ? '#3b82f6' : '#6b7280',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        style={{
                            padding: '0 0 12px',
                            background: 'none',
                            border: 'none',
                            borderBottom: `2px solid ${activeTab === 'history' ? '#3b82f6' : 'transparent'}`,
                            color: activeTab === 'history' ? '#3b82f6' : '#6b7280',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('history')}
                    >
                        History & Notes
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    {activeTab === 'details' ? (
                        <>
                            {/* Personal Info */}
                            <div style={gridRow}>
                                <ReadOnlyField label="Full Name" value={lead.full_name} />
                                <ReadOnlyField label="Phone" value={lead.phone} />
                            </div>

                            <div style={gridRow}>
                                <ReadOnlyField label="Email" value={lead.email} />
                                <ReadOnlyField label="Qualification" value={lead.qualification} />
                            </div>

                            {/* Context: Subjects & Boards & Mediums */}
                            <div style={{ ...gridRow, gridTemplateColumns: '1fr 1fr 1fr' }}>
                                <ReadOnlyField label="Subjects" value={
                                    subjects.length ? subjects.map((s, i) => <Badge key={i} color="#3b82f6">{s}</Badge>) : null
                                } />
                                <ReadOnlyField label="Boards" value={
                                    boards.length ? boards.map((b, i) => <Badge key={i} color="#15803d">{b}</Badge>) : null
                                } />
                                <ReadOnlyField label="Mediums" value={
                                    mediums.length ? mediums.map((m, i) => <Badge key={i} color="#8b5cf6">{m}</Badge>) : null
                                } />
                            </div>

                            {/* Experience */}
                            <div style={{ ...gridRow, gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                                <ReadOnlyField label="Experience Level" value={lead.experience_level === 'fresher' ? 'Fresher' : 'Experienced'} />
                                <ReadOnlyField label="Experience Type" value={lead.experience_type === 'school' ? 'School' : lead.experience_type === 'coaching' ? 'Coaching' : lead.experience_type} />
                                <ReadOnlyField label="Duration" value={lead.experience_duration || null} />
                                <ReadOnlyField label="Comm. Level" value={lead.communication_level ? <Badge color={lead.communication_level === 'Fluent' ? '#10b981' : lead.communication_level === 'Mixed' ? '#3b82f6' : lead.communication_level === 'Average' ? '#f59e0b' : '#ef4444'}>{lead.communication_level}</Badge> : '—'} />
                            </div>

                            {/* Location */}
                            <div style={gridRow}>
                                <ReadOnlyField label="Place/Area" value={lead.place} />
                                <ReadOnlyField label="City" value={lead.city} />
                            </div>

                            {/* Notes */}
                            <div style={{ marginBottom: '24px' }}>
                                <ReadOnlyField label="Notes" full value={<span style={{ fontStyle: 'italic', color: '#555' }}>{lead.notes}</span>} />
                            </div>

                            {/* Rejection Reason (Visible if rejected) */}
                            {lead.status === 'rejected' && (
                                <div style={{ marginBottom: '24px' }}>
                                    <ReadOnlyField label="Rejection Reason" full value={<span style={{ fontWeight: 600, color: '#dc2626' }}>{lead.rejection_reason || 'No reason specified'}</span>} />
                                </div>
                            )}

                            {/* Interview & Account Info (Visible if present or approved) */}
                            {(lead.interview_date || lead.second_interview_date || lead.account_holder_name || lead.gpay_holder_name || lead.status === 'approved') && (
                                <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#111827' }}>Additional Details</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {(lead.interview_date || lead.status === 'approved') && (
                                            <>
                                                <ReadOnlyField label="First Interview Date" value={lead.interview_date ? new Date(lead.interview_date).toLocaleDateString('en-GB') : '—'} />
                                                <ReadOnlyField label="First Interview Time" value={lead.interview_time ? new Date(`2000-01-01T${lead.interview_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—'} />
                                            </>
                                        )}
                                        {(lead.second_interview_date || lead.status === 'approved') && (
                                            <>
                                                <ReadOnlyField label="Second Interview Date" value={lead.second_interview_date ? new Date(lead.second_interview_date).toLocaleDateString('en-GB') : '—'} />
                                                <ReadOnlyField label="Second Interview Time" value={lead.second_interview_time ? new Date(`2000-01-01T${lead.second_interview_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—'} />
                                            </>
                                        )}
                                        {lead.account_holder_name && (
                                            <>
                                                <ReadOnlyField label="Account Holder" value={lead.account_holder_name} />
                                                <ReadOnlyField label="Account Number" value={lead.account_number} />
                                                <ReadOnlyField label="IFSC Code" value={lead.ifsc_code} />
                                                <ReadOnlyField label="GPay Name" value={lead.gpay_holder_name} />
                                                <ReadOnlyField label="GPay Number" value={lead.gpay_number} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                                <button onClick={onClose} className="secondary" style={{ minWidth: '100px' }}>Close</button>
                                <button onClick={onEdit} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px', justifyContent: 'center' }}>
                                    <Icon d={ICONS.edit} size={16} /> Edit Details
                                </button>
                            </div>
                        </>
                    ) : (
                        /* History Tab Content */
                        <div>
                            {loadingHistory ? <p>Loading history...</p> : history.length === 0 ? <p className="text-muted">No history found for this lead.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {history.map((h, i) => (
                                        <div key={h.id || i} style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d1d5db', border: '2px solid #fff', boxShadow: '0 0 0 2px #e5e7eb' }}></div>
                                                {i < history.length - 1 && <div style={{ width: '2px', flex: 1, background: '#e5e7eb', marginTop: '4px' }}></div>}
                                            </div>
                                            <div style={{ flex: 1, marginTop: '-6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        {new Date(h.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {h.old_status && h.new_status && (
                                                        <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: '#f3f4f6', color: '#374151' }}>
                                                            {STATUS_LABELS[h.old_status] || h.old_status} → {STATUS_LABELS[h.new_status] || h.new_status}
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>{h.reason || h.note || 'Status updated'}</p>
                                                {h.changed_by_name && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>by {h.changed_by_name}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <button onClick={onClose} className="secondary">Close</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
