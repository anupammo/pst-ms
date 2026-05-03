import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import QuotationCard from '../../components/QuotationCard';

export default function QuotationsList() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetch('/api/quotations')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setQuotations(data.data);
        else setError(data.error);
      })
      .catch(() => setError('Failed to load quotations'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this quotation?')) return;
    const res = await fetch(`/api/quotations/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) setQuotations((prev) => prev.filter((q) => q._id !== id));
    else alert('Failed to delete: ' + data.error);
  };

  const filtered = quotations.filter((q) => {
    const matchSearch = !search ||
      q.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      q.destination?.toLowerCase().includes(search.toLowerCase()) ||
      q.quotationNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Layout title="Quotations">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <span className="section-icon"><i className="bi bi-file-earmark-text"></i></span>
          Quotations
        </h2>
        <Link href="/quotations/new" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          New Quotation
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, destination, or quotation number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {['Draft', 'Sent', 'Accepted', 'Rejected'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No quotations found.</p>
          <Link href="/quotations/new" className="btn btn-primary">Create First Quotation</Link>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((q) => (
            <div key={q._id} className="col-md-4 col-lg-3">
              <QuotationCard quotation={q} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
