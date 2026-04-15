import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Bootstrap JS for dropdowns/collapses
    require('bootstrap/dist/js/bootstrap.bundle.min.js');

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  return <Component {...pageProps} />;
}
