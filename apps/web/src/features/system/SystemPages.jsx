import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { ROLE_OPTIONS } from '../../lib/roles.js';
import { PhoneInput, isValidEmail } from '../../components/PhoneInput.jsx';

export function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // user object to delete

    async function load() {
        try {
            const data = await apiFetch('/admin/users');
            setUsers(data.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    return (
        <section className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2>User Management</h2>
                <button className="primary" onClick={() => setShowAdd(true)}>+ Add User</button>
            </div>

            {loading ? <p>Loading users...</p> : (
                <div className="card" style={{ padding: '0' }}>
                    <div className="table-wrap mobile-friendly-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Phone</th>
                                    <th>Last Sign In</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td data-label="Email" style={{ fontWeight: 600 }}>
                                            {u.email}
                                            {u.name && <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 400 }}>{u.name}</div>}
                                        </td>
                                        <td data-label="Role">
                                            <span className={`tag ${u.role === 'unknown' ? 'warning' : ''}`} style={{ textTransform: 'uppercase', fontSize: '11px' }}>
                                                {ROLE_OPTIONS.find(r => r.value === u.role)?.label || u.role}
                                            </span>
                                        </td>
                                        <td data-label="Phone">
                                            {u.phone || '-'}
                                        </td>
                                        <td data-label="Last Sign In" className="text-muted" style={{ fontSize: '13px' }}>
                                            {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : 'Never'}
                                        </td>
                                        <td data-label="Created" className="text-muted" style={{ fontSize: '13px' }}>
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td data-label="Actions">
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="secondary small" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => setEditingUser(u)}>
                                                    Edit
                                                </button>
                                                <button className="text-danger" style={{ fontSize: '12px' }} onClick={() => setDeleteConfirm(u)}>Remove</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!users.length && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No users found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showAdd && <UserModal onClose={() => setShowAdd(false)} onDone={() => { setShowAdd(false); load(); }} />}
            {editingUser && <UserModal user={editingUser} onClose={() => setEditingUser(null)} onDone={() => { setEditingUser(null); load(); }} />}
            {deleteConfirm && <DeleteConfirmModal user={deleteConfirm} onClose={() => setDeleteConfirm(null)} onDone={() => { setDeleteConfirm(null); load(); }} />}
        </section>
    );
}

function DeleteConfirmModal({ user, onClose, onDone }) {
    const [typed, setTyped] = useState('');
    const [deleting, setDeleting] = useState(false);
    const match = typed === user.email;

    async function handleDelete() {
        setDeleting(true);
        try {
            await apiFetch(`/admin/users/${user.id}`, { method: 'DELETE' });
            onDone();
        } catch (err) {
            alert(err.message);
            setDeleting(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24 }}>⚠️</div>
                    <h3 style={{ margin: '0 0 6px', color: '#dc2626' }}>Delete User Permanently</h3>
                    <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                        This will permanently remove <strong>{user.name || user.email}</strong> and all their associated data including employee records, attendance, and role assignments.
                    </p>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#991b1b', fontWeight: 600, marginBottom: 8 }}>
                        To confirm, type the user's email below:
                    </p>
                    <code style={{ display: 'block', fontSize: 13, color: '#dc2626', marginBottom: 8, wordBreak: 'break-all' }}>{user.email}</code>
                    <input
                        type="text"
                        value={typed}
                        onChange={e => setTyped(e.target.value)}
                        placeholder="Type email to confirm..."
                        autoFocus
                        style={{
                            width: '100%', padding: '8px 12px', borderRadius: 6,
                            border: `1px solid ${match ? '#22c55e' : '#d1d5db'}`,
                            fontSize: 14, outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={onClose} className="secondary" style={{ flex: 1 }}>Cancel</button>
                    <button
                        onClick={handleDelete}
                        disabled={!match || deleting}
                        style={{
                            flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', cursor: match ? 'pointer' : 'not-allowed',
                            background: match ? '#dc2626' : '#e5e7eb', color: match ? '#fff' : '#9ca3af',
                            fontWeight: 600, fontSize: 14, transition: 'all 0.15s'
                        }}
                    >
                        {deleting ? 'Deleting...' : 'Delete Permanently'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function UserModal({ user, onClose, onDone }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isEdit = !!user;

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);

        if (payload.email && !isValidEmail(payload.email.trim())) {
            setError("Please enter a valid email address format");
            setLoading(false);
            return;
        }
        if (payload.email) payload.email = payload.email.trim();
        if (payload.name) payload.name = payload.name.trim();

        try {
            const url = isEdit ? `/admin/users/${user.id}` : '/admin/users';
            const method = isEdit ? 'PATCH' : 'POST';

            // Remove password if empty in edit mode
            if (isEdit && !payload.password) delete payload.password;

            await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            onDone();
        } catch (err) {
            setError(err.message || 'Failed to save user');
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0 }}>{isEdit ? 'Edit User' : 'Add New User'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                </div>

                {error && <p className="error" style={{ marginBottom: '12px' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {!isEdit && (
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email</label>
                            <input type="email" name="email" required placeholder="user@example.com" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                        </div>
                    )}
                    {isEdit && (
                        <div style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email</label>
                            <input type="email" value={user.email} disabled style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', background: '#f5f5f5', color: '#888' }} />
                        </div>
                    )}

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{isEdit ? 'New Password (Optional)' : 'Password'}</label>
                        <input type="password" name="password" required={!isEdit} placeholder={isEdit ? "Leave blank to keep current" : "Create password"} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Role</label>
                        <select name="role" required defaultValue={user?.role} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                            <option value="">Select Role...</option>
                            {ROLE_OPTIONS.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Name *</label>
                        <input type="text" name="name" required defaultValue={user?.name} placeholder="Full Name" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>

                    {!isEdit && (
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                            <PhoneInput name="phone" required={true} />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button type="button" onClick={onClose} className="secondary" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="primary" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function SystemSettingsPage() {
    return (
        <section className="panel">

            <div className="grid-two">
                <div className="card">
                    <h3>Environment</h3>
                    <div style={{ marginTop: '12px', fontSize: '14px' }}>
                        <p><strong>Mode:</strong> Development</p>
                        <p><strong>API Endpoint:</strong> /api</p>
                        <p><strong>Version:</strong> v1.0.0-beta</p>
                    </div>
                </div>

                <div className="card">
                    <h3>Maintenance</h3>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '8px 0 16px' }}>Temporarily disable login for non-admin users.</p>
                    <button className="secondary" disabled>Enable Maintenance Mode</button>
                </div>
            </div>
        </section>
    );
}
