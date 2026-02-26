const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../apps/api/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Basic CSV parser
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const headers = lines[0].split(',').map(h => h.trim());
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || null;
    });
    records.push(row);
  }
  return records;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function importTeachers() {
  console.log('Importing Teachers...');
  const teachers = parseCSV(path.resolve(__dirname, '../teacher_import_template.csv'));
  
  for (const t of teachers) {
    // Generate email if missing
    const email = t.email || `${t.teacher_code.toLowerCase()}@edusolve.local`;
    
    // Check if user already exists based on email
    let { data: users, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (selectError) {
      console.error('Error fetching user', email, selectError);
      continue;
    }

    let userId;
    if (users && users.length > 0) {
      userId = users[0].id;
      console.log(`User ${email} already exists.`);
    } else {
      // 1. Insert into users
      // Since this is a custom table (not auth.users) we use a random uuid or let it generate
      const newUserId = crypto.randomUUID();
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          id: newUserId,
          full_name: t.full_name,
          email: email,
          is_active: t.is_active?.toLowerCase() === 'yes'
        }])
        .select()
        .single();
        
      if (userError) {
        console.error('Error inserting user', email, userError);
        continue;
      }
      userId = newUser.id;
      console.log(`Created user ${email}`);
    }

    // 2. Insert into teacher_profiles
    const hasProfile = await supabase.from('teacher_profiles').select('id').eq('user_id', userId).limit(1);
    if (hasProfile.data && hasProfile.data.length > 0) {
      console.log(`Teacher profile for ${email} already exists.`);
      continue;
    }

    const { error: profileError } = await supabase
      .from('teacher_profiles')
      .insert([{
        user_id: userId,
        teacher_code: t.teacher_code,
        experience_level: t.experience_level,
        per_hour_rate: parseFloat(t.per_hour_rate) || 0,
        is_in_pool: t.is_in_pool?.toLowerCase() === 'yes'
      }]);
      
    if (profileError) {
      console.error('Error inserting teacher profile', t.teacher_code, profileError);
    } else {
      console.log(`Created teacher profile for ${t.teacher_code}`);
    }
  }
}

async function importStudents() {
  console.log('\nImporting Students...');
  const students = parseCSV(path.resolve(__dirname, '../student_import_template.csv'));
  
  for (const s of students) {
    if (!s.student_name) continue;

    // 1. Create a lead first, assuming 'joined' status
    // Parse Date DD-MM-YYYY
    let joinedAtDate = null;
    if (s.joined_at) {
      const [day, month, year] = s.joined_at.split('-');
      joinedAtDate = new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
    }

    // Checking if lead exists
    const phoneFilter = s.contact_number ? s.contact_number : '';
    let leadId;
    
    // For simplicity, create a new lead since phone numbers can have spaces, etc, or multiple leads per phone
    const { data: newLead, error: leadError } = await supabase
      .from('leads')
      .insert([{
        student_name: s.student_name,
        parent_name: s.parent_name,
        country_code: s.country_code,
        contact_number: s.contact_number,
        class_level: s.class_level,
        package_name: s.package_name,
        status: 'joined',
        assigned_at: joinedAtDate || new Date().toISOString()
      }])
      .select()
      .single();

    if (leadError) {
      console.error('Error inserting lead', s.student_name, leadError);
      continue;
    }
    
    leadId = newLead.id;
    console.log(`Created lead for ${s.student_name}`);

    // 2. Create student
    const totalHours = parseFloat(s.total_hours) || 0;
    const remainingHours = s.remaining_hours ? parseFloat(s.remaining_hours) : totalHours;
    
    // Note: user.email might be used for auth later, but the core schema doesn't force a student to have a `users` row.
    // They just have a `students` row.
    const { data: newStudent, error: studentError } = await supabase
      .from('students')
      .insert([{
        lead_id: leadId,
        student_code: s.student_code || null,
        student_name: s.student_name,
        parent_name: s.parent_name,
        contact_number: s.contact_number ? `${s.country_code} ${s.contact_number}`.trim() : null,
        class_level: s.class_level,
        package_name: s.package_name,
        total_hours: totalHours,
        remaining_hours: remainingHours,
        status: s.status?.toLowerCase() || 'active',
        joined_at: joinedAtDate
      }])
      .select()
      .single();

    if (studentError) {
      console.error('Error inserting student', s.student_name, studentError);
      continue;
    }
    
    console.log(`Created student ${s.student_name} (${newStudent.id})`);

    // 3. Update lead to point back to joined_student_id
    const { error: updateError } = await supabase
      .from('leads')
      .update({ joined_student_id: newStudent.id })
      .eq('id', leadId);
      
    if (updateError) {
      console.error('Error updating lead with joined_student_id', updateError);
    }
  }
}

async function run() {
  await importTeachers();
  await importStudents();
  console.log('\nMigration complete.');
}

run();
