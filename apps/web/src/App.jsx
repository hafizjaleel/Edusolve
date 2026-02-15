'use client';

import { useEffect, useMemo, useState } from 'react';
import LoginPage from './auth/LoginPage.jsx';
import AppShell from './components/AppShell.jsx';
import PageView from './components/PageView.jsx';
import {
  AllLeadsPage,
  DemoManagementPage,
  LeadDetailsPage,
  MyLeadsPage
} from './features/leads/LeadsPages.jsx';
import { TodayLeadsPage } from './features/leads/TodayLeadsPage.jsx';
import {
  CounselorDashboardPage,
  CounselorHeadDashboardPage
} from './features/dashboards/CounselorDashboards.jsx';
import { SuperAdminDashboardPage } from './features/dashboards/SuperAdminDashboard.jsx';
import { FinanceDashboardPage, IncomeManagementPage, ExpenseManagementPage, AccountsPage, PartiesPage, PayrollPage, RequestsVerificationPage, FinanceReportsPage, PaymentVerificationPage } from './features/finance/FinancePages.jsx';
import { UsersPage, SystemSettingsPage } from './features/system/SystemPages.jsx';
import {
  AcademicCoordinatorDashboardPage,
  StudentsHubPage,
  WeeklyCalendarPage,
  TodayClassesPage,
  SessionsManagePage,
  TopUpsPage,
  TeacherPoolPage,
  AutomationPage
} from './features/academic/AcademicPages.jsx';
import { CounselorTeamPage } from './features/counselors/CounselorPages.jsx';
import { CounselorReportsPage } from './features/counselors/CounselorReportsPage.jsx';
import { CounselorRequestsPage } from './features/requests/CounselorRequestsPage.jsx';
import { VerificationQueuePage, SessionLogsPage } from './features/sessions/SessionPages.jsx';
import { TeacherProfilePage } from './features/teachers/TeacherPages.jsx';
import { TCDashboardPage, TeacherLeadsPage, TCTeacherPoolPage, TeacherPerformancePage } from './features/teachers/TeacherCoordinatorPages.jsx';
import { TeacherDashboardPage, TeacherTodaySessionsPage, TeacherTimetablePage, TeacherMyProfilePage, TeacherReportsPage, TeacherInvoicesPage } from './features/teachers/TeacherDashboardPages.jsx';
import { getSession, logout } from './lib/auth.js';
import { defaultPageForRole, getPageByPath, pagesForRole } from './lib/routes.js';
import { ROLE_OPTIONS } from './lib/roles.js';

function roleLabel(role) {
  return ROLE_OPTIONS.find((item) => item.value === role)?.label || role;
}

function currentPathFromHash() {
  if (typeof window === 'undefined') return '';
  const hash = window.location.hash || '';
  return hash.startsWith('#') ? hash.slice(1) : '';
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activePath, setActivePath] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedTeacherProfileId, setSelectedTeacherProfileId] = useState('');

  useEffect(() => {
    const session = getSession();
    if (!session?.user?.role) return;

    const sessionUser = session.user;
    setUser(sessionUser);

    const hashPath = currentPathFromHash();
    const matchingPage = getPageByPath(hashPath, sessionUser.role);
    const defaultPage = defaultPageForRole(sessionUser.role);
    const nextPath = matchingPage?.path || defaultPage?.path || '';
    setActivePath(nextPath);
    if (nextPath) window.location.hash = nextPath;
  }, []);

  useEffect(() => {
    function onHashChange() {
      if (!user?.role) return;
      const hashPath = currentPathFromHash();
      const page = getPageByPath(hashPath, user.role);
      if (page) setActivePath(page.path);
    }

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [user]);

  const role = user?.role || null;
  const pages = useMemo(() => (role ? pagesForRole(role) : []), [role]);
  const page = useMemo(() => (role ? getPageByPath(activePath, role) : null), [activePath, role]);

  function onLoginSuccess(nextUser) {
    setUser(nextUser);
    const defaultPage = defaultPageForRole(nextUser.role);
    if (!defaultPage) return;
    setActivePath(defaultPage.path);
    window.location.hash = defaultPage.path;
  }

  function onNavigate(path) {
    setActivePath(path);
    window.location.hash = path;
  }

  function onLogout() {
    logout();
    setUser(null);
    setActivePath('');
    setSelectedLeadId('');
    setSelectedTeacherProfileId('');
    window.location.hash = '';
  }

  function openLeadDetails(leadId) {
    setSelectedLeadId(leadId);
    onNavigate('/leads/details');
  }

  function openTeacherProfile(teacherProfileId) {
    setSelectedTeacherProfileId(teacherProfileId);
    onNavigate('/teachers/profile');
  }

  function renderPage() {
    if (!page) return null;

    /* Dashboards */
    if (page.path === '/dashboard/counselor') return <CounselorDashboardPage />;
    if (page.path === '/dashboard/counselor-head') return <CounselorHeadDashboardPage />;
    if (page.path === '/dashboard/academic-coordinator') return <AcademicCoordinatorDashboardPage />;

    /* Leads */
    if (page.path === '/leads/all') return <AllLeadsPage onOpenDetails={openLeadDetails} selectedLeadId={selectedLeadId} />;
    if (page.path === '/leads/today') return <TodayLeadsPage onOpenDetails={openLeadDetails} role={role} />;
    if (page.path === '/leads/mine') return <MyLeadsPage onOpenDetails={openLeadDetails} />;
    if (page.path === '/leads/details') return <LeadDetailsPage leadId={selectedLeadId} />;
    if (page.path === '/leads/demo-management') return <DemoManagementPage leadId={selectedLeadId} />;

    /* Students */
    if (page.path === '/students/hub') return <StudentsHubPage role={role} />;

    /* Calendar */
    if (page.path === '/students/calendar') return <WeeklyCalendarPage />;

    /* Today Classes */
    if (page.path === '/students/today') return <TodayClassesPage />;

    /* Sessions (AC merged page) */
    if (page.path === '/sessions/manage') return <SessionsManagePage />;

    /* Sessions (non-AC standalone pages) */
    if (page.path === '/sessions/verification-queue') return <VerificationQueuePage />;
    if (page.path === '/sessions/logs') return <SessionLogsPage />;

    /* Teacher Pool (AC) */
    if (page.path === '/teachers/pool') return <TeacherPoolPage />;

    /* Team (Counselor Head) */
    if (page.path === '/team/counselors') return <CounselorTeamPage />;
    if (page.path === '/counselors/reports') return <CounselorReportsPage />;

    /* Requests */
    if (page.path === '/requests') return <CounselorRequestsPage role={role} onOpenLeadDetails={openLeadDetails} />;

    /* Teacher Profile (shared view) */
    if (page.path === '/teachers/profile') return <TeacherProfilePage teacherProfileId={selectedTeacherProfileId} />;

    /* Teacher Pages */
    if (page.path === '/dashboard/teacher') return <TeacherDashboardPage />;
    if (page.path === '/teacher/today-sessions') return <TeacherTodaySessionsPage />;
    if (page.path === '/teacher/timetable') return <TeacherTimetablePage />;
    if (page.path === '/teacher/profile') return <TeacherMyProfilePage />;
    if (page.path === '/teacher/reports') return <TeacherReportsPage />;
    if (page.path === '/teacher/invoices') return <TeacherInvoicesPage />;

    /* Teacher Coordinator */
    if (page.path === '/dashboard/tc') return <TCDashboardPage />;
    if (page.path === '/tc/teacher-leads') return <TeacherLeadsPage />;
    if (page.path === '/tc/teacher-pool') return <TeacherPoolPage />;
    if (page.path === '/tc/performance') return <TeacherPerformancePage />;

    /* Top-Ups */
    if (page.path === '/topups/manage') return <TopUpsPage />;

    /* Automation */
    if (page.path === '/automation/hub') return <AutomationPage />;

    /* Finance */
    if (page.path === '/dashboard/finance') return <FinanceDashboardPage />;
    if (page.path === '/finance/income') return <IncomeManagementPage />;
    if (page.path === '/finance/expenses') return <ExpenseManagementPage />;
    if (page.path === '/finance/accounts') return <AccountsPage />;
    if (page.path === '/finance/parties') return <PartiesPage />;
    if (page.path === '/finance/payroll') return <PayrollPage />;
    if (page.path === '/finance/payment-verification') return <PaymentVerificationPage />;
    if (page.path === '/finance/reports') return <FinanceReportsPage />;

    /* Super Admin & System */
    if (page.path === '/dashboard/super-admin') return <SuperAdminDashboardPage />;
    if (page.path === '/admin/users') return <UsersPage />;
    if (page.path === '/admin/settings') return <SystemSettingsPage />;

    return <PageView page={page} role={roleLabel(role)} />;
  }

  if (!role) {
    return <LoginPage onSuccess={onLoginSuccess} />;
  }

  if (!page) {
    return <LoginPage onSuccess={onLoginSuccess} />;
  }

  return (
    <AppShell
      role={role}
      roleLabel={roleLabel(role)}
      pages={pages}
      activePath={page.path}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {renderPage()}
    </AppShell>
  );
}
