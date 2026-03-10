
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { ROLE_OPTIONS } from '../../lib/roles.js';

/* ─── Constants ─── */
const PRIORITY_OPTIONS = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' }
];
const CATEGORY_OPTIONS = [
    { label: 'HR Issue', value: 'hr_issue' },
    { label: 'Work Issue', value: 'work_issue' },
    { label: 'Technical Issue', value: 'technical_issue' },
    { label: 'Finance Issue', value: 'finance_issue' },
    { label: 'General', value: 'general' }
];
const STATUS_OPTIONS = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Waiting for Response', value: 'waiting_for_response' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' }
];

function roleName(roleValue) {
    return ROLE_OPTIONS.find(r => r.value === roleValue)?.label || roleValue;
}

function priorityBadge(p) {
    const colors = { low: '#22c55e', medium: '#eab308', high: '#f97316', urgent: '#ef4444' };
    return (
        <span style={{
            background: colors[p] || '#94a3b8', color: '#fff', padding: '2px 10px',
            borderRadius: 12, fontSize: 11, fontWeight: 600, textTransform: 'capitalize'
        }}>{p}</span>
    );
}

function statusBadge(s) {
    const colors = {
        open: '#3b82f6', in_progress: '#f59e0b', waiting_for_response: '#a855f7',
        resolved: '#22c55e', closed: '#64748b'
    };
    const label = s?.replace(/_/g, ' ') || s;
    return (
        <span style={{
            background: colors[s] || '#94a3b8', color: '#fff', padding: '2px 10px',
            borderRadius: 12, fontSize: 11, fontWeight: 600, textTransform: 'capitalize'
        }}>{label}</span>
    );
}

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

/* ════════════════════════════════════════════════════════════
   TICKET DASHBOARD PAGE
   ════════════════════════════════════════════════════════════ */
export function TicketDashboardPage({ role, userId, onNavigateToDetail }) {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({});

    // Filters
    const [scope, setScope] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Modals
    const [showCreate, setShowCreate] = useState(false);
    const [viewingTicketId, setViewingTicketId] = useState(null);

    const limit = 20;

    async function load(currentPage = page) {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage, limit,
                scope, status: statusFilter, priority: priorityFilter,
                category: categoryFilter, search
            });
            const [ticketsRes, statsRes] = await Promise.all([
                apiFetch(`/tickets?${params}`),
                apiFetch('/tickets/stats')
            ]);
            setItems(ticketsRes.items || []);
            setTotal(ticketsRes.total || 0);
            setStats(statsRes || {});
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    }

    useEffect(() => { load(1); setPage(1); }, [scope, statusFilter, priorityFilter, categoryFilter]);
    useEffect(() => { load(page); }, [page]);

    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
        load(1);
    }

    function openTicket(ticketId) {
        setViewingTicketId(ticketId);
    }

    return (
        <section className="panel">
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
                {[
                    { label: 'Open', value: stats.open || 0, color: '#3b82f6' },
                    { label: 'In Progress', value: stats.in_progress || 0, color: '#f59e0b' },
                    { label: 'Waiting', value: stats.waiting_for_response || 0, color: '#a855f7' },
                    { label: 'Resolved', value: stats.resolved || 0, color: '#22c55e' },
                    { label: 'Closed', value: stats.closed || 0, color: '#64748b' },
                    { label: 'Total', value: stats.total || 0, color: '#818cf8' }
                ].map(s => (
                    <div key={s.label} className="card stat-card" style={{
                        padding: '16px', textAlign: 'center',
                        borderTop: `3px solid ${s.color}`
                    }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 200, display: 'flex', gap: 8 }}>
                    <input
                        type="text" placeholder="Search tickets..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="primary" style={{ whiteSpace: 'nowrap' }}>Search</button>
                </form>

                <select value={scope} onChange={e => setScope(e.target.value)} style={{ width: 150 }}>
                    <option value="all">All Tickets</option>
                    <option value="mine">My Tickets</option>
                    <option value="assigned">Assigned to Me</option>
                </select>

                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 150 }}>
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>

                <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ width: 130 }}>
                    <option value="all">All Priority</option>
                    {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>

                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ width: 150 }}>
                    <option value="all">All Categories</option>
                    {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>

                <button onClick={() => setShowCreate(true)} className="primary" style={{ whiteSpace: 'nowrap' }}>+ New Ticket</button>
            </div>

            {/* Error */}
            {error && <p className="error">{error}</p>}

            {/* Tickets Table */}
            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Ticket</th>
                                <th>Priority</th>
                                <th>Category</th>
                                <th>Target</th>
                                <th>Created By</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Msgs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 24, color: '#888' }}>Loading tickets...</td></tr>
                            )}
                            {!loading && items.map(t => (
                                <tr
                                    key={t.id}
                                    onClick={() => openTicket(t.id)}
                                    style={{ cursor: 'pointer' }}
                                    className="clickable-row"
                                >
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{t.title}</div>
                                        <div style={{ fontSize: 12, color: '#888', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {t.description}
                                        </div>
                                    </td>
                                    <td>{priorityBadge(t.priority)}</td>
                                    <td style={{ fontSize: 12, color: '#888', textTransform: 'capitalize' }}>{t.category?.replace(/_/g, ' ') || '—'}</td>
                                    <td style={{ fontSize: 12 }}>{roleName(t.target_role)}</td>
                                    <td style={{ fontSize: 12 }}>
                                        <div>{t.creator?.full_name || 'Unknown'}</div>
                                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, textTransform: 'capitalize' }}>
                                            {roleName(t.creator?.role || 'unknown')}
                                        </div>
                                    </td>
                                    <td>{statusBadge(t.status)}</td>
                                    <td style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>{timeAgo(t.created_at)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        {t.message_count > 0 && (
                                            <span style={{
                                                background: '#e2e8f0', color: '#475569', padding: '2px 8px',
                                                borderRadius: 10, fontSize: 11
                                            }}>{t.message_count}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!loading && !items.length && (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 24, color: '#888' }}>No tickets found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {total > limit && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 12 }}>
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="small secondary">← Prev</button>
                        <span style={{ color: '#888', fontSize: 13, lineHeight: '32px' }}>
                            Page {page} of {Math.ceil(total / limit)}
                        </span>
                        <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)} className="small secondary">Next →</button>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {showCreate && (
                <CreateTicketModal
                    role={role}
                    onClose={() => setShowCreate(false)}
                    onSuccess={() => { setShowCreate(false); load(); }}
                />
            )}

            {/* Ticket Detail Modal */}
            {viewingTicketId && (
                <TicketDetailModal
                    ticketId={viewingTicketId}
                    role={role}
                    userId={userId}
                    onClose={() => { setViewingTicketId(null); load(); }}
                />
            )}
        </section>
    );
}

/* ════════════════════════════════════════════════════════════
   CREATE TICKET MODAL  — White Theme
   ════════════════════════════════════════════════════════════ */
function CreateTicketModal({ role, onClose, onSuccess }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState('');
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(false);

    // AC -> TC specifics
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [targetUserId, setTargetUserId] = useState('');
    const isAC = role === 'academic_coordinator';

    useEffect(() => {
        apiFetch('/tickets/routing')
            .then(res => {
                setTargets(res.targets || []);
                if (res.targets?.length && !isAC) setTargetRole(res.targets[0]);
            })
            .catch(() => { });

        if (isAC) {
            apiFetch('/teachers/pool')
                .then(res => setTeachers(res.items || []))
                .catch(() => {});
        }
    }, [isAC]);

    function handleTeacherChange(e) {
        const tId = e.target.value;
        setSelectedTeacherId(tId);
        if (tId) {
            const selected = teachers.find(t => t.id === tId);
            if (selected?.teacher_coordinator_id) {
                setTargetUserId(selected.teacher_coordinator_id);
                setTargetRole('teacher_coordinator');
            } else {
                setTargetUserId('');
                // Optionally reset target role or leave as is
            }
        } else {
            setTargetUserId('');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title || !description || !targetRole) return;
        setLoading(true);
        try {
            let finalDescription = description;
            let finalTitle = title;
            if (selectedTeacherId) {
                const tName = teachers.find(t => t.id === selectedTeacherId)?.users?.full_name || 'Teacher';
                finalTitle = `[${tName}] ${title}`;
            }

            await apiFetch('/tickets', {
                method: 'POST',
                body: JSON.stringify({ 
                    title: finalTitle, 
                    description: finalDescription, 
                    target_role: targetRole, 
                    target_user_id: targetUserId || undefined,
                    priority, 
                    category: category || null 
                })
            });
            onSuccess();
        } catch (err) {
            alert('Failed to create ticket: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{ maxWidth: 560, width: '90vw', background: '#fff', color: '#1e293b' }}>
                <h3 style={{ marginBottom: 16, color: '#1e293b' }}>🎫 Create New Ticket</h3>
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-field full-width">
                        <label style={{ color: '#475569' }}>Ticket Title *</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief summary of the issue" required
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b' }} />
                    </div>

                    <div className="form-field full-width">
                        <label style={{ color: '#475569' }}>Description *</label>
                        <textarea
                            value={description} onChange={e => setDescription(e.target.value)}
                            placeholder="Describe the issue in detail..."
                            rows={5} required
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b' }}
                        />
                    </div>

                    {isAC && (
                        <div className="form-field full-width">
                            <label style={{ color: '#475569' }}>Related Teacher (Optional)</label>
                            <select value={selectedTeacherId} onChange={handleTeacherChange}
                                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b' }}>
                                <option value="">Select a teacher...</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.users?.full_name || t.id}</option>
                                ))}
                            </select>
                            <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 4 }}>
                                Selecting a teacher will automatically route the ticket to their assigned Teacher Coordinator.
                            </span>
                        </div>
                    )}

                    <div className="form-field">
                        <label style={{ color: '#475569' }}>Send To (Target Role) *</label>
                        <select value={targetRole} onChange={e => setTargetRole(e.target.value)} required
                            disabled={!!targetUserId}
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b' }}>
                            <option value="">Select recipient...</option>
                            {targets.map(t => (
                                <option key={t} value={t}>{roleName(t)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label style={{ color: '#475569' }}>Priority</label>
                        <select value={priority} onChange={e => setPriority(e.target.value)}
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b' }}>
                            {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                    </div>

                    <div className="form-field full-width">
                        <label style={{ color: '#475569' }}>Category (optional)</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b' }}>
                            <option value="">No category</option>
                            {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>

                    <div className="actions" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button type="button" className="secondary" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className="primary" disabled={loading || !targetRole}>
                            {loading ? 'Creating...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   TICKET DETAIL MODAL  — White Theme
   ════════════════════════════════════════════════════════════ */
function TicketDetailModal({ ticketId, role, userId, onClose }) {
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Reply
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);

    // Status update
    const [newStatus, setNewStatus] = useState('');
    const [resolutionNote, setResolutionNote] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const isTarget = ticket?.target_role === role;
    const isCreator = ticket?.created_by === userId;
    const canManageAndReply = isTarget || isCreator;

    async function loadTicket() {
        setLoading(true);
        try {
            const res = await apiFetch(`/tickets/${ticketId}`);
            setTicket(res.ticket);
            setMessages(res.messages || []);
            setNewStatus(res.ticket?.status || '');
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    }

    useEffect(() => { loadTicket(); }, [ticketId]);

    async function handleSendReply(e) {
        e.preventDefault();
        if (!reply.trim()) return;
        setSending(true);
        try {
            await apiFetch(`/tickets/${ticketId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ message: reply })
            });
            setReply('');
            await loadTicket();
        } catch (e) {
            alert('Failed to send: ' + e.message);
        }
        setSending(false);
    }

    async function handleStatusUpdate() {
        if (!newStatus || newStatus === ticket?.status) return;
        setUpdatingStatus(true);
        try {
            await apiFetch(`/tickets/${ticketId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: newStatus,
                    resolution_note: (newStatus === 'resolved' || newStatus === 'closed') ? resolutionNote : undefined
                })
            });
            await loadTicket();
        } catch (e) {
            alert('Failed to update status: ' + e.message);
        }
        setUpdatingStatus(false);
    }

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal card" style={{ maxWidth: 700, width: '90vw', padding: 32, textAlign: 'center', background: '#fff' }}>
                    <p style={{ color: '#64748b' }}>Loading ticket...</p>
                </div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="modal-overlay">
                <div className="modal card" style={{ maxWidth: 500, width: '90vw', background: '#fff' }}>
                    <p className="error">{error || 'Ticket not found'}</p>
                    <button className="secondary" onClick={onClose} style={{ marginTop: 12 }}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal card" style={{
                maxWidth: 740, width: '94vw', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column',
                background: '#fff', color: '#1e293b'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 18, color: '#1e293b' }}>{ticket.title}</h3>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                            {statusBadge(ticket.status)}
                            {priorityBadge(ticket.priority)}
                            {ticket.category && (
                                <span style={{
                                    background: '#e2e8f0', color: '#475569', padding: '2px 10px',
                                    borderRadius: 12, fontSize: 11, textTransform: 'capitalize'
                                }}>{ticket.category.replace(/_/g, ' ')}</span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', color: '#94a3b8',
                        fontSize: 22, cursor: 'pointer', padding: '0 4px'
                    }}>✕</button>
                </div>

                {/* Ticket Info Grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px',
                    padding: '12px 16px', background: '#f8fafc', borderRadius: 8,
                    marginBottom: 16, fontSize: 13, border: '1px solid #e2e8f0'
                }}>
                    <div>
                        <span style={{ color: '#64748b' }}>Created by:</span>{' '}
                        <strong style={{ color: '#1e293b' }}>{ticket.creator?.full_name || 'Unknown'}</strong>{' '}
                        <span style={{ fontSize: 11, color: '#64748b' }}>({roleName(ticket.creator?.role || 'unknown')})</span>
                    </div>
                    <div><span style={{ color: '#64748b' }}>Target:</span> <strong style={{ color: '#4f46e5' }}>{roleName(ticket.target_role)}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Created:</span> <span style={{ color: '#475569' }}>{new Date(ticket.created_at).toLocaleString()}</span></div>
                    <div><span style={{ color: '#64748b' }}>Updated:</span> <span style={{ color: '#475569' }}>{new Date(ticket.updated_at).toLocaleString()}</span></div>
                </div>

                {/* Description */}
                <div style={{
                    padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0',
                    marginBottom: 16, fontSize: 13, color: '#334155', lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                }}>
                    {ticket.description}
                </div>

                {/* Status Update (for assigned role only) */}
                {canManageAndReply && ticket.status !== 'closed' && (
                    <div style={{
                        padding: '12px 16px', background: '#f0f9ff', border: '1px solid #bae6fd',
                        borderRadius: 8, marginBottom: 16
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0369a1', marginBottom: 8 }}>Update Status</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                                style={{ width: 180, background: '#fff', border: '1px solid #cbd5e1', color: '#1e293b' }}>
                                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                            {(newStatus === 'resolved' || newStatus === 'closed') && (
                                <input
                                    value={resolutionNote} onChange={e => setResolutionNote(e.target.value)}
                                    placeholder="Resolution note..."
                                    style={{ flex: 1, minWidth: 150, background: '#fff', border: '1px solid #cbd5e1', color: '#1e293b' }}
                                />
                            )}
                            <button
                                onClick={handleStatusUpdate}
                                disabled={updatingStatus || newStatus === ticket.status}
                                className="primary small"
                            >
                                {updatingStatus ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Resolution Note */}
                {ticket.resolution_note && (
                    <div style={{
                        padding: '10px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0',
                        borderRadius: 8, marginBottom: 16, fontSize: 13
                    }}>
                        <div style={{ fontWeight: 600, color: '#16a34a', marginBottom: 4 }}>Resolution</div>
                        <div style={{ color: '#334155' }}>{ticket.resolution_note}</div>
                        {ticket.resolved_at && (
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                                Resolved on {new Date(ticket.resolved_at).toLocaleString()}
                            </div>
                        )}
                    </div>
                )}

                {/* Conversation Thread */}
                <div style={{
                    flex: 1, overflowY: 'auto', marginBottom: 12,
                    border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 0'
                }}>
                    <div style={{
                        padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b',
                        borderBottom: '1px solid #e2e8f0', background: '#f8fafc'
                    }}>
                        Conversation ({messages.length})
                    </div>

                    {messages.length === 0 && (
                        <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                            No messages yet. Start the conversation below.
                        </div>
                    )}

                    {messages.map(msg => {
                        const isMine = msg.sender_id === userId;
                        return (
                            <div key={msg.id} style={{
                                padding: '10px 16px',
                                borderBottom: '1px solid #f1f5f9'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{
                                        fontSize: 12, fontWeight: 600,
                                        color: isMine ? '#4f46e5' : '#059669'
                                    }}>
                                        {msg.sender?.full_name || 'Unknown'}
                                    </span>
                                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{timeAgo(msg.created_at)}</span>
                                </div>
                                <div style={{
                                    fontSize: 13, color: '#334155', lineHeight: 1.5,
                                    whiteSpace: 'pre-wrap'
                                }}>{msg.message}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Reply Form */}
                {canManageAndReply && ticket.status !== 'closed' && (
                    <form onSubmit={handleSendReply} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <input
                            value={reply} onChange={e => setReply(e.target.value)}
                            placeholder="Type a reply..."
                            style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#1e293b' }}
                        />
                        <button disabled={sending || !reply.trim()} className="primary">
                            {sending ? '...' : 'Send'}
                        </button>
                    </form>
                )}

                {/* Close Button */}
                <button className="secondary" style={{ marginTop: 12, width: '100%' }} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
