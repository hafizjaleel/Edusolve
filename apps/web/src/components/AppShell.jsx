import { useMemo, useState, useEffect } from 'react';
import { NotificationBell } from './NotificationBell.jsx';
import { apiFetch } from '../lib/api.js';

// Simple set of generic SVG icons for the bottom nav
function NavIcon({ path, active }) {
  const p = path.toLowerCase();

  if (p.includes('dashboard') || p.includes('hub')) {
    // Dashboard / Home icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9"></rect>
        <rect x="14" y="3" width="7" height="5"></rect>
        <rect x="14" y="12" width="7" height="9"></rect>
        <rect x="3" y="16" width="7" height="5"></rect>
      </svg>
    );
  } else if (p.includes('timetable') || p.includes('calendar')) {
    // Timetable / Calendar icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    );
  } else if (p.includes('today-sessions') || p.includes('today')) {
    // Today Sessions / Clock icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    );
  } else if (p.includes('profile')) {
    // Profile / User icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    );
  } else if (p.includes('finance') || p.includes('invoices') || p.includes('salary') || p.includes('reports')) {
    // Finance / Reports icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    );
  } else if (p.includes('leads') || p.includes('students')) {
    // Students / Users group icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    );
  } else {
    // Default list icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
    );
  }
}

function nowInKolkata() {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  }).format(new Date());
}

export default function AppShell({ roleLabel, role, pages, activePath, onNavigate, onLogout, onNavigateToTicket, children }) {
  const navPages = useMemo(() => pages.filter((page) => page.showInNav !== false), [pages]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedNav, setExpandedNav] = useState({});
  const [employeesByRole, setEmployeesByRole] = useState({});

  useEffect(() => {
    if (role === 'super_admin') {
      apiFetch('/admin/users/employees').then(res => {
        if (res.ok && res.items) {
          const grouped = {};
          res.items.forEach(emp => {
            if (!grouped[emp.role]) grouped[emp.role] = [];
            grouped[emp.role].push(emp);
          });
          setEmployeesByRole(grouped);
        }
      }).catch(err => console.error('Failed to fetch employees for sidebar', err));
    }
  }, [role]);

  const toggleNav = (path, e) => {
    e.stopPropagation();
    setExpandedNav(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const grouped = useMemo(() => {
    const map = new Map();
    for (const page of navPages) {
      if (!map.has(page.group)) map.set(page.group, []);
      map.get(page.group).push(page);
    }
    return [...map.entries()];
  }, [navPages]);

  const activePage = pages.find((page) => page.path === activePath);

  // Take up to 4 items for the bottom nav
  const bottomNavPages = navPages.slice(0, 4);

  return (
    <div className="app-shell">
      <aside className={mobileMenuOpen ? 'sidebar mobile-open' : 'sidebar'}>
        <div className="brand-block">
          <h1>
            Edusolve
            <span className="role-badge-small">{roleLabel}</span>
          </h1>
        </div>

        <nav className="nav-groups" aria-label="Main navigation">
          {grouped.map(([group, groupPages]) => (
            <section key={group}>
              <h2>{group}</h2>
              {groupPages.map((page) => {
                let subItems = [];
                if (role === 'super_admin' && page.group === 'Dashboards') {
                  if (page.path === '/dashboard/counselor' || page.path === '/dashboard/counselor-head') subItems = employeesByRole['counselor'] || [];
                  if (page.path === '/dashboard/tc') subItems = employeesByRole['teacher_coordinator'] || [];
                  if (page.path === '/dashboard/academic-coordinator') subItems = employeesByRole['academic_coordinator'] || [];
                }

                const isActive = activePath === page.path && !window.location.hash.includes('?userId=');
                const isExpanded = expandedNav[page.path];

                return (
                  <div key={page.path} className="nav-item-wrap">
                    <div className={isActive ? 'nav-link active' : 'nav-link'} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        style={{ all: 'unset', flex: 1, cursor: 'pointer' }}
                        onClick={() => {
                          onNavigate(page.path);
                          if (subItems.length > 0 && !isExpanded) setExpandedNav(prev => ({ ...prev, [page.path]: true }));
                          setMobileMenuOpen(false);
                        }}
                      >
                        {page.title}
                      </button>
                      {subItems.length > 0 && (
                        <button type="button" onClick={(e) => toggleNav(page.path, e)} style={{ all: 'unset', cursor: 'pointer', padding: '0 8px', fontSize: '10px', color: '#6b7280' }}>
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      )}
                    </div>

                    {isExpanded && subItems.length > 0 && (
                      <div style={{ paddingLeft: '24px', margin: '4px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {subItems.map(emp => {
                          const empPath = `${page.path}?userId=${emp.id}`;
                          const isEmpActive = window.location.hash === `#${empPath}`;
                          return (
                            <button
                              key={emp.id}
                              type="button"
                              className={isEmpActive ? 'nav-link active' : 'nav-link'}
                              style={{ padding: '6px 12px', fontSize: '13px', background: isEmpActive ? '#c7dcfc' : 'transparent', color: isEmpActive ? '#1f4b8f' : 'inherit', borderTop: 'none', borderBottom: 'none' }}
                              onClick={() => {
                                onNavigate(empPath);
                                setMobileMenuOpen(false);
                              }}
                            >
                              ↳ {emp.full_name || emp.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
            <button type="button" className="secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onLogout}>Logout</button>
          </div>
        </nav>
      </aside>

      <div className="content-wrap">
        <header className="top-bar">
          <div className="top-bar-title-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <p className="eyebrow">{roleLabel}</p>
              <h2>{activePage?.title || 'Dashboard'}</h2>
            </div>
            <NotificationBell onNavigateToTicket={(ticketId) => onNavigateToTicket && onNavigateToTicket(ticketId)} />
          </div>
          {/* Timestamp moved below title on mobile */}
          <div className="top-bar-actions">
            <span className="timestamp" style={{ marginLeft: 'auto' }}>IST: {nowInKolkata()}</span>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>

      <nav className="bottom-nav">
        {bottomNavPages.map((page) => {
          const isActive = activePath === page.path;
          // Keep it short but clear: "My Timetable" -> "Timetable", "Today Sessions" -> "Today"
          let displayTitle = page.title.replace(/^My\s/i, '');
          if (displayTitle === 'Today Sessions') displayTitle = 'Today';

          return (
            <button
              key={page.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(page.path)}
            >
              <NavIcon path={page.path} active={isActive} />
              <span>{displayTitle}</span>
            </button>
          );
        })}
        <button
          className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span>More</span>
        </button>
      </nav>
    </div >
  );
}
