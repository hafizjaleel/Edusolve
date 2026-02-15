export const env = {
  port: Number(process.env.PORT || 4000),
  webOrigin: process.env.WEB_ORIGIN || 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  allowDevRoleLogin: process.env.ALLOW_DEV_ROLE_LOGIN === 'true'
};

export function hasSupabaseAuthConfig() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function hasSupabaseAdminConfig() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}
