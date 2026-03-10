import { useMemo, useState, useEffect } from 'react';
import { NotificationBell } from './NotificationBell.jsx';
import { apiFetch } from '../lib/api.js';

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
                        <div style={{ paddingLeft: '24px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                                ↳ {emp.name}
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
          </nav>
        </aside>

        <div className="content-wrap">
        <header className="top-bar">
          <div>
            <p className="eyebrow">{roleLabel}</p>
            <h2>{activePage?.title || 'Dashboard'}</h2>
          </div>
          <div className="top-bar-actions">
            <button
              type="button"
              className="secondary menu-btn"
              onClick={() => setMobileMenuOpen((value) => !value)}
            >
              Menu
            </button>
            <NotificationBell onNavigateToTicket={(ticketId) => onNavigateToTicket && onNavigateToTicket(ticketId)} />
            <span className="timestamp">IST: {nowInKolkata()}</span>
            <button type="button" className="secondary" onClick={onLogout}>Logout</button>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
