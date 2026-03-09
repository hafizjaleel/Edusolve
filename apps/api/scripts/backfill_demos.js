import { getSupabaseAdminClient } from '../src/config/supabase.js';

async function backfill() {
  const client = getSupabaseAdminClient();
  
  // 1. Get all leads with demo_scheduled status
  const { data: leads, error: leadsError } = await client
    .from('leads')
    .select('id, student_name, demo_scheduled_at, demo_ends_at, subject, demo_teacher_id')
    .eq('status', 'demo_scheduled');

  if (leadsError) {
    console.error('Error fetching leads:', leadsError);
    process.exit(1);
  }

  // 2. Get all existing demo_sessions to see which are missing
  const { data: sessions, error: sessionsError } = await client
    .from('demo_sessions')
    .select('lead_id');

  if (sessionsError) {
    console.error('Error fetching sessions:', sessionsError);
    process.exit(1);
  }

  const existingLeadIds = new Set(sessions.map(s => s.lead_id));
  const missingLeads = leads.filter(l => !existingLeadIds.has(l.id));

  console.log(`Found ${missingLeads.length} leads with missing demo_sessions.`);

  // 3. Backfill
  for (const lead of missingLeads) {
    if (!lead.demo_teacher_id || !lead.demo_scheduled_at) {
      console.log(`Skipping lead ${lead.id} (${lead.student_name}) due to missing teacher or scheduled time.`);
      continue;
    }

    // Resolve user ID if demo_teacher_id is a profile ID
    let teacherUserId = lead.demo_teacher_id;
    const { data: profile } = await client
      .from('teacher_profiles')
      .select('user_id')
      .eq('id', lead.demo_teacher_id)
      .maybeSingle();
      
    if (profile?.user_id) {
      teacherUserId = profile.user_id;
    }

    const { error: insertError } = await client
      .from('demo_sessions')
      .insert({
        lead_id: lead.id,
        teacher_id: teacherUserId,
        scheduled_at: lead.demo_scheduled_at,
        ends_at: lead.demo_ends_at || null,
        subject: lead.subject || null,
        status: 'scheduled',
        demo_number: 1
      });

    if (insertError) {
      console.error(`Error backfilling lead ${lead.id}:`, insertError);
    } else {
      console.log(`Successfully backfilled demo for lead ${lead.id} (${lead.student_name}).`);
    }
  }

  console.log('Backfill complete.');
  process.exit(0);
}

backfill().catch(err => {
  console.error(err);
  process.exit(1);
});
