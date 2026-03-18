import React, { useState, useMemo, useEffect } from 'react';

export function TeacherOnboardingModal({ profile, onComplete, apiFetch }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        full_name: profile?.users?.full_name || '',
        gender: profile?.gender || '',
        dob: profile?.dob || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        pincode: profile?.pincode || '',
        city: profile?.city || '',
        place: profile?.place || '',
        qualification: profile?.qualification || '',
        experience_level: profile?.experience_level || '',
        experience_duration: profile?.experience_duration || '',
        subjects_taught: Array.isArray(profile?.subjects_taught) ? profile.subjects_taught : [],
        syllabus: Array.isArray(profile?.syllabus) ? profile.syllabus : [],
        languages: Array.isArray(profile?.languages) ? profile.languages : [],
        meeting_link: profile?.meeting_link || '',
        account_holder_name: profile?.account_holder_name || '',
        account_number: profile?.account_number || '',
        ifsc_code: profile?.ifsc_code || '',
        upi_id: profile?.upi_id || '',
        gpay_holder_name: profile?.gpay_holder_name || '',
        gpay_number: profile?.gpay_number || '',
    });

    const [slots, setSlots] = useState(profile?.teacher_availability || []);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const updateField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

    const handleNext = () => {
        if (step === 1) {
            const required = ['full_name', 'gender', 'dob', 'phone', 'address', 'pincode', 'city', 'place'];
            for (const f of required) {
                if (!formData[f]) {
                    setError(`Please fill in all personal details: ${f.replace('_', ' ')} is missing.`);
                    return;
                }
            }
        }
        if (step === 2) {
            const required = ['qualification', 'experience_level', 'experience_duration', 'meeting_link', 'subjects_taught', 'syllabus', 'languages'];
            for (const f of required) {
                const val = formData[f];
                if (!val || (Array.isArray(val) && val.length === 0)) {
                    setError(`Please fill in all professional details: ${f.replace('_', ' ')} is missing.`);
                    return;
                }
            }
        }
        setError('');
        setStep(step + 1);
    };

    const handleBack = () => {
        setError('');
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (step === 4 && slots.length === 0) {
            setError('Please add at least one availability slot.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            // Convert comma-separated strings back to arrays if they are strings
            const finalData = { ...formData };
            if (typeof finalData.subjects_taught === 'string') {
                finalData.subjects_taught = finalData.subjects_taught.split(',').map(s => s.trim()).filter(Boolean);
            }
            if (typeof finalData.syllabus === 'string') {
                finalData.syllabus = finalData.syllabus.split(',').map(s => s.trim()).filter(Boolean);
            }
            if (typeof finalData.languages === 'string') {
                finalData.languages = finalData.languages.split(',').map(s => s.trim()).filter(Boolean);
            }

            // 1. Save Profile Data
            const res = await apiFetch('/teachers/me/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    ...finalData,
                    is_completing_onboarding: true
                })
            });

            // 2. Save Availability Slots
            await apiFetch('/teachers/availability', {
                method: 'PUT',
                body: JSON.stringify({ slots })
            });

            onComplete(res.teacher);
        } catch (e) {
            setError(e.message || 'Failed to complete onboarding. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const renderProgress = () => (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3, 4].map(s => (
                <div key={s} style={{ 
                    flex: 1, 
                    height: '4px', 
                    borderRadius: '2px',
                    background: s <= step ? '#2563eb' : '#e5e7eb',
                    transition: 'background 0.3s'
                }} />
            ))}
        </div>
    );

    const inputStyle = {
        width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
        borderRadius: '8px', fontSize: '14px', marginBottom: '16px',
        boxSizing: 'border-box'
    };
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' };
    const requiredStar = <span style={{ color: '#dc2626' }}>*</span>;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
            padding: '20px'
        }}>
            <div style={{ 
                background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', 
                maxHeight: '90vh', overflowY: 'auto', padding: '32px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 700, color: '#111827' }}>Welcome to Edusolve!</h2>
                <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '15px' }}>Please complete your profile to get started.</p>
                
                {renderProgress()}

                {error && (
                    <div style={{ padding: '12px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Personal Details</h3>
                            <span style={{ fontSize: '12px', color: '#dc2626' }}>* Mandatory fields</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Full Name {requiredStar}</label>
                                <input value={formData.full_name} onChange={e => updateField('full_name', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Gender {requiredStar}</label>
                                <select value={formData.gender} onChange={e => updateField('gender', e.target.value)} style={inputStyle}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Date of Birth {requiredStar}</label>
                                <input type="date" value={formData.dob} onChange={e => updateField('dob', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone Number {requiredStar}</label>
                                <input value={formData.phone} onChange={e => updateField('phone', e.target.value)} style={inputStyle} />
                            </div>
                        </div>
                        <label style={labelStyle}>Address {requiredStar}</label>
                        <input value={formData.address} onChange={e => updateField('address', e.target.value)} style={inputStyle} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={labelStyle}>Pincode {requiredStar}</label>
                                <input value={formData.pincode} onChange={e => updateField('pincode', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>City {requiredStar}</label>
                                <input value={formData.city} onChange={e => updateField('city', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Place/Area {requiredStar}</label>
                                <input value={formData.place} onChange={e => updateField('place', e.target.value)} style={inputStyle} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Professional Details</h3>
                            <span style={{ fontSize: '12px', color: '#dc2626' }}>* Mandatory fields</span>
                        </div>
                        <label style={labelStyle}>Qualification {requiredStar}</label>
                        <input value={formData.qualification} onChange={e => updateField('qualification', e.target.value)} style={inputStyle} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Experience Level {requiredStar}</label>
                                <select value={formData.experience_level} onChange={e => updateField('experience_level', e.target.value)} style={inputStyle}>
                                    <option value="">Select</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Experience Duration {requiredStar}</label>
                                <input value={formData.experience_duration} onChange={e => updateField('experience_duration', e.target.value)} style={inputStyle} placeholder="e.g. 5 years" />
                            </div>
                        </div>
                        <label style={labelStyle}>Subjects Taught (comma separated) {requiredStar}</label>
                        <input value={Array.isArray(formData.subjects_taught) ? formData.subjects_taught.join(', ') : formData.subjects_taught} onChange={e => updateField('subjects_taught', e.target.value)} style={inputStyle} placeholder="Maths, Science, etc." />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Syllabus (comma separated) {requiredStar}</label>
                                <input value={Array.isArray(formData.syllabus) ? formData.syllabus.join(', ') : formData.syllabus} onChange={e => updateField('syllabus', e.target.value)} style={inputStyle} placeholder="CBSE, ICSE, etc." />
                            </div>
                            <div>
                                <label style={labelStyle}>Languages (comma separated) {requiredStar}</label>
                                <input value={Array.isArray(formData.languages) ? formData.languages.join(', ') : formData.languages} onChange={e => updateField('languages', e.target.value)} style={inputStyle} placeholder="English, Malayalam, etc." />
                            </div>
                        </div>

                        <label style={labelStyle}>Meeting Link (Google Meet/Zoom) {requiredStar}</label>
                        <input value={formData.meeting_link} onChange={e => updateField('meeting_link', e.target.value)} style={inputStyle} placeholder="https://..." />
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Bank Information</h3>
                        <div style={{ padding: '16px', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', marginBottom: '24px' }}>
                            <p style={{ fontSize: '14px', color: '#9a3412', margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ⚠️ Important Notice
                            </p>
                            <p style={{ fontSize: '13px', color: '#c2410c', margin: '4px 0 0', lineHeight: '1.5' }}>
                                Bank details cannot be changed manually after this step. Please double-check all information before proceeding.
                            </p>
                        </div>
                        <label style={labelStyle}>Account Holder Name</label>
                        <input value={formData.account_holder_name} onChange={e => updateField('account_holder_name', e.target.value)} style={inputStyle} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Account Number</label>
                                <input value={formData.account_number} onChange={e => updateField('account_number', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>IFSC Code</label>
                                <input value={formData.ifsc_code} onChange={e => updateField('ifsc_code', e.target.value)} style={inputStyle} />
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0', paddingTop: '16px' }}>
                            <label style={labelStyle}>UPI ID</label>
                            <input value={formData.upi_id} onChange={e => updateField('upi_id', e.target.value)} style={inputStyle} placeholder="username@upi" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>GPay Name</label>
                                <input value={formData.gpay_holder_name} onChange={e => updateField('gpay_holder_name', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>GPay Number</label>
                                <input value={formData.gpay_number} onChange={e => updateField('gpay_number', e.target.value)} style={inputStyle} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Availability Slots</h3>
                        <p style={{ fontSize: '13px', color: '#15803d', marginBottom: '20px', fontWeight: 500 }}>
                           💡 Note: You can change and update your teaching slots anytime after completing this onboarding from your profile.
                        </p>
                        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
                            Add your preferred teaching times.
                        </p>
                        
                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px' }}>
                            {slots.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', fontSize: '14px' }}>No slots added yet.</p>
                            ) : (
                                slots.map((s, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: i < slots.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{s.day_of_week}</span>
                                        <span style={{ fontSize: '14px' }}>{s.start_time} - {s.end_time}</span>
                                        <button onClick={() => setSlots(slots.filter((_, idx) => idx !== i))} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                                    </div>
                                ))
                            )}
                        </div>

                        <AddSlotInline onAdd={(newSlots) => setSlots([...slots, ...newSlots])} />
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                    {step > 1 ? (
                        <button onClick={handleBack} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                    ) : <div />}
                    
                    {step < 4 ? (
                        <button onClick={handleNext} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Next</button>
                    ) : (
                        <button onClick={handleSubmit} disabled={saving} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#15803d', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                            {saving ? 'Completing...' : 'Finish Onboarding'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function AddSlotInline({ onAdd }) {
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [day, setDay] = useState('Monday');
    const [start, setStart] = useState('09:00');
    const [end, setEnd] = useState('10:00');

    return (
        <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <select value={day} onChange={e => setDay(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="time" value={start} onChange={e => setStart(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                <input type="time" value={end} onChange={e => setEnd(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
            <button onClick={() => onAdd([{ day_of_week: day, start_time: start, end_time: end }])} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: '#eff6ff', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                + Add This Slot
            </button>
        </div>
    );
}
