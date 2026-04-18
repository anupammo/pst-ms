import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.data);
        else setError(data.error || 'Live metrics are temporarily unavailable.');
      })
      .catch(() => setError('Live metrics are temporarily unavailable. Check your database connection and try again.'))
      .finally(() => setLoading(false));
  }, []);

  const summaryCards = stats
    ? [
        { label: 'Total Quotations', value: stats.totalQuotations, color: 'primary', icon: '📋', href: '/quotations' },
        { label: 'Active Leads', value: stats.activeLeads, color: 'warning', icon: '🎯', href: '/leads' },
        { label: 'Total Travellers', value: stats.totalTravellers, color: 'success', icon: '👥', href: '/travellers' },
        { label: 'Total Invoices', value: stats.totalInvoices, color: 'info', icon: '🧾', href: '/invoices' },
      ]
    : [];

  const statusBadge = {
    Draft: 'secondary', Sent: 'info', Accepted: 'success', Rejected: 'danger',
    New: 'primary', Contacted: 'info', Interested: 'warning', Converted: 'success', Lost: 'danger',
  };

  return (
    <Layout title="Dashboard">
      <div className="dashboard-hero card border-0 mb-4">
        <div className="card-body p-4 p-lg-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <p className="text-uppercase small fw-semibold mb-2 text-white-50">Operations command center</p>
              <h2 className="mb-2 fw-bold">Dashboard</h2>
              <p className="mb-0 text-white-50">Track quotations, leads, travellers, invoices, and team follow-ups from one workspace.</p>
            </div>
            <div className="text-lg-end">
              <div className="hero-chip mb-3">● Live overview</div>
              <div className="d-flex flex-wrap justify-content-lg-end gap-2">
                <Link href="/quotations/new" className="btn btn-light btn-sm">+ New Quotation</Link>
                <Link href="/leads/new" className="btn btn-outline-light btn-sm">+ New Lead</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {summaryCards.map((card) => (
              <div key={card.label} className="col-6 col-md-3">
                <Link href={card.href} className="text-decoration-none">
                  <div className={`card border-0 shadow-sm bg-${card.color} text-white h-100 metric-card`}>
                    <div className="card-body text-center py-3">
                      <div style={{ fontSize: '2rem' }}>{card.icon}</div>
                      <h3 className="fw-bold mb-0">{card.value}</h3>
                      <p className="mb-0 small opacity-75">{card.label}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">📋 Recent Quotations</h6>
                  <Link href="/quotations" className="btn btn-sm btn-outline-primary">View All</Link>
                </div>
                <div className="card-body p-0">
                  {!stats?.recentQuotations?.length ? (
                    <p className="text-muted text-center py-3 mb-0">No quotations yet</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {stats.recentQuotations.map((q) => (
                        <li key={q._id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <Link href={`/quotations/${q._id}`} className="fw-semibold text-decoration-none">
                                {q.clientName}
                              </Link>
                              <br />
                              <small className="text-muted">
                                {q.destination} &bull; {q.numberOfPax} pax
                                {q.finalPrice ? ` • ₹${q.finalPrice.toLocaleString('en-IN')}` : ''}
                              </small>
                            </div>
                            <div className="text-end">
                              <span className={`badge bg-${statusBadge[q.status] || 'secondary'}`}>{q.status}</span>
                              <br />
                              <small className="text-muted">{q.createdAt ? format(new Date(q.createdAt), 'dd MMM') : ''}</small>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">🎯 Recent Leads</h6>
                  <Link href="/leads" className="btn btn-sm btn-outline-primary">View All</Link>
                </div>
                <div className="card-body p-0">
                  {!stats?.recentLeads?.length ? (
                    <p className="text-muted text-center py-3 mb-0">No leads yet</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {stats.recentLeads.map((l) => (
                        <li key={l._id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <Link href={`/leads/${l._id}`} className="fw-semibold text-decoration-none">
                                {l.clientName}
                              </Link>
                              <br />
                              <small className="text-muted">{l.destination || 'N/A'} &bull; {l.source}</small>
                            </div>
                            <div className="text-end">
                              <span className={`badge bg-${statusBadge[l.status] || 'secondary'}`}>{l.status}</span>
                              <br />
                              <small className="text-muted">{l.createdAt ? format(new Date(l.createdAt), 'dd MMM') : ''}</small>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h6 className="mb-0 fw-bold">⚡ Quick Actions</h6>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2">
                    <Link href="/quotations/new" className="btn btn-primary">📋 New Quotation</Link>
                    <Link href="/travellers/new" className="btn btn-success">👥 Add Traveller</Link>
                    <Link href="/leads/new" className="btn btn-warning text-dark">🎯 Add Lead</Link>
                    <Link href="/invoices/new" className="btn btn-info text-dark">🧾 New Invoice</Link>
                    <Link href="/communications/new" className="btn btn-secondary">📢 New Communication</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
