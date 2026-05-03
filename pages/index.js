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
        { label: 'Total Quotations', value: stats.totalQuotations, icon: 'bi-file-earmark-text', href: '/quotations' },
        { label: 'Active Leads', value: stats.activeLeads, icon: 'bi-bullseye', href: '/leads' },
        { label: 'Total Travellers', value: stats.totalTravellers, icon: 'bi-people', href: '/travellers' },
        { label: 'Total Invoices', value: stats.totalInvoices, icon: 'bi-receipt', href: '/invoices' },
      ]
    : [];

  const quickActions = [
    { href: '/quotations/new', label: 'New Quotation', icon: 'bi-plus-circle-fill', btn: 'btn-primary' },
    { href: '/travellers/new', label: 'Add Traveller', icon: 'bi-person-plus-fill', btn: 'btn-outline-primary' },
    { href: '/leads/new', label: 'Add Lead', icon: 'bi-bullseye', btn: 'btn-outline-primary' },
    { href: '/invoices/new', label: 'New Invoice', icon: 'bi-receipt-cutoff', btn: 'btn-outline-primary' },
    { href: '/communications/new', label: 'New Communication', icon: 'bi-megaphone-fill', btn: 'btn-outline-primary' },
  ];

  const statusBadge = {
    Draft: 'secondary',
    Sent: 'info',
    Accepted: 'success',
    Rejected: 'danger',
    New: 'primary',
    Contacted: 'info',
    Interested: 'warning',
    Converted: 'success',
    Lost: 'danger',
  };

  return (
    <Layout title="Dashboard">
      <section className="dashboard-hero card border-0 mb-4">
        <div className="card-body p-4 p-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="hero-chip mb-3">
                <i className="bi bi-stars"></i>
                Operations command center
              </div>
              <h1 className="display-6 fw-bold mb-3">Dashboard</h1>
              <p className="mb-4 hero-copy">
                Manage quotations, travellers, leads, invoices, and communication flow from one polished workspace.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link href="/quotations/new" className="btn btn-light">
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Create quotation
                </Link>
                <Link href="/leads/new" className="btn btn-outline-light">
                  <i className="bi bi-arrow-up-right-circle me-2"></i>
                  Capture lead
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-panel">
                <div className="hero-panel__item">
                  <span>Visibility</span>
                  <strong>Live pipeline</strong>
                </div>
                <div className="hero-panel__item">
                  <span>Experience</span>
                  <strong>Mobile-ready</strong>
                </div>
                <div className="hero-panel__item">
                  <span>Branding</span>
                  <strong>Premium design system</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <div key={card.label} className="col-6 col-xl-3">
                <Link href={card.href} className="text-decoration-none">
                  <div className="card metric-card h-100 border-0">
                    <div className="card-body">
                      <div className="metric-card__icon">
                        <i className={`bi ${card.icon}`}></i>
                      </div>
                      <h3 className="fw-bold mb-1 mt-3">{card.value}</h3>
                      <p className="metric-card__label mb-0">{card.label}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-xl-7">
              <div className="card shadow-sm h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                    <span className="section-icon"><i className="bi bi-file-earmark-text"></i></span>
                    Recent Quotations
                  </h6>
                  <Link href="/quotations" className="btn btn-sm btn-outline-primary">View all</Link>
                </div>
                <div className="card-body p-0">
                  {!stats?.recentQuotations?.length ? (
                    <p className="text-muted text-center py-4 mb-0">No quotations yet</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {stats.recentQuotations.map((q) => (
                        <li key={q._id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <Link href={`/quotations/${q._id}`} className="fw-semibold text-decoration-none">
                                {q.clientName}
                              </Link>
                              <div className="text-muted small mt-1">
                                {q.destination} &bull; {q.numberOfPax} pax
                                {q.finalPrice ? ` • ₹${q.finalPrice.toLocaleString('en-IN')}` : ''}
                              </div>
                            </div>
                            <div className="text-end">
                              <span className={`badge bg-${statusBadge[q.status] || 'secondary'}`}>{q.status}</span>
                              <div className="text-muted small mt-1">{q.createdAt ? format(new Date(q.createdAt), 'dd MMM') : ''}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="col-xl-5">
              <div className="card shadow-sm h-100">
                <div className="card-header">
                  <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                    <span className="section-icon"><i className="bi bi-lightning-charge"></i></span>
                    Quick Actions
                  </h6>
                </div>
                <div className="card-body d-grid gap-2">
                  {quickActions.map((action) => (
                    <Link key={action.href} href={action.href} className={`btn ${action.btn} quick-action`}>
                      <i className={`bi ${action.icon} me-2`}></i>
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-1">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                    <span className="section-icon"><i className="bi bi-bullseye"></i></span>
                    Recent Leads
                  </h6>
                  <Link href="/leads" className="btn btn-sm btn-outline-primary">View all</Link>
                </div>
                <div className="card-body p-0">
                  {!stats?.recentLeads?.length ? (
                    <p className="text-muted text-center py-4 mb-0">No leads yet</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {stats.recentLeads.map((l) => (
                        <li key={l._id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <Link href={`/leads/${l._id}`} className="fw-semibold text-decoration-none">
                                {l.clientName}
                              </Link>
                              <div className="text-muted small mt-1">{l.destination || 'N/A'} &bull; {l.source}</div>
                            </div>
                            <div className="text-end">
                              <span className={`badge bg-${statusBadge[l.status] || 'secondary'}`}>{l.status}</span>
                              <div className="text-muted small mt-1">{l.createdAt ? format(new Date(l.createdAt), 'dd MMM') : ''}</div>
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
        </>
      )}
    </Layout>
  );
}
