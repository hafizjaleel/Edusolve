import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api.js';
import { ViewTeacherModal } from '../academic/AcademicPages.jsx';

export function TeacherDirectoryPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [viewTeacher, setViewTeacher] = useState(null);

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
            // Revert on error
            fetchTeachers();
            alert('Failed to update status');
        }
    };

    const filtered = teachers.filter((t) => {
        if (!search) return true;
        const term = search.toLowerCase();
        const name = t.users?.full_name?.toLowerCase() || '';
        const code = t.teacher_code?.toLowerCase() || '';
        return name.includes(term) || code.includes(term);
    });

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
                            <th>Experience</th>
                            <th>Rate / Hr</th>
                            <th>Coordinator</th>
                            <th style={{ width: 120 }}>In Pool Map?</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24 }}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24, color: '#666' }}>No teachers found.</td></tr>
                        ) : (
                            filtered.map(t => (
                                <tr key={t.id}>
                                    <td style={{ fontWeight: 500 }}>{t.teacher_code || '-'}</td>
                                    <td style={{ fontWeight: 600 }}>{t.users?.full_name || '-'}</td>
                                    <td>{t.users?.email || '-'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{t.experience_level || 'N/A'}</td>
                                    <td>{t.per_hour_rate ? `₹${t.per_hour_rate}` : '-'}</td>
                                    <td>{t.coordinator?.full_name || 'Unassigned'}</td>
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
                                                color: '#6b7280' // muted grey icon
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
            {viewTeacher && <ViewTeacherModal teacher={viewTeacher} onClose={() => setViewTeacher(null)} />}
        </div>
    );
}
