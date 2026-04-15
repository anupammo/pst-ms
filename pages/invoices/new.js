import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function NewInvoice() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quotations, setQuotations] = useState([]);
  const [form, setForm] = useState({
    quotationId: '', clientName: '', contact: '', email: '',
    destination: '', tripDuration: '', travelDate: '', numberOfPax: '',
    baseAmount: '', discount: '0', finalAmount: '', advanceAmount: '', notes: '',
    paymentStatus: 'Pending',
  });

  useEffect(() => {
    fetch('/api/quotations').then(r => r.json()).then(data => { if (data.success) setQuotations(data.data); });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'baseAmount' || name === 'discount') {
        const base = parseFloat(name === 'baseAmount' ? value : prev.baseAmount) || 0;
        const disc = parseFloat(name === 'discount' ? value : prev.discount) || 0;
        const final = base - disc;
        updated.finalAmount = String(final);
        updated.advanceAmount = String(Math.round(final * 0.4));
      }
      return updated;
    });
  };

  const handleQuotationSelect = (e) => {
    const qId = e.target.value;
    const q = quotations.find(q => q._id === qId);
    if (q) {
      const finalAmt = q.finalPrice || (q.basePrice - (q.discount || 0));
      setForm(prev => ({
        ...prev,
        quotationId: qId,
        clientName: q.clientName || '',
        contact: q.contact || '',
        destination: q.destination || '',
        tripDuration: q.tripDuration || '',
        numberOfPax: String(q.numberOfPax || ''),
        baseAmount: String(q.basePrice || ''),
        discount: String(q.discount || '0'),
        finalAmount: String(finalAmt || ''),
        advanceAmount: String(Math.round(finalAmt * 0.4) || ''),
      }));
    } else {
      setForm(prev => ({ ...prev, quotationId: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const body = { ...form };
    ['numberOfPax','baseAmount','discount','finalAmount','advanceAmount'].forEach(f => { if (body[f]) body[f] = Number(body[f]); });
    if (!body.travelDate) delete body.travelDate;
    if (!body.quotationId) delete body.quotationId;
    body.balanceAmount = (body.finalAmount || 0) - (body.advanceAmount || 0);
    try {
      const res = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) router.push(`/invoices/${data.data._id}`);
      else setError(data.error);
    } catch { setError('Failed to save'); } finally { setLoading(false); }
  };

  return (
    <Layout title="New Invoice">
      <div className="d-flex align-items-center mb-4">
        <button onClick={() => router.back()} className="btn btn-outline-secondary btn-sm me-3">← Back</button>
        <h2 className="mb-0 fw-bold">🧾 New Invoice</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-dark">
                <h6 className="mb-0">Import from Quotation (optional)</h6>
              </div>
              <div className="card-body">
                <select className="form-select" value={form.quotationId} onChange={handleQuotationSelect}>
                  <option value="">-- Select Quotation to import data --</option>
                  {quotations.map(q => <option key={q._id} value={q._id}>{q.quotationNumber} — {q.clientName} — {q.destination}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white"><h6 className="mb-0">Client Details</h6></div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Client Name *</label>
                    <input type="text" className="form-control" name="clientName" value={form.clientName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Contact</label>
                    <input type="text" className="form-control" name="contact" value={form.contact} onChange={handleChange} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white"><h6 className="mb-0">Trip Details</h6></div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Destination</label>
                    <input type="text" className="form-control" name="destination" value={form.destination} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Trip Duration</label>
                    <input type="text" className="form-control" name="tripDuration" value={form.tripDuration} onChange={handleChange} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Pax</label>
                    <input type="number" className="form-control" name="numberOfPax" value={form.numberOfPax} onChange={handleChange} min="1" />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Travel Date</label>
                    <input type="date" className="form-control" name="travelDate" value={form.travelDate} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark"><h6 className="mb-0">💰 Payment Details</h6></div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Base Amount (₹)</label>
                    <input type="number" className="form-control" name="baseAmount" value={form.baseAmount} onChange={handleChange} min="0" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Discount (₹)</label>
                    <input type="number" className="form-control" name="discount" value={form.discount} onChange={handleChange} min="0" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Final Amount (₹)</label>
                    <input type="number" className="form-control" name="finalAmount" value={form.finalAmount} onChange={handleChange} min="0" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Advance (40%) (₹)</label>
                    <input type="number" className="form-control" name="advanceAmount" value={form.advanceAmount} onChange={handleChange} min="0" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Payment Status</label>
                    <select className="form-select" name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
                      {['Pending','Partial','Paid'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  {form.finalAmount && form.advanceAmount && (
                    <div className="col-12">
                      <div className="alert alert-info mb-0">
                        Balance Amount: ₹{Math.max(0, Number(form.finalAmount) - Number(form.advanceAmount)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <label className="form-label">Notes</label>
            <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows="2" />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-info text-dark btn-lg me-2" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : '💾 Create Invoice'}
            </button>
            <button type="button" className="btn btn-outline-secondary btn-lg" onClick={() => router.back()}>Cancel</button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
