const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
const STORAGE_KEY = 'ehms_auth';

function sessionFromStorage() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function apiFetch(path, options = {}) {
  const session = sessionFromStorage();
  const headers = { ...options.headers };
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  if (session?.user?.id) headers['x-user-id'] = session.user.id;
  if (session?.user?.role) headers['x-user-role'] = session.user.role;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  const isErrorTokenExpired =
    response.status === 401 ||
    (response.status === 403 &&
      typeof data.error === 'string' &&
      data.error.toLowerCase().includes('token is expired'));

  if (isErrorTokenExpired && !options._isRetry && session?.refreshToken && path !== '/auth/refresh') {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken })
      });
      const refreshData = await refreshRes.json().catch(() => ({}));
      if (refreshRes.ok && refreshData.ok) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshData));
        return apiFetch(path, { ...options, _isRetry: true });
      } else {
        localStorage.removeItem(STORAGE_KEY);
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
    } catch (e) {
      if (e.message.includes('Session expired')) throw e;
      localStorage.removeItem(STORAGE_KEY);
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) throw new Error(data.error || 'request failed');
  return data;
}
