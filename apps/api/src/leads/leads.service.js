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

  async list({ scope, actor }) {
    const adminClient = getSupabaseAdminClient();

    if (!isCounselor(actor) && !isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'lead access is not allowed for this role' };
    }

    const resolvedScope = isCounselor(actor) ? 'mine' : scope;

    if (!adminClient) {
      const base = memoryLeads.filter((lead) => !lead.deleted_at);
      return resolvedScope === 'mine'
        ? base.filter((lead) => lead.counselor_id === actor.userId)
        : base;
    }

    let query = adminClient
      .from('leads')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (resolvedScope === 'mine') {
      query = query.eq('counselor_id', actor.userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
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
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    if (!canAccessLead(actor, data)) return { error: 'not allowed to access this lead' };
    return data;
  }

  async create(payload, actor) {
    const adminClient = getSupabaseAdminClient();
    if (!isCounselorHead(actor) && !isSuperAdmin(actor)) {
      return { error: 'only counselor head or super admin can create leads' };
    }

    const counselorId = payload.counselor_id || null;

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

    const editable = ['student_name', 'parent_name', 'class_level', 'subject', 'contact_number', 'email', 'status'];

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
      lead.status = 'payment_pending';
      lead.updated_at = nowIso();
      return {
        id: randomUUID(),
        lead_id: id,
        requested_by: actor.userId,
        amount,
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
        screenshot_url: payload.screenshot_url || null,
        status: 'pending'
      })
      .select('*')
      .single();
    if (requestError) throw new Error(requestError.message);

    const { data: updated, error: updateError } = await adminClient
      .from('leads')
      .update({ status: 'payment_pending', owner_stage: 'finance', updated_at: nowIso() })
      .eq('id', id)
      .select('*')
      .single();
    if (updateError) throw new Error(updateError.message);

    await adminClient.from('lead_status_history').insert({
      lead_id: id,
      from_status: current.status,
      to_status: 'payment_pending',
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
      .update({ counselor_id: counselorUserId, updated_at: nowIso() })
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
      .update({ counselor_id: counselorId, updated_at: nowIso() })
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
}
