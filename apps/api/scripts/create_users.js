import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const usersToCreate = [
  { email: 'admin@edusove.com', role: 'super_admin' },
  { email: 'finance@edusolve.com', role: 'finance' },
  { email: 'c-1@edusolve.com', role: 'counselor' },
  { email: 'c-head@edusolve.com', role: 'counselor_head' },
  { email: 't-c1@edusolve.com', role: 'teacher_coordinator' },
  { email: 'a-c1@edusolve.com', role: 'academic_coordinator' },
  { email: 'teacher1@edusolve.com', role: 'teacher' }
];

const DEFAULT_PASSWORD = 'Edusolve@123';

async function ensureRoleId(roleCode) {
  const { data, error } = await supabase
    .from('roles')
    .select('id')
    .eq('code', roleCode)
    .maybeSingle();

  if (error) throw error;
  if (!data?.id) throw new Error(`Role not found: ${roleCode}`);
  return data.id;
}

async function upsertProfile(user, roleCode) {
  // Insert or update users table
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email.split('@')[0],
      email: user.email,
      is_active: true
    }, { onConflict: 'id' });

  if (userError) throw userError;

  const roleId = await ensureRoleId(roleCode);

  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({ user_id: user.id, role_id: roleId }, { onConflict: 'user_id,role_id' });

  if (roleError) throw roleError;
}

async function createOrUpdateUser({ email, role }) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;

  const existing = data.users.find((u) => u.email === email);

  if (!existing) {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      app_metadata: { role }
    });
    if (createError) throw createError;
    await upsertProfile(created.user, role);
    return { email, status: 'created' };
  }

  // Update metadata role if needed
  const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
    app_metadata: { ...(existing.app_metadata || {}), role }
  });
  if (updateError) throw updateError;

  await upsertProfile(existing, role);
  return { email, status: 'updated' };
}

async function run() {
  const results = [];
  for (const entry of usersToCreate) {
    const result = await createOrUpdateUser(entry);
    results.push(result);
  }
  console.log('Done:', results);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
