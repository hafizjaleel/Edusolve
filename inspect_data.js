import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('e:\\Qubes\\Edusolve\\apps\\api\\.env') });

const supabaseUrl = 'https://jgihvgeglakjaldoizme.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnaWh2Z2VnbGFramFsZG9pem1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2NDczNywiZXhwIjoyMDg2NjQwNzM3fQ.A6bhjD12S0imsm-hsJgLqjE6-sSs1Btv-5KIOk8Wqrs';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectData() {
  console.log('Inspecting teacher_leads data...');
  const { data: leads, error } = await supabase
    .from('teacher_leads')
    .select('id, subjects, boards, mediums')
    .limit(20);

  if (error) {
    console.error('Error fetching leads:', error);
    return;
  }

  console.log('Sample data (first 20 rows):');
  leads.forEach(lead => {
    console.log(`\nLead ID: ${lead.id}`);
    console.log('subjects:', typeof lead.subjects, JSON.stringify(lead.subjects));
    console.log('boards:', typeof lead.boards, JSON.stringify(lead.boards));
    console.log('mediums:', typeof lead.mediums, JSON.stringify(lead.mediums));
  });
}

inspectData();
