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
  if (!response.ok) throw new Error(data.error || 'request failed');
  return data;
}
