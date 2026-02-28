const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase
    .from('teacher_profiles')
    .select('id, users!teacher_profiles_user_id_fkey(id, full_name)')
    .limit(1);
  if (error) console.log('FK name 1 FAILED:', error.message);
  else console.log('Success! Sample:', JSON.stringify(data?.[0]));
}
run();
