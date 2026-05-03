import template from '../lib/quotationTemplate';

export default function QuotationPreview({ quotation }) {
  if (!quotation) return null;

  const advance = quotation.finalPrice ? Math.round(quotation.finalPrice * 0.4) : 0;

  const defaultInclusions = [
    'Quality stay',
    'Quality food (Breakfast + Dinner / MAP Plan)',
    'Experienced driver cum guide',
    `Private ${quotation.vehicleType || '[Vehicle Type]'}`,
    'Dedicated client support team',
  ];

  const defaultExclusions = [
    'Entry fees, permits, tickets',
    'Parking charges',
    'Lunch or any food outside package',
    'Anything not mentioned in inclusion',
  ];

  const inclusions = quotation.inclusions && quotation.inclusions.length > 0
    ? quotation.inclusions
    : defaultInclusions;

  const exclusions = quotation.exclusions && quotation.exclusions.length > 0
    ? quotation.exclusions
    : defaultExclusions;

  const itineraryText = quotation.itinerary && quotation.itinerary.length > 0
    ? quotation.itinerary.map((d) => `Day ${d.day}: ${d.description}`).join('\n')
    : quotation.itineraryLink || '[Paste Itinerary Link or Summary]';

  const text = `Form -1A || Quotation from PST

${quotation.tripDuration || '[Trip Duration]'} ${quotation.destination || '[Destination]'} Package trip with PSTourism™️, An ISO 9001:2015 certified travel company
Official website: www.pstourism.in

Traveller Details
Client Name: ${quotation.clientName}
Number of Pax: ${quotation.numberOfPax}
Number of Rooms: ${quotation.numberOfRooms || '[No. of Rooms]'}
Route / Pickup-Drop: (${quotation.route || '[Route]'})

Trip Itinerary
${itineraryText}

Package Pricing
Base Package Price: ₹ ${quotation.basePrice ? quotation.basePrice.toLocaleString('en-IN') : '[Amount]'}
Discount (if any): ₹ ${quotation.discount ? quotation.discount.toLocaleString('en-IN') : '0'}
Final Package Cost: ₹ ${quotation.finalPrice ? quotation.finalPrice.toLocaleString('en-IN') : '[Final Amount]'}

Booking and Payment Policy
40% Advance: ₹ ${advance.toLocaleString('en-IN')}
60% Payable after check-in on Day 1
Pay ₹ ${advance.toLocaleString('en-IN')} now to confirm your booking.

Inclusions
${inclusions.map((i) => `- ${i}`).join('\n')}

Exclusions
${exclusions.map((e) => `- ${e}`).join('\n')}

Know More About Us
About Us: https://www.pstourism.in/about-us
Google Reviews: https://maps.app.goo.gl/2iHbAFRBGeCRVwZi8
Explore Our Other Holiday Packages: https://www.pstourism.in/packages

Our Offices
Kolkata: Garia, Bidhan Pally, Near Gitanjali Metro, Kolkata – 700084
Bankura: Palasdanga, Bankura – 722208

Regards
Team PST
PSTourism™️ — Unlocking Your Premium Travel Experience`;
  const openHtmlPreview = (printNow = false) => {
    const advance = quotation.finalPrice ? Math.round(quotation.finalPrice * 0.4) : 0;
    const itineraryHTML = Array.isArray(quotation.itinerary) && quotation.itinerary.length
      ? quotation.itinerary.map(d => `<div style="margin-bottom:10px"><strong>Day ${d.day}:</strong> ${d.description}</div>`).join('')
      : (quotation.itineraryLink ? `<div><a href="${quotation.itineraryLink}" target="_blank">${quotation.itineraryLink}</a></div>` : '<div>[Itinerary will be added]</div>');

    const inclusionsHTML = (inclusions || []).map(i => `<li>${i}</li>`).join('');
    const exclusionsHTML = (exclusions || []).map(e => `<li>${e}</li>`).join('');

    const html = template
      .replace(/{{CLIENT_NAME}}/g, String(quotation.clientName || '-'))
      .replace(/{{PAX_TEXT}}/g, `${quotation.adults||0} Adult(s)${quotation.children ? ', '+quotation.children+' Child(ren)' : ''}`)
      .replace(/{{NUM_ROOMS}}/g, String(quotation.numberOfRooms || '-'))
      .replace(/{{ROUTE}}/g, String(quotation.route || '-'))
      .replace(/{{ITINERARY_HTML}}/g, itineraryHTML)
      .replace(/{{DESTINATION}}/g, String(quotation.destination || '-'))
      .replace(/{{TRIP_DURATION}}/g, String(quotation.tripDuration || '-'))
      .replace(/{{BASE_PRICE}}/g, String(quotation.basePrice || '-'))
      .replace(/{{DISCOUNT}}/g, String(quotation.discount || 0))
      .replace(/{{FINAL_PRICE}}/g, String(quotation.finalPrice || '-'))
      .replace(/{{ADVANCE}}/g, String(advance))
      .replace(/{{CANCELLATION}}/g, String(quotation.cancellationPolicy || 'Standard cancellation policy applies.'))
      .replace(/{{INCLUSIONS_HTML}}/g, inclusionsHTML)
      .replace(/{{EXCLUSIONS_HTML}}/g, exclusionsHTML);

    const w = window.open('', '_blank', 'noopener');
    if (w) {
      w.document.write(html);
      w.document.close();
      try { w.focus(); } catch (e) {}
      if (printNow) setTimeout(() => { try { w.print(); } catch (e) {} }, 400);
      return;
    }

    // Fallback when popup blocked: save HTML and navigate to preview page
    try {
      sessionStorage.setItem('pst_preview_html', html);
      const url = '/quotations/preview' + (printNow ? '?print=1' : '');
      window.location.href = url;
    } catch (e) {
      alert('Popup blocked — allow popups for this site to preview');
    }
  };

  return (
    <div className="card border-primary">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <span className="fw-bold"><i className="bi bi-file-earmark-text me-2"></i>Form-1A Preview</span>
        <div>
          <button className="btn btn-sm btn-light me-2" onClick={() => { navigator.clipboard.writeText(text); alert('Quotation text copied to clipboard!'); }}><i className="bi bi-copy me-1"></i>Copy Text</button>
          <button className="btn btn-sm btn-light me-2" onClick={() => openHtmlPreview(false)}><i className="bi bi-eye me-1"></i>Preview</button>
          <button className="btn btn-sm btn-light" onClick={() => openHtmlPreview(true)}><i className="bi bi-printer me-1"></i>Print / Save PDF</button>
        </div>
      </div>
      <div className="card-body">
        <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: '1.6' }}>{text}</pre>
      </div>
    </div>
  );
}
