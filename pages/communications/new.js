import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function NewCommunication() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', type: 'Offer', content: '', targetAudience: 'All',
    scheduledDate: '', status: 'Draft', tags: '',
  });

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const body = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    if (!body.scheduledDate) delete body.scheduledDate;
    try {
      const res = await fetch('/api/communications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) router.push('/communications');
      else setError(data.error);
    } catch { setError('Failed to save'); } finally { setLoading(false); }
  };

  const templates = {
    Offer: `🌟 Special Offer Alert! 🌟\n\nBook your dream holiday package with PSTourism™️ and get exclusive discounts!\n\n📍 Destination: [Destination]\n💰 Starting from: ₹[Amount]\n📅 Valid till: [Date]\n\nCall us: [Phone]\nVisit: www.pstourism.in\n\nTeam PST 🙏`,
    Greeting: `🎉 Warm Greetings from PSTourism™️!\n\nDear [Name],\n\nWishing you a very Happy [Occasion]! 🎊\n\nMay this special day bring you joy and wonderful memories.\n\nWe look forward to being part of your travel journeys!\n\nWarm Regards,\nTeam PST\nPSTourism™️`,
    Update: `📢 Update from PSTourism™️\n\nDear Travellers,\n\n[Your update content here]\n\nFor more information, visit: www.pstourism.in\n\nTeam PST 🙏`,
  };

  return (
    <Layout title="New Communication">
      <div className="d-flex align-items-center mb-4">
        <button onClick={() => router.back()} className="btn btn-outline-secondary btn-sm me-3">← Back</button>
        <h2 className="mb-0 fw-bold">📢 New Communication</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Title *</label>
                <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Type</label>
                <select className="form-select" name="type" value={form.type} onChange={(e) => {
                  handleChange(e);
                  if (templates[e.target.value] && !form.content) setForm(p => ({ ...p, type: e.target.value, content: templates[e.target.value] }));
                  else setForm(p => ({ ...p, type: e.target.value }));
                }}>
                  {['Offer','Greeting','Update','Newsletter','Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Target Audience</label>
                <select className="form-select" name="targetAudience" value={form.targetAudience} onChange={handleChange}>
                  {['All','Leads','Travellers','Custom'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  {['Draft','Scheduled','Sent'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Scheduled Date</label>
                <input type="datetime-local" className="form-control" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} />
              </div>
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label mb-0">Content *</label>
                  {templates[form.type] && (
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setForm(p => ({ ...p, content: templates[form.type] }))}>
                      Use Template
                    </button>
                  )}
                </div>
                <textarea className="form-control" name="content" value={form.content} onChange={handleChange} rows="10" required />
              </div>
              <div className="col-12">
                <label className="form-label">Tags (comma-separated)</label>
                <input type="text" className="form-control" name="tags" value={form.tags} onChange={handleChange} placeholder="offer, holiday, 2025" />
              </div>
            </div>
          </div>
          <div className="card-footer bg-white">
            <button type="submit" className="btn btn-secondary me-2" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : '💾 Save Communication'}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => router.back()}>Cancel</button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
