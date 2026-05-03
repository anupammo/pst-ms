import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function NewTraveller() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', contact: '', email: '', address: '',
    idProofType: '', idProofNumber: '', dateOfBirth: '',
    anniversary: '', numberOfPax: '1', specialRequirements: '', tags: '',
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const body = { ...form, numberOfPax: Number(form.numberOfPax), tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    if (!body.dateOfBirth) delete body.dateOfBirth;
    if (!body.anniversary) delete body.anniversary;
    try {
      const res = await fetch('/api/travellers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) router.push(`/travellers/${data.data._id}`);
      else setError(data.error);
    } catch { setError('Failed to save'); } finally { setLoading(false); }
  };

  return (
    <Layout title="Add Traveller">
      <div className="d-flex align-items-center mb-4 flex-wrap gap-2">
        <button onClick={() => router.back()} className="btn btn-outline-secondary btn-sm me-1">
          <i className="bi bi-arrow-left me-1"></i>
          Back
        </button>
        <h2 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <span className="section-icon"><i className="bi bi-people"></i></span>
          Add Traveller
        </h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
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
                <label className="form-label">Number of Pax</label>
                <input type="number" className="form-control" name="numberOfPax" value={form.numberOfPax} onChange={handleChange} min="1" />
              </div>
              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea className="form-control" name="address" value={form.address} onChange={handleChange} rows="2" />
              </div>
              <div className="col-md-6">
                <label className="form-label">ID Proof Type</label>
                <select className="form-select" name="idProofType" value={form.idProofType} onChange={handleChange}>
                  <option value="">Select...</option>
                  {['Aadhaar','Passport','Voter ID','Driving License','PAN Card','Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">ID Proof Number</label>
                <input type="text" className="form-control" name="idProofNumber" value={form.idProofNumber} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-control" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Anniversary Date</label>
                <input type="date" className="form-control" name="anniversary" value={form.anniversary} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Special Requirements</label>
                <textarea className="form-control" name="specialRequirements" value={form.specialRequirements} onChange={handleChange} rows="2" />
              </div>
              <div className="col-12">
                <label className="form-label">Tags (comma-separated)</label>
                <input type="text" className="form-control" name="tags" value={form.tags} onChange={handleChange} placeholder="VIP, Corporate, Repeat Customer" />
              </div>
            </div>
          </div>
          <div className="card-footer bg-white">
            <button type="submit" className="btn btn-primary me-2" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-floppy me-2"></i>Save Traveller</>}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => router.back()}>Cancel</button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
