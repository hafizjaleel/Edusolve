
import { useEffect, useState, useRef } from 'react';
import { apiFetch } from '../lib/api.js';

export function NotificationBell({ onNavigateToTicket }) {
    const [count, setCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    // Poll unread count every 30 secs
    useEffect(() => {
        loadCount();
        const interval = setInterval(loadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        function handleOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    async function loadCount() {
        try {
            const res = await apiFetch('/notifications/count');
            setCount(res.count || 0);
        } catch (e) { /* silent */ }
    }

    async function loadNotifications() {
        setLoading(true);
        try {
            const res = await apiFetch('/notifications?limit=10');
            setItems(res.items || []);
        } catch (e) { /* silent */ }
        setLoading(false);
    }

    function handleToggle() {
        const nextOpen = !open;
        setOpen(nextOpen);
        if (nextOpen) loadNotifications();
    }

    async function handleMarkAllRead() {
        try {
            await apiFetch('/notifications/read-all', { method: 'PATCH' });
            setCount(0);
            setItems(prev => prev.map(i => ({ ...i, is_read: true })));
        } catch (e) { /* silent */ }
    }

    async function handleClick(item) {
        // Mark as read
        if (!item.is_read) {
            try {
                await apiFetch(`/notifications/${item.id}/read`, { method: 'PATCH' });
                setCount(c => Math.max(0, c - 1));
                setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_read: true } : i));
            } catch (e) { /* silent */ }
        }
        setOpen(false);
        if (item.reference_id && onNavigateToTicket) {
            onNavigateToTicket(item.reference_id);
        }
    }

    async function handleDismiss(e, item) {
        e.stopPropagation(); // Prevent triggering the item click
        try {
            await apiFetch(`/notifications/${item.id}`, { method: 'DELETE' });
            setItems(prev => prev.filter(i => i.id !== item.id));
            if (!item.is_read) {
                setCount(c => Math.max(0, c - 1));
            }
        } catch (err) { /* silent */ }
    }

    function timeAgo(dateStr) {
        const now = new Date();
        const date = new Date(dateStr);
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    return (
        <div className="notification-bell-wrap" ref={ref} style={{ position: 'relative' }}>
            <button
                type="button"
                className="notification-bell-btn"
                onClick={handleToggle}
                title="Notifications"
                style={{
                    background: open ? '#f1f5f9' : 'transparent',
                    border: 'none', cursor: 'pointer', position: 'relative',
                    width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: open ? '#0f172a' : '#64748b', transition: 'all 0.2s'
                }}
                onMouseEnter={e => !open && (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={e => !open && (e.currentTarget.style.background = 'transparent')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {count > 0 && (
                    <span style={{
                        position: 'absolute', top: 0, right: 0,
                        background: '#ef4444', color: '#fff', borderRadius: '50%',
                        fontSize: '11px', fontWeight: 700, minWidth: '16px', height: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 4px', lineHeight: 1, border: '2px solid #ffffff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>{count > 9 ? '9+' : count}</span>
                )}
            </button>

            {open && (
                <div className="notification-dropdown" style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '340px',
                    background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)', zIndex: 9999,
                    maxHeight: '420px', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc'
                    }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>Notifications</span>
                        {count > 0 && (
                            <button onClick={handleMarkAllRead} style={{
                                background: 'none', border: 'none', color: '#3b82f6',
                                cursor: 'pointer', fontSize: '12px', fontWeight: 500
                            }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                            >Mark all read</button>
                        )}
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {loading && <div style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Loading...</div>}
                        {!loading && items.length === 0 && (
                            <div style={{ padding: '32px 24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px', opacity: 0.5 }}>📭</div>
                                No new notifications
                            </div>
                        )}
                        {items.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleClick(item)}
                                style={{
                                    padding: '12px 16px', cursor: 'pointer',
                                    borderBottom: '1px solid #f1f5f9',
                                    background: item.is_read ? '#ffffff' : '#eff6ff',
                                    transition: 'background .15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = item.is_read ? '#f8fafc' : '#dbeafe'}
                                onMouseLeave={e => e.currentTarget.style.background = item.is_read ? '#ffffff' : '#eff6ff'}
                            >
                                <div style={{
                                    fontSize: '13px', fontWeight: item.is_read ? 500 : 700,
                                    color: item.is_read ? '#334155' : '#0f172a', marginBottom: '4px',
                                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        {!item.is_read && <span style={{ color: '#3b82f6', marginRight: '6px', fontSize: '8px', marginTop: '4px' }}>●</span>}
                                        <span style={{ lineHeight: 1.4 }}>{item.title}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDismiss(e, item)}
                                        style={{
                                            background: 'transparent', border: 'none', cursor: 'pointer',
                                            color: '#94a3b8', fontSize: '14px', padding: '0 4px',
                                            lineHeight: 1, marginTop: '2px', marginLeft: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                        title="Dismiss notification"
                                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div style={{ fontSize: '12.5px', color: item.is_read ? '#64748b' : '#475569', marginBottom: '6px', paddingLeft: item.is_read ? 0 : '14px', lineHeight: 1.4, paddingRight: '20px' }}>{item.message}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', paddingLeft: item.is_read ? 0 : '14px' }}>{timeAgo(item.created_at)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
