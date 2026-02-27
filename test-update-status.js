const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('academic_sessions').update({ status: 'verified' }).eq('id', 'dbb4a0cd-db70-4bcf-b446-7fb3c92e3a75');
  console.log(error);
}
run();
