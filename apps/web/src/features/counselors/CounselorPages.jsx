
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { AddCounselorModal } from './components/AddCounselorModal.jsx';

export function CounselorTeamPage() {
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAdd, setShowAdd] = useState(false);

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


            <div className="card filters-bar" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowAdd(true)} className="primary" style={{ whiteSpace: 'nowrap' }}>+ Add Counselor</button>
            </div>

            {loading ? <p>Loading team...</p> : null}
            {error ? <p className="error">{error}</p> : null}

            <div className="card">
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
                                <tr><td colSpan="4">No counselors found. Add one to get started.</td></tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
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


