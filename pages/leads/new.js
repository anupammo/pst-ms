import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function NewLead() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clientName: '', contact: '', email: '', source: 'Other',
    interestedPackage: '', destination: '', budget: '', travelDate: '',
    numberOfPax: '', status: 'New', notes: '', assignedTo: '',
  });

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const body = { ...form };
    if (body.budget) body.budget = Number(body.budget);
    if (body.numberOfPax) body.numberOfPax = Number(body.numberOfPax);
    if (!body.travelDate) delete body.travelDate;
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) router.push(`/leads/${data.data._id}`);
      else setError(data.error);
    } catch { setError('Failed to save'); } finally { setLoading(false); }
  };

  return (
    <Layout title="New Lead">
      <div className="d-flex align-items-center mb-4">
        <button onClick={() => router.back()} className="btn btn-outline-secondary btn-sm me-3">← Back</button>
        <h2 className="mb-0 fw-bold">🎯 New Lead</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Client Name *</label>
                <input type="text" className="form-control" name="clientName" value={form.clientName} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Contact</label>
                <input type="text" className="form-control" name="contact" value={form.contact} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Source</label>
                <select className="form-select" name="source" value={form.source} onChange={handleChange}>
                  {['Website','WhatsApp','Referral','Social Media','Walk-in','Other'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Destination</label>
                <input type="text" className="form-control" name="destination" value={form.destination} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Interested Package</label>
                <input type="text" className="form-control" name="interestedPackage" value={form.interestedPackage} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Budget (₹)</label>
                <input type="number" className="form-control" name="budget" value={form.budget} onChange={handleChange} min="0" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Number of Pax</label>
                <input type="number" className="form-control" name="numberOfPax" value={form.numberOfPax} onChange={handleChange} min="1" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Travel Date</label>
                <input type="date" className="form-control" name="travelDate" value={form.travelDate} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  {['New','Contacted','Interested','Converted','Lost'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Assigned To</label>
                <input type="text" className="form-control" name="assignedTo" value={form.assignedTo} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows="3" />
              </div>
            </div>
          </div>
          <div className="card-footer bg-white">
            <button type="submit" className="btn btn-warning text-dark me-2" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : '💾 Save Lead'}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => router.back()}>Cancel</button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
