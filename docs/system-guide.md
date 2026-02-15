# EHMS – System Guide

> **Education Hub Management System** — An internal operations platform managing the entire education business lifecycle: lead acquisition → demo → conversion → verified sessions → payroll.

---

## 1. Mission & Problem

### The Problem
Education hubs struggle with scattered lead tracking, manual demo coordination, miscommunication between counselor and coordinator, unverified session claims, payroll disputes, financial inconsistencies, and no clear ownership transitions.

### The Mission
A role-driven, audit-safe system that tracks every action, separates ownership clearly, verifies sessions before payment, and prevents destructive financial edits.

### Target Audience
**Internal team only** (7 roles). Students do **not** have login access.

---

## 2. Architecture

### Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend** | Next.js 15 + React 19 | Client-side hash routing, role-based UI shell (`apps/web`, port 5173) |
| **Backend** | Node.js (ESM) | Vanilla HTTP server — no Express/NestJS (`apps/api`, port 4000) |
| **Database** | PostgreSQL via Supabase | RLS-enabled, 20+ tables, immutable finance ledger |
| **Auth** | Supabase Auth | JWT claims → role mapping, dev fallback mode |
| **Automation** | n8n | Waappa broadcast orchestration, payroll reminders, retry/escalation |
| **Queue** | Planned: BullMQ | For fast internal async jobs |

### Monorepo Structure
```
/
├── apps/
│   ├── web/                # Next.js frontend
│   │   ├── app/            # Next.js App Router entry (wraps src/App.jsx)
│   │   └── src/
│   │       ├── auth/       # LoginPage
│   │       ├── components/ # AppShell, PageView
│   │       ├── features/   # leads, dashboards, finance, academic, teachers
│   │       └── lib/        # auth, routes, roles
│   └── api/                # Node.js backend
│       └── src/
│           ├── auth/       # Auth controller
│           ├── leads/      # Lead CRUD + lifecycle
│           ├── students/   # Student management
│           ├── teachers/   # Teacher management
│           ├── sessions/   # Session verification
│           ├── finance/    # Ledger, payroll
│           ├── dashboard/  # Dashboard stats
│           ├── common/     # sendJson, readJson, getBearerToken
│           └── config/     # Environment config
├── supabase/
│   └── migrations/         # 5 SQL migration files
├── n8n/
│   └── workflows/          # n8n workflow exports (planned)
└── docs/                   # This documentation
```

### Design Principles
- **n8n orchestrates**, but critical writes go through secured backend APIs
- **Soft delete** for operational entities (`deleted_at`, `deleted_by`, `delete_reason`)
- **Finance records are immutable** — corrections use reversal/adjustment entries
- **Timezone**: Store UTC, render in Asia/Kolkata
- **Every sensitive action** emits an audit log with before/after snapshots

---

## 3. User Roles & Access

| Role | Primary Responsibility | Key Access | Restrictions |
|------|----------------------|------------|-------------|
| **Super Admin** | System oversight | All dashboards, User mgmt, Audit logs | Read-only operations — cannot modify leads, students, finance, sessions |
| **Counselor Head** | Monitor counselors | All leads, Counselor performance, Intervention | No academic modification, No finance approval |
| **Counselor** | Lead management | Add/Edit own leads, Broadcast demo, Select teacher, Initiate payment | No access after ownership transfer |
| **Teacher Coordinator** | Teacher recruitment | Add teacher leads, Conduct interviews, Approve into pool | No student access |
| **Academic Coordinator** | Student management | Assign teachers, Timetable, Verify sessions, Adjust hours | Cannot edit finance ledger |
| **Teacher** | Session delivery | Assigned students only, Mark sessions, Homework/marks, Availability | Cannot view financial data |
| **Finance** | Financial control | Approve payments, Record income/expenses, Approve payroll | Cannot edit academic records |

### Ownership Transfer Model
| Stage | Owner | Next |
|-------|-------|------|
| Lead | Counselor | → |
| Payment Pending | Finance | → |
| Student Active | Academic Coordinator | — |
| Session Marking | Teacher | → |
| Session Verification | Academic Coordinator | → |
| Payroll | Finance | — |

**No overlap. No ambiguity.** Counselor becomes read-only after ownership transfer.

---

## 4. Core Business Flows

### Lead Lifecycle
```
New → Demo Scheduled → Demo Done → Payment Pending → Joined → (becomes Student)
                                                    ↘ Dropped
```

1. **Counselor** adds lead and broadcasts demo request to teacher pool
2. **Teacher** responds → Counselor selects → Demo scheduled and marked complete
3. **Counselor** initiates payment request
4. **Finance** verifies payment → Student created → Ownership transferred to Academic Coordinator

### Session Verification
1. **Teacher** marks session complete
2. **Academic Coordinator** verifies (approve/reject)
3. If approved: Student hours debited + Teacher hours credited
4. If rejected: Teacher notified + Manual adjustment allowed
5. **No automatic credit without verification**

### Payroll Cycle
1. System aggregates verified teacher hours
2. **Finance** approves payroll cycle
3. Payroll marked paid (can be reopened by Finance only)
4. Demo hours are unpaid unless student converts

### Teacher Recruitment
1. **Teacher Coordinator** adds teacher as lead → conducts interview
2. Status: Applied → Interviewed → Selected → Rejected
3. Only "Selected" teachers enter the pool (available for demo broadcast + assignment)

### Top-Up Flow
1. **Academic Coordinator** adds top-up with screenshot
2. **Finance** verifies payment
3. Hours credited to student

---

## 5. Database Schema

### Enums

| Enum | Values |
|------|--------|
| `lead_status` | new, demo_scheduled, demo_done, payment_pending, joined, dropped |
| `interview_status` | applied, interviewed, selected, rejected |
| `session_status` | completed, missed, rescheduled |
| `verification_status` | pending, approved, rejected |
| `student_status` | active, vacation, dropped, completed |
| `payroll_status` | draft, approved, paid, reopened |
| `owner_stage` | counselor, finance, academic |
| `ledger_type` | income, expense, payout, adjustment, reversal |

### Tables

#### Users & Roles
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `roles` | code, name | 7 system roles |
| `users` | id (UUID from Auth), full_name, email, is_active | User accounts |
| `user_roles` | user_id, role_id | Many-to-many mapping |

#### Leads & Demo
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `leads` | counselor_id, student_name, status, owner_stage, joined_student_id, soft-delete fields | Lead records |
| `lead_status_history` | lead_id, from_status, to_status, changed_by, reason | Audit trail |
| `demo_requests` | lead_id, broadcasted_by, scheduled_at, status | Broadcast to teacher pool |
| `demo_teacher_responses` | demo_request_id, teacher_id, response | Teacher replies |
| `demo_sessions` | lead_id, teacher_id, scheduled_at, completed_at, outcome | Demo tracking |
| `payment_requests` | lead_id, amount, screenshot_url, status, finance_note | Conversion payments |

#### Teachers
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `teacher_profiles` | user_id, teacher_code, per_hour_rate, is_in_pool | Pool & billing |
| `teacher_interviews` | teacher_profile_id, status, interviewer_id, notes | Recruitment pipeline |
| `teacher_availability` | teacher_profile_id, day_of_week, start_time, end_time | Weekly slots |

#### Students & Sessions
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `students` | lead_id, academic_coordinator_id, student_code, total_hours, remaining_hours, status | Student records |
| `student_topups` | student_id, hours_added, amount, payment_verified, screenshot_url, status | Hour purchases |
| `academic_sessions` | student_id, teacher_id, session_date, duration_hours, status, homework, marks | Session records |
| `session_verifications` | session_id, verifier_id, status, reason | Approval/rejection |
| `hour_ledger` | student_id, teacher_id, session_id, hours_delta, entry_type | Hours debit/credit |

#### Finance & Payroll
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `ledger_entries` | entry_date, entry_type, amount, currency (INR), reference_type/id, posted_by | **Immutable** financial records |
| `expenses` | expense_date, category, amount, created_by | Operational expenses |
| `invoices` | student_id, invoice_number, amount, due_date, status | Invoice tracking |
| `payroll_monthly_cycles` | year, month, start_date, end_date, status, approved_by | Monthly payroll |
| `payroll_items` | cycle_id, teacher_id, verified_hours, rate_per_hour, amount, adjustment_amount | Per-teacher items |

#### Governance
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `ownership_transfers` | entity_type, entity_id, from_stage, to_stage, transferred_by | Ownership audit trail |
| `audit_logs` | actor_id, action, entity_type/id, before_data, after_data (JSONB) | Full action snapshots |
| `integration_logs` | provider, event_type, external_id, payload, status | External API events |
| `idempotency_keys` | key, scope, response_hash | Duplicate prevention |

### RLS Policies (Applied)
- `leads`: authenticated read (non-deleted), insert (any auth), update (owner only)
- `lead_status_history`: authenticated read
- `demo_requests`: authenticated read + insert
- `audit_logs`: authenticated read-only

---

## 6. Frontend Pages & Navigation

### Navigation Groups

| Group | Pages | Roles |
|-------|-------|-------|
| **Dashboards** | Counselor, Counselor Head, Teacher Coordinator, Academic Coordinator, Teacher, Finance, Super Admin | One per role |
| **Operations** | All Leads, My Leads, Lead Details, Demo Management, Students Hub, Student List/Profile, Timetable, Session History, Top-Ups, Teachers Hub, Teacher Pool/Profile, Availability, Interviews, Session Verification Queue, Session Logs | Mixed |
| **Finance** | Ledger, Income, Expenses, Payroll Cycles, Invoices, Payroll Reconciliation | Finance, Super Admin |
| **Communication** | Waappa Campaigns, Waappa Delivery Logs | Counselor, Coordinators, Finance |
| **Governance** | Approvals Inbox, Ownership Timeline, Notifications, Global Search, Recycle Bin, Audit Logs | Mixed/Admin |
| **Admin** | User Management, Role Permissions, Settings, Import/Export, Monitoring | Super Admin |

### Implementation Status

**Already Implemented:**
- [x] Auth: Login (role-based)
- [x] Role-aware UI shell and module navigation
- [x] Leads: All Leads, My Leads, Lead Details edit, soft delete, demo request
- [x] Supabase-ready auth path with dev fallback mode
- [x] Counselor Dashboard, Counselor Head Dashboard
- [x] Students Hub, Teachers Hub, Teacher Profile
- [x] Finance Income page

**Planned / Pending:**
- [ ] Global Search
- [ ] Notifications Center
- [ ] Approvals Inbox
- [ ] Recycle Bin / Restore
- [ ] Data Import/Export
- [ ] Waappa Campaigns & Delivery Logs
- [ ] Payroll Reconciliation View
- [ ] Settings (package templates, status dictionary, reason codes)
- [ ] Error Monitoring View
- [ ] Reports (monthly conversion, dropout, teacher utilization, AR aging)

---

## 7. Integrations

### Waappa (WhatsApp)
- API/webhook connector module in backend
- n8n orchestrates campaign/broadcast and retries
- Integration logs capture queued/sent/delivered/failed events

### n8n Workflows (Planned)
1. Waappa broadcast orchestration
2. Waappa delivery retry/escalation
3. Monthly payroll pre-close reminders (Asia/Kolkata)

---

## 8. Roadmap

| Phase | Features |
|-------|----------|
| **MVP** | Lead lifecycle, Demo broadcast, Conversion flow, Session verification, Manual finance approval |
| **V1** | Payroll automation, Ledger-based accounting, Expense module, Teacher performance metrics |
| **V2** | Analytics dashboards, Conversion heatmaps, Teacher efficiency, AI-based teacher match |
| **Future** | Multi-branch, Regional payroll rules, Commission auto-calc, AI demo predictor, WhatsApp API, Parent portal |

---

## 9. Security & Compliance
- Role-based access control with Supabase RLS
- Audit logging with before/after JSONB snapshots
- Immutable finance (reversal entries only)
- No destructive updates on posted records
- Super Admin = read-only oversight
- Multi-year data retention
- Owner-based checks for handoffs (Counselor → Finance → Academic)
