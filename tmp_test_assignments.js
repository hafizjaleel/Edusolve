
const { createClient } = require('@supabase/supabase-js');
const adminClient = createClient(
  'http://127.0.0.1:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || require('fs').readFileSync('.env', 'utf8').match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1]
);

async function test() {
  const { data: students } = await adminClient.from('students').select('id').limit(1);
  if (!students.length) return console.log('No students found.');
  const sId = students[0].id;
  
  const { data: teachers } = await adminClient.from('teacher_profiles').select('user_id').limit(2);
  const t1 = teachers[0].user_id;
  
  console.log('Inserting pending assignment...');
  const { data, error } = await adminClient.from('student_teacher_assignments').insert({
    student_id: sId,
    teacher_id: t1,
    subject: 'Math',
    day: 'Monday',
    time: '14:00',
    status: 'pending',
    is_active: false
  }).select();
  console.log(error ? 'Error: ' + error.message : 'Inserted: ', data);
  
  if(data) {
     console.log('Marking accepted...');
     const { data: acc, error: err2 } = await adminClient.from('student_teacher_assignments').update({ status: 'accepted', is_active: true }).eq('id', data[0].id).select();
     console.log(err2 ? err2 : acc);
  }
}
test();
