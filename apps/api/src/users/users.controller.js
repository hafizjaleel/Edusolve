import { getSupabaseAdminClient } from '../config/supabase.js';
import { readJson, sendJson } from '../common/http.js';
import { ROLES } from '../common/roles.js';

export async function handleUsers(req, res) {
    if (!req.url.startsWith('/admin/users')) return false;

    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
        sendJson(res, 500, { ok: false, error: 'Database configuration missing' });
        return true;
    }

    // 1. Check permissions (Super Admin only)
    const role = req.headers['x-user-role'];
    if (role !== ROLES.SUPER_ADMIN) {
        sendJson(res, 403, { ok: false, error: 'Super Admin access required' });
        return true;
    }

    try {
        // GET /admin/users - List users
        if (req.method === 'GET') {
            const { data: { users }, error } = await adminClient.auth.admin.listUsers();
            if (error) throw error;

            // Fetch fallback roles from DB just in case metadata is empty
            const { data: dbRoles } = await adminClient.from('user_roles').select('user_id, roles(code)');
            const dbRoleMap = new Map();
            (dbRoles || []).forEach(r => {
                const code = Array.isArray(r.roles) ? r.roles[0]?.code : r.roles?.code;
                if (code) dbRoleMap.set(r.user_id, code);
            });

            // Transform to cleaner format
            const safeUsers = users.map(u => {
                let role = u.app_metadata?.role || u.user_metadata?.role;
                // Fallback to DB role if metadata is missing
                if (!role || role === 'unknown') {
                    role = dbRoleMap.get(u.id) || 'unknown';
                }

                return {
                    id: u.id,
                    email: u.email,
                    role: role,
                    name: u.user_metadata?.name || '',
                    phone: u.user_metadata?.phone || '',
                    last_sign_in_at: u.last_sign_in_at,
                    created_at: u.created_at
                };
            });

            sendJson(res, 200, { ok: true, items: safeUsers });
            return true;
        }

        if (req.method === 'POST') {
            const body = await readJson(req);
            const { email, password, role, name, phone } = body;

            if (!email || !password || !role || !name || !phone) {
                sendJson(res, 400, { ok: false, error: 'Email, password, role, name, and phone are required' });
                return true;
            }

            const { data, error } = await adminClient.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { role, name, phone }
            });

            if (error) throw error;

            // Auto-add to employees table (for HR attendance/salary) — skip teachers and super_admin
            const skipRoles = ['super_admin', 'teacher'];
            if (!skipRoles.includes(role)) {
              const deptMap = {
                counselor_head: 'Sales', counselor: 'Sales',
                academic_coordinator: 'Academics', teacher_coordinator: 'Academics',
                finance: 'Finance', hr: 'HR'
              };
              await adminClient.from('employees').insert({
                user_id: data.user.id,
                full_name: name || email,
                email: email,
                phone: phone,
                designation: role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                department: deptMap[role] || 'General',
                employee_type: 'staff',
                is_active: true,
                joined_date: new Date().toISOString().slice(0, 10)
              }).catch(() => { /* ignore if employees table doesn't exist yet */ });
            }

            sendJson(res, 201, { ok: true, user: data.user });
            return true;
        }

        // PATCH /admin/users/:id - Update user
        if (req.method === 'PATCH') {
            const id = req.url.split('/').pop();
            const body = await readJson(req);
            const { role, password, name } = body;

            const updates = { user_metadata: { ...body.user_metadata } };
            if (role) updates.user_metadata.role = role;
            if (name) updates.user_metadata.name = name;
            if (password) updates.password = password;

            const { data, error } = await adminClient.auth.admin.updateUserById(id, updates);
            if (error) throw error;

            sendJson(res, 200, { ok: true, user: data.user });
            return true;
        }

        // DELETE /admin/users/:id - Delete user
        if (req.method === 'DELETE') {
            const id = req.url.split('/').pop();
            const { error } = await adminClient.auth.admin.deleteUser(id);
            if (error) throw error;

            sendJson(res, 200, { ok: true, message: 'User deleted' });
            return true;
        }

    } catch (err) {
        console.error('User Management Error:', err);
        sendJson(res, 500, { ok: false, error: err.message });
        return true;
    }

    return false;
}
