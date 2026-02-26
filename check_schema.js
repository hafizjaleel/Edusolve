import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgihvgeglakjaldoizme.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnaWh2Z2VnbGFramFsZG9pem1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2NDczNywiZXhwIjoyMDg2NjQwNzM3fQ.A6bhjD12S0imsm-hsJgLqjE6-sSs1Btv-5KIOk8Wqrs';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check_schema() {
  console.log('Checking Schema...');
  
  // We can't query information_schema directly via postgrest usually unless exposed.
  // But we can try RPC if available, or just infer from a select.
  // Actually, standard Supabase exposes widely. Let's try.
  
  // If we can't query info schema, we can try to select casting to text and see format.
  
  const { data, error } = await supabase
    .from('teacher_leads')
    .select('subjects')
    .limit(1);

  if (data && data.length > 0) {
      console.log('teacher_leads.subjects type sample:', typeof data[0].subjects, Array.isArray(data[0].subjects) ? 'Is Array' : 'Not Array');
  } else {
      console.log('No leads found');
  }

  const { data: profiles, error: pError } = await supabase
      .from('teacher_profiles')
      .select('subjects_taught, syllabus, languages')
      .limit(1);
      
  if (profiles && profiles.length > 0) {
      console.log('teacher_profiles sample:', profiles[0]);
      console.log('subjects_taught type:', typeof profiles[0].subjects_taught, Array.isArray(profiles[0].subjects_taught) ? 'Is Array' : 'Not Array');
  } else {
      console.log('No profiles found');
  }

  console.log('--- Teacher Profiles Columns ---');
  const { data: tp, error: tpErr } = await supabase.from('teacher_profiles').select('*').limit(1);
  if (tp && tp.length > 0) console.log(Object.keys(tp[0]));
  else if (tpErr) console.error(tpErr);

  console.log('--- Users Columns ---');
  const { data: u, error: uErr } = await supabase.from('users').select('*').limit(1);
  if (u && u.length > 0) console.log(Object.keys(u[0]));
  else if (uErr) console.error(uErr);
}

check_schema();
