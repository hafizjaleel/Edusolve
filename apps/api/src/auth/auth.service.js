import { ALL_ROLES } from '../common/roles.js';
import { env } from '../config/env.js';
import { getSupabaseAdminClient, getSupabaseAuthClient } from '../config/supabase.js';

function roleFromUser(user) {
  const role = user?.app_metadata?.role || user?.user_metadata?.role;
  return ALL_ROLES.includes(role) ? role : null;
}

async function resolveRoleFromDb(userId) {
  const adminClient = getSupabaseAdminClient();
  if (!adminClient || !userId) return null;

  const { data, error } = await adminClient
    .from('user_roles')
    .select('roles(code)')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (error || !data?.roles) return null;
  const roleCode = Array.isArray(data.roles) ? data.roles[0]?.code : data.roles.code;
  return ALL_ROLES.includes(roleCode) ? roleCode : null;
}

export class AuthService {
  async login(payload) {
    const { email, password, role } = payload;

    if (!email) {
      return { ok: false, error: 'email is required' };
    }

    const authClient = getSupabaseAuthClient();
    if (authClient) {
      if (!password) {
        return { ok: false, error: 'password is required' };
      }

      const { data, error } = await authClient.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };

      const resolvedRole = roleFromUser(data.user) || (await resolveRoleFromDb(data.user?.id));
      if (!resolvedRole) {
        return { ok: false, error: 'user role is missing or invalid' };
      }

      return {
        ok: true,
        token: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: resolvedRole
        }
      };
    }

    // Strict dev fallback only when explicitly enabled.
    if (!env.allowDevRoleLogin) {
      return { ok: false, error: 'auth provider is not configured' };
    }
    if (!role || !ALL_ROLES.includes(role)) {
      return { ok: false, error: 'role is required in development mode' };
    }

    const token = Buffer.from(JSON.stringify({ email, role })).toString('base64');
    return {
      ok: true,
      token,
      user: { id: 'dev-user', email, role }
    };
  }

  async me(accessToken) {
    if (!accessToken) return { ok: false, error: 'missing token' };

    const adminClient = getSupabaseAdminClient();
    if (adminClient) {
      const { data, error } = await adminClient.auth.getUser(accessToken);
      if (error || !data.user) return { ok: false, error: error?.message || 'invalid token' };

      const resolvedRole = roleFromUser(data.user) || (await resolveRoleFromDb(data.user.id));
      if (!resolvedRole) {
        return { ok: false, error: 'user role is missing or invalid' };
      }

      return {
        ok: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: resolvedRole
        }
      };
    }

    try {
      const parsed = JSON.parse(Buffer.from(accessToken, 'base64').toString('utf8'));
      if (!parsed?.email || !parsed?.role) return { ok: false, error: 'invalid token' };
      return {
        ok: true,
        user: { id: 'dev-user', email: parsed.email, role: parsed.role }
      };
    } catch {
      return { ok: false, error: 'invalid token' };
    }
  }
}
