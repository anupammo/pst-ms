import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import QuotationPreview from '../../components/QuotationPreview';

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

  const handleSave = async () => {
    setSaving(true);
    const body = {
      ...form,
      numberOfPax: Number(form.numberOfPax),
      numberOfRooms: Number(form.numberOfRooms) || undefined,
      basePrice: Number(form.basePrice) || undefined,
      discount: Number(form.discount) || 0,
      finalPrice: Number(form.finalPrice) || undefined,
      inclusions: typeof form.inclusions === 'string' ? form.inclusions.split('\n').filter(Boolean) : form.inclusions,
      exclusions: typeof form.exclusions === 'string' ? form.exclusions.split('\n').filter(Boolean) : form.exclusions,
    };
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
                {saving ? <span className="spinner-border spinner-border-sm" /> : '💾 Save'}
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
                { label: 'Number of Pax', name: 'numberOfPax', type: 'number' },
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
              <div className="col-md-6">
                <label className="form-label">Room Type</label>
                <select className="form-select" name="roomType" value={form.roomType} onChange={handleChange}>
                  {['Standard','Deluxe','Premium'].map(s => <option key={s}>{s}</option>)}
                </select>
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
                    ['Number of Pax', quotation.numberOfPax],
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
