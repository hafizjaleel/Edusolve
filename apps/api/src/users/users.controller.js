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

    // 1. Check permissions (Super Admin or HR)
    const role = req.headers['x-user-role'];
    if (role !== ROLES.SUPER_ADMIN && role !== ROLES.HR) {
        sendJson(res, 403, { ok: false, error: 'Unauthorized access' });
        return true;
    }

    try {
        // GET /admin/users/employees - Fast lookup for active sidebar dashboards
        if (req.method === 'GET' && req.url === '/admin/users/employees') {
            // Join users with user_roles to get name and role code
            const { data, error } = await adminClient
                .from('user_roles')
                .select('user_id, roles(code), users(full_name)');
                
            if (error) throw error;
            
            const staff = (data || []).map(r => ({
                id: r.user_id,
                name: r.users?.full_name || 'Unknown',
                role: Array.isArray(r.roles) ? r.roles[0]?.code : r.roles?.code
            })).filter(u => u.role && u.role !== 'student' && u.role !== 'parent');
            
            sendJson(res, 200, { ok: true, items: staff });
            return true;
        }

        // GET /admin/users - List users
        if (req.method === 'GET' && req.url === '/admin/users') {
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

                // Ensure public users row exists (employees FK references users.id)
                await adminClient.from('users').upsert({
                    id: data.user.id,
                    full_name: name || email,
                    email: email,
                    phone: phone
                }, { onConflict: 'id' });

                const { error: empError } = await adminClient.from('employees').insert({
                    user_id: data.user.id,
                    full_name: name || email,
                    email: email,
                    phone: phone,
                    designation: role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    department: deptMap[role] || 'General',
                    employee_type: 'staff',
                    is_active: true,
                    joined_date: new Date().toISOString().slice(0, 10)
                });
                if (empError) console.error('Failed to auto-add employee:', empError.message);
            }

            // For teachers: auto-create public users row + teacher_profiles row
            // so they appear in the Teacher Directory immediately
            if (role === 'teacher') {
                // 1. Upsert public users row (teacher_profiles FK references users.id)
                await adminClient.from('users').upsert({
                    id: data.user.id,
                    full_name: name || email,
                    email: email,
                    phone: phone
                }, { onConflict: 'id' });

                // 2. Generate a unique teacher code (TCR000001, TCR000002, …)
                const { data: existingCodes } = await adminClient
                    .from('teacher_profiles')
                    .select('teacher_code')
                    .not('teacher_code', 'is', null)
                    .order('created_at', { ascending: false })
                    .limit(200);

                let maxNum = 0;
                for (const row of existingCodes || []) {
                    const num = Number((row.teacher_code || '').replace(/^TCR/i, ''));
                    if (Number.isFinite(num) && num > maxNum) maxNum = num;
                }
                const teacherCode = `TCR${String(maxNum + 1).padStart(6, '0')}`;

                // 3. Insert a minimal teacher_profiles row
                const now = new Date().toISOString();
                const { error: tpError } = await adminClient.from('teacher_profiles').insert({
                    user_id: data.user.id,
                    teacher_code: teacherCode,
                    is_in_pool: false,
                    onboarding_completed: false,
                    created_at: now,
                    updated_at: now
                });
                if (tpError) console.error('Failed to auto-create teacher_profiles row:', tpError.message);
            }

            sendJson(res, 201, { ok: true, user: data.user });
            return true;
        }

        // PATCH /admin/users/:id - Update user
        if (req.method === 'PATCH') {
            const id = req.url.split('/').pop();
            const body = await readJson(req);
            const { role, password, name, phone } = body;

            const updates = { user_metadata: { ...body.user_metadata } };
            if (role) updates.user_metadata.role = role;
            if (name) updates.user_metadata.name = name;
            if (phone) updates.user_metadata.phone = phone;
            if (password) updates.password = password;

            const { data, error } = await adminClient.auth.admin.updateUserById(id, updates);
            if (error) throw error;

            // Also update the public users row if phone or name changed
            const publicUpdate = {};
            if (name) publicUpdate.full_name = name;
            if (phone) publicUpdate.phone = phone;
            if (Object.keys(publicUpdate).length > 0) {
                await adminClient.from('users').update(publicUpdate).eq('id', id);
                // Also update employees table phone/name if record exists
                if (phone) await adminClient.from('employees').update({ phone }).eq('user_id', id);
                if (name) await adminClient.from('employees').update({ full_name: name }).eq('user_id', id);
            }

            sendJson(res, 200, { ok: true, user: data.user });
            return true;
        }

        // DELETE /admin/users/:id - Delete user
        if (req.method === 'DELETE') {
            const id = req.url.split('/').pop();

            // Clean up related records first to avoid FK constraint errors
            // Delete owned records
            try { await adminClient.from('employees').delete().eq('user_id', id); } catch (_) { }
            try { await adminClient.from('user_roles').delete().eq('user_id', id); } catch (_) { }
            try { await adminClient.from('teacher_profiles').delete().eq('user_id', id); } catch (_) { }

            // Nullify FK references in other tables
            try { await adminClient.from('teacher_leads').update({ coordinator_id: null }).eq('coordinator_id', id); } catch (_) { }
            try { await adminClient.from('teacher_lead_history').update({ changed_by: null }).eq('changed_by', id); } catch (_) { }
            try { await adminClient.from('requests').update({ counselor_id: null }).eq('counselor_id', id); } catch (_) { }
            try { await adminClient.from('accounts').update({ created_by: null }).eq('created_by', id); } catch (_) { }
            try { await adminClient.from('parties').update({ created_by: null }).eq('created_by', id); } catch (_) { }

            // Delete public users row last (other tables may FK to it too)
            try { await adminClient.from('users').delete().eq('id', id); } catch (_) { }

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
