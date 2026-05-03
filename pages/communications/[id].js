import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

export default function CommunicationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [comm, setComm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/communications/${id}`).then(r => r.json())
      .then(data => {
        if (data.success) {
          setComm(data.data);
          setForm({ ...data.data, tags: (data.data.tags||[]).join(', '),
            scheduledDate: data.data.scheduledDate ? data.data.scheduledDate.substring(0,16) : '' });
        } else setError(data.error);
      }).catch(() => setError('Failed to load')).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    if (!body.scheduledDate) delete body.scheduledDate;
    try {
      const res = await fetch(`/api/communications/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { setComm(data.data); setEditing(false); }
      else setError(data.error);
    } catch { setError('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this communication?')) return;
    await fetch(`/api/communications/${id}`, { method: 'DELETE' });
    router.push('/communications');
  };

  if (loading) return <Layout title="Communication"><div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div></Layout>;
  if (!comm) return <Layout title="Error"><div className="alert alert-danger">{error}</div></Layout>;

  return (
    <Layout title={comm.title}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <button onClick={() => router.push('/communications')} className="btn btn-outline-secondary btn-sm">← Back</button>
          <h2 className="mb-0 fw-bold">{comm.title}</h2>
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
              <div className="col-md-8">
                <label className="form-label">Title *</label>
                <input type="text" className="form-control" name="title" value={form.title||''} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Type</label>
                <select className="form-select" name="type" value={form.type||''} onChange={handleChange}>
                  {['Offer','Greeting','Update','Newsletter','Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Target Audience</label>
                <select className="form-select" name="targetAudience" value={form.targetAudience||''} onChange={handleChange}>
                  {['All','Leads','Travellers','Custom'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={form.status||''} onChange={handleChange}>
                  {['Draft','Scheduled','Sent'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Scheduled Date</label>
                <input type="datetime-local" className="form-control" name="scheduledDate" value={form.scheduledDate||''} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Content *</label>
                <textarea className="form-control" name="content" value={form.content||''} onChange={handleChange} rows="12" required />
              </div>
              <div className="col-12">
                <label className="form-label">Tags (comma-separated)</label>
                <input type="text" className="form-control" name="tags" value={form.tags||''} onChange={handleChange} />
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex gap-2 mb-3 flex-wrap">
                <span className="badge bg-primary fs-6">{comm.type}</span>
                <span className="badge bg-secondary fs-6">{comm.status}</span>
                <span className="badge bg-info text-dark fs-6"><i className="bi bi-people me-1"></i>{comm.targetAudience}</span>
                {comm.scheduledDate && <span className="badge bg-warning text-dark fs-6"><i className="bi bi-calendar-event me-1"></i>{format(new Date(comm.scheduledDate), 'dd MMM yyyy HH:mm')}</span>}
              </div>
              <div className="border rounded p-3 bg-light">
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: 0 }}>
                  {comm.content}
                </pre>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => { navigator.clipboard.writeText(comm.content); alert('Copied!'); }}>
                  <i className="bi bi-copy me-1"></i>
                  Copy Content
                </button>
              </div>
              {comm.tags?.length > 0 && (
                <div className="mt-3">
                  <small className="text-muted d-block mb-1">Tags</small>
                  <div className="d-flex gap-1 flex-wrap">{comm.tags.map(tag => <span key={tag} className="badge bg-secondary">{tag}</span>)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
