import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('e:/Qubes/Edusolve/.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function patchMissingLeadIds() {
  // 1. Get all students without a lead_id
  const { data: missingLeadStudents, error: fetchErr } = await supabase
    .from('students')
    .select('id, student_name, student_code, lead_id');
    
  if (fetchErr) {
    console.error('Error fetching students:', fetchErr);
    return;
  }

  const missing = missingLeadStudents.filter(s => !s.lead_id);
  console.log(`Found ${missing.length} students without a lead_id.`);

  if (missing.length === 0) return;

  // 2. See if we can find a matching lead by student_name or joined_student_id
  const { data: allLeads, error: leadsErr } = await supabase
    .from('leads')
    .select('id, student_name, joined_student_id');

  if (leadsErr) {
    console.error('Error fetching leads:', leadsErr);
    return;
  }

  let patchedCount = 0;
  for (const student of missing) {
    // Try to find by explicit joined_student_id first, then by name match if they were created from it
    let matchingLead = allLeads.find(l => l.joined_student_id === student.id);
    
    if (!matchingLead) {
      matchingLead = allLeads.find(l => l.student_name === student.student_name);
    }

    if (matchingLead) {
      console.log(`Patching student ${student.student_name} (${student.id}) with lead ${matchingLead.id}`);
      const { error: updateErr } = await supabase
        .from('students')
        .update({ lead_id: matchingLead.id })
        .eq('id', student.id);
        
      if (!updateErr) {
        patchedCount++;
      } else {
        console.error(`Failed to patch ${student.id}:`, updateErr);
      }
    } else {
      console.log(`Could not find a matching lead for student ${student.student_name}`);
    }
  }
  
  console.log(`\nSuccessfully patched ${patchedCount} out of ${missing.length} students.`);
}

patchMissingLeadIds();
