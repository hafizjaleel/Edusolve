import { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api.js';
import { CreatableSelect } from '../../../components/ui/CreatableSelect.jsx';
import { PhoneInput, isValidEmail } from '../../../components/PhoneInput.jsx';

export function AddLeadModal({ onClose, onSuccess }) {
    const [studentName, setStudentName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [subject, setSubject] = useState('');
    const [leadType, setLeadType] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [leadTypes, setLeadTypes] = useState([]);

    async function fetchLeadTypes() {
        const res = await apiFetch('/leads/types');
        if (res.ok) setLeadTypes(res.types || []);
    }

    async function handleAddType(name) {
        const res = await apiFetch('/leads/types', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            setLeadTypes(prev => [...prev, name].sort());
        } else {
            console.error('Failed to save lead type:', res.error);
        }
    }

    useEffect(() => {
        fetchLeadTypes();
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setSaving(true);

        const safeStudentName = studentName.trim();
        const safeContact = contactNumber.trim();
        const safeEmail = email.trim();

        if (safeEmail && !isValidEmail(safeEmail)) {
            setError("Please enter a valid email address");
            setSaving(false);
            return;
        }

        try {
            await apiFetch('/leads', {
                method: 'POST',
                body: JSON.stringify({
                    student_name: safeStudentName,
                    contact_number: safeContact,
                    subject,
                    lead_type: leadType,
                    email: safeEmail
                })
            });
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal card">
                <h3>Add New Lead</h3>
                <form className="form-grid" onSubmit={onSubmit}>
                    <label>
                        Student Name
                        <input value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
                    </label>
                    <label>
                        Contact
                        <PhoneInput value={contactNumber} onChange={setContactNumber} required={true} />
                    </label>
                    <label>
                        Subject
                        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <CreatableSelect
                            label="Lead Type"
                            value={leadType}
                            onChange={setLeadType}
                            options={leadTypes}
                            placeholder="Select or Add New"
                            onAdd={handleAddType}
                        />
                    </div>
                    <label>
                        Email (Optional)
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>

                    {error ? <p className="error">{error}</p> : null}

                    <div className="actions">
                        <button type="button" className="secondary" onClick={onClose} disabled={saving}>Cancel</button>
                        <button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Lead'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
