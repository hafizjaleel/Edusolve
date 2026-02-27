const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('hour_ledger')
    .select('*')
    .eq('teacher_id', 'c19deda7-fd97-42e0-bf9e-a5a9b34f6d30')
    .eq('entry_type', 'teacher_credit');
  console.log('Teacher Ledger:', data, 'Error:', error);
}
run();
