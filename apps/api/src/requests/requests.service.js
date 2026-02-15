
import { getSupabaseAdminClient } from '../config/supabase.js';
import { randomUUID } from 'crypto';

export class RequestsService {
    constructor() {
        this.admin = getSupabaseAdminClient();
    }

    // Helper to ensure table exists (simple migration)
    async ensureTable() {
        if (!this.admin) return;
        // Check if table exists by trying to select from it
        const { error } = await this.admin.from('requests').select('id').limit(1);
        if (error && error.code === '42P01') { // undefined_table
            // Create table via SQL is not directly possible with JS client unless using rpc
            // We'll rely on the user or manual setup, or try to use a function if available.
            // For now, we assume the table needs to be created. 
            // IMPROVEMENT: We can Return a specific error to the controller to tell the user to run SQL.
            console.error('Table "requests" does not exist. Please run migration.');
        }
    }

    async list(role, userId) {
        if (!this.admin) return { error: 'Admin client not available' };

        let query = this.admin
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });

        // Counselors only see their own
        if (role === 'counselor') {
            query = query.eq('counselor_id', userId);
        }

        const { data: requests, error } = await query;
        if (error) return { error: error.message };

        // Manual join to get counselor and lead details
        if (!requests.length) return [];

        const counselorIds = [...new Set(requests.map(r => r.counselor_id).filter(Boolean))];
        const leadIds = [...new Set(requests.map(r => r.lead_id).filter(Boolean))];

        const [usersResult, leadsResult] = await Promise.all([
            this.admin.from('users').select('id, full_name, email').in('id', counselorIds),
            leadIds.length ? this.admin.from('leads').select('id, student_name').in('id', leadIds) : { data: [] }
        ]);

        if (usersResult.error) return { error: usersResult.error.message };

        const userMap = (usersResult.data || []).reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        const leadMap = (leadsResult.data || []).reduce((acc, lead) => {
            acc[lead.id] = lead;
            return acc;
        }, {});

        return requests.map(r => ({
            ...r,
            counselor: userMap[r.counselor_id] || { full_name: 'Unknown', email: '' },
            lead: leadMap[r.lead_id] || null
        }));
    }

    async create(userId, payload) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { subject, description } = payload;

        const { data, error } = await this.admin
            .from('requests')
            .insert({
                counselor_id: userId,
                subject,
                description,
                lead_id: payload.lead_id || null, // Optional lead link
                status: 'open'
            })
            .select()
            .single();

        if (error) return { error: error.message };
        return data;
    }

    async updateStatus(id, status, resolution_note) {
        if (!this.admin) return { error: 'Admin client not available' };

        const updates = { status };
        if (status === 'closed') {
            updates.resolved_at = new Date().toISOString();
            if (resolution_note) updates.resolution_note = resolution_note;
        }

        const { data, error } = await this.admin
            .from('requests')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) return { error: error.message };
        return data;
    }
    async update(id, payload) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { subject, description, lead_id } = payload;

        const { data, error } = await this.admin
            .from('requests')
            .update({ subject, description, lead_id })
            .eq('id', id)
            .select()
            .single();

        if (error) return { error: error.message };
        return data;
    }

    async delete(id) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { error } = await this.admin
            .from('requests')
            .delete()
            .eq('id', id);

        if (error) return { error: error.message };
        return { ok: true };
    }
}
