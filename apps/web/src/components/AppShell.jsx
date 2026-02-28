import { useMemo, useState } from 'react';

function nowInKolkata() {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  }).format(new Date());
}

export default function AppShell({ roleLabel, role, pages, activePath, onNavigate, onLogout, children }) {
  const navPages = useMemo(() => pages.filter((page) => page.showInNav !== false), [pages]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              {groupPages.map((page) => (
                <button
                  key={page.path}
                  type="button"
                  className={activePath === page.path ? 'nav-link active' : 'nav-link'}
                  onClick={() => {
                    onNavigate(page.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  {page.title}
                </button>
              ))}
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
            <span className="timestamp">IST: {nowInKolkata()}</span>
            <button type="button" className="secondary" onClick={onLogout}>Logout</button>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
