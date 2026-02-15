
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { ROLES } from '../../lib/roles.js';

function AddRequestModal({ onClose, onSuccess, initialData }) {
    const [subject, setSubject] = useState(initialData?.subject || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [loading, setLoading] = useState(false);
    const [leadId, setLeadId] = useState(initialData?.lead_id || null);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!subject || !description) return;

        setLoading(true);
        try {
            const url = initialData ? `/requests/${initialData.id}` : '/requests';
            const method = initialData ? 'PATCH' : 'POST';

            await apiFetch(url, {
                method,
                body: JSON.stringify({ subject, description, lead_id: leadId })
            });
            onSuccess();
        } catch (err) {
            alert('Failed to save request: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal card">
                <h3>{initialData ? 'Edit Request' : 'New Request'}</h3>
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-field full-width">
                        <label>Subject</label>
                        <input value={subject} onChange={e => setSubject(e.target.value)} required />
                    </div>
                    <div className="form-field full-width">
                        <label>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required></textarea>
                    </div>
                    <div className="form-field full-width">
                        <label>Link Lead (Optional)</label>
                        <LeadSelector onSelect={setLeadId} />
                    </div>
                    <div className="actions">
                        <button type="button" className="secondary" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function LeadSelector({ onSelect }) {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchLeads() {
            setLoading(true);
            try {
                // Fetch simple list or search
                const data = await apiFetch(`/leads?scope=mine`); // Or search endpoint if available
                setLeads(data.items || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchLeads();
    }, []);

    const filtered = leads.filter(l => l.student_name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            {!selectedLead ? (
                <>
                    <input
                        placeholder="Search lead by name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ marginBottom: '8px' }}
                    />
                    {search && (
                        <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px' }}>
                            {filtered.map(l => (
                                <div
                                    key={l.id}
                                    onClick={() => { setSelectedLead(l); onSelect(l.id); }}
                                    style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                >
                                    {l.student_name} ({l.class_level})
                                </div>
                            ))}
                            {!filtered.length && <div style={{ padding: '8px', color: '#888' }}>No matches</div>}
                        </div>
                    )}
                </>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f3f4f6', padding: '8px', borderRadius: '4px' }}>
                    <span>Linked: <strong>{selectedLead.student_name}</strong></span>
                    <button type="button" className="text-danger small" onClick={() => { setSelectedLead(null); onSelect(null); }}>Remove</button>
                </div>
            )}
        </div>
    );
}

function RequestDetailsModal({ request, onClose, onCloseRequest, onOpenLeadDetails }) {
    const [note, setNote] = useState('');
    const [closing, setClosing] = useState(false);

    async function handleClose() {
        if (!note) return alert('Please add a resolution note.');
        setClosing(true);
        await onCloseRequest(request.id, note);
        setClosing(false);
        onClose();
    }

    return (
        <div className="modal-overlay">
            <div className="modal card">
                <h3>Request Details</h3>
                <div className="form-grid">
                    <div>
                        <label>Subject</label>
                        <p>{request.subject}</p>
                    </div>
                    <div>
                        <label>Description</label>
                        <p>{request.description}</p>
                    </div>
                    <div>
                        <label>Submitted By</label>
                        <p>{request.counselor?.full_name}</p>
                    </div>
                    {request.lead ? (
                        <div>
                            <label>Linked Lead</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="text-primary" style={{ fontWeight: 500 }}>{request.lead.student_name}</span>
                                <button
                                    type="button"
                                    className="small primary"
                                    onClick={() => { onClose(); onOpenLeadDetails(request.lead_id); }}
                                >
                                    View Lead
                                </button>
                            </div>
                        </div>
                    ) : null}
                    <div>
                        <label>Status</label>
                        <p><span className={`badge ${request.status === 'open' ? 'neutral' : 'success'}`}>{request.status}</span></p>
                    </div>
                    {request.status === 'closed' ? (
                        <div>
                            <label>Resolution</label>
                            <p>"{request.resolution_note}"</p>
                            <p className="text-small text-muted">Resolved on {new Date(request.resolved_at).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <div className="border-top" style={{ paddingTop: '16px' }}>
                            <h4>Close Request</h4>
                            <label>Resolution Note</label>
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="How was this resolved?"
                                rows={3}
                            ></textarea>
                            <div className="actions">
                                <button className="success" onClick={handleClose} disabled={closing}>
                                    {closing ? 'Closing...' : 'Close Request'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <button className="secondary" style={{ marginTop: '20px', width: '100%' }} onClick={onClose}>Close View</button>
            </div>
        </div>
    );
}

export function CounselorRequestsPage({ role, onOpenLeadDetails }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null); // For Edit
    const [viewingRequest, setViewingRequest] = useState(null); // For Head View

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, open, closed
    const [counselorFilter, setCounselorFilter] = useState('all'); // all, or counselor_id

    // Counselors list for filter (Head only)
    const [counselors, setCounselors] = useState([]);

    // Check if role is counselor
    const isCounselor = role === ROLES.COUNSELOR;
    const isHead = role === ROLES.COUNSELOR_HEAD || role === ROLES.SUPER_ADMIN;

    async function load() {
        setLoading(true);
        try {
            const [requestsData, counselorsData] = await Promise.all([
                apiFetch('/requests'),
                isHead ? apiFetch('/counselors').then(res => res.items || []) : Promise.resolve([])
            ]);

            setItems(requestsData.items || []);
            if (isHead) setCounselors(counselorsData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this request?')) return;
        try {
            await apiFetch(`/requests/${id}`, { method: 'DELETE' });
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleCloseRequest(id, note) {
        try {
            await apiFetch(`/requests/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'closed', resolution_note: note })
            });
            load(); // Reload to get updates
        } catch (err) {
            alert(err.message);
        }
    }

    // Filter Logic
    const filteredItems = items.filter(item => {
        // Search
        const searchLower = search.toLowerCase();
        const matchSearch = item.subject.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower);

        // Status
        const matchStatus = statusFilter === 'all' || item.status === statusFilter;

        // Counselor
        const matchCounselor = counselorFilter === 'all' || item.counselor_id === counselorFilter;

        return matchSearch && matchStatus && matchCounselor;
    });

    return (
        <section className="panel">
            {/* Filters Bar */}
            <div className="card filters-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <input
                        type="text"
                        placeholder="Search requests..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>

                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '150px' }}>
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>

                {isHead && (
                    <select value={counselorFilter} onChange={e => setCounselorFilter(e.target.value)} style={{ width: '200px' }}>
                        <option value="all">All Counselors</option>
                        {counselors.map(c => (
                            <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
                        ))}
                    </select>
                )}

                {isCounselor && (
                    <button onClick={() => { setEditingRequest(null); setShowModal(true); }} className="primary" style={{ whiteSpace: 'nowrap' }}>+ New Request</button>
                )}
            </div>

            {loading ? <p>Loading requests...</p> : null}
            {error ? <p className="error">{error}</p> : null}

            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Submitted By</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map(req => (
                                <tr
                                    key={req.id}
                                    onClick={() => isHead ? setViewingRequest(req) : null}
                                    style={{ cursor: isHead ? 'pointer' : 'default' }}
                                    className={isHead ? 'clickable-row' : ''}
                                >
                                    <td style={{ fontWeight: 500 }}>
                                        {req.subject}
                                        <div style={{ fontSize: '0.85em', color: '#6b7280', fontWeight: 'normal' }}>{req.description}</div>
                                        {req.lead ? (
                                            <div style={{ fontSize: '0.8em', color: '#4f46e5', marginTop: '2px' }}>
                                                Linked Lead: {req.lead.student_name}
                                            </div>
                                        ) : null}
                                    </td>
                                    <td>{req.counselor?.full_name || 'Unknown'}</td>
                                    <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${req.status === 'open' ? 'neutral' : 'success'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        {isCounselor && req.status === 'open' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="small secondary" onClick={() => { setEditingRequest(req); setShowModal(true); }}>Edit</button>
                                                <button className="small danger" onClick={() => handleDelete(req.id)}>Delete</button>
                                            </div>
                                        ) : null}
                                        {isHead && (
                                            <button className="small secondary" onClick={() => setViewingRequest(req)}>View</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!filteredItems.length && !loading ? (
                                <tr><td colSpan="5">No requests found.</td></tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <AddRequestModal
                    initialData={editingRequest}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); load(); }}
                />
            )}

            {viewingRequest && (
                <RequestDetailsModal
                    request={viewingRequest}
                    onClose={() => setViewingRequest(null)}
                    onCloseRequest={handleCloseRequest}
                    onOpenLeadDetails={onOpenLeadDetails}
                />
            )}
        </section>
    );
}
