import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api.js';
import { getSession } from '../../lib/auth.js';
import { ViewTeacherModal } from '../academic/AcademicPages.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';

export function TeacherDirectoryPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [viewTeacher, setViewTeacher] = useState(null);
    const [page, setPage] = useState(1);

    const userRole = getSession()?.user?.role || '';
    const isAdmin = userRole === 'super_admin';
    const [allTcs, setAllTcs] = useState([]);
    const [reassigning, setReassigning] = useState(null); // teacherId
    const [newTcId, setNewTcId] = useState('');

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/teachers/directory');
            setTeachers(res.items || []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
        if (isAdmin) {
            apiFetch('/admin/users').then(res => {
                const tcList = (res.items || [])
                    .filter(u => u.role === 'teacher_coordinator')
                    .map(u => ({ id: u.id, full_name: u.name || u.email, email: u.email }));
                setAllTcs(tcList);
            }).catch(() => { });
        }
    }, []);


    const handleTogglePool = async (teacherId, currentStatus) => {
        try {
            const nextStatus = !currentStatus;
            setTeachers((prev) =>
                prev.map((t) => (t.id === teacherId ? { ...t, is_in_pool: nextStatus } : t))
            );
            await apiFetch(`/teachers/${teacherId}/pool-status`, {
                method: 'PATCH',
                body: JSON.stringify({ is_in_pool: nextStatus })
            });
        } catch (e) {
            console.error(e);
            fetchTeachers();
            alert('Failed to update status');
        }
    };

    const handleReassignTc = async (teacherId) => {
        try {
            await apiFetch(`/teachers/${teacherId}/assign-tc`, {
                method: 'PATCH',
                body: JSON.stringify({ teacher_coordinator_id: newTcId || null })
            });
            const newCoordinator = allTcs.find(tc => tc.id === newTcId) || null;
            setTeachers(prev => prev.map(t =>
                t.id === teacherId
                    ? { ...t, teacher_coordinator_id: newTcId || null, coordinator: newCoordinator }
                    : t
            ));
            setReassigning(null);
        } catch (e) {
            alert('Failed to reassign: ' + e.message);
        }
    };

    const filtered = teachers.filter((t) => {
        if (!search) return true;
        const term = search.toLowerCase();
        const name = t.users?.full_name?.toLowerCase() || '';
        const code = t.teacher_code?.toLowerCase() || '';
        return name.includes(term) || code.includes(term);
    });

    // Reset page on search
    useEffect(() => { setPage(1); }, [search]);

    const colSpan = isAdmin ? 9 : 9;

    return (
        <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ margin: '0 0 8px' }}>Teacher Directory</h2>
                    <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                        Manage all registered teachers. Enable "In Pool" to show them on the Teacher Pool map.
                    </p>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, width: 250 }}
                    />
                </div>
            </div>

            {error && <div className="alert error" style={{ marginBottom: 16 }}>{error}</div>}

            <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Teacher Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Experience</th>
                            <th>Rate / Hr</th>
                            <th>Coordinator</th>
                            <th style={{ width: 120 }}>In Pool Map?</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24 }}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24, color: '#666' }}>No teachers found.</td></tr>
                        ) : (
                            filtered.slice((page - 1) * 10, page * 10).map(t => (
                                <tr key={t.id}>
                                    <td style={{ fontWeight: 500 }}>{t.teacher_code || '-'}</td>
                                    <td style={{ fontWeight: 600 }}>{t.users?.full_name || '-'}</td>
                                    <td>{t.users?.email || '-'}</td>
                                    <td>{t.phone || t.users?.phone || '-'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{t.experience_level || 'N/A'}</td>
                                    <td>{t.per_hour_rate ? `₹${t.per_hour_rate}` : '-'}</td>
                                    <td style={{ minWidth: 180 }}>
                                        {isAdmin && reassigning === t.id ? (
                                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                                <select
                                                    value={newTcId}
                                                    onChange={e => setNewTcId(e.target.value)}
                                                    style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 12, flex: 1 }}
                                                >
                                                    <option value="">— None —</option>
                                                    {allTcs.map(tc => <option key={tc.id} value={tc.id}>{tc.full_name}</option>)}
                                                </select>
                                                <button
                                                    style={{ padding: '4px 8px', fontSize: 11, borderRadius: 4, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}
                                                    onClick={() => handleReassignTc(t.id)}
                                                >✓</button>
                                                <button
                                                    style={{ padding: '4px 8px', fontSize: 11, borderRadius: 4, background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', cursor: 'pointer' }}
                                                    onClick={() => setReassigning(null)}
                                                >✕</button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span>{t.coordinator?.full_name || <span style={{ color: '#9ca3af' }}>Unassigned</span>}</span>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => { setReassigning(t.id); setNewTcId(t.teacher_coordinator_id || ''); }}
                                                        style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, border: '1px solid #d1d5db', background: '#f9fafb', cursor: 'pointer', color: '#4b5563' }}
                                                    >Reassign</button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
                                            <input
                                                type="checkbox"
                                                checked={!!t.is_in_pool}
                                                onChange={() => handleTogglePool(t.id, t.is_in_pool)}
                                                style={{ width: 16, height: 16, accentColor: 'var(--primary-color, #2563eb)' }}
                                            />
                                            <span style={{ fontSize: 13, fontWeight: 500, color: t.is_in_pool ? '#166534' : '#6b7280' }}>
                                                {t.is_in_pool ? 'Active' : 'Hidden'}
                                            </span>
                                        </label>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            title="View Profile"
                                            onClick={() => setViewTeacher(t)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '6px',
                                                color: '#6b7280'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
                                            onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {filtered.length > 10 && (
                <Pagination page={page} limit={10} total={filtered.length} onPageChange={setPage} />
            )}
            {viewTeacher && <ViewTeacherModal teacher={viewTeacher} onClose={() => setViewTeacher(null)} />}
        </div>
    );
}
