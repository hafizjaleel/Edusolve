import { apiFetch } from './api.js';

const STORAGE_KEY = 'ehms_auth';

export async function login({ email, password, role }) {
  const payload = { email, password };
  if (role) payload.role = role;

  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export async function me() {
  const session = getSession();
  if (!session?.token) return null;
  try {
    const data = await apiFetch('/auth/me');
    return data.user;
  } catch {
    return null;
  }
}

export function getSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}
