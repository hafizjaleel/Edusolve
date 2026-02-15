import { createClient } from '@supabase/supabase-js';
import { env, hasSupabaseAdminConfig, hasSupabaseAuthConfig } from './env.js';

let authClient;
let adminClient;

export function getSupabaseAuthClient() {
  if (!hasSupabaseAuthConfig()) return null;
  if (!authClient) {
    authClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: false }
    });
  }
  return authClient;
}

export function getSupabaseAdminClient() {
  if (!hasSupabaseAdminConfig()) return null;
  if (!adminClient) {
    adminClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false }
    });
  }
  return adminClient;
}
