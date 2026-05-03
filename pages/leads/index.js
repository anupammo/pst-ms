import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const STATUS_COLORS = { New: 'primary', Contacted: 'info', Interested: 'warning', Converted: 'success', Lost: 'danger' };

export default function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetch('/api/leads').then(r => r.json())
      .then(data => { if (data.success) setLeads(data.data); else setError(data.error); })
      .catch(() => setError('Failed to load leads'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) setLeads(prev => prev.filter(l => l._id !== id));
  };

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.clientName?.toLowerCase().includes(search.toLowerCase()) || l.contact?.includes(search);
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Layout title="Leads">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <span className="section-icon"><i className="bi bi-bullseye"></i></span>
          Leads
        </h2>
        <Link href="/leads/new" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          New Lead
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Search by name or contact..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {['New','Contacted','Interested','Converted','Lost'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No leads found.</p>
          <Link href="/leads/new" className="btn btn-warning text-dark">Add First Lead</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-warning">
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Destination</th>
                <th>Source</th>
                <th>Status</th>
                <th>Travel Date</th>
                <th>Follow-ups</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l._id}>
                  <td className="fw-semibold">{l.clientName}</td>
                  <td>{l.contact || '-'}</td>
                  <td>{l.destination || '-'}</td>
                  <td><span className="badge bg-secondary">{l.source}</span></td>
                  <td><span className={`badge bg-${STATUS_COLORS[l.status]}`}>{l.status}</span></td>
                  <td>{l.travelDate ? format(new Date(l.travelDate), 'dd MMM yyyy') : '-'}</td>
                  <td><span className="badge bg-light text-dark border">{l.followUps?.length || 0}</span></td>
                  <td>
                    <Link href={`/leads/${l._id}`} className="btn btn-sm btn-outline-primary me-1">View</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(l._id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
