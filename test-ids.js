const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: p } = await supabase.from('teacher_profiles').select('id, user_id, teacher_code').limit(2);
  console.log('Teacher Profiles:', p);
  
  const { data: l } = await supabase.from('hour_ledger').select('teacher_id').limit(2);
  console.log('Hour Ledger:', l);
}
run();
