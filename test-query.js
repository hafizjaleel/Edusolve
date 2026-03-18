import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
async function run() {
  const { data, error } = await supabase.from('payment_requests').select('*, leads!inner(student_name, subject, class_level, contact_number, counselor_id, source, package_name, counselor:counselor_id(full_name))').limit(1);
  console.log(JSON.stringify({data, error}, null, 2));
}
run();
