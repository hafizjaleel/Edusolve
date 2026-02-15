import { useState } from 'react';
import { login } from '../lib/auth.js';
import { ROLE_OPTIONS } from '../lib/roles.js';

const allowDevRoleLogin = process.env.NEXT_PUBLIC_ALLOW_DEV_ROLE_LOGIN === 'true';

export default function LoginPage({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(ROLE_OPTIONS[2].value);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({
        email,
        password,
        role: allowDevRoleLogin ? role : undefined
      });
      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Edusolve</h1>
        <p>Internal operations sign-in. All actions are tracked with role-based control.</p>

        <form onSubmit={onSubmit} className="form-grid">
          <label>
            Work Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
            />
          </label>

          <label>
            Password
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!allowDevRoleLogin}
                placeholder="Enter your password"
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 0,
                  width: 'auto'
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745A10.029 10.029 0 0018 10c0-4.04-3.06-7.531-7.143-7.983C9.728 2.378 8.441 2.388 7.218 2.63L3.28 2.22zm7.575 7.575a2.25 2.25 0 000 3.182l-3.182-3.182a2.25 2.25 0 013.182 0z" clipRule="evenodd" />
                    <path d="M10.704 13.91l2.583 2.583A9.96 9.96 0 0110 17c-4.8 0-8.87-3.49-9.87-7.99a9.966 9.966 0 012.308-4.103l1.838 1.838a4.484 4.484 0 000 5.666l1.642 1.642a2.99 2.99 0 002.788-.133zM12.986 8.513l1.642 1.642a4.484 4.484 0 000-5.666l-1.642 4.024z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {allowDevRoleLogin ? (
            <label>
              Role (Dev mode only)
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          ) : null}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {error ? <p className="error">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
