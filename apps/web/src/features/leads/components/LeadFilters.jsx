
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api.js';

export function LeadFilters({ onFilterChange, counselors = [], children }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [counselorId, setCounselorId] = useState('');
    // debounce search could be added later

    useEffect(() => {
        onFilterChange({ search, status, counselorId });
    }, [search, status, counselorId]);

    return (
        <div className="card filters-bar" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px' }}>
            <div className="filter-group" style={{ flex: 1 }}>
                <input
                    type="text"
                    placeholder="Search name or phone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            <div className="filter-group">
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="demo_scheduled">Demo Scheduled</option>
                    <option value="demo_done">Demo Done</option>
                    <option value="payment_pending">Payment Pending</option>
                    <option value="payment_verification">Payment Verification</option>
                    <option value="joined">Joined</option>
                    <option value="dropped">Dropped</option>
                </select>
            </div>

            <div className="filter-group">
                <select value={counselorId} onChange={e => setCounselorId(e.target.value)}>
                    <option value="">All Counselors</option>
                    {counselors.map(c => (
                        <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
                    ))}
                </select>
            </div>
            {children}
        </div>
    );
}
