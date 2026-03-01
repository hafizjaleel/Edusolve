import React, { useState, useEffect } from 'react';

const COUNTRY_CODES = [
    { code: '+91', label: 'IND (+91)', length: 10 },
    { code: '+1', label: 'USA (+1)', length: 10 },
    { code: '+44', label: 'UK (+44)', length: 10 },
    { code: '+971', label: 'UAE (+971)', length: 9 },
    { code: '+61', label: 'AUS (+61)', length: 9 },
    { code: '+65', label: 'SGP (+65)', length: 8 }
];

export function PhoneInput({ name = 'phone', required = false, value = '', onChange, placeholder = 'Phone Number', style = {} }) {
    const getInitState = (val) => {
        if (!val) return { cc: '+91', num: '' };
        let clean = val.replace(/[^0-9+]/g, '');
        for (const c of COUNTRY_CODES) {
            if (clean.startsWith(c.code)) {
                return { cc: c.code, num: clean.slice(c.code.length) };
            }
        }
        if (clean.length === 10 && !clean.startsWith('+')) {
            return { cc: '+91', num: clean };
        }
        return { cc: '+91', num: clean.replace(/^\+/, '') };
    }

    const [countryCode, setCountryCode] = useState('+91');
    const [number, setNumber] = useState('');

    useEffect(() => {
        const init = getInitState(value);
        setCountryCode(init.cc);
        setNumber(init.num);
    }, [value]);

    const activeCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];

    const handleNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // strip non numeric
        if (val.length > activeCountry.length) {
            val = val.slice(0, activeCountry.length);
        }
        setNumber(val);
        triggerChange(countryCode, val);
    };

    const handleCodeChange = (e) => {
        const cc = e.target.value;
        const newMaxLen = (COUNTRY_CODES.find(c => c.code === cc) || COUNTRY_CODES[0]).length;
        let num = number;
        if (num.length > newMaxLen) {
            num = num.slice(0, newMaxLen);
            setNumber(num);
        }
        setCountryCode(cc);
        triggerChange(cc, num);
    };

    const triggerChange = (cc, num) => {
        if (onChange) {
            onChange(cc + num);
        }
    };

    const fullValue = number ? `${countryCode}${number}` : '';

    return (
        <div style={{ display: 'flex', gap: '8px', ...style }}>
            <select
                value={countryCode}
                onChange={handleCodeChange}
                style={{
                    padding: '8px 4px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: '#fff',
                    outline: 'none',
                    width: 'auto',
                    flexShrink: 0,
                    color: '#333'
                }}
            >
                {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                ))}
            </select>
            <input
                type="tel"
                placeholder={placeholder}
                value={number}
                onChange={handleNumberChange}
                required={required}
                style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    outline: 'none',
                    color: '#333'
                }}
            />
            {/* Hidden actual input for FormData */}
            <input type="hidden" name={name} value={fullValue} />
        </div>
    );
}

// Reusable Email Regex validation helper for forms
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
