import { randomUUID } from 'node:crypto';
import { getSupabaseAdminClient } from '../config/supabase.js';

const nowIso = () => new Date().toISOString();

const memoryLeads = [
  {
    id: randomUUID(),
    student_name: 'Aarav Sharma',
    parent_name: 'Neha Sharma',
    class_level: 'Class 8',
    subject: 'Math',
    counselor_id: 'dev-user',
    contact_number: '+919999999001',
    status: 'new',
    owner_stage: 'counselor',
    created_at: nowIso(),
    updated_at: nowIso(),
    deleted_at: null
  }
];

function isCounselor(actor) {
  return actor?.role === 'counselor';
}

function isCounselorHead(actor) {
  return actor?.role === 'counselor_head';
}

function isSuperAdmin(actor) {
  return actor?.role === 'super_admin';
}

function canAccessLead(actor, lead) {
  if (isSuperAdmin(actor)) return true;
  if (isCounselorHead(actor)) return true;
  if (isCounselor(actor) && lead.counselor_id === actor.userId) return true;
  return false;
}

async function safeAuditInsert(action, entityType, entityId, actorId, beforeData, afterData, reason) {
  const adminClient = getSupabaseAdminClient();
  if (!adminClient) return;

  await adminClient.from('audit_logs').insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_data: beforeData,
    after_data: afterData,
    reason: reason || null
  });
}

export class LeadsService {
  async listOutcomes(actor) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'lead access is not allowed for this role' };
    }

    if (!adminClient) {
      const base = memoryLeads.filter((lead) => !lead.deleted_at);
      const scoped = isCounselor(actor)
        ? base.filter((lead) => lead.counselor_id === actor.userId)
        : base;
      return scoped.filter((lead) => lead.status === 'joined' || lead.status === 'dropped');
    }

    let query = adminClient
      .from('leads')
      .select('*')
      .is('deleted_at', null)
      .in('status', ['joined', 'dropped'])
      .order('updated_at', { ascending: false });

    if (isCounselor(actor)) {
      query = query.eq('counselor_id', actor.userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async getTeacherDemos(teacherId, date) {
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) return [];
    const startOfDay = `${date}T00:00:00+05:30`;
    const endOfDay = `${date}T23:59:59+05:30`;

    // 1. Query demo_sessions for scheduled demos
    const { data: demoData, error: demoError } = await adminClient
      .from('demo_sessions')
      .select('id, lead_id, teacher_id, scheduled_at, ends_at, status, subject')
      .eq('teacher_id', teacherId)
      .in('status', ['scheduled', 'rescheduled'])
      .gte('scheduled_at', new Date(startOfDay).toISOString())
      .lte('scheduled_at', new Date(endOfDay).toISOString());
    if (demoError) throw new Error(demoError.message);

    // 2. Query academic_sessions for scheduled/rescheduled classes
    const { data: sessionData, error: sessionError } = await adminClient
      .from('academic_sessions')
      .select('id, student_id, teacher_id, started_at, duration_hours, status, subject, students(student_name)')
      .eq('teacher_id', teacherId)
      .in('status', ['scheduled', 'rescheduled', 'completed', 'verified'])
      .eq('session_date', date);
    if (sessionError) throw new Error(sessionError.message);

    // 3. Get student names for demos
    const leadIds = [...new Set((demoData || []).map(d => d.lead_id))];
    let leadMap = {};
    if (leadIds.length > 0) {
      const { data: leads } = await adminClient
        .from('leads')
        .select('id, student_name')
        .in('id', leadIds);
      (leads || []).forEach(l => { leadMap[l.id] = l.student_name; });
    }

    // Combine both
    const demos = (demoData || []).map(d => ({
      id: d.id,
      student_name: leadMap[d.lead_id] || 'Unknown Lead',
      demo_scheduled_at: d.scheduled_at,
      demo_ends_at: d.ends_at,
      status: d.status,
      subject: d.subject,
      type: 'demo'
    }));

    const classes = (sessionData || []).map(s => {
      const start = new Date(s.started_at);
      const end = new Date(start.getTime() + (s.duration_hours || 1) * 3600000);
      return {
        id: s.id,
        student_name: s.students?.student_name || 'Academic Student',
        demo_scheduled_at: s.started_at,
        demo_ends_at: end.toISOString(),
        status: s.status,
        subject: s.subject,
        type: 'class'
      };
    });

    return [...demos, ...classes];
  }

  async list({ scope, actor, page, limit, status, counselor_id, lead_type }) {
    const adminClient = getSupabaseAdminClient();

    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'lead access is not allowed for this role' };
    }

    const resolvedScope = isCounselor(actor) ? 'mine' : scope;

    if (!adminClient) {
      const base = memoryLeads.filter((lead) => !lead.deleted_at);
      let filtered = base;
      if (resolvedScope === 'joined') filtered = base.filter((lead) => lead.status === 'joined');
      else if (resolvedScope === 'mine') filtered = base.filter((lead) => lead.counselor_id === actor.userId);

      const total = filtered.length;
      if (page && limit) {
        const from = (page - 1) * limit;
        return { items: filtered.slice(from, from + limit), total, page, limit };
      }
      return { items: filtered, total, page: 1, limit: total || 10 };
    }

    let selectQuery = '*';
    if (resolvedScope === 'joined') {
      selectQuery = '*, students!students_lead_id_fkey(academic_coordinator_id, users!students_academic_coordinator_id_fkey(full_name, email))';
    }

    let query = adminClient
      .from('leads')
      .select(selectQuery, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (resolvedScope === 'mine') {
      query = query.eq('counselor_id', actor.userId);
    } else if (counselor_id && counselor_id !== 'all') {
      query = query.eq('counselor_id', counselor_id);
    }

    if (status && status !== 'all') {
      if (status.includes(',')) {
        query = query.in('status', status.split(',').map(s => s.trim()));
      } else {
        query = query.eq('status', status);
      }
    }

    if (lead_type && lead_type !== 'all') {
      query = query.eq('lead_type', lead_type);
    }

    if (resolvedScope === 'joined') {
      // Fetch leads without any ambiguous joins
      let joinedQuery = adminClient
        .from('leads')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
        .eq('status', 'joined')
        .order('updated_at', { ascending: false });

      if (counselor_id && counselor_id !== 'all') joinedQuery = joinedQuery.eq('counselor_id', counselor_id);
      if (lead_type && lead_type !== 'all') joinedQuery = joinedQuery.eq('lead_type', lead_type);

      if (page && limit) {
        const from = (page - 1) * limit;
        joinedQuery = joinedQuery.range(from, from + limit - 1);
      }

      const { data: joinedLeads, count: joinedCount, error: joinedError } = await joinedQuery;
      if (joinedError) throw new Error(joinedError.message);

      // Fetch corresponding students to get AC assignments
      const leadIds = (joinedLeads || []).map(l => l.id);
      let studentsMap = {};
      let acUserIds = new Set();

      if (leadIds.length > 0) {
        const { data: studentsData } = await adminClient
          .from('students')
          .select('id, lead_id, student_code, academic_coordinator_id')
          .in('lead_id', leadIds);

        (studentsData || []).forEach(s => {
          studentsMap[s.lead_id] = s;
          if (s.academic_coordinator_id) acUserIds.add(s.academic_coordinator_id);
        });
      }

      // Resolve counselor + ac_user names from users table
      const userIds = [...new Set([
        ...(joinedLeads || []).map(l => l.counselor_id).filter(Boolean),
        ...Array.from(acUserIds)
      ])];

      let userMap = {};
      if (userIds.length > 0) {
        const { data: users } = await adminClient
          .from('users')
          .select('id, full_name, email')
          .in('id', userIds);
        (users || []).forEach(u => { userMap[u.id] = { id: u.id, full_name: u.full_name, email: u.email }; });
      }

      const mapped = (joinedLeads || []).map(l => {
        const student = studentsMap[l.id];
        return {
          ...l,
          counselor: l.counselor_id ? (userMap[l.counselor_id] || null) : null,
          ac_user: (student && student.academic_coordinator_id) ? (userMap[student.academic_coordinator_id] || null) : null,
          student_code: student ? student.student_code : null,
          students: student ? {
            users: student.academic_coordinator_id ? (userMap[student.academic_coordinator_id] || null) : null
          } : null
        };
      });
      return { items: mapped, total: joinedCount || 0, page, limit };
    }

    if (page && limit) {
      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);
    return { items: data || [], total: count || 0, page, limit };
  }

  async get(id, actor) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'lead access is not allowed for this role' };
    }

    if (!adminClient) {
      const lead = memoryLeads.find((item) => item.id === id && !item.deleted_at) || null;
      if (!lead) return null;
      if (!canAccessLead(actor, lead)) return { error: 'not allowed to access this lead' };
      return lead;
    }

    const { data, error } = await adminClient
      .from('leads')
      .select('*, teacher_profiles(id, teacher_code, users!teacher_profiles_user_id_fkey(id, full_name, email))')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    if (!canAccessLead(actor, data)) return { error: 'not allowed to access this lead' };
    return data;
  }

  async getTypes(actor) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'access is not allowed for this role' };
    }

    if (!adminClient) {
      const types = new Set(memoryLeads.map(l => l.lead_type).filter(Boolean));
      return Array.from(types);
    }

    const { data, error } = await adminClient
      .from('lead_types')
      .select('name')
      .order('name', { ascending: true });

    if (error) {
      // fallback if new table is not there yet
      const { data: raw, error: rawError } = await adminClient
        .from('leads')
        .select('lead_type')
        .neq('lead_type', null)
        .is('deleted_at', null);

      if (rawError) throw new Error(rawError.message);
      const unique = new Set((raw || []).map(r => r.lead_type).filter(Boolean));
      return Array.from(unique);
    }

    return (data || []).map(r => r.name);
  }

  async getDropReasons(actor) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'access is not allowed for this role' };
    }

    if (!adminClient) {
      return [];
    }

    const { data, error } = await adminClient
      .from('lead_drop_reasons')
      .select('reason')
      .order('reason', { ascending: true });

    if (error) {
      // Return empty array if table doesn't exist yet
      if (error.code === '42P01') return []; 
      throw new Error(error.message);
    }

    return data || [];
  }

  async addType(name, actor) {
    const adminClient = getSupabaseAdminClient();
    if (!name) return { error: 'name is required' };

    if (!adminClient) {
      return { ok: true, name };
    }

    const { data, error } = await adminClient
      .from('lead_types')
      .insert({ name })
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') return { ok: true, name }; // Already exists
      throw new Error(error.message);
    }

    await safeAuditInsert('lead_type.create', 'lead_type', data.id, actor.userId, null, data, null);
    return { ok: true, type: data };
  }

  async create(payload, actor) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'only counselor, counselor head or super admin can create leads' };
    }

    let counselorId = payload.counselor_id || null;
    if (isCounselor(actor)) {
      counselorId = actor.userId; // Force auto-assign to the counselor creating it
    }

    if (!adminClient) {
      const created = {
        id: randomUUID(),
        student_name: payload.student_name,
        parent_name: payload.parent_name || null,
        class_level: payload.class_level || null,
        subject: payload.subject || null,
        counselor_id: counselorId,
        contact_number: payload.contact_number || null,
        status: 'new',
        owner_stage: 'counselor',
        created_at: nowIso(),
        updated_at: nowIso(),
        deleted_at: null
      };
      memoryLeads.push(created);
      return created;
    }

    const { data, error } = await adminClient
      .from('leads')
      .insert({
        student_name: payload.student_name,
        parent_name: payload.parent_name || null,
        class_level: payload.class_level || null,
        subject: payload.subject || null,
        lead_type: payload.lead_type || null,
        counselor_id: counselorId,
        contact_number: payload.contact_number || null,
        email: payload.email || null,
        status: 'new',
        owner_stage: 'counselor'
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    await safeAuditInsert('lead.create', 'lead', data.id, actor.userId, null, data, null);
    await adminClient.from('lead_status_history').insert({
      lead_id: data.id,
      from_status: null,
      to_status: data.status,
      changed_by: actor.userId,
      reason: 'initial status'
    });
    return data;
  }

  async update(id, payload, actor) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'lead update is not allowed for this role' };
    }

    const editable = ['student_name', 'parent_name', 'class_level', 'subject', 'lead_type', 'contact_number', 'email', 'status', 'demo_scheduled_at', 'demo_ends_at', 'demo_teacher_id', 'drop_reason', 'current_note'];

    if (!adminClient) {
      const lead = memoryLeads.find((item) => item.id === id && !item.deleted_at);
      if (!lead) return null;
      if (!canAccessLead(actor, lead)) return { error: 'not allowed to edit this lead' };

      for (const key of editable) {
        if (payload[key] !== undefined) lead[key] = payload[key];
      }
      lead.updated_at = nowIso();
      return lead;
    }

    const { data: current, error: currentError } = await adminClient
      .from('leads')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (currentError) throw new Error(currentError.message);
    if (!current) return null;
    if (!canAccessLead(actor, current)) return { error: 'not allowed to edit this lead' };

    const patch = {};
    for (const key of editable) {
      if (payload[key] !== undefined) patch[key] = payload[key];
    }
    patch.updated_at = nowIso();

    // Clear current_note if status changes
    if (payload.status && payload.status !== current.status) {
        patch.current_note = null;
    }

    const { data: updated, error: updateError } = await adminClient
      .from('leads')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) throw new Error(updateError.message);

    await safeAuditInsert('lead.update', 'lead', updated.id, actor.userId, current, updated, payload.reason || null);
    if (current.status !== updated.status) {
      await adminClient.from('lead_status_history').insert({
        lead_id: updated.id,
        from_status: current.status,
        to_status: updated.status,
        changed_by: actor.userId,
        reason: payload.reason || 'status updated'
      });
    }

    // Always insert a new demo_session row (supports multiple demos per lead)
    if (updated.demo_teacher_id && updated.demo_scheduled_at) {
      // Resolve teacher user_id if demo_teacher_id is a profile ID
      let teacherUserId = updated.demo_teacher_id;
      const { data: profile } = await adminClient
        .from('teacher_profiles')
        .select('user_id')
        .eq('id', updated.demo_teacher_id)
        .maybeSingle();
      if (profile?.user_id) {
        teacherUserId = profile.user_id;
      }

      // Calculate next demo_number
      const { data: existingDemos } = await adminClient
        .from('demo_sessions')
        .select('demo_number')
        .eq('lead_id', id)
        .order('demo_number', { ascending: false })
        .limit(1);
      const nextNum = (existingDemos && existingDemos.length > 0) ? (existingDemos[0].demo_number || 0) + 1 : 1;

      await adminClient
        .from('demo_sessions')
        .insert({
          lead_id: id,
          teacher_id: teacherUserId,
          scheduled_at: updated.demo_scheduled_at,
          ends_at: updated.demo_ends_at || null,
          subject: updated.subject || null,
          status: 'scheduled',
          demo_number: nextNum
        });
    }

    // When lead status changes to demo_done, also mark the latest scheduled demo_session as done
    if (updated.status === 'demo_done' && current.status === 'demo_scheduled') {
      const { data: latestDemo } = await adminClient
        .from('demo_sessions')
        .select('id')
        .eq('lead_id', id)
        .eq('status', 'scheduled')
        .order('demo_number', { ascending: false })
        .limit(1);
      if (latestDemo && latestDemo.length > 0) {
        await adminClient
          .from('demo_sessions')
          .update({ status: 'done', completed_at: nowIso() })
          .eq('id', latestDemo[0].id);
      }
    }

    return updated;
  }

  async softDelete(id, actor, reason) {
    const adminClient = getSupabaseAdminClient();

    if (!isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'only counselor head or super admin can delete lead' };
    }

    if (!adminClient) {
      const lead = memoryLeads.find((item) => item.id === id && !item.deleted_at);
      if (!lead) return null;

      lead.deleted_at = nowIso();
      lead.deleted_by = actor.userId;
      lead.delete_reason = reason || null;
      lead.updated_at = nowIso();
      return lead;
    }

    const { data: current, error: currentError } = await adminClient
      .from('leads')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (currentError) throw new Error(currentError.message);
    if (!current) return null;

    const patch = {
      deleted_at: nowIso(),
      deleted_by: actor.userId,
      delete_reason: reason || null,
      updated_at: nowIso()
    };

    const { data: deleted, error: deleteError } = await adminClient
      .from('leads')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();

    if (deleteError) throw new Error(deleteError.message);

    await safeAuditInsert('lead.soft_delete', 'lead', deleted.id, actor.userId, current, deleted, reason || null);
    return deleted;
  }

  async createDemoRequest(id, actor, scheduledAt) {
    const adminClient = getSupabaseAdminClient();

    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'demo management is not allowed for this role' };
    }

    if (!adminClient) {
      const lead = memoryLeads.find((item) => item.id === id && !item.deleted_at);
      if (!lead) return null;
      if (!canAccessLead(actor, lead)) return { error: 'not allowed to manage demo for this lead' };

      lead.status = 'demo_scheduled';
      lead.updated_at = nowIso();

      return {
        lead_id: id,
        broadcasted_by: actor.userId,
        scheduled_at: scheduledAt || null,
        status: 'open',
        created_at: nowIso()
      };
    }

    const { data: current, error: currentError } = await adminClient
      .from('leads')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (currentError) throw new Error(currentError.message);
    if (!current) return null;
    if (!canAccessLead(actor, current)) return { error: 'not allowed to manage demo for this lead' };

    const { error: leadUpdateError } = await adminClient
      .from('leads')
      .update({ status: 'demo_scheduled', updated_at: nowIso() })
      .eq('id', id);
    if (leadUpdateError) throw new Error(leadUpdateError.message);

    const { data: demoRequest, error: demoError } = await adminClient
      .from('demo_requests')
      .insert({
        lead_id: id,
        broadcasted_by: actor.userId,
        scheduled_at: scheduledAt || null,
        status: 'open'
      })
      .select('*')
      .single();

    if (demoError) throw new Error(demoError.message);

    await safeAuditInsert('lead.demo_request', 'lead', id, actor.userId, current, { ...current, status: 'demo_scheduled' }, null);
    return demoRequest;
  }

  async listPaymentRequests(actor, page, limit) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor) && actor.role !== 'academic_coordinator') {
      return { error: 'payment request access is not allowed for this role' };
    }
    if (!adminClient) return { items: [], total: 0, page: 1, limit: 10 };

    let query = adminClient
      .from('payment_requests')
      .select('*, leads(student_name, subject, class_level, contact_number, counselor_id, source, package_name)', { count: 'exact' })
      .order('status', { ascending: true })
      .order('created_at', { ascending: false });

    // Counselors and ACs see only their own requests
    if (isCounselor(actor) || actor.role === 'academic_coordinator') {
      query = query.eq('requested_by', actor.userId);
    }

    if (page && limit) {
      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);
    return { items: data || [], total: count || 0, page, limit };
  }

  async submitPaymentRequest(id, actor, payload) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'payment request is not allowed for this role' };
    }

    const amount = Number(payload.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { error: 'valid payment amount is required' };
    }

    if (!adminClient) {
      const lead = memoryLeads.find((item) => item.id === id && !item.deleted_at);
      if (!lead) return null;
      if (!canAccessLead(actor, lead)) return { error: 'not allowed for this lead' };
      lead.status = 'payment_verification';
      lead.updated_at = nowIso();
      return {
        id: randomUUID(),
        lead_id: id,
        requested_by: actor.userId,
        amount,
        total_amount: Number(payload.total_amount) || null,
        hours: Number(payload.hours) || null,
        screenshot_url: payload.screenshot_url || null,
        status: 'pending',
        created_at: nowIso()
      };
    }

    const { data: current, error: currentError } = await adminClient
      .from('leads')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();
    if (currentError) throw new Error(currentError.message);
    if (!current) return null;
    if (!canAccessLead(actor, current)) return { error: 'not allowed for this lead' };

    const { data: paymentRequest, error: requestError } = await adminClient
      .from('payment_requests')
      .insert({
        lead_id: id,
        requested_by: actor.userId,
        amount,
        total_amount: Number(payload.total_amount) || null,
        hours: Number(payload.hours) || null,
        screenshot_url: payload.screenshot_url || null,
        status: 'pending'
      })
      .select('*')
      .single();
    if (requestError) throw new Error(requestError.message);

    const { data: updated, error: updateError } = await adminClient
      .from('leads')
      .update({ status: 'payment_verification', owner_stage: 'finance', updated_at: nowIso() })
      .eq('id', id)
      .select('*')
      .single();
    if (updateError) throw new Error(updateError.message);

    await adminClient.from('lead_status_history').insert({
      lead_id: id,
      from_status: current.status,
      to_status: 'payment_verification',
      changed_by: actor.userId,
      reason: 'payment request submitted'
    });

    await safeAuditInsert(
      'lead.payment_request',
      'lead',
      id,
      actor.userId,
      current,
      updated,
      'payment evidence submitted'
    );
    return paymentRequest;
  }

  async assignCounselor(id, counselorUserId, actor) {
    const adminClient = getSupabaseAdminClient();

    if (!isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'only counselor head or super admin can assign leads' };
    }

    if (!counselorUserId) {
      return { error: 'counselor_user_id is required' };
    }

    if (!adminClient) {
      const lead = memoryLeads.find((item) => item.id === id && !item.deleted_at);
      if (!lead) return null;
      const before = { ...lead };
      lead.counselor_id = counselorUserId;
      lead.updated_at = nowIso();
      return { lead, before };
    }

    const { data: current, error: currentError } = await adminClient
      .from('leads')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (currentError) throw new Error(currentError.message);
    if (!current) return null;

    const { data: updated, error: updateError } = await adminClient
      .from('leads')
      .update({ counselor_id: counselorUserId, assigned_at: nowIso(), updated_at: nowIso() })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) throw new Error(updateError.message);

    await safeAuditInsert(
      'lead.assign_counselor',
      'lead',
      updated.id,
      actor.userId,
      current,
      updated,
      'reassigned by counselor head'
    );

    // Add to timeline/history
    await adminClient.from('lead_status_history').insert({
      lead_id: id,
      from_status: current.status,
      to_status: current.status, // Status didn't change, but assignment did
      changed_by: actor.userId,
      reason: `Assigned to counselor: ${counselorUserId}` // Log the assignment
    });


    return { lead: updated, before: current };
  }

  async getHistory(id, actor) {
    const adminClient = getSupabaseAdminClient();
    const lead = await this.get(id, actor);
    if (!lead || lead.error) return lead;

    if (!adminClient) {
      return [
        {
          id: `memory-${id}`,
          lead_id: id,
          from_status: null,
          to_status: lead.status,
          changed_by: lead.counselor_id,
          reason: 'memory mode history',
          created_at: lead.created_at
        }
      ];
    }

    const { data, error } = await adminClient
      .from('lead_status_history')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);

    // Resolve changed_by user IDs to names
    const userIds = [...new Set((data || []).map(h => h.changed_by).filter(Boolean))];
    let userMap = {};
    if (userIds.length) {
      const { data: users } = await adminClient
        .from('users')
        .select('id, full_name, email')
        .in('id', userIds);
      (users || []).forEach(u => { userMap[u.id] = u.full_name || u.email || 'Unknown'; });
    }

    return (data || []).map(h => ({
      ...h,
      changed_by_name: userMap[h.changed_by] || 'System'
    }));
  }

  async getLeadDemos(leadId, actor) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'access not allowed' };
    }
    if (!adminClient) return [];

    const { data, error } = await adminClient
      .from('demo_sessions')
      .select('*')
      .eq('lead_id', leadId)
      .order('demo_number', { ascending: true });
    if (error) throw new Error(error.message);

    // Resolve teacher names
    const teacherIds = [...new Set((data || []).map(d => d.teacher_id).filter(Boolean))];
    let teacherMap = {};
    if (teacherIds.length > 0) {
      const { data: teachers } = await adminClient
        .from('users')
        .select('id, full_name')
        .in('id', teacherIds);
      (teachers || []).forEach(t => { teacherMap[t.id] = t.full_name; });
    }

    return (data || []).map(d => ({
      ...d,
      teacher_name: teacherMap[d.teacher_id] || 'Unknown'
    }));
  }
  async bulkAssign(leadIds, counselorId, actor) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselorHead(actor) && !isSuperAdmin(actor)) return { error: 'only counselor head or super admin can assign leads' };
    if (!Array.isArray(leadIds) || leadIds.length === 0) return { error: 'leadIds array is required' };
    if (!counselorId) return { error: 'counselor_id is required' };

    if (!adminClient) {
      // Memory mode
      let count = 0;
      memoryLeads.forEach(lead => {
        if (leadIds.includes(lead.id) && !lead.deleted_at) {
          lead.counselor_id = counselorId;
          lead.updated_at = nowIso();
          count++;
        }
      });
      return { count };
    }

    // Update in batch
    const { data: updated, error } = await adminClient
      .from('leads')
      .update({ counselor_id: counselorId, assigned_at: nowIso(), updated_at: nowIso() })
      .in('id', leadIds)
      .select('id');

    if (error) throw new Error(error.message);

    // Add timeline entries for each assigned lead
    if (updated && updated.length) {
      const historyEntries = updated.map(u => ({
        lead_id: u.id,
        from_status: null,  // We don't track status change here
        to_status: null,
        changed_by: actor.userId,
        reason: `Assigned to counselor (bulk)`
      }));
      await adminClient.from('lead_status_history').insert(historyEntries);
    }

    return { count: updated.length };
  }

  async listOverdueLeads(page, limit) {
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) return { items: [], total: 0, page: 1, limit: 10 };

    const thirteenDaysAgo = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString();

    let query = adminClient
      .from('leads')
      .select('*, users:counselor_id(id, full_name)', { count: 'exact' })
      .not('counselor_id', 'is', null)
      .is('deleted_at', null)
      .lt('assigned_at', thirteenDaysAgo)
      .not('status', 'in', '(joined,dropped)')
      .order('assigned_at', { ascending: true });

    if (page && limit) {
      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);
    return { items: data || [], total: count || 0, page, limit };
  }

  async listAcademicCoordinators() {
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) return [];

    // Fetch users who have the academic_coordinator role from Supabase auth metadata
    const { data: { users }, error } = await adminClient.auth.admin.listUsers();
    if (error) throw new Error(error.message);

    return (users || [])
      .filter(u => {
        const role = u.app_metadata?.role || u.user_metadata?.role;
        return role === 'academic_coordinator';
      })
      .map(u => ({
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.name || u.user_metadata?.full_name || u.email
      }));
  }

  async listCounselors() {
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) return [];

    const { data: { users }, error } = await adminClient.auth.admin.listUsers();
    if (error) throw new Error(error.message);

    const counselorAuthUsers = (users || []).filter(u => {
      const role = u.app_metadata?.role || u.user_metadata?.role;
      return role === 'counselor';
    });

    // Enrich with full_name from users DB table
    const ids = counselorAuthUsers.map(u => u.id);
    let dbNameMap = {};
    if (ids.length) {
      const { data: dbUsers } = await adminClient
        .from('users')
        .select('id, full_name')
        .in('id', ids);
      (dbUsers || []).forEach(u => { if (u.full_name) dbNameMap[u.id] = u.full_name; });
    }

    return counselorAuthUsers.map(u => ({
      id: u.id,
      email: u.email,
      full_name: dbNameMap[u.id] || u.user_metadata?.name || u.user_metadata?.full_name || u.email
    }));
  }

  async convertToStudent(leadId, acUserId, actor) {
    const adminClient = getSupabaseAdminClient();

    if (!isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'only counselor head or super admin can assign leads to academic coordinators' };
    }

    if (!acUserId) return { error: 'ac_user_id is required' };

    if (!adminClient) {
      return { error: 'database not configured' };
    }

    // Fetch the lead
    const { data: lead, error: leadError } = await adminClient
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .is('deleted_at', null)
      .maybeSingle();

    if (leadError) throw new Error(leadError.message);
    if (!lead) return null;
    if (lead.status !== 'joined') return { error: 'lead must be in joined status to assign to AC' };

    // Check if student record already exists for this lead
    const { data: existingStudent } = await adminClient
      .from('students')
      .select('id')
      .eq('lead_id', leadId)
      .maybeSingle();

    let student;
    if (existingStudent) {
      // Update existing student's AC
      const { data: updated, error: updateError } = await adminClient
        .from('students')
        .update({ academic_coordinator_id: acUserId, updated_at: nowIso() })
        .eq('id', existingStudent.id)
        .select('*')
        .single();
      if (updateError) throw new Error(updateError.message);
      student = updated;
    } else {
      // Generate student code: e.g. FB02601397
      const MONTH_CODES = ['JA', 'FB', 'MR', 'AP', 'MY', 'JN', 'JL', 'AG', 'SP', 'OC', 'NV', 'DC'];
      const now = new Date();
      const monthCode = MONTH_CODES[now.getMonth()];
      const yearCode = String(now.getFullYear()).slice(-2);

      // Get the current max sequential number
      const { count: totalStudents } = await adminClient
        .from('students')
        .select('*', { count: 'exact', head: true });
      const seq = (totalStudents || 0) + 1;
      const studentCode = `${monthCode}0${yearCode}0${seq}`;

      // Create new student record from lead data
      const { data: created, error: createError } = await adminClient
        .from('students')
        .insert({
          lead_id: leadId,
          academic_coordinator_id: acUserId,
          counselor_id: lead.counselor_id || null,
          student_name: lead.student_name,
          student_code: studentCode,
          parent_name: lead.parent_name || null,
          country_code: lead.country_code || null,
          contact_number: lead.contact_number || null,
          class_level: lead.class_level || null,
          subject: lead.subject || null,
          package_name: lead.package_name || null,
          source: lead.source || null,
          status: 'active',
          joined_at: nowIso(),
          total_hours: 0,
          remaining_hours: 0,
          created_at: nowIso(),
          updated_at: nowIso()
        })
        .select('*')
        .single();
      if (createError) throw new Error(createError.message);
      student = created;
    }

    // Log in lead timeline
    await adminClient.from('lead_status_history').insert({
      lead_id: leadId,
      from_status: 'joined',
      to_status: 'joined',
      changed_by: actor.userId,
      reason: `Assigned to Academic Coordinator and converted to student`
    });

    await safeAuditInsert(
      'lead.assign_ac',
      'lead',
      leadId,
      actor.userId,
      lead,
      { ...lead, academic_coordinator_id: acUserId },
      'Assigned to Academic Coordinator'
    );

    return { student, lead };
  }

  async bulkConvertToStudents(leadIds, acUserId, actor) {
    if (!isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'only counselor head or super admin can bulk assign' };
    }
    if (!Array.isArray(leadIds) || !leadIds.length) return { error: 'lead_ids array is required' };
    if (!acUserId) return { error: 'ac_user_id is required' };

    let successCount = 0;
    const errors = [];
    for (const id of leadIds) {
      try {
        const result = await this.convertToStudent(id, acUserId, actor);
        if (result?.error) { errors.push(`${id}: ${result.error}`); }
        else { successCount++; }
      } catch (err) { errors.push(`${id}: ${err.message}`); }
    }
    return { count: successCount, errors };
  }
}
