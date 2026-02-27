import { ROLES } from './roles.js';

export const APP_PAGES = [
  /* ── Dashboards ── */
  { path: '/dashboard/tc', title: 'TC Dashboard', group: 'Dashboards', roles: [ROLES.TEACHER_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/dashboard/super-admin', title: 'Super Admin Dashboard', group: 'Dashboards', roles: [ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/dashboard/counselor', title: 'Counselor Dashboard', group: 'Dashboards', roles: [ROLES.COUNSELOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/dashboard/counselor-head', title: 'Counselor Head Dashboard', group: 'Dashboards', roles: [ROLES.COUNSELOR_HEAD, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/dashboard/academic-coordinator', title: 'AC Dashboard', group: 'Dashboards', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },

  /* ── Leads ── */
  { path: '/leads/today', title: 'Today Leads', group: 'Sales', roles: [ROLES.COUNSELOR_HEAD, ROLES.COUNSELOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/leads/all', title: 'All Leads', group: 'Sales', roles: [ROLES.COUNSELOR_HEAD, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/leads/mine', title: 'My Leads', group: 'Sales', roles: [ROLES.COUNSELOR], showInNav: true },
  { path: '/leads/details', title: 'Lead Details', group: 'Sales', roles: [ROLES.COUNSELOR, ROLES.COUNSELOR_HEAD, ROLES.SUPER_ADMIN], showInNav: false },
  { path: '/leads/demo-management', title: 'Demo Management', group: 'Sales', roles: [ROLES.COUNSELOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/team/counselors', title: 'Counselors (Team)', group: 'Sales', roles: [ROLES.COUNSELOR_HEAD], showInNav: true },
  { path: '/counselors/reports', title: 'Sales Reports', group: 'Sales', roles: [ROLES.COUNSELOR_HEAD, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/requests', title: 'Requests', group: 'Sales', roles: [ROLES.COUNSELOR, ROLES.COUNSELOR_HEAD], showInNav: true },
  { path: '/leads/payment-requests', title: 'Payment Requests', group: 'Sales', roles: [ROLES.COUNSELOR, ROLES.COUNSELOR_HEAD, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/leads/overdue', title: 'Overdue Leads', group: 'Sales', roles: [ROLES.COUNSELOR_HEAD, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/leads/converted', title: 'Converted Leads', group: 'Sales', roles: [ROLES.COUNSELOR_HEAD, ROLES.SUPER_ADMIN], showInNav: true },

  /* ── Academics (Students/Teachers) ── */
  { path: '/students/hub', title: 'Students', group: 'Academics', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/students/today', title: 'Today Classes', group: 'Academics', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/sessions/manage', title: 'All Sessions', group: 'Academics', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/sessions/verifications', title: 'Verifications', group: 'Academics', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/sessions/verification-queue', title: 'Session Queue', group: 'Academics', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: false },
  { path: '/sessions/logs', title: 'Session Logs', group: 'Academics', roles: [ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/teachers/pool', title: 'Teacher Pool', group: 'Academics', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.COUNSELOR, ROLES.TEACHER_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/topups/manage', title: 'Top-Ups', group: 'Academics', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/automation/hub', title: 'Automation', group: 'Academics', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/manage/subjects', title: 'Subjects & Boards', group: 'Academics', roles: [ROLES.ACADEMIC_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },

  /* ── Teacher Coordinator ── */
  { path: '/tc/leads', title: 'All Leads', group: 'Academics', roles: [ROLES.TEACHER_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/tc/teacher-leads', title: 'Leads Pipeline', group: 'Academics', roles: [ROLES.TEACHER_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },

  { path: '/tc/performance', title: 'Teacher Performance', group: 'Academics', roles: [ROLES.TEACHER_COORDINATOR, ROLES.SUPER_ADMIN], showInNav: true },

  /* ── Teacher (Individual) ── */
  { path: '/dashboard/teacher', title: 'Dashboard', group: 'Dashboards', roles: [ROLES.TEACHER], showInNav: true },
  { path: '/teacher/today-sessions', title: 'Today Sessions', group: 'Operations', roles: [ROLES.TEACHER], showInNav: true },
  { path: '/teacher/timetable', title: 'My Timetable', group: 'Operations', roles: [ROLES.TEACHER], showInNav: true },
  { path: '/teacher/profile', title: 'My Profile', group: 'Operations', roles: [ROLES.TEACHER], showInNav: true },
  { path: '/teacher/reports', title: 'Reports', group: 'Operations', roles: [ROLES.TEACHER], showInNav: true },
  { path: '/teacher/invoices', title: 'Invoices', group: 'Finance', roles: [ROLES.TEACHER], showInNav: true },
  { path: '/teachers/profile', title: 'Teacher Profile', group: 'Academics', roles: [ROLES.TEACHER_COORDINATOR, ROLES.ACADEMIC_COORDINATOR, ROLES.FINANCE, ROLES.TEACHER, ROLES.SUPER_ADMIN], showInNav: false },

  /* ── Finance ── */
  { path: '/dashboard/finance', title: 'Finance Dashboard', group: 'Dashboards', roles: [ROLES.FINANCE, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/finance/income', title: 'Income', group: 'Finance', roles: [ROLES.FINANCE, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/finance/expenses', title: 'Expenses', group: 'Finance', roles: [ROLES.FINANCE, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/finance/accounts', title: 'Accounts', group: 'Finance', roles: [ROLES.FINANCE, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/finance/parties', title: 'Parties', group: 'Finance', roles: [ROLES.FINANCE, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/finance/payroll', title: 'Payroll', group: 'Finance', roles: [ROLES.FINANCE, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/finance/payment-verification', title: 'Payment Verification', group: 'Finance', roles: [ROLES.FINANCE, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/finance/reports', title: 'Reports', group: 'Finance', roles: [ROLES.FINANCE, ROLES.SUPER_ADMIN], showInNav: true },

  /* ── HR ── */
  { path: '/dashboard/hr', title: 'HR Dashboard', group: 'Dashboards', roles: [ROLES.HR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/hr/attendance', title: 'Attendance', group: 'HR', roles: [ROLES.HR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/hr/employees', title: 'Employees', group: 'HR', roles: [ROLES.HR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/hr/salary', title: 'Salary Calculator', group: 'HR', roles: [ROLES.HR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/hr/payroll', title: 'Payroll', group: 'HR', roles: [ROLES.HR, ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/hr/payment-requests', title: 'Payment Requests', group: 'HR', roles: [ROLES.HR, ROLES.SUPER_ADMIN], showInNav: true },

  /* ── System ── */
  { path: '/admin/users', title: 'User Management', group: 'System', roles: [ROLES.SUPER_ADMIN], showInNav: true },
  { path: '/admin/settings', title: 'Settings', group: 'System', roles: [ROLES.SUPER_ADMIN], showInNav: true }
];

export function pagesForRole(role) {
  return APP_PAGES.filter((page) => page.roles.includes(role));
}

export function defaultPageForRole(role) {
  return pagesForRole(role).find((page) => page.showInNav !== false) || null;
}

export function getPageByPath(path, role) {
  return pagesForRole(role).find((page) => page.path === path) || null;
}
