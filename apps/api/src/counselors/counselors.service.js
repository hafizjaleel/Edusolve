
import { getSupabaseAdminClient } from '../config/supabase.js';
import { randomUUID } from 'crypto';

export class CounselorsService {
    constructor() {
        this.admin = getSupabaseAdminClient();
    }

    // List all counselors with their profiles using the admin client
    async list() {
        if (!this.admin) return { error: 'Admin client not available' };

        // 1. Get role ID for 'counselor'
        const { data: roleData, error: roleError } = await this.admin
            .from('roles')
            .select('id')
            .eq('code', 'counselor')
            .single();

        if (roleError || !roleData) return { error: 'Counselor role not found' };

        // 2. Get users who have this role
        const { data: userRoles, error: urError } = await this.admin
            .from('user_roles')
            .select('user_id')
            .eq('role_id', roleData.id);

        if (urError) return { error: urError.message };

        const userIds = userRoles.map(ur => ur.user_id);

        if (userIds.length === 0) return [];

        // 3. Get user profiles
        const { data: users, error: userError } = await this.admin
            .from('users')
            .select('*')
            .in('id', userIds)
            .order('full_name');

        if (userError) return { error: userError.message };

        // 4. Enrich with stats (optional, could be separate query for performance)
        // For now, just return profiles.
        return users;
    }

    // Create a new counselor
    async create(payload) {
        if (!this.admin) return { error: 'Admin client not available' };
        const { email, password, full_name } = payload;

        // 1. Create Auth User
        const { data: authData, error: authError } = await this.admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name, role: 'counselor' },
            app_metadata: { role: 'counselor' }
        });

        if (authError) return { error: authError.message };
        const user = authData.user;

        // 2. Create Profile in 'users' table
        const { error: profileError } = await this.admin
            .from('users')
            .insert({
                id: user.id,
                email: user.email,
                full_name: full_name || email.split('@')[0],
                is_active: true
            });

        if (profileError) {
            // Cleanup auth user if profile fails? 
            // ideally transaction, but for now just error out
            return { error: 'Failed to create profile: ' + profileError.message };
        }

        // 3. Assign Role in 'user_roles'
        const { data: roleData } = await this.admin.from('roles').select('id').eq('code', 'counselor').single();
        if (roleData) {
            await this.admin.from('user_roles').insert({ user_id: user.id, role_id: roleData.id });
        }

        return user;
    }

    // Update counselor status (active/inactive)
    async updateStatus(id, isActive) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { data, error } = await this.admin
            .from('users')
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single();

        if (error) return { error: error.message };
        return data;
    }

    // Get aggregated stats for all counselors
    async getStats({ from, to } = {}) {
        if (!this.admin) return { error: 'Admin client not available' };

        // Get all leads to aggregate
        // Note: large dataset in future might need SQL grouping/view
        let query = this.admin
            .from('leads')
            .select('counselor_id, status, created_at');

        if (from) query = query.gte('created_at', from);
        if (to) query = query.lte('created_at', to);

        const { data: leads, error } = await query;

        if (error) return { error: error.message };

        const stats = {}; // counselor_id -> { total, active, joined, dropped }

        for (const lead of leads) {
            const cid = lead.counselor_id || 'unassigned';
            if (!stats[cid]) stats[cid] = { total: 0, active: 0, joined: 0, dropped: 0 };

            stats[cid].total++;
            if (['joined'].includes(lead.status)) stats[cid].joined++;
            else if (['dropped'].includes(lead.status)) stats[cid].dropped++;
            else stats[cid].active++;
        }

        return stats;
    }
}
