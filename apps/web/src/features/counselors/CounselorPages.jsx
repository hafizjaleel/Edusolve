
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { getSession } from '../../lib/auth.js';
import { AddCounselorModal } from './components/AddCounselorModal.jsx';

function MobileCounselorCard({ counselor, onToggleStatus }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="card list-mobile-card" style={{ padding: '16px', position: 'relative', marginBottom: '0', border: '1px solid #e5e7eb', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} onClick={() => setExpanded(!expanded)}>
                <div style={{ flex: 1, paddingRight: 8, display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                        {counselor.full_name || counselor.email}
                    </h4>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {counselor.phone || 'No phone'}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`status-badge ${counselor.is_active ? 'success' : 'neutral'}`}>
                            {counselor.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', color: '#6b7280', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </span>
                    </div>
                </div>
            </div>

            {expanded && (
                <div style={{ marginTop: '12px', animation: 'fadeIn 0.2s ease-in' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginBottom: '12px' }}>
                        <div><span style={{ color: '#888' }}>Email:</span> <div style={{ fontWeight: 500 }}>{counselor.email}</div></div>
                    </div>

                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                        <button
                            className="secondary small"
                            onClick={() => onToggleStatus(counselor.id, counselor.is_active)}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {counselor.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export function CounselorTeamPage() {
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAdd, setShowAdd] = useState(false);

    const session = getSession();
    const isHead = session?.user?.role === 'counselor_head';

    async function load() {
        setLoading(true);
        try {
            const data = await apiFetch('/counselors');
            setCounselors(data.items || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function toggleStatus(id, currentStatus) {
        try {
            const updated = await apiFetch(`/counselors/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ is_active: !currentStatus })
            });
            setCounselors(prev => prev.map(c => c.id === id ? { ...c, is_active: updated.updated.is_active } : c));
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        }
    }

    return (
        <section className="panel">
            {!isHead && (
                <div className="card filters-bar" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowAdd(true)} className="primary" style={{ whiteSpace: 'nowrap' }}>+ Add Counselor</button>
                </div>
            )}

            {loading ? <p>Loading team...</p> : null}
            {error ? <p className="error">{error}</p> : null}

            {/* Desktop Table */}
            <div className="card desktop-only">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {counselors.map(c => (
                                <tr key={c.id}>
                                    <td>{c.full_name || c.email}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${c.is_active ? 'success' : 'neutral'}`}>
                                            {c.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="secondary small"
                                            onClick={() => toggleStatus(c.id, c.is_active)}
                                        >
                                            {c.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!counselors.length && !loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>No counselors found. Add one to get started.</td></tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {counselors.map(c => (
                    <MobileCounselorCard
                        key={c.id}
                        counselor={c}
                        onToggleStatus={toggleStatus}
                    />
                ))}
                {!counselors.length && !loading && (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>No counselors found. Add one to get started.</div>
                )}
            </div>

            {showAdd ? (
                <AddCounselorModal
                    onClose={() => setShowAdd(false)}
                    onSuccess={() => { setShowAdd(false); load(); }}
                />
            ) : null}
        </section>
    );
}


