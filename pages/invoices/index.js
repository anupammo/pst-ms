import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const PAYMENT_COLORS = { Pending: 'danger', Partial: 'warning', Paid: 'success' };

export default function InvoicesList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetch('/api/invoices').then(r => r.json())
      .then(data => { if (data.success) setInvoices(data.data); else setError(data.error); })
      .catch(() => setError('Failed to load')).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) setInvoices(prev => prev.filter(i => i._id !== id));
  };

  const filtered = invoices.filter(i => !statusFilter || i.paymentStatus === statusFilter);

  return (
    <Layout title="Invoices">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">🧾 Invoices</h2>
        <Link href="/invoices/new" className="btn btn-info text-dark">+ New Invoice</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <select className="form-select w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Payment Statuses</option>
          {['Pending','Partial','Paid'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No invoices found.</p>
          <Link href="/invoices/new" className="btn btn-info text-dark">Create First Invoice</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-info">
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Destination</th>
                <th>Amount</th>
                <th>Travel Date</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv._id}>
                  <td className="fw-semibold text-primary">{inv.invoiceNumber}</td>
                  <td>{inv.clientName}</td>
                  <td>{inv.destination || '-'}</td>
                  <td>{inv.finalAmount ? `₹${inv.finalAmount.toLocaleString('en-IN')}` : '-'}</td>
                  <td>{inv.travelDate ? format(new Date(inv.travelDate), 'dd MMM yyyy') : '-'}</td>
                  <td><span className={`badge bg-${PAYMENT_COLORS[inv.paymentStatus]}`}>{inv.paymentStatus}</span></td>
                  <td>
                    <Link href={`/invoices/${inv._id}`} className="btn btn-sm btn-outline-primary me-1">View</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(inv._id)}>Del</button>
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
