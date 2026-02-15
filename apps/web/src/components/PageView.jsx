export default function PageView({ page, role }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">{page.group}</p>
          <h2>{page.title}</h2>
          <p>This module is under development and will be available soon.</p>
        </div>
        <span className="status-tag">Coming Soon</span>
      </div>

      <article className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</p>
        <h3>Under Development</h3>
        <p style={{ color: 'var(--slate)', marginTop: '8px' }}>
          We're building this feature. Check back soon for updates.
        </p>
      </article>
    </section>
  );
}
