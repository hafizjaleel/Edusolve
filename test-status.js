const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data } = await supabase.from('academic_sessions').select('id, status').not('status', 'eq', 'scheduled');
  console.log(data);
  const { data: v } = await supabase.from('session_verifications').select('session_id, status, type');
  console.log(v);
}
run();
