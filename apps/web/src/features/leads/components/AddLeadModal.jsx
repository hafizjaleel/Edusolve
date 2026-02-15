
import { useState } from 'react';
import { apiFetch } from '../../../lib/api.js';

export function AddLeadModal({ onClose, onSuccess }) {
    const [studentName, setStudentName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await apiFetch('/leads', {
                method: 'POST',
                body: JSON.stringify({
                    student_name: studentName,
                    contact_number: contactNumber,
                    subject,
                    email
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
                        <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
                    </label>
                    <label>
                        Subject
                        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </label>
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
