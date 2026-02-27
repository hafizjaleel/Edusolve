const fs = require('fs');
const file = 'apps/web/src/features/teachers/TeacherCoordinatorPages.jsx';
let content = fs.readFileSync(file, 'utf8');

const tcalleadspage = `

/* ═══════ TC All Leads (Table View) ═══════ */
export function TCAllLeadsPage({ onNavigate }) {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const [showViewModal, setShowViewModal] = useState(null);

    useEffect(() => {
        apiFetch('/teacher-leads').then(res => {
            setLeads(res.items || []);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            // Search
            if (search && !lead.full_name?.toLowerCase().includes(search.toLowerCase()) && 
                !lead.phone?.includes(search) && 
                !lead.email?.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }
            
            // Status filter
            if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

            // Date filter
            if (dateFilter !== 'all') {
                const leadDate = new Date(lead.created_at);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (dateFilter === 'today') {
                    if (leadDate < today) return false;
                } else if (dateFilter === 'yesterday') {
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (leadDate < yesterday || leadDate >= today) return false;
                } else if (dateFilter === 'last7') {
                    const last7 = new Date(today);
                    last7.setDate(last7.getDate() - 7);
                    if (leadDate < last7) return false;
                } else if (dateFilter === 'last30') {
                    const last30 = new Date(today);
                    last30.setDate(last30.getDate() - 30);
                    if (leadDate < last30) return false;
                }
            }

            return true;
        });
    }, [leads, search, statusFilter, dateFilter]);

    return (
        <section className="panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>All Teacher Leads</h2>
            </div>

            <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Search</label>
                        <input 
                            type="text" 
                            placeholder="Search name, phone, email..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div style={{ flex: '0 0 160px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</label>
                        <select 
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
                        >
                            <option value="all">All Statuses</option>
                            {STATUS_STEPS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div style={{ flex: '0 0 160px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Date Received</label>
                        <select 
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday (1 day ago)</option>
                            <option value="last7">Last 7 Days</option>
                            <option value="last30">Last 30 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading leads...</div>
                ) : filteredLeads.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No leads found.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151' }}>Date Received</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151' }}>Name</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151', minWidth: '120px' }}>Contact</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151' }}>Experience</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151' }}>Status</th>
                                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map(lead => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        <div style={{ fontSize: '11px', marginTop: '2px' }}>
                                            {new Date(lead.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>
                                        {lead.full_name}
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                                        <div>{lead.phone || '-'}</div>
                                        {lead.email && <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{lead.email}</div>}
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                                        {lead.experience_level || '-'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                                            background: `${STATUS_COLORS[lead.status] || '#6b7280'}18`,
                                            color: STATUS_COLORS[lead.status] || '#6b7280',
                                            display: 'inline-flex', alignItems: 'center', gap: '4px'
                                        }}>
                                            <StatusIcon status={lead.status} size={12} />
                                            {STATUS_LABELS[lead.status] || lead.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <button 
                                            className="small secondary" 
                                            onClick={() => setShowViewModal(lead)}
                                            style={{ padding: '4px 8px', fontSize: '12px' }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* View Lead Modal */}
            {showViewModal ? <ViewLeadModal lead={showViewModal} onClose={() => setShowViewModal(null)} onEdit={() => {}} /> : null}

        </section>
    );
}

`;

if (!content.includes('TCAllLeadsPage')) {
    content = content + tcalleadspage;
    fs.writeFileSync(file, content);
    console.log('TCAllLeadsPage added');
} else {
    console.log('TCAllLeadsPage already exists');
}
