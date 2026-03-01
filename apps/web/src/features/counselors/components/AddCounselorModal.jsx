import { useState } from 'react';
import { apiFetch } from '../../../lib/api.js';
import { PhoneInput, isValidEmail } from '../../../components/PhoneInput.jsx';

export function AddCounselorModal({ onClose, onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const safeEmail = email.trim();
        const safeName = fullName.trim();
        const safePhone = phone.trim();

        if (!isValidEmail(safeEmail)) {
            setError("Please enter a valid email address format");
            setLoading(false);
            return;
        }

        try {
            await apiFetch('/counselors', {
                method: 'POST',
                body: JSON.stringify({ email: safeEmail, password, full_name: safeName, phone: safePhone })
            });
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal card">
                <h3>Add New Counselor</h3>
                <form onSubmit={onSubmit} className="form-grid">
                    <label>
                        Full Name
                        <input value={fullName} onChange={e => setFullName(e.target.value)} required />
                    </label>
                    <label>
                        Email
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Phone Number
                        <PhoneInput value={phone} onChange={setPhone} required={true} />
                    </label>
                    <label>
                        Password
                        <input type="text" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Initial password" />
                    </label>
                    {error ? <p className="error">{error}</p> : null}
                    <div className="actions">
                        <button type="button" className="secondary" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Counselor'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
