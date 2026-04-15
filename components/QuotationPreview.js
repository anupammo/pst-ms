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

📍 Trip Itinerary
${itineraryText}

💰 Package Pricing
Base Package Price: ₹ ${quotation.basePrice ? quotation.basePrice.toLocaleString('en-IN') : '[Amount]'}
Discount (if any): ₹ ${quotation.discount ? quotation.discount.toLocaleString('en-IN') : '0'}
✅ Final Package Cost: ₹ ${quotation.finalPrice ? quotation.finalPrice.toLocaleString('en-IN') : '[Final Amount]'}

🧾 Booking and Payment Policy
40% Advance: ₹ ${advance.toLocaleString('en-IN')}
60% Payable after check-in on Day 1
🔹 Pay ₹ ${advance.toLocaleString('en-IN')} now to confirm your booking.

✅ Inclusions
${inclusions.map((i) => `- ${i}`).join('\n')}

❌ Exclusions
${exclusions.map((e) => `- ${e}`).join('\n')}

ℹ️ Want to Know About Us?
About Us: https://www.pstourism.in/about-us
Google Reviews: https://maps.app.goo.gl/2iHbAFRBGeCRVwZi8
Explore Our Other Holiday Packages: https://www.pstourism.in/packages

📍 Our Offices
Kolkata: Garia, Bidhan Pally, Near Gitanjali Metro, Kolkata – 700084
Bankura: Palasdanga, Bankura – 722208

Regards
Team PST
PSTourism™️ — Unlocking Your Premium Travel Experience`;

  return (
    <div className="card border-primary">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <span className="fw-bold">📋 Form-1A Preview</span>
        <button
          className="btn btn-sm btn-light"
          onClick={() => {
            navigator.clipboard.writeText(text);
            alert('Quotation text copied to clipboard!');
          }}
        >
          📋 Copy Text
        </button>
      </div>
      <div className="card-body">
        <pre
          className="mb-0"
          style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            lineHeight: '1.6',
          }}
        >
          {text}
        </pre>
      </div>
    </div>
  );
}
