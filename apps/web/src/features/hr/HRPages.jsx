import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api.js';

/* ═══════ HR DASHBOARD ═══════ */
export function HRDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/hr/stats').then(r => setStats(r.stats)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

    const s = stats || {};
    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 20 }}>HR Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <DashCard label="Total Employees" value={s.totalEmployees || 0} tone="blue" />
                <DashCard label="Present Today" value={s.todayPresent || 0} tone="green" />
                <DashCard label="Absent Today" value={s.todayAbsent || 0} tone="red" />
                <DashCard label="Half Day" value={s.todayHalfDay || 0} tone="amber" />
                <DashCard label="On Leave" value={s.todayLeave || 0} tone="purple" />
                <DashCard label="Attendance Marked" value={s.todayMarked || 0} tone="blue" />
                <DashCard label="Draft Payrolls" value={s.pendingPayrollCycles || 0} tone="amber" />
                <DashCard label="Pending Requests" value={s.pendingPaymentRequests || 0} tone="red" />
            </div>
        </div>
    );
}

function DashCard({ label, value, tone }) {
    const colors = { blue: '#3b82f6', green: '#22c55e', red: '#ef4444', amber: '#f59e0b', purple: '#8b5cf6' };
    return (
        <div style={{
            background: '#1e293b', borderRadius: 12, padding: '20px 24px', minWidth: 180,
            borderLeft: `4px solid ${colors[tone] || '#666'}`
        }}>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9' }}>{value}</p>
        </div>
    );
}

/* ═══════ ATTENDANCE PAGE ═══════ */
export function AttendancePage() {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changes, setChanges] = useState({});
    const [filter, setFilter] = useState('all');

    function load() {
        setLoading(true);
        apiFetch(`/hr/attendance?date=${date}`)
            .then(r => { setItems(r.items || []); setChanges({}); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, [date]);

    function updateStatus(empId, status) {
        setChanges(prev => ({ ...prev, [empId]: { ...prev[empId], employee_id: empId, status } }));
    }

    function markAllAs(status) {
        const bulk = {};
        filteredItems.forEach(emp => {
            if (!changes[emp.id] && !emp.attendance) {
                bulk[emp.id] = { employee_id: emp.id, status };
            }
        });
        setChanges(prev => ({ ...prev, ...bulk }));
    }

    async function saveAll() {
        const records = Object.values(changes);
        if (records.length === 0) return;
        setSaving(true);
        try {
            await apiFetch('/hr/attendance', {
                method: 'POST',
                body: JSON.stringify({ date, records })
            });
            load();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    const statuses = ['present', 'absent', 'half_day', 'leave'];
    const statusLabels = { present: 'Present', absent: 'Absent', half_day: 'Half Day', leave: 'Leave' };
    const statusIcons = { present: '✓', absent: '✗', half_day: '½', leave: '🏖' };
    const statusColors = { present: '#22c55e', absent: '#ef4444', half_day: '#f59e0b', leave: '#8b5cf6' };

    const summary = useMemo(() => {
        const counts = { present: 0, absent: 0, half_day: 0, leave: 0, unmarked: 0 };
        items.forEach(emp => {
            const s = changes[emp.id]?.status || emp.attendance?.status;
            if (s && counts[s] !== undefined) counts[s]++;
            else counts.unmarked++;
        });
        return counts;
    }, [items, changes]);

    const filteredItems = useMemo(() => {
        if (filter === 'all') return items;
        if (filter === 'unmarked') return items.filter(emp => !changes[emp.id]?.status && !emp.attendance?.status);
        return items.filter(emp => {
            const s = changes[emp.id]?.status || emp.attendance?.status;
            return s === filter;
        });
    }, [items, changes, filter]);

    const changesCount = Object.keys(changes).length;
    const isToday = date === new Date().toISOString().slice(0, 10);
    const dateLabel = isToday ? 'Today' : new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div style={{ padding: 24, paddingBottom: changesCount > 0 ? 80 : 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0, marginBottom: 4 }}>Attendance</h2>
                    <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>{dateLabel} · {items.length} employees</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => setDate(prev => { const d = new Date(prev); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })}
                        style={{ padding: '6px 12px', borderRadius: 8, background: '#334155', color: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 16 }}>←</button>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                        style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 14 }} />
                    <button onClick={() => setDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })}
                        style={{ padding: '6px 12px', borderRadius: 8, background: '#334155', color: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 16 }}>→</button>
                    {!isToday && (
                        <button onClick={() => setDate(new Date().toISOString().slice(0, 10))}
                            style={{ padding: '6px 14px', borderRadius: 8, background: '#1e3a5f', color: '#60a5fa', border: 'none', cursor: 'pointer', fontSize: 13 }}>Today</button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
                {[
                    { label: 'Present', count: summary.present, color: '#22c55e', bg: '#064e3b', filterKey: 'present' },
                    { label: 'Absent', count: summary.absent, color: '#ef4444', bg: '#7f1d1d', filterKey: 'absent' },
                    { label: 'Half Day', count: summary.half_day, color: '#f59e0b', bg: '#78350f', filterKey: 'half_day' },
                    { label: 'Leave', count: summary.leave, color: '#8b5cf6', bg: '#4c1d95', filterKey: 'leave' },
                    { label: 'Unmarked', count: summary.unmarked, color: '#94a3b8', bg: '#1e293b', filterKey: 'unmarked' },
                ].map(card => (
                    <div key={card.label} onClick={() => setFilter(filter === card.filterKey ? 'all' : card.filterKey)}
                        style={{
                            background: card.bg, borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
                            border: filter === card.filterKey ? `2px solid ${card.color}` : '2px solid transparent',
                            transition: 'border 0.15s'
                        }}>
                        <p style={{ fontSize: 22, fontWeight: 700, color: card.color, margin: 0 }}>{card.count}</p>
                        <p style={{ fontSize: 12, color: card.color, opacity: 0.8, margin: 0, marginTop: 2 }}>{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#64748b', marginRight: 4 }}>Quick:</span>
                <button onClick={() => markAllAs('present')}
                    style={{ padding: '4px 12px', borderRadius: 6, background: '#064e3b', color: '#22c55e', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                    Mark all Present
                </button>
                <button onClick={() => markAllAs('absent')}
                    style={{ padding: '4px 12px', borderRadius: 6, background: '#7f1d1d', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                    Mark all Absent
                </button>
                {filter !== 'all' && (
                    <button onClick={() => setFilter('all')}
                        style={{ padding: '4px 12px', borderRadius: 6, background: '#334155', color: '#e2e8f0', border: 'none', cursor: 'pointer', fontSize: 12, marginLeft: 'auto' }}>
                        Show All
                    </button>
                )}
            </div>

            {/* Table */}
            {loading ? <p>Loading...</p> : (
                <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #1e293b' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#0f172a' }}>
                                <th style={{ ...thStyle, width: 40 }}>#</th>
                                <th style={thStyle}>Employee</th>
                                <th style={{ ...thStyle, width: 100 }}>Department</th>
                                <th style={{ ...thStyle, width: 80 }}>Type</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((emp, idx) => {
                                const currentStatus = changes[emp.id]?.status || emp.attendance?.status || null;
                                return (
                                    <tr key={emp.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                        <td style={{ ...tdStyle, color: '#94a3b8' }}>{idx + 1}</td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: 500 }}>{emp.full_name}</div>
                                            {emp.designation && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{emp.designation}</div>}
                                        </td>
                                        <td style={{ ...tdStyle, fontSize: 13, color: '#94a3b8' }}>{emp.department || '—'}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                                                background: emp.employee_type === 'student' ? '#1e3a5f' : '#1e293b',
                                                color: emp.employee_type === 'student' ? '#60a5fa' : '#94a3b8'
                                            }}>
                                                {emp.employee_type}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', gap: 4, background: '#0f172a', borderRadius: 8, padding: 3 }}>
                                                {statuses.map(s => {
                                                    const isActive = currentStatus === s;
                                                    return (
                                                        <button key={s} onClick={() => updateStatus(emp.id, s)}
                                                            title={statusLabels[s]}
                                                            style={{
                                                                padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                                                fontSize: 12, fontWeight: isActive ? 700 : 400,
                                                                background: isActive ? statusColors[s] : 'transparent',
                                                                color: isActive ? '#fff' : '#64748b',
                                                                transition: 'all 0.15s', minWidth: 70
                                                            }}>
                                                            <span style={{ marginRight: 4 }}>{statusIcons[s]}</span>
                                                            {statusLabels[s]}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#64748b', padding: 32 }}>
                                    {filter !== 'all' ? 'No employees match this filter' : 'No employees found. Add employees first.'}
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Sticky Save Bar */}
            {changesCount > 0 && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 24px',
                    background: '#0f172af0', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                    borderTop: '1px solid #334155', zIndex: 100
                }}>
                    <span style={{ color: '#94a3b8', fontSize: 14 }}>{changesCount} unsaved change{changesCount > 1 ? 's' : ''}</span>
                    <button onClick={() => setChanges({})}
                        style={{ padding: '8px 20px', borderRadius: 8, background: '#334155', color: '#e2e8f0', border: 'none', cursor: 'pointer', fontSize: 14 }}>
                        Discard
                    </button>
                    <button onClick={saveAll} disabled={saving}
                        style={{ padding: '8px 24px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                        {saving ? 'Saving...' : 'Save All'}
                    </button>
                </div>
            )}
        </div>
    );
}

/* ═══════ EMPLOYEES PAGE ═══════ */
export function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editEmp, setEditEmp] = useState(null);
    const [salaryEmp, setSalaryEmp] = useState(null);

    function load() {
        setLoading(true);
        apiFetch('/hr/employees').then(r => setEmployees(r.items || [])).catch(() => { }).finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, []);

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>Employees</h2>
                <button onClick={() => setShowAdd(true)}
                    style={{ padding: '8px 20px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    + Add Employee
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Type</th>
                                <th style={thStyle}>Designation</th>
                                <th style={thStyle}>Department</th>
                                <th style={thStyle}>Phone</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Salary</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp, idx) => {
                                const sal = emp.salary_structures?.[0] || emp.salary_structures;
                                const hasSalary = sal && sal.base_salary > 0;
                                return (
                                    <tr key={emp.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                        <td style={tdStyle}>{idx + 1}</td>
                                        <td style={tdStyle}>{emp.full_name}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: '2px 10px', borderRadius: 20, fontSize: 12,
                                                background: emp.employee_type === 'student' ? '#1e3a5f' : '#1e293b',
                                                color: emp.employee_type === 'student' ? '#60a5fa' : '#94a3b8'
                                            }}>
                                                {emp.employee_type}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>{emp.designation || '—'}</td>
                                        <td style={tdStyle}>{emp.department || '—'}</td>
                                        <td style={tdStyle}>{emp.phone || '—'}</td>
                                        <td style={tdStyle}>{emp.email || '—'}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: '2px 10px', borderRadius: 20, fontSize: 12,
                                                background: emp.is_active ? '#064e3b' : '#7f1d1d',
                                                color: emp.is_active ? '#34d399' : '#fca5a5'
                                            }}>
                                                {emp.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>{hasSalary ? `₹${Number(sal.base_salary).toLocaleString()}` : '—'}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button onClick={() => setEditEmp(emp)}
                                                    style={{ padding: '4px 12px', borderRadius: 6, background: '#334155', color: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                                                    Edit
                                                </button>
                                                <button onClick={() => setSalaryEmp(emp)}
                                                    style={{ padding: '4px 12px', borderRadius: 6, background: hasSalary ? '#1e3a5f' : '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                                                    {hasSalary ? 'Edit Salary' : 'Set Salary'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {employees.length === 0 && (
                                <tr><td colSpan={10} style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>No employees yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showAdd && <AddEmployeeModal onClose={() => setShowAdd(false)} onDone={() => { setShowAdd(false); load(); }} />}
            {editEmp && <EditEmployeeModal employee={editEmp} onClose={() => setEditEmp(null)} onDone={() => { setEditEmp(null); load(); }} />}
            {salaryEmp && <SalaryModal employee={salaryEmp} existing={(salaryEmp.salary_structures?.[0] || salaryEmp.salary_structures)} onClose={() => setSalaryEmp(null)} onDone={() => { setSalaryEmp(null); load(); }} />}
        </div>
    );
}

function AddEmployeeModal({ onClose, onDone }) {
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', designation: '', department: '', employee_type: 'staff' });
    const [saving, setSaving] = useState(false);
    const upd = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await apiFetch('/hr/employees', { method: 'POST', body: JSON.stringify(form) });
            onDone();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{ marginBottom: 16 }}>Add Employee</h3>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={labelStyle}>
                        Full Name *
                        <input required value={form.full_name} onChange={e => upd('full_name', e.target.value)} style={inputStyle} />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Email
                            <input type="email" value={form.email} onChange={e => upd('email', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>
                            Phone
                            <input value={form.phone} onChange={e => upd('phone', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Designation
                            <input value={form.designation} onChange={e => upd('designation', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>
                            Department
                            <input value={form.department} onChange={e => upd('department', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <label style={labelStyle}>
                        Type
                        <select value={form.employee_type} onChange={e => upd('employee_type', e.target.value)} style={inputStyle}>
                            <option value="staff">Staff</option>
                            <option value="student">Student</option>
                        </select>
                    </label>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : 'Add Employee'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditEmployeeModal({ employee, onClose, onDone }) {
    const [form, setForm] = useState({
        full_name: employee.full_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        designation: employee.designation || '',
        department: employee.department || '',
        employee_type: employee.employee_type || 'staff',
        is_active: employee.is_active !== false
    });
    const [saving, setSaving] = useState(false);
    const upd = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await apiFetch(`/hr/employees/${employee.id}`, { method: 'PATCH', body: JSON.stringify(form) });
            onDone();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{ marginBottom: 16 }}>Edit Employee</h3>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={labelStyle}>
                        Full Name *
                        <input required value={form.full_name} onChange={e => upd('full_name', e.target.value)} style={inputStyle} />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Email
                            <input type="email" value={form.email} onChange={e => upd('email', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>
                            Phone
                            <input value={form.phone} onChange={e => upd('phone', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Designation
                            <input value={form.designation} onChange={e => upd('designation', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>
                            Department
                            <input value={form.department} onChange={e => upd('department', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>
                            Type
                            <select value={form.employee_type} onChange={e => upd('employee_type', e.target.value)} style={inputStyle}>
                                <option value="staff">Staff</option>
                                <option value="student">Student</option>
                            </select>
                        </label>
                        <label style={labelStyle}>
                            Status
                            <select value={form.is_active ? 'active' : 'inactive'} onChange={e => upd('is_active', e.target.value === 'active')} style={inputStyle}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════ SALARY CALCULATOR PAGE ═══════ */
export function SalaryCalculatorPage() {
    const [employees, setEmployees] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editEmp, setEditEmp] = useState(null);

    useEffect(() => {
        Promise.all([
            apiFetch('/hr/employees'),
            apiFetch('/hr/salary-structures')
        ]).then(([empRes, salRes]) => {
            setEmployees(empRes.items || []);
            setSalaries(salRes.items || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    function reload() {
        setLoading(true);
        Promise.all([
            apiFetch('/hr/employees'),
            apiFetch('/hr/salary-structures')
        ]).then(([empRes, salRes]) => {
            setEmployees(empRes.items || []);
            setSalaries(salRes.items || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }

    const salaryMap = useMemo(() => {
        const map = {};
        (salaries || []).forEach(s => { map[s.employee_id] = s; });
        return map;
    }, [salaries]);

    if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 20 }}>Salary Calculator</h2>

            <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>Employee</th>
                            <th style={thStyle}>Base Salary</th>
                            <th style={thStyle}>HRA</th>
                            <th style={thStyle}>Allowances</th>
                            <th style={thStyle}>Deductions</th>
                            <th style={thStyle}>Gross</th>
                            <th style={thStyle}>Net</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.filter(e => e.is_active).map((emp, idx) => {
                            const sal = salaryMap[emp.id];
                            const base = sal ? Number(sal.base_salary) : 0;
                            const hra = sal ? Number(sal.hra) : 0;
                            const allowances = sal ? Number(sal.transport_allowance) + Number(sal.other_allowance) : 0;
                            const deductions = sal ? Number(sal.pf_deduction) + Number(sal.tax_deduction) + Number(sal.other_deduction) : 0;
                            const gross = base + hra + allowances;
                            const net = gross - deductions;
                            return (
                                <tr key={emp.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                    <td style={tdStyle}>{idx + 1}</td>
                                    <td style={tdStyle}>
                                        <div>{emp.full_name}</div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>{emp.designation || ''}</div>
                                    </td>
                                    <td style={tdStyle}>₹{base.toLocaleString()}</td>
                                    <td style={tdStyle}>₹{hra.toLocaleString()}</td>
                                    <td style={tdStyle}>₹{allowances.toLocaleString()}</td>
                                    <td style={tdStyle}>₹{deductions.toLocaleString()}</td>
                                    <td style={{ ...tdStyle, color: '#22c55e' }}>₹{gross.toLocaleString()}</td>
                                    <td style={{ ...tdStyle, fontWeight: 700, color: '#f1f5f9' }}>₹{net.toLocaleString()}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => setEditEmp(emp)}
                                            style={{ padding: '4px 12px', borderRadius: 6, background: '#334155', color: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                                            {sal ? 'Edit' : 'Set'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {editEmp && (
                <SalaryModal
                    employee={editEmp}
                    existing={salaryMap[editEmp.id]}
                    onClose={() => setEditEmp(null)}
                    onDone={() => { setEditEmp(null); reload(); }}
                />
            )}
        </div>
    );
}

function SalaryModal({ employee, existing, onClose, onDone }) {
    const [form, setForm] = useState({
        base_salary: existing?.base_salary || '',
        hra: existing?.hra || '',
        transport_allowance: existing?.transport_allowance || '',
        other_allowance: existing?.other_allowance || '',
        pf_deduction: existing?.pf_deduction || '',
        tax_deduction: existing?.tax_deduction || '',
        other_deduction: existing?.other_deduction || ''
    });
    const [saving, setSaving] = useState(false);
    const upd = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await apiFetch('/hr/salary-structures', {
                method: 'POST',
                body: JSON.stringify({ employee_id: employee.id, ...form })
            });
            onDone();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    const gross = Number(form.base_salary || 0) + Number(form.hra || 0) + Number(form.transport_allowance || 0) + Number(form.other_allowance || 0);
    const deductions = Number(form.pf_deduction || 0) + Number(form.tax_deduction || 0) + Number(form.other_deduction || 0);
    const net = gross - deductions;

    return (
        <div style={overlayStyle}>
            <div style={{ ...modalStyle, maxWidth: 520 }}>
                <h3 style={{ marginBottom: 4 }}>Salary Structure</h3>
                <p style={{ color: '#94a3b8', marginBottom: 16, fontSize: 14 }}>{employee.full_name} — {employee.designation || 'No designation'}</p>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={labelStyle}>Base Salary (₹)
                        <input type="number" step="0.01" value={form.base_salary} onChange={e => upd('base_salary', e.target.value)} style={inputStyle} />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>HRA (₹)
                            <input type="number" step="0.01" value={form.hra} onChange={e => upd('hra', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>Transport (₹)
                            <input type="number" step="0.01" value={form.transport_allowance} onChange={e => upd('transport_allowance', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <label style={labelStyle}>Other Allowance (₹)
                        <input type="number" step="0.01" value={form.other_allowance} onChange={e => upd('other_allowance', e.target.value)} style={inputStyle} />
                    </label>
                    <hr style={{ border: 'none', borderTop: '1px solid #334155', margin: '4px 0' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>PF (₹)
                            <input type="number" step="0.01" value={form.pf_deduction} onChange={e => upd('pf_deduction', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>Tax (₹)
                            <input type="number" step="0.01" value={form.tax_deduction} onChange={e => upd('tax_deduction', e.target.value)} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>Other (₹)
                            <input type="number" step="0.01" value={form.other_deduction} onChange={e => upd('other_deduction', e.target.value)} style={inputStyle} />
                        </label>
                    </div>
                    <div style={{ background: '#0f172a', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Gross: <strong style={{ color: '#22c55e' }}>₹{gross.toLocaleString()}</strong></span>
                        <span style={{ color: '#94a3b8' }}>Deductions: <strong style={{ color: '#ef4444' }}>₹{deductions.toLocaleString()}</strong></span>
                        <span style={{ color: '#94a3b8' }}>Net: <strong style={{ color: '#f1f5f9' }}>₹{net.toLocaleString()}</strong></span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : 'Save Salary'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════ HR PAYROLL PAGE ═══════ */
export function HRPayrollPage() {
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [viewCycleId, setViewCycleId] = useState(null);
    const [items, setItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);

    function loadCycles() {
        setLoading(true);
        apiFetch('/hr/payroll').then(r => setCycles(r.items || [])).catch(() => { }).finally(() => setLoading(false));
    }

    useEffect(() => { loadCycles(); }, []);

    async function viewCycle(cycle) {
        setViewCycleId(cycle.id);
        setItemsLoading(true);
        try {
            const r = await apiFetch(`/hr/payroll/${cycle.id}`);
            setItems(r.items || []);
        } catch { } finally {
            setItemsLoading(false);
        }
    }

    async function generatePayroll(cycleId) {
        try {
            const r = await apiFetch('/hr/payroll/generate', { method: 'POST', body: JSON.stringify({ cycle_id: cycleId }) });
            alert(`Payroll generated for ${r.count} employees. Total: ₹${r.totalAmount?.toLocaleString()}`);
            viewCycle({ id: cycleId });
            loadCycles();
        } catch (err) {
            alert(err.message);
        }
    }

    async function submitToFinance(cycleId) {
        if (!confirm('Submit this payroll to Finance for payment?')) return;
        try {
            await apiFetch('/hr/payment-requests', { method: 'POST', body: JSON.stringify({ cycle_id: cycleId }) });
            alert('Payment request sent to Finance!');
            loadCycles();
        } catch (err) {
            alert(err.message);
        }
    }

    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const statusColors = { draft: '#f59e0b', submitted: '#3b82f6', approved: '#22c55e', rejected: '#ef4444', paid: '#8b5cf6' };

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>Payroll</h2>
                <button onClick={() => setShowCreate(true)}
                    style={{ padding: '8px 20px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    + New Cycle
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {/* Cycles List */}
                    <div style={{ flex: '0 0 340px' }}>
                        {cycles.map(c => (
                            <div key={c.id} onClick={() => viewCycle(c)}
                                style={{
                                    background: viewCycleId === c.id ? '#1e3a5f' : '#1e293b', borderRadius: 10, padding: 16,
                                    marginBottom: 8, cursor: 'pointer', border: viewCycleId === c.id ? '1px solid #3b82f6' : '1px solid transparent'
                                }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ color: '#f1f5f9' }}>{monthNames[c.month]} {c.year}</strong>
                                    <span style={{
                                        padding: '2px 10px', borderRadius: 20, fontSize: 12,
                                        background: statusColors[c.status] + '22', color: statusColors[c.status]
                                    }}>
                                        {c.status}
                                    </span>
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>Total: ₹{Number(c.total_amount || 0).toLocaleString()}</p>
                                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                    {c.status === 'draft' && (
                                        <>
                                            <button onClick={e => { e.stopPropagation(); generatePayroll(c.id); }}
                                                style={{ ...btnSmall, background: '#334155' }}>Generate</button>
                                            <button onClick={e => { e.stopPropagation(); submitToFinance(c.id); }}
                                                style={{ ...btnSmall, background: '#22c55e' }}>Send to Finance</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {cycles.length === 0 && <p style={{ color: '#64748b' }}>No payroll cycles yet</p>}
                    </div>

                    {/* Payroll Items */}
                    {viewCycleId && (
                        <div style={{ flex: 1, minWidth: 400 }}>
                            <h3 style={{ marginBottom: 12, color: '#f1f5f9' }}>Payroll Items</h3>
                            {itemsLoading ? <p>Loading...</p> : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={thStyle}>#</th>
                                                <th style={thStyle}>Employee</th>
                                                <th style={thStyle}>Working</th>
                                                <th style={thStyle}>Present</th>
                                                <th style={thStyle}>Absent</th>
                                                <th style={thStyle}>Base</th>
                                                <th style={thStyle}>Allowances</th>
                                                <th style={thStyle}>Deductions</th>
                                                <th style={thStyle}>Net Salary</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item, idx) => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                                    <td style={tdStyle}>{idx + 1}</td>
                                                    <td style={tdStyle}>{item.employees?.full_name || '—'}</td>
                                                    <td style={tdStyle}>{item.working_days}</td>
                                                    <td style={{ ...tdStyle, color: '#22c55e' }}>{item.present_days}</td>
                                                    <td style={{ ...tdStyle, color: '#ef4444' }}>{item.absent_days}</td>
                                                    <td style={tdStyle}>₹{Number(item.base_salary).toLocaleString()}</td>
                                                    <td style={tdStyle}>₹{Number(item.total_allowances).toLocaleString()}</td>
                                                    <td style={tdStyle}>₹{Number(item.total_deductions).toLocaleString()}</td>
                                                    <td style={{ ...tdStyle, fontWeight: 700, color: '#f1f5f9' }}>₹{Number(item.net_salary).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            {items.length === 0 && (
                                                <tr><td colSpan={9} style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>No items — click "Generate" to calculate</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {showCreate && <CreatePayrollCycleModal onClose={() => setShowCreate(false)} onDone={() => { setShowCreate(false); loadCycles(); }} />}
        </div>
    );
}

function CreatePayrollCycleModal({ onClose, onDone }) {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [saving, setSaving] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await apiFetch('/hr/payroll', { method: 'POST', body: JSON.stringify({ year, month }) });
            onDone();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{ marginBottom: 16 }}>Create Payroll Cycle</h3>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={labelStyle}>Year
                            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} style={inputStyle} />
                        </label>
                        <label style={labelStyle}>Month
                            <select value={month} onChange={e => setMonth(Number(e.target.value))} style={inputStyle}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                    <option key={m} value={m}>{['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m]}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                        <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Creating...' : 'Create Cycle'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════ HR PAYMENT REQUESTS PAGE ═══════ */
export function HRPaymentRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/hr/payment-requests')
            .then(r => setRequests(r.items || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const statusColors = { pending: '#f59e0b', approved: '#22c55e', rejected: '#ef4444', paid: '#8b5cf6' };
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 20 }}>Payment Requests to Finance</h2>

            <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>Payroll Period</th>
                            <th style={thStyle}>Total Amount</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Submitted</th>
                            <th style={thStyle}>Finance Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req, idx) => {
                            const cycle = req.hr_payroll_cycles;
                            return (
                                <tr key={req.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                    <td style={tdStyle}>{idx + 1}</td>
                                    <td style={tdStyle}>{cycle ? `${monthNames[cycle.month]} ${cycle.year}` : '—'}</td>
                                    <td style={{ ...tdStyle, fontWeight: 700 }}>₹{Number(req.total_amount).toLocaleString()}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '2px 10px', borderRadius: 20, fontSize: 12,
                                            background: (statusColors[req.status] || '#666') + '22',
                                            color: statusColors[req.status] || '#94a3b8'
                                        }}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{new Date(req.created_at).toLocaleDateString('en-IN')}</td>
                                    <td style={tdStyle}>{req.finance_note || '—'}</td>
                                </tr>
                            );
                        })}
                        {requests.length === 0 && (
                            <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>No payment requests yet. Generate payroll and submit to Finance.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════ SHARED STYLES ═══════ */
const thStyle = { textAlign: 'left', padding: '10px 12px', color: '#94a3b8', fontSize: 13, fontWeight: 600, background: '#0f172a', whiteSpace: 'nowrap' };
const tdStyle = { padding: '10px 12px', color: '#1e293b', fontSize: 14 };
const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalStyle = {
    background: '#1e293b', borderRadius: 14, padding: 28, width: '100%', maxWidth: 480,
    maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
};
const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #334155',
    background: '#0f172a', color: '#f1f5f9', fontSize: 14, marginTop: 4
};
const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: 13, color: '#94a3b8' };
const btnPrimary = { padding: '8px 20px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 };
const btnSecondary = { padding: '8px 20px', borderRadius: 8, background: '#334155', color: '#e2e8f0', border: 'none', cursor: 'pointer' };
const btnSmall = { padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, color: '#f1f5f9' };
