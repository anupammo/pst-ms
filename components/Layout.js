import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Layout({ children, title = 'PST Management System' }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { href: '/quotations', label: 'Quotations', icon: 'bi-file-earmark-text-fill' },
    { href: '/travellers', label: 'Travellers', icon: 'bi-people-fill' },
    { href: '/leads', label: 'Leads', icon: 'bi-bullseye' },
    { href: '/communications', label: 'Communications', icon: 'bi-megaphone-fill' },
    { href: '/invoices', label: 'Invoices', icon: 'bi-receipt-cutoff' },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <Head>
        <title>{`${title} | PSTourism`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#081225" />
        <meta
          name="description"
          content="Premium PSTourism workspace for quotations, leads, travellers, communications, and invoicing."
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <div className="app-shell d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg app-navbar sticky-top">
          <div className="container-fluid app-container">
            <Link href="/" className="navbar-brand d-flex align-items-center gap-3" onClick={() => setIsMenuOpen(false)}>
              <span className="brand-logo-wrap">
                <img src="https://pstourism.in/res/Logo.png" alt="PSTourism" className="brand-logo" />
              </span>
              <span>
                <span className="brand-title d-block">PSTourism</span>
                <small className="brand-subtitle">Premium Travel Ops Suite</small>
              </span>
            </Link>

            <div className="d-flex align-items-center gap-2 order-lg-2">
              <span className="status-pill">
                <i className="bi bi-stars"></i>
                2026 premium UI
              </span>
            </div>

            <button
              className={`navbar-toggler ${isMenuOpen ? '' : 'collapsed'}`}
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-controls="navbarNav"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1 nav-cluster">
                {navLinks.map((link) => (
                  <li key={link.href} className="nav-item">
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`nav-link nav-pill ${isActive(link.href) ? 'active fw-semibold' : ''}`}
                    >
                      <i className={`bi ${link.icon} nav-icon`}></i>
                      <span>{link.label}</span>
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
            <small>© {new Date().getFullYear()} PSTourism. Premium travel operations, streamlined.</small>
            <small className="text-white-50">Faster follow-up, cleaner visibility, dependable execution.</small>
          </div>
        </footer>
      </div>
    </>
  );
}
