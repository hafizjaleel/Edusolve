import React, { useEffect, useState } from 'react';

export function SearchSelect({ label, value, onChange, options, placeholder }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const filtered = search ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase())) : options;
    const selectedLabel = options.find(o => o.value === value)?.label || '';

    useEffect(() => { function close(e) { if (!e.target.closest('.search-select')) setOpen(false); } if (open) document.addEventListener('click', close); return () => document.removeEventListener('click', close); }, [open]);

    return (
        <div className="search-select">
            <span className="search-select-label">{label}</span>
            <div className="search-select-trigger" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
                <span className={value ? '' : 'muted'}>{selectedLabel || placeholder || 'All'}</span>
                <span className="search-select-arrow">{open ? '▲' : '▼'}</span>
            </div>
            {open ? <div className="search-select-dropdown" onClick={e => e.stopPropagation()}>
                <input className="search-select-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." autoFocus />
                <div className="search-select-options">
                    <div className={`search-select-option ${!value ? 'active' : ''}`} onClick={() => { onChange(''); setOpen(false); setSearch(''); }}>All</div>
                    {filtered.map(o => <div key={o.value} className={`search-select-option ${value === o.value ? 'active' : ''}`} onClick={() => { onChange(o.value); setOpen(false); setSearch(''); }}>{o.label}</div>)}
                    {!filtered.length ? <div className="search-select-option muted">No matches</div> : null}
                </div>
            </div> : null}
        </div>
    );
}
