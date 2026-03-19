import { useState, useRef, useEffect } from 'react';

/* ═══════════════════════════════════════════════
   COMPANY BRANDING HELPERS
═══════════════════════════════════════════════ */
const DEFAULT_BRANDING = {
  name: 'EduSolve Academy',
  tagline: 'Excellence in Education',
  address: 'Address Line 1, City, State - 000000',
  phone: '+91 00000 00000',
  email: 'contact@example.com',
  gst: '',
  logo: '',
};

export function getBranding() {
  try {
    const saved = localStorage.getItem('company_branding');
    return saved ? { ...DEFAULT_BRANDING, ...JSON.parse(saved) } : DEFAULT_BRANDING;
  } catch { return DEFAULT_BRANDING; }
}

export function saveBranding(data) {
  localStorage.setItem('company_branding', JSON.stringify(data));
}

/* ═══════════════════════════════════════════════
   COMPANY SETTINGS FORM
═══════════════════════════════════════════════ */
export function CompanyBrandingSettings() {
  const [form, setForm] = useState(getBranding());
  const [saved, setSaved] = useState(false);
  function upd(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function handleSave(e) {
    e.preventDefault();
    saveBranding(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  return (
    <div style={{ maxWidth: '500px' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Company Branding</h3>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
        This branding appears on all invoices, receipts, and pay slips.
      </p>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { label: 'Company Name *', key: 'name', type: 'text', required: true },
          { label: 'Tagline', key: 'tagline', type: 'text' },
          { label: 'Address', key: 'address', type: 'text' },
          { label: 'Phone', key: 'phone', type: 'text' },
          { label: 'Email', key: 'email', type: 'email' },
          { label: 'GST Number', key: 'gst', type: 'text' },
          { label: 'Logo URL (https://...)', key: 'logo', type: 'url' },
        ].map(f => (
          <label key={f.key} style={{ fontSize: '13px', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {f.label}
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => upd(f.key, e.target.value)}
              required={f.required}
              style={{ fontWeight: 400, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }}
            />
          </label>
        ))}
        <button type="submit" className="primary" style={{ alignSelf: 'flex-start', padding: '9px 20px', fontSize: '13px', fontWeight: 600 }}>
          {saved ? '✅ Saved!' : 'Save Branding'}
        </button>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GENERATE INVOICE MODAL (on-demand, before payment)
═══════════════════════════════════════════════ */
export function GenerateInvoiceModal({ onClose }) {
  const company = getBranding();
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadSearch, setLeadSearch] = useState('');
  const [form, setForm] = useState({
    subject: '',
    hours: '',
    ratePerHour: '',
    totalAmount: '',
    note: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [showPreview, setShowPreview] = useState(false);
  function upd(k, v) { setForm(f => ({ ...f, [k]: v })); }

  // Fetch counselor's assigned leads
  useEffect(() => {
    import('../../lib/api.js').then(({ apiFetch }) => {
      apiFetch('/leads?scope=my&limit=200')
        .then(res => setLeads((res.items || []).filter(l => !l.deleted_at)))
        .catch(() => {})
        .finally(() => setLeadsLoading(false));
    });
  }, []);

  const filteredLeads = leads.filter(l =>
    (l.student_name || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
    (l.contact_number || '').includes(leadSearch)
  );

  const docNumber = `INV-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  if (showPreview && selectedLead) {
    const items = [{
      description: `${form.subject || 'Tuition'} — ${form.hours || '?'} hrs`,
      hours: form.hours,
      amount: Number(form.totalAmount) || (Number(form.hours) * Number(form.ratePerHour)) || 0,
    }];
    return (
      <InvoicePrintModal
        type="invoice"
        status="unpaid"
        company={company}
        docNumber={docNumber}
        docDate={form.date}
        party={{ name: selectedLead.student_name, phone: selectedLead.contact_number }}
        items={items}
        total={items[0].amount}
        note={form.note}
        onClose={onClose}
      />
    );
  }

  const inputStyle = { fontWeight: 400, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' };
  const labelStyle = { fontSize: '13px', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '4px' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>📄 Generate Invoice</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b7280' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Lead Selector */}
          <label style={labelStyle}>
            Select Lead *
            {selectedLead ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', padding: '8px 12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{selectedLead.student_name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>📞 {selectedLead.contact_number} {selectedLead.subject ? `• ${selectedLead.subject}` : ''}</div>
                </div>
                <button type="button" onClick={() => { setSelectedLead(null); setLeadSearch(''); }}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                  style={inputStyle}
                />
                {leadSearch && (
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', maxHeight: '160px', overflowY: 'auto', marginTop: '4px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {leadsLoading ? (
                      <div style={{ padding: '12px', color: '#6b7280', fontSize: '13px' }}>Loading leads...</div>
                    ) : filteredLeads.length === 0 ? (
                      <div style={{ padding: '12px', color: '#9ca3af', fontSize: '13px' }}>No leads found</div>
                    ) : filteredLeads.slice(0, 10).map(l => (
                      <div
                        key={l.id}
                        onClick={() => { setSelectedLead(l); setLeadSearch(''); }}
                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <div style={{ fontWeight: 600 }}>{l.student_name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{l.contact_number} {l.subject ? `• ${l.subject}` : ''}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </label>

          {/* Auto-filled info (read-only) */}
          {selectedLead && (
            <div style={{ background: '#f9fafb', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', color: '#4b5563' }}>
              <div><strong>Student:</strong> {selectedLead.student_name}</div>
              <div><strong>Phone:</strong> {selectedLead.contact_number}</div>
              {selectedLead.subject && <div><strong>Subject:</strong> {selectedLead.subject}</div>}
            </div>
          )}

          {/* Invoice details */}
          <label style={labelStyle}>
            Subject / Package
            <input type="text" value={form.subject} onChange={e => upd('subject', e.target.value)}
              placeholder={selectedLead?.subject || 'e.g. Math — Standard Package'} style={inputStyle} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <label style={labelStyle}>
              Hours
              <input type="number" value={form.hours} onChange={e => upd('hours', e.target.value)} placeholder="e.g. 40" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Rate/Hour (₹)
              <input type="number" value={form.ratePerHour} onChange={e => upd('ratePerHour', e.target.value)} placeholder="e.g. 500" style={inputStyle} />
            </label>
          </div>
          <label style={labelStyle}>
            Total Amount (₹) *
            <input type="number" value={form.totalAmount} onChange={e => upd('totalAmount', e.target.value)}
              placeholder={form.hours && form.ratePerHour ? `Auto: ₹${Number(form.hours) * Number(form.ratePerHour)}` : 'Enter amount'} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Note (optional)
            <input type="text" value={form.note} onChange={e => upd('note', e.target.value)} placeholder="e.g. Includes study material" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Invoice Date
            <input type="date" value={form.date} onChange={e => upd('date', e.target.value)} style={inputStyle} />
          </label>
          <button
            className="primary"
            style={{ padding: '10px', fontWeight: 600, marginTop: '4px' }}
            disabled={!selectedLead || (!form.totalAmount && !(form.hours && form.ratePerHour))}
            onClick={() => setShowPreview(true)}
          >
            Preview &amp; Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   RECEIPT MODAL — from verified payment request
═══════════════════════════════════════════════ */
export function ReceiptModal({ payment, type = 'payment', onClose }) {
  const company = getBranding();
  const isTopup = type === 'topup';
  const studentName = isTopup
    ? (payment.students?.student_name || '—')
    : (payment.leads?.student_name || '—');
  const phone = isTopup
    ? (payment.students?.contact_number || '—')
    : (payment.leads?.contact_number || '—');

  const docNumber = `RCP-${new Date().getFullYear()}-${(payment.id || '').slice(0, 6).toUpperCase()}`;
  const items = [{
    description: isTopup
      ? `Top-Up — ${payment.hours_added || '?'} hrs`
      : `Onboarding Payment — ${payment.hours || '?'} hrs${payment.total_amount ? `, Package ₹${Number(payment.total_amount).toLocaleString('en-IN')}` : ''}`,
    hours: isTopup ? payment.hours_added : payment.hours,
    amount: Number(payment.amount || 0),
  }];

  return (
    <InvoicePrintModal
      type="receipt"
      status="paid"
      company={company}
      docNumber={docNumber}
      docDate={payment.created_at ? new Date(payment.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}
      paidDate={payment.updated_at ? new Date(payment.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null}
      party={{ name: studentName, phone }}
      items={items}
      total={Number(payment.total_amount || payment.amount || 0)}
      paidAmount={Number(payment.amount || 0)}
      note={payment.finance_note || ''}
      onClose={onClose}
    />
  );
}

/* ═══════════════════════════════════════════════
   PAYSLIP MODAL — from verified payroll request
═══════════════════════════════════════════════ */
export function PaySlipModal({ request, onClose }) {
  const company = getBranding();
  const name = request.target_type === 'teacher'
    ? (request.teacher_profiles?.users?.full_name || '—')
    : (request.employees?.full_name || '—');
  const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const period = `${MONTHS[request.month] || ''} ${request.year || ''}`;
  const docNumber = `PAY-${request.year || new Date().getFullYear()}-${String(request.month || '').padStart(2, '0')}-${(request.id || '').slice(0, 6).toUpperCase()}`;

  const breakdown = request.breakdown || {};
  const items = [
    { description: 'Base Salary / Calculated', amount: Number(breakdown.base_calculated || request.total_amount || 0) },
    ...(breakdown.adjustment ? [{ description: 'Adjustment', amount: Number(breakdown.adjustment) }] : []),
  ];

  return (
    <InvoicePrintModal
      type="payslip"
      status="paid"
      company={company}
      docNumber={docNumber}
      docDate={new Date().toISOString().slice(0, 10)}
      paidDate={request.updated_at ? new Date(request.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null}
      party={{ name, role: request.target_type === 'teacher' ? 'Teacher' : 'Employee', period }}
      items={items}
      total={Number(request.total_amount || 0)}
      paidAmount={Number(request.total_amount || 0)}
      onClose={onClose}
    />
  );
}

/* ═══════════════════════════════════════════════
   CORE PRINT MODAL — renders A4-style document
═══════════════════════════════════════════════ */
function InvoicePrintModal({ type, status, company, docNumber, docDate, paidDate, party, items, total, paidAmount, note, onClose }) {
  const printRef = useRef();

  function handlePrint() {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=800,height=900');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${docNumber}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; background: #fff; padding: 40px; }
          .doc { max-width: 720px; margin: auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #4338ca; padding-bottom: 20px; margin-bottom: 24px; }
          .company-name { font-size: 22px; font-weight: 800; color: #4338ca; }
          .company-sub { font-size: 12px; color: #6b7280; margin-top: 3px; }
          .doc-meta { text-align: right; }
          .doc-title { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: ${status === 'paid' ? '#15803d' : '#f59e0b'}; }
          .doc-num { font-size: 12px; color: #6b7280; margin-top: 4px; }
          .status-stamp { display: inline-block; border: 3px solid ${status === 'paid' ? '#15803d' : '#f59e0b'}; color: ${status === 'paid' ? '#15803d' : '#f59e0b'}; font-size: 28px; font-weight: 900; padding: 4px 16px; border-radius: 6px; transform: rotate(-8deg); letter-spacing: 3px; margin-top: 8px; }
          .party { background: #f9fafb; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; }
          .party h4 { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
          .party p { font-size: 14px; font-weight: 600; }
          .party span { font-size: 12px; color: #4b5563; font-weight: 400; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          thead th { background: #4338ca; color: white; padding: 10px 14px; text-align: left; font-size: 12px; }
          tbody td { padding: 10px 14px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
          .amount { text-align: right; font-weight: 600; }
          .totals { display: flex; justify-content: flex-end; margin-bottom: 24px; }
          .totals-box { width: 240px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
          .totals-row.total { font-size: 16px; font-weight: 800; color: #4338ca; border-top: 2px solid #4338ca; border-bottom: none; padding-top: 10px; }
          .note { font-size: 12px; color: #4b5563; padding: 10px 14px; background: #fef3c7; border-radius: 6px; margin-bottom: 20px; }
          .footer { border-top: 1px solid #e5e7eb; padding-top: 14px; text-align: center; font-size: 11px; color: #9ca3af; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="doc">${content}</div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }

  const docTitle = type === 'invoice' ? 'INVOICE' : type === 'receipt' ? 'RECEIPT' : 'PAY SLIP';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#f3f4f6', width: '100%', maxWidth: '780px', maxHeight: '92vh', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#1e1b4b', color: 'white' }}>
          <span style={{ fontWeight: 700, fontSize: '15px' }}>📄 {docTitle} Preview — {docNumber}</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{ background: '#4338ca', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              🖨 Print / Save as PDF
            </button>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
          <div ref={printRef} style={{ background: 'white', maxWidth: '720px', margin: '0 auto', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: "'Segoe UI', Arial, sans-serif" }}>

            {/* Header */}
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #4338ca', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                {company.logo && <img src={company.logo} alt="logo" style={{ height: '44px', marginBottom: '8px', display: 'block' }} />}
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#4338ca' }}>{company.name}</div>
                {company.tagline && <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{company.tagline}</div>}
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px', lineHeight: '1.6' }}>
                  {company.address && <div>{company.address}</div>}
                  {company.phone && <div>📞 {company.phone}</div>}
                  {company.email && <div>✉ {company.email}</div>}
                  {company.gst && <div>GST: {company.gst}</div>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '3px', color: status === 'paid' ? '#15803d' : '#f59e0b' }}>{docTitle}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{docNumber}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Date: {new Date(docDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                {paidDate && <div style={{ fontSize: '12px', color: '#6b7280' }}>Paid On: {paidDate}</div>}
                {/* Stamp */}
                <div style={{
                  display: 'inline-block', border: `3px solid ${status === 'paid' ? '#15803d' : '#f59e0b'}`,
                  color: status === 'paid' ? '#15803d' : '#f59e0b', fontSize: '18px', fontWeight: 900,
                  padding: '4px 14px', borderRadius: '6px', transform: 'rotate(-8deg)', letterSpacing: '3px', marginTop: '10px'
                }}>
                  {status === 'paid' ? 'PAID ✓' : 'UNPAID'}
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '14px 18px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontWeight: 600 }}>
                {type === 'payslip' ? 'Pay To' : 'Bill To'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{party.name}</div>
              {party.phone && <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '2px' }}>📞 {party.phone}</div>}
              {party.role && <div style={{ fontSize: '12px', color: '#4b5563' }}>Role: {party.role}</div>}
              {party.period && <div style={{ fontSize: '12px', color: '#4b5563' }}>Period: {party.period}</div>}
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#4338ca' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: 'white', borderRadius: '4px 0 0 0' }}>Description</th>
                  {items.some(i => i.hours) && <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', color: 'white' }}>Hours</th>}
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '12px', color: 'white', borderRadius: '0 4px 0 0' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 14px', fontSize: '13px' }}>{item.description}</td>
                    {items.some(it => it.hours) && <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '13px' }}>{item.hours || '—'}</td>}
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, fontSize: '13px', color: Number(item.amount) < 0 ? '#dc2626' : '#111' }}>
                      {Number(item.amount) < 0 ? '-' : ''}₹{Math.abs(Number(item.amount)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <div style={{ width: '240px' }}>
                {paidAmount !== undefined ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#6b7280' }}>Total Amount</span>
                      <span style={{ fontWeight: 600 }}>₹{Number(total).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#15803d', fontWeight: 600 }}>Amount Paid</span>
                      <span style={{ fontWeight: 700, color: '#15803d' }}>₹{Number(paidAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '15px', fontWeight: 800, borderTop: '2px solid #4338ca', marginTop: '4px', color: paidAmount < total ? '#dc2626' : '#4338ca' }}>
                      <span>Balance Due</span>
                      <span>₹{Math.max(0, Number(total) - Number(paidAmount)).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '16px', fontWeight: 800, color: '#4338ca', borderTop: '2px solid #4338ca', marginTop: '4px' }}>
                    <span>Total</span>
                    <span>₹{Number(total).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            {note && (
              <div style={{ fontSize: '12px', color: '#4b5563', padding: '10px 14px', background: '#fef3c7', borderRadius: '6px', marginBottom: '20px' }}>
                <strong>Note:</strong> {note}
              </div>
            )}

            {/* Footer */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px', textAlign: 'center', fontSize: '11px', color: '#9ca3af' }}>
              <p>{company.name} {company.gst ? `| GST: ${company.gst}` : ''}</p>
              <p style={{ marginTop: '4px' }}>This is a computer-generated document. No signature required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
