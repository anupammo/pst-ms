import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const PAYMENT_COLORS = { Pending: 'danger', Partial: 'warning', Paid: 'success' };

export default function InvoiceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [payment, setPayment] = useState({ amount: '', date: '', method: 'UPI', reference: '', note: '' });
  const [addingPayment, setAddingPayment] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/invoices/${id}`).then(r => r.json())
      .then(data => {
        if (data.success) {
          setInvoice(data.data);
          setForm({ ...data.data, travelDate: data.data.travelDate ? data.data.travelDate.substring(0,10) : '' });
        } else setError(data.error);
      }).catch(() => setError('Failed to load')).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form };
    ['numberOfPax','baseAmount','discount','finalAmount','advanceAmount','balanceAmount'].forEach(f => { if (body[f]) body[f] = Number(body[f]); });
    if (!body.travelDate) delete body.travelDate;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { setInvoice(data.data); setEditing(false); }
      else setError(data.error);
    } catch { setError('Failed to save'); } finally { setSaving(false); }
  };

  const handleAddPayment = async () => {
    if (!payment.amount) return;
    setAddingPayment(true);
    try {
      const body = { ...payment, amount: Number(payment.amount) };
      if (!body.date) delete body.date;
      const res = await fetch(`/api/invoices/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { setInvoice(data.data); setPayment({ amount: '', date: '', method: 'UPI', reference: '', note: '' }); }
      else setError(data.error);
    } catch { setError('Failed to add payment'); } finally { setAddingPayment(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this invoice?')) return;
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    router.push('/invoices');
  };

  if (loading) return <Layout title="Invoice"><div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div></Layout>;
  if (!invoice) return <Layout title="Error"><div className="alert alert-danger">{error}</div></Layout>;

  const totalPaid = invoice.payments?.reduce((s, p) => s + (p.amount || 0), 0) || 0;
  const balance = (invoice.finalAmount || 0) - totalPaid;

  return (
    <Layout title={`Invoice - ${invoice.invoiceNumber}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <button onClick={() => router.push('/invoices')} className="btn btn-outline-secondary btn-sm">← Back</button>
          <div>
            <h2 className="mb-0 fw-bold">{invoice.invoiceNumber}</h2>
            <span className={`badge bg-${PAYMENT_COLORS[invoice.paymentStatus]}`}>{invoice.paymentStatus}</span>
          </div>
        </div>
        <div className="d-flex gap-2">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="btn btn-outline-primary btn-sm">✏️ Edit</button>
              <button onClick={handleDelete} className="btn btn-outline-danger btn-sm">🗑️ Delete</button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={saving}>{saving ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-floppy me-1"></i>Save</>}</button>
              <button onClick={() => setEditing(false)} className="btn btn-outline-secondary btn-sm">Cancel</button>
            </>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-7">
          {editing ? (
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row g-3">
                  {[['clientName','Client Name','text',true],['contact','Contact','text'],['email','Email','email'],['destination','Destination','text'],['tripDuration','Trip Duration','text'],['numberOfPax','Pax','number'],['baseAmount','Base Amount (₹)','number'],['discount','Discount (₹)','number'],['finalAmount','Final Amount (₹)','number'],['advanceAmount','Advance (₹)','number']].map(([name,label,type,req]) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label">{label}</label>
                      <input type={type} className="form-control" name={name} value={form[name]||''} onChange={handleChange} required={!!req} />
                    </div>
                  ))}
                  <div className="col-md-6">
                    <label className="form-label">Travel Date</label>
                    <input type="date" className="form-control" name="travelDate" value={form.travelDate||''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Payment Status</label>
                    <select className="form-select" name="paymentStatus" value={form.paymentStatus||''} onChange={handleChange}>
                      {['Pending','Partial','Paid'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" name="notes" value={form.notes||''} onChange={handleChange} rows="2" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-header bg-white"><h6 className="mb-0 fw-bold">Invoice Details</h6></div>
              <div className="card-body">
                <div className="row g-3 mb-3">
                  {[
                    ['Client', invoice.clientName],
                    ['Contact', invoice.contact],
                    ['Email', invoice.email],
                    ['Destination', invoice.destination],
                    ['Trip Duration', invoice.tripDuration],
                    ['Pax', invoice.numberOfPax],
                    ['Travel Date', invoice.travelDate ? format(new Date(invoice.travelDate), 'dd MMM yyyy') : null],
                  ].filter(([,v]) => v).map(([label, value]) => (
                    <div className="col-md-6" key={label}>
                      <small className="text-muted d-block">{label}</small>
                      <span className="fw-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="row g-3">
                  <div className="col-4 text-center">
                    <small className="text-muted d-block">Base Amount</small>
                    <span className="fw-bold">₹{invoice.baseAmount?.toLocaleString('en-IN') || '-'}</span>
                  </div>
                  <div className="col-4 text-center">
                    <small className="text-muted d-block">Discount</small>
                    <span className="fw-bold text-danger">₹{invoice.discount?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                  <div className="col-4 text-center">
                    <small className="text-muted d-block">Final Amount</small>
                    <span className="fw-bold text-success fs-5">₹{invoice.finalAmount?.toLocaleString('en-IN') || '-'}</span>
                  </div>
                  <div className="col-4 text-center">
                    <small className="text-muted d-block">Advance (40%)</small>
                    <span className="fw-bold">₹{invoice.advanceAmount?.toLocaleString('en-IN') || '-'}</span>
                  </div>
                  <div className="col-4 text-center">
                    <small className="text-muted d-block">Total Paid</small>
                    <span className="fw-bold text-success">₹{totalPaid.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="col-4 text-center">
                    <small className="text-muted d-block">Balance Due</small>
                    <span className={`fw-bold ${balance > 0 ? 'text-danger' : 'text-success'}`}>₹{balance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0 fw-bold">💵 Add Payment</h6>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small">Amount (₹) *</label>
                  <input type="number" className="form-control form-control-sm" value={payment.amount} onChange={e => setPayment(p => ({ ...p, amount: e.target.value }))} min="0" />
                </div>
                <div className="col-6">
                  <label className="form-label small">Method</label>
                  <select className="form-select form-select-sm" value={payment.method} onChange={e => setPayment(p => ({ ...p, method: e.target.value }))}>
                    {['Cash','UPI','Bank Transfer','Card','Other'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small">Date</label>
                  <input type="date" className="form-control form-control-sm" value={payment.date} onChange={e => setPayment(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="col-6">
                  <label className="form-label small">Reference</label>
                  <input type="text" className="form-control form-control-sm" value={payment.reference} onChange={e => setPayment(p => ({ ...p, reference: e.target.value }))} placeholder="UTR/Ref No." />
                </div>
                <div className="col-12">
                  <label className="form-label small">Note</label>
                  <input type="text" className="form-control form-control-sm" value={payment.note} onChange={e => setPayment(p => ({ ...p, note: e.target.value }))} placeholder="Optional note" />
                </div>
                <div className="col-12">
                  <button className="btn btn-sm btn-success w-100" onClick={handleAddPayment} disabled={addingPayment || !payment.amount}>
                    {addingPayment ? <span className="spinner-border spinner-border-sm" /> : '+ Record Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white"><h6 className="mb-0 fw-bold">Payment History ({invoice.payments?.length || 0})</h6></div>
            <div className="card-body p-0">
              {!invoice.payments?.length ? (
                <p className="text-muted text-center py-3 mb-0">No payments yet</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {invoice.payments.map((p, i) => (
                    <li key={i} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="fw-semibold text-success">₹{p.amount?.toLocaleString('en-IN')}</span>
                          <span className="badge bg-secondary ms-2">{p.method}</span>
                          {p.note && <small className="text-muted ms-2">{p.note}</small>}
                        </div>
                        <small className="text-muted">{p.date ? format(new Date(p.date), 'dd MMM yy') : ''}</small>
                      </div>
                      {p.reference && <small className="text-muted">Ref: {p.reference}</small>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
