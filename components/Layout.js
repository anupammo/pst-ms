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
        <title>{title} | PSTourism</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0d6efd" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <div className="d-flex flex-column min-vh-100">
        {/* Top Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
          <div className="container-fluid">
            <Link href="/" className="navbar-brand fw-bold">
              ✈️ PSTourism MS
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {navLinks.map((link) => (
                  <li key={link.href} className="nav-item">
                    <Link
                      href={link.href}
                      className={`nav-link ${isActive(link.href) ? 'active fw-semibold' : ''}`}
                    >
                      {link.icon} {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-grow-1 bg-light">
          <div className="container-fluid py-4 px-3 px-md-4">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <small>
            © {new Date().getFullYear()} PSTourism™️ — Unlocking Your Premium Travel Experience
          </small>
        </footer>
      </div>
    </>
  );
}
