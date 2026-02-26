const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve('e:/Qubes/Edusolve/apps/api/.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const studentMapping = {
  "Amina Muzzammil": "EDSV0004",
  "vaiga": "EDSV0005",
  "Farhan": "EDSV0006",
  "Fathima Daisha": "EDSV0007"
};

async function patch() {
  const { data: students, error } = await supabase.from('students').select('id, student_name, student_code');
  if (error) {
    console.error(error); return;
  }

  for (const s of students) {
    const code = studentMapping[s.student_name.trim()];
    if (code && s.student_code !== code) {
      await supabase.from('students').update({ student_code: code }).eq('id', s.id);
      console.log('Patched', s.student_name, 'with', code);
    } else if (code) {
      console.log('Skipping', s.student_name, 'already has', code);
    }
  }
}
patch();
