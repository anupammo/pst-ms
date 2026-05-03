import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const TYPE_COLORS = { Offer: 'success', Greeting: 'info', Update: 'primary', Newsletter: 'warning', Other: 'secondary' };
const STATUS_COLORS = { Draft: 'secondary', Scheduled: 'warning', Sent: 'success' };

export default function CommunicationsList() {
  const [comms, setComms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetch('/api/communications').then(r => r.json())
      .then(data => { if (data.success) setComms(data.data); else setError(data.error); })
      .catch(() => setError('Failed to load')).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this communication?')) return;
    const res = await fetch(`/api/communications/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) setComms(prev => prev.filter(c => c._id !== id));
  };

  const filtered = comms.filter(c => !typeFilter || c.type === typeFilter);

  return (
    <Layout title="Communications">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <span className="section-icon"><i className="bi bi-megaphone-fill"></i></span>
          Communications
        </h2>
        <Link href="/communications/new" className="btn btn-secondary">
          <i className="bi bi-plus-circle me-2"></i>
          New Communication
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <select className="form-select w-auto" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {['Offer','Greeting','Update','Newsletter','Other'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No communications found.</p>
          <Link href="/communications/new" className="btn btn-secondary">Create First</Link>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(c => (
            <div key={c._id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <span className={`badge bg-${TYPE_COLORS[c.type]}`}>{c.type}</span>
                  <span className={`badge bg-${STATUS_COLORS[c.status]}`}>{c.status}</span>
                </div>
                <div className="card-body">
                  <h6 className="card-title">{c.title}</h6>
                  <p className="text-muted small mb-2" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {c.content}
                  </p>
                  <small className="text-muted">Target: {c.targetAudience}</small>
                  <br />
                  <small className="text-muted">{c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : ''}</small>
                </div>
                <div className="card-footer bg-white d-flex gap-2">
                  <Link href={`/communications/${c._id}`} className="btn btn-sm btn-outline-secondary flex-fill">View/Edit</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
