import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

export default function TravellerDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [traveller, setTraveller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/travellers/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setTraveller(data.data);
          setForm({ ...data.data, tags: (data.data.tags||[]).join(', '),
            dateOfBirth: data.data.dateOfBirth ? data.data.dateOfBirth.substring(0,10) : '',
            anniversary: data.data.anniversary ? data.data.anniversary.substring(0,10) : '' });
        } else setError(data.error);
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, numberOfPax: Number(form.numberOfPax), tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    if (!body.dateOfBirth) delete body.dateOfBirth;
    if (!body.anniversary) delete body.anniversary;
    try {
      const res = await fetch(`/api/travellers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { setTraveller(data.data); setEditing(false); }
      else setError(data.error);
    } catch { setError('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this traveller?')) return;
    await fetch(`/api/travellers/${id}`, { method: 'DELETE' });
    router.push('/travellers');
  };

  if (loading) return <Layout title="Traveller"><div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div></Layout>;
  if (!traveller) return <Layout title="Error"><div className="alert alert-danger">{error}</div></Layout>;

  return (
    <Layout title={`Traveller - ${traveller.name}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <button onClick={() => router.push('/travellers')} className="btn btn-outline-secondary btn-sm">← Back</button>
          <h2 className="mb-0 fw-bold">{traveller.name}</h2>
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

      <div className="card shadow-sm">
        <div className="card-body">
          {editing ? (
            <div className="row g-3">
              {[['name','Full Name','text',true],['contact','Contact','text'],['email','Email','email'],['numberOfPax','Number of Pax','number'],['idProofNumber','ID Proof Number','text']].map(([name,label,type,req]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label">{label}</label>
                  <input type={type} className="form-control" name={name} value={form[name]||''} onChange={handleChange} required={!!req} />
                </div>
              ))}
              <div className="col-md-6">
                <label className="form-label">ID Proof Type</label>
                <select className="form-select" name="idProofType" value={form.idProofType||''} onChange={handleChange}>
                  <option value="">Select...</option>
                  {['Aadhaar','Passport','Voter ID','Driving License','PAN Card','Other'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-control" name="dateOfBirth" value={form.dateOfBirth||''} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Anniversary</label>
                <input type="date" className="form-control" name="anniversary" value={form.anniversary||''} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea className="form-control" name="address" value={form.address||''} onChange={handleChange} rows="2" />
              </div>
              <div className="col-12">
                <label className="form-label">Special Requirements</label>
                <textarea className="form-control" name="specialRequirements" value={form.specialRequirements||''} onChange={handleChange} rows="2" />
              </div>
              <div className="col-12">
                <label className="form-label">Tags (comma-separated)</label>
                <input type="text" className="form-control" name="tags" value={form.tags||''} onChange={handleChange} />
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {[
                ['Contact', traveller.contact],
                ['Email', traveller.email],
                ['Address', traveller.address],
                ['ID Proof', traveller.idProofType ? `${traveller.idProofType}: ${traveller.idProofNumber||''}` : null],
                ['Date of Birth', traveller.dateOfBirth ? format(new Date(traveller.dateOfBirth), 'dd MMM yyyy') : null],
                ['Anniversary', traveller.anniversary ? format(new Date(traveller.anniversary), 'dd MMM yyyy') : null],
                ['Number of Pax', traveller.numberOfPax],
                ['Special Requirements', traveller.specialRequirements],
              ].filter(([,v]) => v).map(([label, value]) => (
                <div className="col-md-6" key={label}>
                  <small className="text-muted d-block">{label}</small>
                  <span className="fw-semibold">{value}</span>
                </div>
              ))}
              {traveller.tags?.length > 0 && (
                <div className="col-12">
                  <small className="text-muted d-block">Tags</small>
                  <div className="d-flex gap-1 flex-wrap">
                    {traveller.tags.map(tag => <span key={tag} className="badge bg-secondary">{tag}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
