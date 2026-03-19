import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jgihvgeglakjaldoizme.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnaWh2Z2VnbGFramFsZG9pem1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2NDczNywiZXhwIjoyMDg2NjQwNzM3fQ.A6bhjD12S0imsm-hsJgLqjE6-sSs1Btv-5KIOk8Wqrs';
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  try {
      const { data: { users }, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      if (error) throw new Error(error.message);

      const { data: dbRoles } = await adminClient.from('user_roles').select('user_id, roles(code)');
      const dbRoleMap = new Map();
      (dbRoles || []).forEach(r => {
          const code = Array.isArray(r.roles) ? r.roles[0]?.code : r.roles?.code;
          if (code) dbRoleMap.set(r.user_id, code);
      });

      const tcs = (users || [])
        .filter(u => {
             let role = u.app_metadata?.role || u.user_metadata?.role;
             if (!role || role === 'unknown') role = dbRoleMap.get(u.id);
             return role === 'teacher_coordinator';
        })
        .map(u => ({ id: u.id, full_name: u.user_metadata?.full_name || u.user_metadata?.name || u.email, email: u.email }));
        
      console.log('TCS count:', tcs.length);
      console.log('Sample:', tcs.slice(0, 2));
  } catch (err) {
      console.error(err);
  }
}
test();
