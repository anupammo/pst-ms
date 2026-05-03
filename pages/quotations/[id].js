import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import QuotationPreview from '../../components/QuotationPreview';
import template from '../../lib/quotationTemplate';

export default function QuotationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/quotations/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setQuotation(data.data);
          setForm({
            ...data.data,
            adults: data.data.adults || String(data.data.numberOfPax || 0),
            children: data.data.children || '0',
            cancellationPolicy: data.data.cancellationPolicy || '',
            inclusions: (data.data.inclusions || []).join('\n'),
            exclusions: (data.data.exclusions || []).join('\n'),
          });
        } else setError(data.error);
      })
      .catch(() => setError('Failed to load quotation'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'basePrice' || name === 'discount') {
        const base = parseFloat(name === 'basePrice' ? value : prev.basePrice) || 0;
        const disc = parseFloat(name === 'discount' ? value : prev.discount) || 0;
        updated.finalPrice = String(base - disc);
      }
      return updated;
    });
  };

  const generateQuotationHTML = (data) => {
    const adults = Number(data.adults || 0);
    const children = Number(data.children || 0);
    const paxText = `${adults} Adult(s)${children ? `, ${children} Child(ren)` : ''}`;
    const advance = data.finalPrice ? Math.round(Number(data.finalPrice) * 0.4) : 0;
    const inclusionsArr = Array.isArray(data.inclusions) ? data.inclusions : String(data.inclusions || '').split('\n').filter(Boolean);
    const exclusionsArr = Array.isArray(data.exclusions) ? data.exclusions : String(data.exclusions || '').split('\n').filter(Boolean);
    const inclusionsHTML = (inclusionsArr.length ? inclusionsArr : ['Quality stay']).map(i => `<li>${i}</li>`).join('');
    const exclusionsHTML = (exclusionsArr.length ? exclusionsArr : ['Entry fees, permits']).map(e => `<li>${e}</li>`).join('');
    let itineraryHTML = '';
    if (Array.isArray(data.itinerary) && data.itinerary.length) {
      itineraryHTML = data.itinerary.map(d => `<div style="margin-bottom:10px"><strong>Day ${d.day}:</strong> ${d.description}</div>`).join('');
    } else if (data.itineraryLink) {
      itineraryHTML = `<div><a href="${data.itineraryLink}" target="_blank">${data.itineraryLink}</a></div>`;
    } else {
      itineraryHTML = '<div>[Itinerary will be added]</div>';
    }
    let out = template
      .replace(/{{CLIENT_NAME}}/g, String(data.clientName || '-'))
      .replace(/{{PAX_TEXT}}/g, paxText)
      .replace(/{{NUM_ROOMS}}/g, String(data.numberOfRooms || '-'))
      .replace(/{{ROUTE}}/g, String(data.route || '-'))
      .replace(/{{ITINERARY_HTML}}/g, itineraryHTML)
      .replace(/{{DESTINATION}}/g, String(data.destination || '-'))
      .replace(/{{TRIP_DURATION}}/g, String(data.tripDuration || '-'))
      .replace(/{{BASE_PRICE}}/g, String(data.basePrice || '-'))
      .replace(/{{DISCOUNT}}/g, String(data.discount || 0))
      .replace(/{{FINAL_PRICE}}/g, String(data.finalPrice || '-'))
      .replace(/{{ADVANCE}}/g, String(advance))
      .replace(/{{CANCELLATION}}/g, String(data.cancellationPolicy || 'Standard cancellation policy applies.'))
      .replace(/{{INCLUSIONS_HTML}}/g, inclusionsHTML)
      .replace(/{{EXCLUSIONS_HTML}}/g, exclusionsHTML);
    return out;
  };

  const handleSave = async () => {
    setSaving(true);
    const adults = Number(form.adults || 0);
    const children = Number(form.children || 0);
    const body = {
      ...form,
      adults,
      children,
      numberOfPax: adults + children,
      numberOfRooms: Number(form.numberOfRooms) || undefined,
      basePrice: Number(form.basePrice) || undefined,
      discount: Number(form.discount) || 0,
      finalPrice: Number(form.finalPrice) || undefined,
      inclusions: typeof form.inclusions === 'string' ? form.inclusions.split('\n').filter(Boolean) : form.inclusions,
      exclusions: typeof form.exclusions === 'string' ? form.exclusions.split('\n').filter(Boolean) : form.exclusions,
    };
    body.html = generateQuotationHTML(body);
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setQuotation(data.data);
        setEditing(false);
      } else setError(data.error);
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this quotation? This cannot be undone.')) return;
    await fetch(`/api/quotations/${id}`, { method: 'DELETE' });
    router.push('/quotations');
  };

  const statusColors = { Draft: 'secondary', Sent: 'info', Accepted: 'success', Rejected: 'danger' };

  const paxDisplay = `${quotation?.adults || 0} Adult(s)${quotation?.children ? ', ' + quotation.children + ' Child(ren)' : ''}`;

  if (loading) return (
    <Layout title="Quotation"><div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div></Layout>
  );
  if (error) return <Layout title="Error"><div className="alert alert-danger">{error}</div></Layout>;
  if (!quotation) return null;

  return (
    <Layout title={`Quotation - ${quotation.clientName}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <button onClick={() => router.push('/quotations')} className="btn btn-outline-secondary btn-sm">← Back</button>
          <div>
            <h2 className="mb-0 fw-bold">{quotation.quotationNumber}</h2>
            <span className={`badge bg-${statusColors[quotation.status]}`}>{quotation.status}</span>
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="btn btn-outline-primary btn-sm">✏️ Edit</button>
              <button onClick={handleDelete} className="btn btn-outline-danger btn-sm">🗑️ Delete</button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className="btn btn-success btn-sm" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-floppy me-1"></i>Save</>}
              </button>
              <button onClick={() => { setEditing(false); setForm({ ...quotation, inclusions: (quotation.inclusions||[]).join('\n'), exclusions: (quotation.exclusions||[]).join('\n') }); }} className="btn btn-outline-secondary btn-sm">Cancel</button>
            </>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-7">
          {editing ? (
            <div className="row g-3">
              {[
                { label: 'Client Name', name: 'clientName', type: 'text', required: true },
                { label: 'Contact', name: 'contact', type: 'text' },
                { label: 'Destination', name: 'destination', type: 'text' },
                { label: 'Trip Duration', name: 'tripDuration', type: 'text' },
                { label: 'Number of Rooms', name: 'numberOfRooms', type: 'number' },
                { label: 'Route', name: 'route', type: 'text' },
                { label: 'Vehicle Type', name: 'vehicleType', type: 'text' },
                { label: 'Itinerary Link', name: 'itineraryLink', type: 'url' },
                { label: 'Base Price (₹)', name: 'basePrice', type: 'number' },
                { label: 'Discount (₹)', name: 'discount', type: 'number' },
                { label: 'Final Price (₹)', name: 'finalPrice', type: 'number' },
              ].map(({ label, name, type, required }) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label">{label}</label>
                  <input type={type} className="form-control" name={name} value={form[name] || ''} onChange={handleChange} required={required} />
                </div>
              ))}
              <div className="col-12">
                <label className="form-label">Number of Pax</label>
              </div>
              <div className="col-md-6">
                <label className="form-label">Adults</label>
                <input type="number" className="form-control" name="adults" value={form.adults || ''} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Childs</label>
                <input type="number" className="form-control" name="children" value={form.children || ''} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Room Type</label>
                <select className="form-select" name="roomType" value={form.roomType} onChange={handleChange}>
                  {['Standard','Deluxe','Premium'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Cancellation Policy</label>
                <textarea className="form-control" name="cancellationPolicy" value={form.cancellationPolicy || ''} onChange={handleChange} rows="3" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  {['Draft','Sent','Accepted','Rejected'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Inclusions (one per line)</label>
                <textarea className="form-control" name="inclusions" value={form.inclusions || ''} onChange={handleChange} rows="4" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Exclusions (one per line)</label>
                <textarea className="form-control" name="exclusions" value={form.exclusions || ''} onChange={handleChange} rows="4" />
              </div>
              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea className="form-control" name="notes" value={form.notes || ''} onChange={handleChange} rows="2" />
              </div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-header bg-white"><h6 className="mb-0 fw-bold">Quotation Details</h6></div>
              <div className="card-body">
                <div className="row g-3">
                  {[
                    ['Client Name', quotation.clientName],
                    ['Contact', quotation.contact],
                    ['Destination', quotation.destination],
                    ['Trip Duration', quotation.tripDuration],
                    ['Number of Pax', paxDisplay],
                    ['Number of Rooms', quotation.numberOfRooms],
                    ['Room Type', quotation.roomType],
                    ['Route', quotation.route],
                    ['Vehicle Type', quotation.vehicleType],
                    ['Base Price', quotation.basePrice ? `₹${quotation.basePrice.toLocaleString('en-IN')}` : '-'],
                    ['Discount', quotation.discount ? `₹${quotation.discount.toLocaleString('en-IN')}` : '-'],
                    ['Final Price', quotation.finalPrice ? `₹${quotation.finalPrice.toLocaleString('en-IN')}` : '-'],
                    ['40% Advance', quotation.finalPrice ? `₹${Math.round(quotation.finalPrice * 0.4).toLocaleString('en-IN')}` : '-'],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div className="col-md-6" key={label}>
                      <small className="text-muted d-block">{label}</small>
                      <span className="fw-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                {quotation.itineraryLink && (
                  <div className="mt-3">
                    <small className="text-muted d-block">Itinerary Link</small>
                    <a href={quotation.itineraryLink} target="_blank" rel="noopener noreferrer">{quotation.itineraryLink}</a>
                  </div>
                )}
                {quotation.notes && (
                  <div className="mt-3">
                    <small className="text-muted d-block">Notes</small>
                    <p className="mb-0">{quotation.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="col-lg-5">
          <QuotationPreview quotation={editing ? {
            ...form,
            inclusions: typeof form.inclusions === 'string' ? form.inclusions.split('\n').filter(Boolean) : form.inclusions,
            exclusions: typeof form.exclusions === 'string' ? form.exclusions.split('\n').filter(Boolean) : form.exclusions,
          } : quotation} />
        </div>
      </div>
    </Layout>
  );
}
