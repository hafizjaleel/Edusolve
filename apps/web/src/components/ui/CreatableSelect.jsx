import React, { useEffect, useState, useRef } from 'react';

export function CreatableSelect({ label, value, onChange, options, placeholder, onAdd }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const containerRef = useRef(null);

    const filtered = search ? options.filter(o => o.toLowerCase().includes(search.toLowerCase())) : options;
    const isExactMatch = options.some(o => o.toLowerCase() === search.toLowerCase());

    useEffect(() => {
        function close(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [open]);

    function handleSelect(val) {
        onChange(val);
        setOpen(false);
        setSearch('');
    }

    async function handleAdd(val) {
        if (!onAdd) {
            handleSelect(val);
            return;
        }
        setAdding(true);
        try {
            await onAdd(val);
            handleSelect(val);
        } catch (e) {
            console.error('Failed to add new item:', e);
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className="search-select" ref={containerRef}>
            <span className="search-select-label">{label}</span>
            <div className="search-select-trigger" onClick={() => setOpen(!open)}>
                <span className={value ? '' : 'muted'}>{value || placeholder || 'Select...'}</span>
                <span className="search-select-arrow">{open ? '▲' : '▼'}</span>
            </div>
            {open && (
                <div className="search-select-dropdown">
                    <input
                        className="search-select-input"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search or type new..."
                        autoFocus
                    />
                    <div className="search-select-options">
                        <div
                            className={`search-select-option ${!value ? 'active' : ''}`}
                            onClick={() => handleSelect('')}
                        >
                            None
                        </div>
                        {filtered.map(o => (
                            <div
                                key={o}
                                className={`search-select-option ${value === o ? 'active' : ''}`}
                                onClick={() => handleSelect(o)}
                            >
                                {o}
                            </div>
                        ))}
                        {search && !isExactMatch && (
                            <div
                                className={`search-select-option ${adding ? 'muted' : ''}`}
                                style={{ color: '#4f46e5', fontWeight: 500 }}
                                onClick={() => !adding && handleAdd(search)}
                            >
                                {adding ? 'Adding...' : `+ Add "${search}"`}
                            </div>
                        )}
                        {!search && (
                            <div
                                className="search-select-option"
                                style={{ color: '#4f46e5', fontWeight: 500, opacity: adding ? 0.5 : 1 }}
                                onClick={(e) => {
                                    if (adding) return;
                                    e.stopPropagation();
                                    const input = containerRef.current?.querySelector('.search-select-input');
                                    if (input) input.focus();
                                }}
                            >
                                + Add New
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
