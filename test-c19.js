const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: user } = await supabase.auth.admin.getUserById('c19deda7-fd97-42e0-bf9e-a5a9b34f6d30');
  console.log('User:', user?.user?.email);
  const { data: p } = await supabase.from('teacher_profiles').select('*').eq('user_id', 'c19deda7-fd97-42e0-bf9e-a5a9b34f6d30');
  console.log('Profile:', p);
}
run();
