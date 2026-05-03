import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function QuotationPreviewPage() {
  const router = useRouter();
  const { query } = router;
  const [html, setHtml] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('pst_preview_html');
    if (stored) setHtml(stored);
    // auto-print if requested
    if (query.print === '1') {
      // wait for content to render
      setTimeout(() => {
        window.print();
      }, 400);
    }
  }, [query.print]);

  if (!html) return (
    <div style={{padding:40}}>No preview available. Generate a preview from the quotation form first.</div>
  );

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
