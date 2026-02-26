
import React, { useState, useEffect } from 'react';

/* ─── Icons ─── */
const ICONS = {
    left: "M15 19l-7-7 7-7",
    right: "M9 5l7 7-7 7",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    check: "M5 13l4 4L19 7"
};

const Icon = ({ d, size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

/* ─── Helpers ─── */
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function DateTimePicker({ date, time, onChange }) {
    const now = new Date();
    const [viewYear, setViewYear] = useState(date ? parseInt(date.split('-')[0]) : now.getFullYear());
    const [viewMonth, setViewMonth] = useState(date ? parseInt(date.split('-')[1]) - 1 : now.getMonth());
    const [mode, setMode] = useState('date'); // 'date' | 'time'

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const handleDateClick = (day) => {
        const newDate = formatDate(viewYear, viewMonth, day);
        onChange({ date: newDate, time });
        setMode('time'); // Auto-switch to time after date select
    };

    const handleHourChange = (h) => {
        const [_, m] = (time || '10:00').split(':');
        const newTime = `${String(h).padStart(2, '0')}:${m || '00'}`;
        onChange({ date, time: newTime });
    };

    const handleMinuteChange = (m) => {
        const [h, _] = (time || '10:00').split(':');
        const newTime = `${h || '10'}:${String(m).padStart(2, '0')}`;
        onChange({ date, time: newTime });
    };

    // Calendar Grid
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const isToday = (d) => {
        const t = new Date();
        return t.getDate() === d && t.getMonth() === viewMonth && t.getFullYear() === viewYear;
    };

    const isSelected = (d) => {
        if (!date) return false;
        const [y, m, day] = date.split('-').map(Number);
        return y === viewYear && m - 1 === viewMonth && day === d;
    };

    // Time Parts
    const [selectedHour, selectedMinute] = (time || '').split(':').map(Number);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10...

    return (
        <div className="datetime-picker" style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            background: '#fff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            {/* Mode Tabs */}
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '8px', padding: '4px', marginBottom: '16px' }}>
                <button
                    type="button"
                    onClick={() => setMode('date')}
                    style={{
                        flex: 1, border: 'none', background: mode === 'date' ? '#fff' : 'transparent',
                        color: mode === 'date' ? '#111827' : '#6b7280', borderRadius: '6px',
                        padding: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                        boxShadow: mode === 'date' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                >
                    <Icon d={ICONS.calendar} size={14} /> Date
                </button>
                <button
                    type="button"
                    onClick={() => setMode('time')}
                    style={{
                        flex: 1, border: 'none', background: mode === 'time' ? '#fff' : 'transparent',
                        color: mode === 'time' ? '#111827' : '#6b7280', borderRadius: '6px',
                        padding: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                        boxShadow: mode === 'time' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                >
                    <Icon d={ICONS.clock} size={14} /> Time
                </button>
            </div>

            {mode === 'date' ? (
                <>
                    {/* Calendar Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <button type="button" onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}>
                            <Icon d={ICONS.left} />
                        </button>
                        <span style={{ fontWeight: 600, color: '#111827', fontSize: '15px' }}>
                            {MONTHS[viewMonth]} {viewYear}
                        </span>
                        <button type="button" onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}>
                            <Icon d={ICONS.right} />
                        </button>
                    </div>

                    {/* Days Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px', textAlign: 'center' }}>
                        {DAYS.map(d => (
                            <span key={d} style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af' }}>{d}</span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                        {days.map(d => {
                            const today = isToday(d);
                            const selected = isSelected(d);
                            return (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => handleDateClick(d)}
                                    style={{
                                        width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: selected ? '2px solid #fff' : today ? '1px solid #6366f1' : 'none',
                                        borderRadius: '50%',
                                        background: selected ? '#6366f1' : 'transparent',
                                        color: selected ? '#fff' : today ? '#6366f1' : '#374151',
                                        fontWeight: selected || today ? 600 : 400,
                                        cursor: 'pointer', fontSize: '13px',
                                        outline: selected ? '2px solid #6366f1' : 'none', outlineOffset: '1px'
                                    }}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div style={{ display: 'flex', gap: '16px', height: '260px' }}>
                    {/* Hours */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px', textAlign: 'center' }}>Hour</span>
                        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            {hours.map(h => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => handleHourChange(h)}
                                    style={{
                                        display: 'block', width: '100%', padding: '8px', border: 'none', background: selectedHour === h ? '#eef2ff' : 'transparent',
                                        color: selectedHour === h ? '#4338ca' : '#374151', fontWeight: selectedHour === h ? 600 : 400,
                                        cursor: 'pointer', textAlign: 'center', fontSize: '14px'
                                    }}
                                >
                                    {String(h).padStart(2, '0')}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Minutes */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px', textAlign: 'center' }}>Minute</span>
                        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            {minutes.map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleMinuteChange(m)}
                                    style={{
                                        display: 'block', width: '100%', padding: '8px', border: 'none', background: selectedMinute === m ? '#eef2ff' : 'transparent',
                                        color: selectedMinute === m ? '#4338ca' : '#374151', fontWeight: selectedMinute === m ? 600 : 400,
                                        cursor: 'pointer', textAlign: 'center', fontSize: '14px'
                                    }}
                                >
                                    {String(m).padStart(2, '0')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Selected Summary Footer */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '13px', color: date && time ? '#4338ca' : '#9ca3af', fontWeight: 500 }}>
                    {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Select Date'}
                    {' • '}
                    {time ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'Select Time'}
                </p>
            </div>
        </div>
    );
}
