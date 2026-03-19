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
    const [tcFilter, setTcFilter] = useState('all');
    const [viewTeacher, setViewTeacher] = useState(null);
    const [page, setPage] = useState(1);

    const userRole = getSession()?.user?.role || '';
    const isAdmin = userRole === 'super_admin';
    const isTc = userRole === 'teacher_coordinator';
    const canFetchTcs = isAdmin || isTc;
    const [allTcs, setAllTcs] = useState([]);
    const [reassigning, setReassigning] = useState(null); // teacherId
    const [newTcId, setNewTcId] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [updatingBulk, setUpdatingBulk] = useState(false);
    const [showBulkAssignTc, setShowBulkAssignTc] = useState(false);
    const [bulkTcId, setBulkTcId] = useState('');
    const [showImportOld, setShowImportOld] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

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
        if (canFetchTcs) {
            apiFetch('/admin/tcs').then(res => {
                setAllTcs(res.items || []);
            }).catch(() => { });
        }
    }, [canFetchTcs]);


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

    const handleBulkPoolStatus = async (isInPool) => {
        if (selectedIds.length === 0) return;
        setUpdatingBulk(true);
        try {
            await apiFetch('/teachers/bulk-pool-status', {
                method: 'PATCH',
                body: JSON.stringify({
                    teacher_ids: selectedIds,
                    is_in_pool: isInPool
                })
            });
            setTeachers(prev => prev.map(t =>
                selectedIds.includes(t.id) ? { ...t, is_in_pool: isInPool } : t
            ));
            setSelectedIds([]);
            alert(`Set ${selectedIds.length} teachers to ${isInPool ? 'Active' : 'Hidden'}`);
        } catch (e) {
            alert('Bulk update failed: ' + e.message);
        } finally {
            setUpdatingBulk(false);
        }
    };

    const handleBulkAssignTc = async () => {
        if (selectedIds.length === 0) return;
        setUpdatingBulk(true);
        try {
            await apiFetch('/teachers/bulk-assign-tc', {
                method: 'PATCH',
                body: JSON.stringify({
                    teacher_ids: selectedIds,
                    teacher_coordinator_id: bulkTcId || null
                })
            });
            const newCoordinator = allTcs.find(tc => tc.id === bulkTcId) || null;
            setTeachers(prev => prev.map(t =>
                selectedIds.includes(t.id)
                    ? { ...t, teacher_coordinator_id: bulkTcId || null, coordinator: newCoordinator }
                    : t
            ));
            setSelectedIds([]);
            setShowBulkAssignTc(false);
            setBulkTcId('');
            alert(`Assigned ${selectedIds.length} teachers to ${newCoordinator?.full_name || 'None'}`);
        } catch (e) {
            alert('Bulk assign failed: ' + e.message);
        } finally {
            setUpdatingBulk(false);
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
        if (tcFilter === 'unassigned' && t.teacher_coordinator_id) return false;
        if (tcFilter !== 'all' && tcFilter !== 'unassigned' && t.teacher_coordinator_id !== tcFilter) return false;

        if (!search) return true;
        const term = search.toLowerCase();
        const name = t.users?.full_name?.toLowerCase() || '';
        const code = t.teacher_code?.toLowerCase() || '';
        return name.includes(term) || code.includes(term);
    });

    // Reset page on search or filter change
    useEffect(() => { setPage(1); }, [search, tcFilter]);

    const toggleSelectAll = () => {
        if (selectedIds.length === filtered.length && filtered.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filtered.map(t => t.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleDeleteTeacher = async (id) => {
        try {
            const res = await apiFetch(`/teachers/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(res.error || 'Delete failed');
            setDeleteTarget(null);
            fetchTeachers();
        } catch (e) {
            alert('Delete failed: ' + e.message);
        }
    };

    const colSpan = isAdmin ? 10 : 10;

    return (
        <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ margin: '0 0 8px' }}>Teacher Directory</h2>
                    <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                        Manage all registered teachers. Enable "In Pool" to show them on the Teacher Pool map.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {selectedIds.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, marginRight: 12, background: '#eff6ff', padding: '6px 12px', borderRadius: 8, border: '1px solid #bfdbfe', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#1e40af' }}>{selectedIds.length} selected</span>
                            <button
                                className="primary small"
                                disabled={updatingBulk}
                                onClick={() => handleBulkPoolStatus(true)}
                                style={{ background: '#16a34a', borderColor: '#16a34a' }}
                            >Activate in Pool</button>
                            <button
                                className="secondary small"
                                disabled={updatingBulk}
                                onClick={() => handleBulkPoolStatus(false)}
                            >Hide from Pool</button>
                            {isAdmin && (
                                <button
                                    className="secondary small"
                                    disabled={updatingBulk}
                                    onClick={() => setShowBulkAssignTc(true)}
                                    style={{ borderColor: '#7c3aed', color: '#7c3aed' }}
                                >Assign TC</button>
                            )}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <select 
                            value={tcFilter} 
                            onChange={e => setTcFilter(e.target.value)}
                            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, background: '#fff' }}
                        >
                            <option value="all">All TCs</option>
                            <option value="unassigned">Unassigned</option>
                            {allTcs.map(tc => <option key={tc.id} value={tc.id}>{tc.full_name}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, width: 250 }}
                        />
                        {isTc && (
                            <button
                                type="button"
                                onClick={() => setShowImportOld(true)}
                                style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontWeight: 600, color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >Old Teachers</button>
                        )}
                    </div>
                </div>
            </div>

            {error && <div className="alert error" style={{ marginBottom: 16 }}>{error}</div>}

            <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Code</th>
                            <th>Teacher Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Experience</th>
                            <th>Coordinator</th>
                            <th style={{ width: 120 }}>In Pool Map?</th>
                            <th>View</th>
                            {(isAdmin || isTc) && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24 }}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24, color: '#666' }}>No teachers found.</td></tr>
                        ) : (
                            filtered.slice((page - 1) * 10, page * 10).map(t => (
                                <tr key={t.id} style={{ background: selectedIds.includes(t.id) ? '#f0f7ff' : 'transparent' }}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(t.id)}
                                            onChange={() => toggleSelect(t.id)}
                                        />
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{t.teacher_code || '-'}</td>
                                    <td style={{ fontWeight: 600 }}>{t.users?.full_name || '-'}</td>
                                    <td>{t.users?.email || '-'}</td>
                                    <td>{t.phone || t.users?.phone || '-'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{t.experience_level || 'N/A'}</td>
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
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: '#6b7280' }}
                                        >👁</button>
                                    </td>
                                    {(isAdmin || isTc) && (
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                title="Delete Teacher"
                                                onClick={() => setDeleteTarget({ id: t.id, name: t.users?.full_name || '' })}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: '#dc2626', fontSize: '16px' }}
                                            >🗑</button>
                                        </td>
                                    )}
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
            {deleteTarget && (
                <DeleteConfirmModal
                    entityName={deleteTarget.name}
                    entityLabel="teacher"
                    onConfirm={() => handleDeleteTeacher(deleteTarget.id)}
                    onClose={() => setDeleteTarget(null)}
                />
            )}

            {/* Bulk Assign TC Modal */}
            {showBulkAssignTc && (
                <div className="modal-overlay">
                    <div className="modal card" style={{ maxWidth: 400, padding: 24 }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: 18 }}>Assign TC to {selectedIds.length} Teachers</h3>
                        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                            Choose a Teacher Coordinator to assign the selected teachers. Pick "— None —" to unassign.
                        </p>
                        <select
                            value={bulkTcId}
                            onChange={e => setBulkTcId(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, marginBottom: 20 }}
                        >
                            <option value="">— None (Unassign) —</option>
                            {allTcs.map(tc => <option key={tc.id} value={tc.id}>{tc.full_name}</option>)}
                        </select>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button className="secondary" onClick={() => { setShowBulkAssignTc(false); setBulkTcId(''); }}>Cancel</button>
                            <button className="primary" disabled={updatingBulk} onClick={handleBulkAssignTc}>
                                {updatingBulk ? 'Assigning...' : 'Confirm Assign'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showImportOld && <ImportOldTeachersModal onClose={() => { setShowImportOld(false); fetchTeachers(); }} />}
        </div>
    );
}

function ImportOldTeachersModal({ onClose }) {
    const [parsed, setParsed] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileRef = React.useRef(null);

    const downloadSample = () => {
        const csv = [
            ['Email', 'Name', 'Phone', 'Code', 'Experience', 'Rate'],
            ['teacher1@example.com', 'Amit Kumar', '+919876543210', 'TCR000001', 'Intermediate', '350'],
            ['teacher2@example.com', 'Sana Shaikh', '+919123456789', '', 'Beginner', '300']
        ].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = 'sample_teachers.csv'; a.click();
    };

    const parseCSV = (text) => {
        const separator = text.includes('\t') ? '\t' : ',';
        const lines = text.trim().split('\n');
        const start = lines[0].toLowerCase().startsWith('email') ? 1 : 0;
        return lines.slice(start).map(line => {
            const parts = line.split(separator);
            return {
                email: parts[0]?.trim() || '',
                full_name: parts[1]?.trim() || '',
                phone: parts[2]?.trim() || '',
                teacher_code: parts[3]?.trim() || '',
                experience_level: parts[4]?.trim() || '',
                per_hour_rate: parts[5]?.trim() || ''
            };
        }).filter(p => p.email && p.full_name);
    };

    const handleFile = (e) => {
        setError(''); setParsed([]);
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = parseCSV(ev.target.result);
            if (!result.length) { setError('No valid rows found. Email and Name are required.'); return; }
            setParsed(result);
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        setLoading(true); setError('');
        try {
            const res = await apiFetch('/teachers/import-sheet', { method: 'POST', body: JSON.stringify(parsed) });
            if (res.ok) {
                if (res.errors?.length > 0) {
                    const errSummary = res.errors.map(e => `• ${e.teacher?.full_name || e.teacher?.email || 'row'}: ${e.error}`).join('\n');
                    setError(`${res.errors.length} row(s) failed:\n${errSummary}`);
                }
                if (res.imported_count > 0 || res.skipped_count >= 0) {
                    const parts = [];
                    if (res.imported_count > 0) parts.push(`${res.imported_count} teacher(s) imported`);
                    if (res.skipped_count > 0) parts.push(`${res.skipped_count} already existed (skipped)`);
                    setSuccess(parts.join(' · ') || 'Done');
                }
            } else throw new Error(res.error || 'Import failed');
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>Import Old Teachers</h3>
                    <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>

                {success ? (
                    <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <p style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#16a34a', textAlign: 'center' }}>✓ {success}</p>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 18px' }}>
                            <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>🔐 Login Credentials for Imported Teachers</p>
                            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#475569' }}>• <strong>Email:</strong> their email from the sheet</p>
                            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#475569' }}>• <strong>Password:</strong> <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>Teacher@123</code></p>
                            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#94a3b8' }}>Teachers should change their password after first login.</p>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <button type="button" onClick={onClose} style={{ padding: '8px 24px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Upload a CSV file</p>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Columns: <strong>Email*</strong>, <strong>Name*</strong>, Phone, Code, Experience, Rate/hr</p>
                            </div>
                            <button type="button" onClick={downloadSample} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                ⬇ Sample CSV
                            </button>
                            <button type="button" onClick={() => fileRef.current?.click()} style={{ padding: '8px 16px', background: '#4338ca', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                📂 Choose File
                            </button>
                            <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" onChange={handleFile} style={{ display: 'none' }} />
                        </div>

                        {parsed.length > 0 && (
                            <>
                                <p style={{ fontSize: '13px', color: '#16a34a', marginBottom: '8px', fontWeight: 600 }}>✓ {parsed.length} rows parsed — preview below:</p>
                                <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px' }}>
                                    <table className="data-table" style={{ fontSize: '12px', width: '100%' }}>
                                        <thead><tr><th>Email</th><th>Name</th><th>Phone</th><th>Code</th><th>Exp</th><th>Rate</th></tr></thead>
                                        <tbody>
                                            {parsed.map((p, i) => (
                                                <tr key={i}>
                                                    <td>{p.email}</td><td>{p.full_name}</td>
                                                    <td>{p.phone || '—'}</td><td>{p.teacher_code || '—'}</td>
                                                    <td>{p.experience_level || '—'}</td><td>{p.per_hour_rate || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {error && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff' }}>Cancel</button>
                            <button type="button" disabled={loading || parsed.length === 0} onClick={handleImport} style={{ padding: '8px 16px', background: '#4338ca', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, opacity: (loading || parsed.length === 0) ? 0.6 : 1 }}>
                                {loading ? 'Importing...' : `Import ${parsed.length} Teachers`}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}


function DeleteConfirmModal({ entityName, entityLabel, onConfirm, onClose }) {
    const [typed, setTyped] = React.useState('');
    const [deleting, setDeleting] = React.useState(false);
    const matches = typed.trim() === entityName.trim();

    const handleConfirm = async () => {
        setDeleting(true);
        await onConfirm();
        setDeleting(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', width: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0, color: '#dc2626' }}>🗑 Delete {entityLabel}</h3>
                    <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#b91c1c', fontWeight: 600 }}>⚠ This action cannot be undone.</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#7f1d1d' }}>All linked data will be permanently deleted{entityLabel === 'teacher' ? ', including their login account' : ''}.</p>
                </div>
                <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>
                    Type <strong style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>{entityName}</strong> to confirm:
                </p>
                <input
                    type="text"
                    value={typed}
                    onChange={e => setTyped(e.target.value)}
                    placeholder={entityName}
                    style={{ width: '100%', padding: '10px 12px', border: `1px solid ${matches ? '#16a34a' : '#e2e8f0'}`, borderRadius: 6, fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box' }}
                    autoFocus
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>Cancel</button>
                    <button
                        type="button"
                        disabled={!matches || deleting}
                        onClick={handleConfirm}
                        style={{ padding: '8px 20px', background: matches ? '#dc2626' : '#fca5a5', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: matches ? 'pointer' : 'not-allowed' }}
                    >
                        {deleting ? 'Deleting...' : `Delete ${entityLabel}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
