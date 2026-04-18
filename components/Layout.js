import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'PST Management System' }) {
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/quotations', label: 'Quotations', icon: '📋' },
    { href: '/travellers', label: 'Travellers', icon: '👥' },
    { href: '/leads', label: 'Leads', icon: '🎯' },
    { href: '/communications', label: 'Communications', icon: '📢' },
    { href: '/invoices', label: 'Invoices', icon: '🧾' },
  ];

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <Head>
        <title>{`${title} | PSTourism`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <meta
          name="description"
          content="Modern PSTourism operations workspace for quotations, leads, travellers, communications, and invoicing."
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <div className="app-shell d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark app-navbar sticky-top">
          <div className="container-fluid app-container">
            <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
              <span className="brand-mark">✈️</span>
              <span>
                <span className="brand-title d-block">PSTourism</span>
                <small className="brand-subtitle">Travel Ops Suite</small>
              </span>
            </Link>

            <div className="d-flex align-items-center gap-2 order-lg-2">
              <span className="status-pill">2026-ready</span>
            </div>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                {navLinks.map((link) => (
                  <li key={link.href} className="nav-item">
                    <Link
                      href={link.href}
                      className={`nav-link nav-pill ${isActive(link.href) ? 'active fw-semibold' : ''}`}
                    >
                      <span className="me-1">{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1 app-main">
          <div className="container-fluid app-container py-4 px-3 px-md-4">{children}</div>
        </main>

        <footer className="app-footer mt-auto">
          <div className="container-fluid app-container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <small>© {new Date().getFullYear()} PSTourism. Built for premium travel operations.</small>
            <small className="text-white-50">Reliable workflow, cleaner visibility, faster follow-up.</small>
          </div>
        </footer>
      </div>
    </>
  );
}
