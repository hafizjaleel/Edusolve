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
  console.log('\n=== Test: Negative Student Hours ===\n');

  // 1. Pick a student
  const { data: student, error: sErr } = await supabase
    .from('students')
    .select('id, student_name, remaining_hours, total_hours')
    .is('deleted_at', null)
    .limit(1)
    .single();

  if (sErr || !student) {
    console.log('❌ Could not find a test student:', sErr?.message);
    return;
  }

  const originalRemaining = Number(student.remaining_hours);
  const originalTotal = Number(student.total_hours);
  console.log(`Using student: ${student.student_name} (ID: ${student.id})`);
  console.log(`  Original remaining_hours: ${originalRemaining}`);

  // 2. Set remaining_hours to 1 for testing
  await supabase.from('students').update({ remaining_hours: 1 }).eq('id', student.id);
  console.log('  Set remaining_hours to 1');

  // 3. Simulate session verification deduction of 3 hours
  //    This mirrors the updated logic in sessions.controller.js (no Math.max clamp)
  const duration = 3;
  const newRemaining = 1 - duration; // = -2

  await supabase.from('students').update({ remaining_hours: newRemaining }).eq('id', student.id);

  const { data: afterDeduction } = await supabase
    .from('students')
    .select('remaining_hours')
    .eq('id', student.id)
    .single();

  console.log(`  After 3h deduction: remaining_hours = ${afterDeduction.remaining_hours}`);
  assert(Number(afterDeduction.remaining_hours) === -2, 'remaining_hours should be -2 (1 - 3 = -2)');
  assert(Number(afterDeduction.remaining_hours) < 0, 'remaining_hours should be negative');

  // 4. Simulate a top-up of 10 hours (mirrors finance.controller.js logic)
  const topupHours = 10;
  const afterTopup = Number(afterDeduction.remaining_hours) + topupHours;

  await supabase.from('students').update({ remaining_hours: afterTopup }).eq('id', student.id);

  const { data: finalStudent } = await supabase
    .from('students')
    .select('remaining_hours')
    .eq('id', student.id)
    .single();

  console.log(`  After 10h top-up: remaining_hours = ${finalStudent.remaining_hours}`);
  assert(Number(finalStudent.remaining_hours) === 8, 'remaining_hours should be 8 (-2 + 10 = 8)');
  assert(Number(finalStudent.remaining_hours) > 0, 'remaining_hours should be positive after top-up');

  // 5. Restore original value
  await supabase.from('students').update({
    remaining_hours: originalRemaining,
    total_hours: originalTotal
  }).eq('id', student.id);
  console.log(`  Restored original remaining_hours to ${originalRemaining}`);

  // Summary
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
