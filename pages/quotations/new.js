import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function NewQuotation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clientName: '',
    contact: '',
    numberOfPax: '',
    numberOfRooms: '',
    roomType: 'Standard',
    route: '',
    tripDuration: '',
    destination: '',
    itineraryLink: '',
    basePrice: '',
    discount: '0',
    finalPrice: '',
    vehicleType: '',
    inclusions: '',
    exclusions: '',
    status: 'Draft',
    notes: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body = {
      ...form,
      numberOfPax: Number(form.numberOfPax),
      numberOfRooms: Number(form.numberOfRooms) || undefined,
      basePrice: Number(form.basePrice) || undefined,
      discount: Number(form.discount) || 0,
      finalPrice: Number(form.finalPrice) || undefined,
      inclusions: form.inclusions ? form.inclusions.split('\n').filter(Boolean) : [],
      exclusions: form.exclusions ? form.exclusions.split('\n').filter(Boolean) : [],
    };

    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/quotations/${data.data._id}`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to create quotation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="New Quotation">
      <div className="d-flex align-items-center mb-4">
        <button onClick={() => router.back()} className="btn btn-outline-secondary btn-sm me-3">← Back</button>
        <h2 className="mb-0 fw-bold">📋 New Quotation</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Client Details */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0">👤 Client Details</h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Client Name *</label>
                    <input type="text" className="form-control" name="clientName" value={form.clientName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Contact</label>
                    <input type="text" className="form-control" name="contact" value={form.contact} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Number of Pax *</label>
                    <input type="number" className="form-control" name="numberOfPax" value={form.numberOfPax} onChange={handleChange} required min="1" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Number of Rooms</label>
                    <input type="number" className="form-control" name="numberOfRooms" value={form.numberOfRooms} onChange={handleChange} min="1" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Room Type</label>
                    <select className="form-select" name="roomType" value={form.roomType} onChange={handleChange}>
                      <option>Standard</option>
                      <option>Deluxe</option>
                      <option>Premium</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">📍 Trip Details</h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Destination</label>
                    <input type="text" className="form-control" name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Sikkim, Darjeeling" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Trip Duration</label>
                    <input type="text" className="form-control" name="tripDuration" value={form.tripDuration} onChange={handleChange} placeholder="e.g. 5 Nights / 6 Days" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Route / Pickup-Drop</label>
                    <input type="text" className="form-control" name="route" value={form.route} onChange={handleChange} placeholder="e.g. NJP-NJP or Kolkata-Kolkata" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Vehicle Type</label>
                    <input type="text" className="form-control" name="vehicleType" value={form.vehicleType} onChange={handleChange} placeholder="e.g. Innova Crysta, Tempo Traveller" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Itinerary Link</label>
                    <input type="url" className="form-control" name="itineraryLink" value={form.itineraryLink} onChange={handleChange} placeholder="https://..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h6 className="mb-0">💰 Pricing</h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Base Package Price (₹)</label>
                    <input type="number" className="form-control" name="basePrice" value={form.basePrice} onChange={handleChange} min="0" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Discount (₹)</label>
                    <input type="number" className="form-control" name="discount" value={form.discount} onChange={handleChange} min="0" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Final Price (₹)</label>
                    <input type="number" className="form-control" name="finalPrice" value={form.finalPrice} onChange={handleChange} min="0" />
                  </div>
                  {form.finalPrice && (
                    <div className="col-12">
                      <div className="alert alert-info mb-0">
                        <strong>40% Advance: ₹{Math.round(Number(form.finalPrice) * 0.4).toLocaleString('en-IN')}</strong>
                        <span className="ms-3 text-muted">Balance (60%): ₹{Math.round(Number(form.finalPrice) * 0.6).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">✅ Inclusions</h6>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  name="inclusions"
                  value={form.inclusions}
                  onChange={handleChange}
                  rows="6"
                  placeholder="One item per line&#10;Quality stay&#10;Quality food (MAP Plan)&#10;..."
                />
                <small className="text-muted">Leave blank for default inclusions</small>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-danger text-white">
                <h6 className="mb-0">❌ Exclusions</h6>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  name="exclusions"
                  value={form.exclusions}
                  onChange={handleChange}
                  rows="6"
                  placeholder="One item per line&#10;Entry fees, permits&#10;Parking charges&#10;..."
                />
                <small className="text-muted">Leave blank for default exclusions</small>
              </div>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-secondary text-white">
                <h6 className="mb-0">⚙️ Settings</h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                      <option>Draft</option>
                      <option>Sent</option>
                      <option>Accepted</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">Internal Notes</label>
                    <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows="2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary btn-lg me-2" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : '💾 Create Quotation'}
            </button>
            <button type="button" className="btn btn-outline-secondary btn-lg" onClick={() => router.back()}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
