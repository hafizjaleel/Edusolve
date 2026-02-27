import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

/* ─── Icons ─── */
const Icon = ({ d, size = 16, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0 }}>
        <path d={d} />
    </svg>
);

const ICONS = {
    book: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20',
    gradCap: 'M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5',
    edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    plus: 'M12 5v14M5 12h14',
    x: 'M18 6L6 18M6 6l12 12',
    save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8'
};

/* ─── Subjects & Boards Management Page ─── */
export function SubjectsBoardsPage() {
    const [subjects, setSubjects] = useState([]);
    const [boards, setBoards] = useState([]);
    const [mediums, setMediums] = useState([]);
    const [newSubject, setNewSubject] = useState('');
    const [newBoard, setNewBoard] = useState('');
    const [newMedium, setNewMedium] = useState('');
    const [editingSubject, setEditingSubject] = useState(null);
    const [editingBoard, setEditingBoard] = useState(null);
    const [editingMedium, setEditingMedium] = useState(null);
    const [editName, setEditName] = useState('');
    const [loading, setLoading] = useState(true);

    const load = async () => {
        const [sRes, bRes, mRes] = await Promise.all([
            apiFetch('/subjects'), apiFetch('/boards'), apiFetch('/mediums')
        ]);
        if (sRes.ok) setSubjects(sRes.subjects);
        if (bRes.ok) setBoards(bRes.boards);
        if (mRes.ok) setMediums(mRes.mediums);
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    /* ── Subject CRUD ── */
    const addSubject = async () => {
        if (!newSubject.trim()) return;
        const res = await apiFetch('/subjects', { method: 'POST', body: { name: newSubject.trim() } });
        if (res.ok) { setNewSubject(''); load(); }
        else alert(res.error || 'Failed');
    };
    const updateSubject = async (id) => {
        if (!editName.trim()) return;
        await apiFetch(`/subjects/${id}`, { method: 'PATCH', body: { name: editName.trim() } });
        setEditingSubject(null); load();
    };
    const deleteSubject = async (id) => {
        if (!confirm('Delete this subject?')) return;
        await apiFetch(`/subjects/${id}`, { method: 'DELETE' });
        load();
    };

    /* ── Board CRUD ── */
    const addBoard = async () => {
        if (!newBoard.trim()) return;
        const res = await apiFetch('/boards', { method: 'POST', body: { name: newBoard.trim() } });
        if (res.ok) { setNewBoard(''); load(); }
        else alert(res.error || 'Failed');
    };
    const updateBoard = async (id) => {
        if (!editName.trim()) return;
        await apiFetch(`/boards/${id}`, { method: 'PATCH', body: { name: editName.trim() } });
        setEditingBoard(null); load();
    };
    const deleteBoard = async (id) => {
        if (!confirm('Delete this board?')) return;
        await apiFetch(`/boards/${id}`, { method: 'DELETE' });
        load();
    };

    /* ── Medium CRUD ── */
    const addMedium = async () => {
        if (!newMedium.trim()) return;
        const res = await apiFetch('/mediums', { method: 'POST', body: { name: newMedium.trim() } });
        if (res.ok) { setNewMedium(''); load(); }
        else alert(res.error || 'Failed');
    };
    const updateMedium = async (id) => {
        if (!editName.trim()) return;
        await apiFetch(`/mediums/${id}`, { method: 'PATCH', body: { name: editName.trim() } });
        setEditingMedium(null); load();
    };
    const deleteMedium = async (id) => {
        if (!confirm('Delete this medium?')) return;
        await apiFetch(`/mediums/${id}`, { method: 'DELETE' });
        load();
    };

    if (loading) return <div className="page-content"><p>Loading…</p></div>;

    const panelStyle = { flex: 1, minWidth: 300 };
    const itemStyle = {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderBottom: '1px solid var(--line)', fontSize: '14px'
    };
    const btnRow = { display: 'flex', gap: '6px' };
    const smallBtn = { padding: '5px 10px', fontSize: '12px', borderRadius: '8px' };
    const dangerBtn = { ...smallBtn, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' };
    const addRow = { display: 'flex', gap: '8px', padding: '12px 14px', borderBottom: '1px solid var(--line)' };

    const renderList = (items, type) => {
        const isSubject = type === 'subject';
        const isBoard = type === 'board';
        const editing = isSubject ? editingSubject : isBoard ? editingBoard : editingMedium;

        const updateFn = (id) => isSubject ? updateSubject(id) : isBoard ? updateBoard(id) : updateMedium(id);
        const deleteFn = (id) => isSubject ? deleteSubject(id) : isBoard ? deleteBoard(id) : deleteMedium(id);
        const setEditingFn = (id) => isSubject ? setEditingSubject(id) : isBoard ? setEditingBoard(id) : setEditingMedium(id);

        return items.map(item => (
            <div key={item.id} style={itemStyle}>
                {editing === item.id ? (
                    <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
                        <input value={editName} onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') updateFn(item.id); }}
                            style={{ flex: 1 }} autoFocus />
                        <button style={smallBtn} onClick={() => updateFn(item.id)}>
                            <Icon d={ICONS.save} size={14} />
                        </button>
                        <button className="secondary" style={smallBtn} onClick={() => setEditingFn(null)}>
                            <Icon d={ICONS.x} size={14} />
                        </button>
                    </div>
                ) : (
                    <>
                        <span>{item.name}</span>
                        <div style={btnRow}>
                            <button className="secondary" style={smallBtn} onClick={() => {
                                setEditName(item.name);
                                setEditingFn(item.id);
                            }}>
                                <Icon d={ICONS.edit} size={14} />
                            </button>
                            <button style={dangerBtn} onClick={() => deleteFn(item.id)}>
                                <Icon d={ICONS.trash} size={14} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        ));
    };

    return (
        <div className="page-content">
            <div className="panel-head">
                <h2>Subjects & Boards & Mediums</h2>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '16px' }}>
                {/* ── Subjects Panel ── */}
                <div className="card" style={panelStyle}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon d={ICONS.book} size={18} /> Subjects
                        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 400 }}>({subjects.length})</span>
                    </h3>
                    <div style={addRow}>
                        <input value={newSubject} onChange={e => setNewSubject(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addSubject(); }}
                            placeholder="New subject name…" style={{ flex: 1 }} />
                        <button onClick={addSubject} style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Icon d={ICONS.plus} size={16} /> Add
                        </button>
                    </div>
                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                        {renderList(subjects, 'subject')}
                        {!subjects.length && <p style={{ padding: '14px', color: 'var(--muted)', fontSize: '13px' }}>No subjects yet</p>}
                    </div>
                </div>

                {/* ── Boards Panel ── */}
                <div className="card" style={panelStyle}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon d={ICONS.gradCap} size={18} /> Boards
                        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 400 }}>({boards.length})</span>
                    </h3>
                    <div style={addRow}>
                        <input value={newBoard} onChange={e => setNewBoard(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addBoard(); }}
                            placeholder="New board name…" style={{ flex: 1 }} />
                        <button onClick={addBoard} style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Icon d={ICONS.plus} size={16} /> Add
                        </button>
                    </div>
                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                        {renderList(boards, 'board')}
                        {!boards.length && <p style={{ padding: '14px', color: 'var(--muted)', fontSize: '13px' }}>No boards yet</p>}
                    </div>
                </div>

                {/* ── Mediums Panel ── */}
                <div className="card" style={panelStyle}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon d={ICONS.book} size={18} /> Mediums
                        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 400 }}>({mediums.length})</span>
                    </h3>
                    <div style={addRow}>
                        <input value={newMedium} onChange={e => setNewMedium(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addMedium(); }}
                            placeholder="New medium name…" style={{ flex: 1 }} />
                        <button onClick={addMedium} style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Icon d={ICONS.plus} size={16} /> Add
                        </button>
                    </div>
                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                        {renderList(mediums, 'medium')}
                        {!mediums.length && <p style={{ padding: '14px', color: 'var(--muted)', fontSize: '13px' }}>No mediums yet</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
