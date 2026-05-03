import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import template from '../../lib/quotationTemplate';

export default function NewQuotation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clientName: '',
    contact: '',
    adults: '1',
    children: '0',
    numberOfRooms: '',
    roomType: 'Standard',
    route: '',
    cancellationPolicy: '',
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

  const generateQuotationHTML = (data) => {
    const adults = Number(data.adults || 0);
    const children = Number(data.children || 0);
    const paxText = `${adults} Adult(s)${children ? `, ${children} Child(ren)` : ''}`;
    const advance = data.finalPrice ? Math.round(Number(data.finalPrice) * 0.4) : 0;
    const inclusionsArr = Array.isArray(data.inclusions) ? data.inclusions : String(data.inclusions || '').split('\n').filter(Boolean);
    const exclusionsArr = Array.isArray(data.exclusions) ? data.exclusions : String(data.exclusions || '').split('\n').filter(Boolean);
    const inclusionsHTML = (inclusionsArr.length ? inclusionsArr : ['Quality stay']).map(i => `<li>${i}</li>`).join('');
    const exclusionsHTML = (exclusionsArr.length ? exclusionsArr : ['Entry fees, permits']).map(e => `<li>${e}</li>`).join('');
    // build itinerary HTML: if itinerary array provided, render days, else show itineraryLink or placeholder
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

  const handlePreview = (printNow = false) => {
    const html = generateQuotationHTML(form);
    const w = window.open('', '_blank', 'noopener');
    if (w) {
      w.document.write(html.replace('</body></html>', '<script>window.addEventListener("load",()=>{document.body.style.visibility="visible"; if(location.search.includes("print=1")) setTimeout(()=>window.print(),250);});</script></body></html>'));
      w.document.close();
      try { w.focus(); } catch (e) {}
      if (printNow) setTimeout(() => { try { w.print(); } catch (e) {} }, 400);
      return;
    }

    // Popup blocked fallback: store HTML and navigate to preview page
    try {
      sessionStorage.setItem('pst_preview_html', html);
      const url = '/quotations/preview' + (printNow ? '?print=1' : '');
      window.location.href = url;
    } catch (e) {
      alert('Popup blocked and fallback preview failed. Please allow popups or try a different browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      inclusions: form.inclusions ? form.inclusions.split('\n').filter(Boolean) : [],
      exclusions: form.exclusions ? form.exclusions.split('\n').filter(Boolean) : [],
    };
    // include generated HTML version
    body.html = generateQuotationHTML(body);

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
      <div className="d-flex align-items-center mb-4 flex-wrap gap-2">
        <button onClick={() => router.back()} className="btn btn-outline-secondary btn-sm me-1">
          <i className="bi bi-arrow-left me-1"></i>
          Back
        </button>
        <h2 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <span className="section-icon"><i className="bi bi-file-earmark-text"></i></span>
          New Quotation
        </h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Client Details */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0"><i className="bi bi-person-vcard me-2"></i>Client Details</h6>
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
                  <div className="col-12">
                    <label className="form-label">Number of Pax</label>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">How many Adults *</label>
                    <input type="number" className="form-control" name="adults" value={form.adults} onChange={handleChange} required min="0" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">How many Childs</label>
                    <input type="number" className="form-control" name="children" value={form.children} onChange={handleChange} min="0" />
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
                <h6 className="mb-0"><i className="bi bi-geo-alt me-2"></i>Trip Details</h6>
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
                  <div className="col-12">
                    <label className="form-label">Cancellation Policy</label>
                    <textarea className="form-control" name="cancellationPolicy" value={form.cancellationPolicy} onChange={handleChange} rows="3" placeholder="E.g. 25% refund up to 15 days before..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h6 className="mb-0"><i className="bi bi-cash-coin me-2"></i>Pricing</h6>
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
                <h6 className="mb-0"><i className="bi bi-check2-circle me-2"></i>Inclusions</h6>
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
                <h6 className="mb-0"><i className="bi bi-x-circle me-2"></i>Exclusions</h6>
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
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-floppy me-2"></i>Create Quotation</>}
            </button>
            <button type="button" className="btn btn-outline-secondary btn-lg me-2" onClick={() => handlePreview(false)}>
              <i className="bi bi-eye me-2"></i>Preview Quotation
            </button>
            <button type="button" className="btn btn-outline-secondary btn-lg me-2" onClick={() => handlePreview(true)}>
              <i className="bi bi-printer me-2"></i>Print / Save PDF
            </button>
            <div style={{display:'inline-block',verticalAlign:'middle',marginLeft:8}}>
              <label className="form-check-label me-2"><input type="checkbox" className="form-check-input me-1" name="sendToLead" onChange={(e)=>setForm(prev=>({...prev, sendToLead: e.target.checked}))} /> Send to Lead</label>
              <label className="form-check-label ms-2"><input type="checkbox" className="form-check-input me-1" name="sendToTravellers" onChange={(e)=>setForm(prev=>({...prev, sendToTravellers: e.target.checked}))} /> Send to Travellers</label>
            </div>
            <button type="button" className="btn btn-outline-secondary btn-lg" onClick={() => router.back()}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
