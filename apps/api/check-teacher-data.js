import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('Fetching all teacher profiles...');
  const { data, error } = await supabase
    .from('teacher_profiles')
    .select('*, users(email, full_name)')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log(`Found ${data.length} profiles.`);
    data.forEach(p => {
        console.log(`\n--- Profile for ${p.users?.email} (${p.users?.full_name}) ---`);
        console.log(`ID: ${p.id}`);
        console.log(`GPay: ${p.gpay_holder_name} / ${p.gpay_number}`);
        console.log(`Subjects: ${JSON.stringify(p.subjects_taught)}`);
        console.log(`Gender: ${p.gender}, DOB: ${p.dob}`);
    });
  } else {
    console.log('No teacher profiles found.');
  }
}

checkData();
