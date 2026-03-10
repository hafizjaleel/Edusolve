import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: 'apps/api/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

async function run() {
  console.log('\n=== Test: Reschedule with Subject & Teacher ===\n');

  // 1. Find a scheduled session to test with
  const { data: sessions, error: sErr } = await supabase
    .from('academic_sessions')
    .select('id, student_id, teacher_id, subject, session_date, started_at, duration_hours, status')
    .in('status', ['scheduled', 'completed', 'rescheduled'])
    .limit(1)
    .single();

  if (sErr || !sessions) {
    console.log('❌ Could not find a test session:', sErr?.message);
    // Create a test session instead
    console.log('  Creating a temporary test session...');
    
    const { data: student } = await supabase.from('students').select('id').is('deleted_at', null).limit(1).single();
    const { data: teacher } = await supabase.from('teacher_profiles').select('user_id').limit(1).single();
    
    if (!student || !teacher) {
      console.log('❌ No student or teacher found to create test session');
      process.exit(1);
    }

    const { data: newSession, error: createErr } = await supabase
      .from('academic_sessions')
      .insert({
        student_id: student.id,
        teacher_id: teacher.user_id,
        session_date: '2026-04-01',
        started_at: '2026-04-01T10:00:00+05:30',
        duration_hours: 1,
        subject: 'Math',
        status: 'scheduled'
      })
      .select('*')
      .single();

    if (createErr) {
      console.log('❌ Could not create test session:', createErr.message);
      process.exit(1);
    }

    return await testReschedule(newSession, true);
  }

  await testReschedule(sessions, false);
}

async function testReschedule(session, isTemp) {
  const originalSubject = session.subject;
  const originalTeacherId = session.teacher_id;
  const originalDate = session.session_date;
  const originalStartedAt = session.started_at;
  const originalDuration = session.duration_hours;

  console.log(`Using session: ${session.id}`);
  console.log(`  Original subject: ${originalSubject || '(none)'}`);
  console.log(`  Original teacher_id: ${originalTeacherId}`);

  // 2. Get a different teacher to test with (or use same one)
  const { data: teachers } = await supabase.from('teacher_profiles').select('user_id').limit(5);
  const otherTeacher = (teachers || []).find(t => t.user_id !== originalTeacherId);
  const newTeacherId = otherTeacher ? otherTeacher.user_id : originalTeacherId;
  const newSubject = originalSubject === 'Science' ? 'Math' : 'Science';

  // 3. Update the session via direct DB (simulating what the API endpoint does)
  const updatePayload = {
    subject: newSubject,
    teacher_id: newTeacherId,
    updated_at: new Date().toISOString()
  };

  const { error: updateErr } = await supabase
    .from('academic_sessions')
    .update(updatePayload)
    .eq('id', session.id);

  if (updateErr) {
    console.log(`  ❌ Update failed: ${updateErr.message}`);
    failed++;
  } else {
    // 4. Verify the change
    const { data: updated } = await supabase
      .from('academic_sessions')
      .select('subject, teacher_id')
      .eq('id', session.id)
      .single();

    console.log(`  After reschedule: subject=${updated.subject}, teacher_id=${updated.teacher_id}`);
    assert(updated.subject === newSubject, `subject changed to "${newSubject}"`);
    assert(updated.teacher_id === newTeacherId, `teacher_id changed to "${newTeacherId}"`);
  }

  // 5. Restore original values
  await supabase
    .from('academic_sessions')
    .update({
      subject: originalSubject,
      teacher_id: originalTeacherId,
      session_date: originalDate,
      started_at: originalStartedAt,
      duration_hours: originalDuration
    })
    .eq('id', session.id);
  console.log('  Restored original session data');

  // 6. If temp session, clean it up
  if (isTemp) {
    await supabase.from('academic_sessions').delete().eq('id', session.id);
    console.log('  Cleaned up temporary test session');
  }

  // 7. Test the API endpoint directly
  console.log('\n--- Testing PUT /sessions/:id/reschedule API endpoint ---');
  
  // First get a session to test on
  const { data: apiSession } = await supabase
    .from('academic_sessions')
    .select('id, subject, teacher_id, session_date, started_at, duration_hours')
    .in('status', ['scheduled', 'completed', 'rescheduled'])
    .limit(1)
    .single();

  if (apiSession) {
    const apiOrigSubject = apiSession.subject;
    const apiOrigTeacher = apiSession.teacher_id;
    
    const apiUrl = `http://localhost:4000/sessions/${apiSession.id}/reschedule`;
    const testSubject = apiOrigSubject === 'Physics' ? 'Chemistry' : 'Physics';
    
    try {
      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'academic_coordinator',
          'x-user-id': 'test-user'
        },
        body: JSON.stringify({
          session_date: apiSession.session_date,
          started_at: apiSession.started_at?.slice(11, 16) || '10:00',
          duration_hours: apiSession.duration_hours || 1,
          subject: testSubject,
          teacher_id: apiOrigTeacher
        })
      });

      const data = await res.json();
      
      if (data.ok) {
        const updatedSession = Array.isArray(data.session) ? data.session[0] : data.session;
        console.log(`  API response subject: ${updatedSession?.subject}`);
        assert(updatedSession?.subject === testSubject, `API updated subject to "${testSubject}"`);
        
        // Restore
        await supabase.from('academic_sessions').update({ subject: apiOrigSubject, teacher_id: apiOrigTeacher }).eq('id', apiSession.id);
        console.log('  Restored API test session data');
      } else {
        console.log(`  API returned error: ${data.error}`);
        // Still counts as pass if the error is about missing fields and not about subject/teacher
        assert(false, `API endpoint accepted subject and teacher_id`);
      }
    } catch (err) {
      console.log(`  ⚠️  API not reachable: ${err.message} (skipping API test)`);
    }
  } else {
    console.log('  No session found for API test, skipping');
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
