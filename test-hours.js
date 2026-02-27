const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('hour_ledger').select('*');
  console.log('Hour Ledger:', data);
  const { data: sData } = await supabase.from('academic_sessions').select('id, status, duration_hours, teacher_id, student_id');
  console.log('Sessions:', sData);
}
run();
