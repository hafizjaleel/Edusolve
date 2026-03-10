
import { getSupabaseAdminClient } from '../config/supabase.js';

/**
 * Role-based ticket routing: which roles can each role send tickets to.
 */
const TICKET_ROUTING = {
    counselor: ['counselor_head', 'hr', 'super_admin'],
    teacher: ['teacher_coordinator', 'hr', 'super_admin'],
    counselor_head: ['hr', 'super_admin'],
    teacher_coordinator: ['hr', 'super_admin'],
    academic_coordinator: ['teacher_coordinator', 'hr', 'super_admin'],
    hr: ['super_admin'],
    finance: ['hr', 'super_admin'],
    super_admin: []
};

/**
 * Roles that can VIEW and RESPOND to tickets targeted at them.
 */
const RESPONDER_ROLES = ['counselor_head', 'teacher_coordinator', 'hr', 'super_admin'];

export class TicketsService {
    constructor() {
        this.admin = getSupabaseAdminClient();
    }

    /* ─── Routing helpers ─── */

    getTargetRolesForRole(role) {
        return TICKET_ROUTING[role] || [];
    }

    canSendTo(senderRole, targetRole) {
        const allowed = TICKET_ROUTING[senderRole] || [];
        return allowed.includes(targetRole);
    }

    canRespondTo(role) {
        return RESPONDER_ROLES.includes(role);
    }

    /* ─── Tickets CRUD ─── */

    async list(role, userId, { page = 1, limit = 20, status, priority, category, scope, search } = {}) {
        if (!this.admin) return { error: 'Admin client not available' };

        let query;

        if (scope === 'assigned') {
            // Tickets targeted at this user's role
            query = this.admin.from('tickets').select('*', { count: 'exact' }).eq('target_role', role);
        } else if (scope === 'mine') {
            // Tickets created by this user
            query = this.admin.from('tickets').select('*', { count: 'exact' }).eq('created_by', userId);
        } else {
            // Default: show both (own + assigned)
            // For super_admin, show all tickets
            if (role === 'super_admin') {
                query = this.admin.from('tickets').select('*', { count: 'exact' });
            } else {
                query = this.admin.from('tickets').select('*', { count: 'exact' })
                    .or(`created_by.eq.${userId},target_role.eq.${role}`);
            }
        }

        // Filters
        if (status && status !== 'all') query = query.eq('status', status);
        if (priority && priority !== 'all') query = query.eq('priority', priority);
        if (category && category !== 'all') query = query.eq('category', category);
        if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

        query = query.order('created_at', { ascending: false });

        if (page && limit) {
            const from = (page - 1) * limit;
            query = query.range(from, from + limit - 1);
        }

        const { data: tickets, count, error } = await query;
        if (error) return { error: error.message };
        if (!tickets || !tickets.length) return { items: [], total: count || 0, page, limit };

        // Get creator details — try public users table first, fallback to auth.users
        const creatorIds = [...new Set(tickets.map(t => t.created_by).filter(Boolean))];
        const { data: users } = await this.admin.from('users').select('id, full_name, email').in('id', creatorIds);
        const allUsers = [...(users || [])];

        // Get roles from user_roles + roles
        let roleMap = {};
        if (creatorIds.length > 0) {
            const { data: userRoles } = await this.admin
                .from('user_roles')
                .select('user_id, roles(code)')
                .in('user_id', creatorIds);
            if (userRoles) {
                userRoles.forEach(ur => {
                    const code = Array.isArray(ur.roles) ? ur.roles[0]?.code : ur.roles?.code;
                    if (code) roleMap[ur.user_id] = code;
                });
            }
        }

        // Fallback: look up any missing users from auth.users
        const foundIds = new Set(allUsers.map(u => u.id));
        const missingIds = creatorIds.filter(id => !foundIds.has(id));
        for (const id of missingIds) {
            try {
                const { data } = await this.admin.auth.admin.getUserById(id);
                if (data?.user) {
                    allUsers.push({
                        id: data.user.id,
                        full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
                        email: data.user.email || '',
                        role: data.user.app_metadata?.role || data.user.user_metadata?.role
                    });
                }
            } catch (e) { /* skip */ }
        }

        const userMap = allUsers.reduce((acc, u) => {
            u.role = u.role || roleMap[u.id] || 'unknown';
            acc[u.id] = u;
            return acc;
        }, {});

        // Get message counts per ticket
        const ticketIds = tickets.map(t => t.id);
        let countMap = {};
        try {
            const { data: allMsgs } = await this.admin
                .from('ticket_messages')
                .select('ticket_id')
                .in('ticket_id', ticketIds);
            if (allMsgs) {
                allMsgs.forEach(m => {
                    countMap[m.ticket_id] = (countMap[m.ticket_id] || 0) + 1;
                });
            }
        } catch (e) {
            // Ignore if messages table isn't ready
        }

        const items = tickets.map(t => ({
            ...t,
            creator: userMap[t.created_by] || { full_name: 'Unknown', email: '' },
            message_count: countMap[t.id] || 0
        }));

        return { items, total: count || 0, page, limit };
    }

    async getById(ticketId, userId, role) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { data: ticket, error } = await this.admin
            .from('tickets')
            .select('*')
            .eq('id', ticketId)
            .single();

        if (error) return { error: error.message };

        // Check access: creator or target role or super_admin
        if (ticket.created_by !== userId && ticket.target_role !== role && role !== 'super_admin') {
            return { error: 'Forbidden' };
        }

        // Get creator info — try public users, fallback to auth
        let { data: creator } = await this.admin.from('users').select('id, full_name, email').eq('id', ticket.created_by).single();

        // Get creator role
        let creatorRole = 'unknown';
        const { data: userRole } = await this.admin.from('user_roles').select('roles(code)').eq('user_id', ticket.created_by).limit(1).maybeSingle();
        if (userRole) {
            creatorRole = Array.isArray(userRole.roles) ? userRole.roles[0]?.code : userRole.roles?.code;
        }

        if (!creator) {
            try {
                const { data } = await this.admin.auth.admin.getUserById(ticket.created_by);
                if (data?.user) {
                    creator = {
                        id: data.user.id,
                        full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
                        email: data.user.email || ''
                    };
                    if (creatorRole === 'unknown') {
                        creatorRole = data.user.app_metadata?.role || data.user.user_metadata?.role || 'unknown';
                    }
                }
            } catch (e) { /* skip */ }
        }
        if (creator) creator.role = creatorRole || 'unknown';

        // Get messages with sender info
        const { data: messages } = await this.admin
            .from('ticket_messages')
            .select('*')
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });

        // Get sender details for messages
        // Get senders — try public users, fallback to auth
        const senderIds = [...new Set((messages || []).map(m => m.sender_id).filter(Boolean))];
        let senderMap = {};
        if (senderIds.length) {
            const { data: senders } = await this.admin.from('users').select('id, full_name, email').in('id', senderIds);
            const allSenders = [...(senders || [])];

            let sRoleMap = {};
            const { data: senderRoles } = await this.admin
                .from('user_roles')
                .select('user_id, roles(code)')
                .in('user_id', senderIds);
            if (senderRoles) {
                senderRoles.forEach(ur => {
                    const code = Array.isArray(ur.roles) ? ur.roles[0]?.code : ur.roles?.code;
                    if (code) sRoleMap[ur.user_id] = code;
                });
            }

            const foundIds = new Set(allSenders.map(u => u.id));
            const missingIds = senderIds.filter(id => !foundIds.has(id));

            for (const id of missingIds) {
                try {
                    const { data } = await this.admin.auth.admin.getUserById(id);
                    if (data?.user) {
                        allSenders.push({
                            id: data.user.id,
                            full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
                            email: data.user.email || '',
                            role: data.user.app_metadata?.role || data.user.user_metadata?.role
                        });
                    }
                } catch (e) { /* skip */ }
            }

            senderMap = allSenders.reduce((acc, u) => {
                u.role = u.role || sRoleMap[u.id] || 'unknown';
                acc[u.id] = u;
                return acc;
            }, {});
        }

        const enrichedMessages = (messages || []).map(m => ({
            ...m,
            sender: senderMap[m.sender_id] || { full_name: 'Unknown', email: '' }
        }));

        // Get attachments
        const { data: attachments } = await this.admin
            .from('ticket_attachments')
            .select('*')
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });

        return {
            ticket: { ...ticket, creator: creator || {} },
            messages: enrichedMessages,
            attachments: attachments || []
        };
    }

    async create(userId, role, payload) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { title, description, target_role, target_user_id, priority, category } = payload;

        if (!this.canSendTo(role, target_role)) {
            return { error: `You cannot send tickets to ${target_role}` };
        }

        const { data, error } = await this.admin
            .from('tickets')
            .insert({
                title,
                description,
                created_by: userId,
                target_role,
                priority: priority || 'medium',
                category: category || null,
                status: 'open'
            })
            .select()
            .single();

        if (error) return { error: error.message };

        // If a specific target_user_id is provided, notify ONLY them. Otherwise, notify entire role.
        if (target_user_id) {
            await this._notifyUser(target_user_id, {
                title: 'New Ticket Submitted',
                message: `${payload.creatorName || 'A staff member'} submitted a ${priority || 'medium'} priority ticket: "${title}"`,
                type: 'ticket',
                reference_id: data.id
            });
        } else {
            // Create notifications for all users with the target role
            await this._notifyRole(target_role, {
                title: 'New Ticket Submitted',
                message: `${payload.creatorName || 'A staff member'} submitted a ${priority || 'medium'} priority ticket: "${title}"`,
                type: 'ticket',
                reference_id: data.id
            });
        }

        return data;
    }

    async updateStatus(ticketId, userId, role, status, resolution_note) {
        if (!this.admin) return { error: 'Admin client not available' };

        // Verify the user's role matches the target role or they created it
        const { data: ticket, error: fetchErr } = await this.admin
            .from('tickets').select('target_role, created_by, title').eq('id', ticketId).single();
        if (fetchErr) return { error: fetchErr.message };

        if (ticket.target_role !== role && ticket.created_by !== userId) {
            return { error: 'Only the assigned authority or creator can update ticket status' };
        }

        const updates = { status, updated_at: new Date().toISOString() };
        if (status === 'resolved' || status === 'closed') {
            updates.resolved_at = new Date().toISOString();
            if (resolution_note) updates.resolution_note = resolution_note;
        }

        const { data, error } = await this.admin
            .from('tickets')
            .update(updates)
            .eq('id', ticketId)
            .select()
            .single();

        if (error) return { error: error.message };

        // Notify the creator
        await this._notifyUser(ticket.created_by, {
            title: `Ticket Status Updated: ${status.replace(/_/g, ' ')}`,
            message: `Your ticket "${ticket.title}" has been updated to "${status.replace(/_/g, ' ')}"`,
            type: 'ticket',
            reference_id: ticketId
        });

        return data;
    }

    /* ─── Messages (Conversation Thread) ─── */

    async addMessage(ticketId, userId, role, message) {
        if (!this.admin) return { error: 'Admin client not available' };

        // Verify access - only creator or assigned target can reply
        const { data: ticket, error: fetchErr } = await this.admin
            .from('tickets').select('created_by, target_role, title').eq('id', ticketId).single();
        if (fetchErr) return { error: fetchErr.message };

        if (ticket.created_by !== userId && ticket.target_role !== role) {
            return { error: 'Forbidden. Only the creator or the assigned department can reply to a ticket.' };
        }

        const { data, error } = await this.admin
            .from('ticket_messages')
            .insert({ ticket_id: ticketId, sender_id: userId, message })
            .select()
            .single();

        if (error) return { error: error.message };

        // Update ticket updated_at
        await this.admin.from('tickets').update({ updated_at: new Date().toISOString() }).eq('id', ticketId);

        // Notify the other party
        if (ticket.created_by === userId) {
            // Creator replied → notify target role
            await this._notifyRole(ticket.target_role, {
                title: 'New Reply on Ticket',
                message: `New reply on ticket: "${ticket.title}"`,
                type: 'ticket',
                reference_id: ticketId
            });
        } else {
            // Responder replied → notify creator
            await this._notifyUser(ticket.created_by, {
                title: 'New Reply on Your Ticket',
                message: `You received a reply on your ticket: "${ticket.title}"`,
                type: 'ticket',
                reference_id: ticketId
            });
        }

        // Get sender info for response
        const { data: sender } = await this.admin.from('users').select('id, full_name, email').eq('id', userId).single();

        return { ...data, sender: sender || {} };
    }

    /* ─── Notifications ─── */

    async getNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
        if (!this.admin) return { error: 'Admin client not available' };

        let query = this.admin
            .from('notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (unreadOnly) query = query.eq('is_read', false);

        if (page && limit) {
            const from = (page - 1) * limit;
            query = query.range(from, from + limit - 1);
        }

        const { data, count, error } = await query;
        if (error) return { error: error.message };

        return { items: data || [], total: count || 0, page, limit };
    }

    async getUnreadCount(userId) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { count, error } = await this.admin
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) return { error: error.message };
        return { count: count || 0 };
    }

    async markAsRead(notificationId, userId) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { error } = await this.admin
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .eq('user_id', userId);

        if (error) return { error: error.message };
        return { ok: true };
    }

    async deleteNotification(notificationId, userId) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { error } = await this.admin
            .from('notifications')
            .delete()
            .eq('id', notificationId)
            .eq('user_id', userId);

        if (error) return { error: error.message };
        return { ok: true };
    }

    async markAllAsRead(userId) {
        if (!this.admin) return { error: 'Admin client not available' };

        const { error } = await this.admin
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) return { error: error.message };
        return { ok: true };
    }

    /* ─── Stats ─── */

    async getStats(role, userId) {
        if (!this.admin) return { error: 'Admin client not available' };

        // Get counts by status for tickets relevant to this user
        let query;
        if (role === 'super_admin') {
            query = this.admin.from('tickets').select('status');
        } else {
            query = this.admin.from('tickets').select('status')
                .or(`created_by.eq.${userId},target_role.eq.${role}`);
        }

        const { data, error } = await query;
        if (error) return { error: error.message };

        const stats = { open: 0, in_progress: 0, waiting_for_response: 0, resolved: 0, closed: 0, total: 0 };
        (data || []).forEach(t => {
            stats[t.status] = (stats[t.status] || 0) + 1;
            stats.total++;
        });

        return stats;
    }

    /* ─── Private helpers ─── */

    async _notifyRole(targetRole, notification) {
        try {
            // Roles are in user_roles + roles tables, not a column on users
            const { data: roleRow } = await this.admin
                .from('roles')
                .select('id')
                .eq('code', targetRole)
                .single();

            if (!roleRow) return;

            const { data: userRoles } = await this.admin
                .from('user_roles')
                .select('user_id')
                .eq('role_id', roleRow.id);

            if (!userRoles || !userRoles.length) return;

            const rows = userRoles.map(ur => ({
                user_id: ur.user_id,
                ...notification
            }));

            await this.admin.from('notifications').insert(rows);
        } catch (e) {
            console.error('Failed to send notifications:', e.message);
        }
    }

    async _notifyUser(userId, notification) {
        try {
            await this.admin.from('notifications').insert({
                user_id: userId,
                ...notification
            });
        } catch (e) {
            console.error('Failed to send notification:', e.message);
        }
    }
}
