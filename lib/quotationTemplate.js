// Quotation HTML template with placeholders.
// Placeholders will be replaced when generating a quotation HTML:
// {{CLIENT_NAME}}, {{PAX_TEXT}}, {{NUM_ROOMS}}, {{ROUTE}}, {{ITINERARY_HTML}},
// {{DESTINATION}}, {{TRIP_DURATION}}, {{BASE_PRICE}}, {{DISCOUNT}}, {{FINAL_PRICE}}, {{ADVANCE}},
// {{CANCELLATION}}, {{INCLUSIONS_HTML}}, {{EXCLUSIONS_HTML}}

const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PST Quotation</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:Inter,system-ui,Arial;margin:20px;background:#eef2f8;color:#123}
    .email-container{max-width:800px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden}
    .gradient-header{background:linear-gradient(135deg,#102B3F,#1A4A6F);padding:28px;color:#fff}
    .main-title{font-size:22px;font-weight:700}
    .content-padding{padding:24px}
    .info-card{background:#F9FBFE;padding:16px;border-radius:12px;margin-bottom:18px;border:1px solid #E9EDF2}
    .section-title{font-weight:700;margin-bottom:12px;color:#0C2E42}
    .detail-grid{display:flex;flex-wrap:wrap;gap:12px}
    .detail-item{flex:1 1 200px}
    .price-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #E9EDF2}
    .btn{display:inline-block;padding:10px 14px;border-radius:8px;background:#0F5C7F;color:#fff;text-decoration:none}
    @media(print){body{background:#fff} .btn{display:none}}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="gradient-header">
      <div class="main-title">PST Quotation</div>
      <div style="margin-top:8px;color:#CFE6F5">{{DESTINATION}} — {{TRIP_DURATION}}</div>
    </div>
    <div class="content-padding">
      <div class="info-card">
        <div class="section-title">Traveller Details</div>
        <div class="detail-grid">
          <div class="detail-item"><div><strong>Client Name</strong></div><div>{{CLIENT_NAME}}</div></div>
          <div class="detail-item"><div><strong>Number of Pax</strong></div><div>{{PAX_TEXT}}</div></div>
          <div class="detail-item"><div><strong>Number of Rooms</strong></div><div>{{NUM_ROOMS}}</div></div>
          <div class="detail-item"><div><strong>Route / Pickup-Drop</strong></div><div>{{ROUTE}}</div></div>
        </div>
      </div>

      <div class="info-card">
        <div class="section-title">Trip Itinerary</div>
        {{ITINERARY_HTML}}
      </div>

      <div class="info-card">
        <div class="section-title">Package Pricing</div>
        <div class="price-row"><div>Base Package Price</div><div>₹ {{BASE_PRICE}}</div></div>
        <div class="price-row"><div>Discount</div><div>₹ {{DISCOUNT}}</div></div>
        <div class="price-row" style="border-bottom:none"><div style="font-weight:700">Final Package Cost</div><div style="font-weight:800">₹ {{FINAL_PRICE}}</div></div>
        <div style="margin-top:12px">40% Advance: <strong>₹ {{ADVANCE}}</strong></div>
      </div>

      <div class="info-card">
        <div class="section-title">Cancellation Policy</div>
        <div>{{CANCELLATION}}</div>
      </div>

      <div class="info-card">
        <div style="display:flex;gap:20px">
          <div style="flex:1">
            <div class="section-title">Inclusions</div>
            <ul>{{INCLUSIONS_HTML}}</ul>
          </div>
          <div style="flex:1">
            <div class="section-title">Exclusions</div>
            <ul>{{EXCLUSIONS_HTML}}</ul>
          </div>
        </div>
      </div>

      <div style="text-align:center;margin-top:18px">
        <a class="btn" href="#" onclick="window.print();return false">Print / Save PDF</a>
      </div>
    </div>
  </div>
</body>
</html>`;

export default template;
