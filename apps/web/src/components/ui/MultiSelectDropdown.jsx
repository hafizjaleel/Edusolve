import React, { useState, useRef, useEffect } from 'react';

/* ─── Inline SVG Icons ─── */
export const Icon = ({ d, color = 'currentColor', size = 16, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} className={className}>
        <path d={d} />
    </svg>
);

/* ─── Multi-Select Dropdown with "Create new" ─── */
export function MultiSelectDropdown({ value = [], onChange, options = [], placeholder, onCreate }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));
    const exactMatch = options.some(o => o.toLowerCase() === search.toLowerCase());

    const toggle = (opt) => {
        const set = new Set(value);
        if (set.has(opt)) set.delete(opt);
        else set.add(opt);
        onChange(Array.from(set));
    };

    return (
        <div className="custom-dropdown" ref={ref} style={{ position: 'relative' }}>
            <div className={`custom-dropdown-trigger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} style={{ 
                minHeight: '42px', 
                height: 'auto', 
                flexWrap: 'wrap', 
                gap: '4px',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                background: 'white'
            }}>
                {value.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
                        {value.map(v => (
                            <span key={v} style={{ background: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {v} <span onClick={(e) => { e.stopPropagation(); toggle(v); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Icon d="M18 6L6 18M6 6l12 12" size={12} /></span>
                            </span>
                        ))}
                    </div>
                ) : <span className="dd-placeholder" style={{ color: '#9ca3af', fontSize: '14px' }}>{placeholder || 'Select...'}</span>}
                <Icon d="M6 9l6 6 6-6" size={14} color="#9ca3af" />
            </div>
            {open && (
                <div className="custom-dropdown-menu" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    marginTop: '4px',
                    padding: '4px'
                }}>
                    <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search..."
                        onClick={e => e.stopPropagation()}
                        style={{ 
                            width: '100%', 
                            border: 'none', 
                            borderBottom: '1px solid #eee', 
                            padding: '8px 12px', 
                            fontSize: '13px', 
                            outline: 'none', 
                            marginBottom: '4px',
                            boxSizing: 'border-box'
                        }} />
                    <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        {filtered.map(opt => (
                            <div key={opt} className={`custom-dropdown-item${value.includes(opt) ? ' selected' : ''}`}
                                onClick={() => toggle(opt)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    padding: '8px 12px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    background: value.includes(opt) ? '#f3f4f6' : 'transparent',
                                    borderRadius: '4px'
                                }}>
                                {opt}
                                {value.includes(opt) && <span style={{ color: '#3b82f6' }}><Icon d="M20 6L9 17l-5-5" size={14} /></span>}
                            </div>
                        ))}
                        {filtered.length === 0 && <div style={{ padding: '8px 12px', fontSize: '12px', color: '#999' }}>No options found</div>}
                    </div>
                    {search && !exactMatch && onCreate && (
                        <div onClick={() => { onCreate(search); setSearch(''); }}
                            style={{ padding: '10px 12px', background: '#eff6ff', color: '#3b82f6', borderTop: '1px solid #dbeafe', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Icon d="M12 5v14M5 12h14" size={12} /> Create "{search}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
