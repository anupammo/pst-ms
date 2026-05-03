const now = new Date();

function daysAgo(days) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export const demoTravellers = [
  {
    _id: 'demo-traveller-1',
    name: 'Aarav Sharma',
    contact: '+91 9876500011',
    email: 'aarav.sharma@example.com',
    address: 'Bengaluru, Karnataka',
    idProofType: 'Passport',
    idProofNumber: 'N1234567',
    dateOfBirth: '1991-03-14T00:00:00.000Z',
    numberOfPax: 2,
    specialRequirements: 'Early check-in and vegetarian meals',
    tags: ['family', 'premium'],
    createdAt: daysAgo(12),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'demo-traveller-2',
    name: 'Priya Mehta',
    contact: '+91 9876500022',
    email: 'priya.mehta@example.com',
    address: 'Ahmedabad, Gujarat',
    idProofType: 'Aadhaar',
    idProofNumber: '4587-3321-9012',
    dateOfBirth: '1994-07-09T00:00:00.000Z',
    numberOfPax: 4,
    specialRequirements: 'Child-friendly room setup',
    tags: ['group', 'repeat'],
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'demo-traveller-3',
    name: 'Kabir Singh',
    contact: '+91 9876500033',
    email: 'kabir.singh@example.com',
    address: 'Delhi, India',
    idProofType: 'Driving License',
    idProofNumber: 'DL-1122334455',
    dateOfBirth: '1988-11-21T00:00:00.000Z',
    numberOfPax: 1,
    specialRequirements: 'Airport transfer required',
    tags: ['solo', 'corporate'],
    createdAt: daysAgo(5),
    updatedAt: now.toISOString(),
  },
];

export const demoLeads = [
  {
    _id: 'demo-lead-1',
    clientName: 'Rohan & Neha Kapoor',
    contact: '+91 9988776601',
    email: 'kapoor.family@example.com',
    source: 'Website',
    interestedPackage: 'Kashmir Summer Escape',
    destination: 'Kashmir',
    budget: 145000,
    travelDate: daysFromNow(25),
    numberOfPax: 4,
    status: 'Interested',
    followUps: [
      { date: daysAgo(3), note: 'Shared itinerary and hotel options', doneBy: 'Anup', createdAt: daysAgo(3) },
      { date: daysAgo(1), note: 'Waiting for travel date confirmation', doneBy: 'Anup', createdAt: daysAgo(1) },
    ],
    notes: 'Looking for scenic premium stay with houseboat option.',
    assignedTo: 'Sales Team',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'demo-lead-2',
    clientName: 'Meera Iyer',
    contact: '+91 9988776602',
    email: 'meera.iyer@example.com',
    source: 'WhatsApp',
    interestedPackage: 'North East Explorer',
    destination: 'Sikkim',
    budget: 82000,
    travelDate: daysFromNow(18),
    numberOfPax: 2,
    status: 'Contacted',
    followUps: [{ date: daysAgo(2), note: 'Sent pricing breakdown', doneBy: 'Riya', createdAt: daysAgo(2) }],
    notes: 'Interested in snow view rooms and private cab.',
    assignedTo: 'Riya',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'demo-lead-3',
    clientName: 'Vikram Desai',
    contact: '+91 9988776603',
    email: 'vikram.desai@example.com',
    source: 'Referral',
    interestedPackage: 'Goa Luxe Weekend',
    destination: 'Goa',
    budget: 56000,
    travelDate: daysFromNow(10),
    numberOfPax: 3,
    status: 'New',
    followUps: [],
    notes: 'Requested beachfront stay and nightlife suggestions.',
    assignedTo: 'Sales Team',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

export const demoQuotations = [
  {
    _id: 'demo-quotation-1',
    quotationNumber: 'QT-2026-001',
    clientName: 'Rohan & Neha Kapoor',
    contact: '+91 9988776601',
    numberOfPax: 4,
    numberOfRooms: 2,
    roomType: 'Premium',
    route: 'Srinagar - Gulmarg - Pahalgam',
    tripDuration: '5N / 6D',
    destination: 'Kashmir',
    itinerary: [
      { day: 1, description: 'Arrival in Srinagar and check-in to premium hotel' },
      { day: 2, description: 'Gulmarg sightseeing with gondola experience' },
    ],
    basePrice: 152000,
    discount: 7000,
    finalPrice: 145000,
    vehicleType: 'Innova Crysta',
    inclusions: ['Breakfast', 'Private Cab', 'Airport Pickup'],
    exclusions: ['Airfare', 'Personal Expenses'],
    status: 'Sent',
    notes: 'Premium honeymoon-friendly itinerary.',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'demo-quotation-2',
    quotationNumber: 'QT-2026-002',
    clientName: 'Meera Iyer',
    contact: '+91 9988776602',
    numberOfPax: 2,
    numberOfRooms: 1,
    roomType: 'Deluxe',
    route: 'Gangtok - Tsomgo - Lachung',
    tripDuration: '4N / 5D',
    destination: 'Sikkim',
    basePrice: 86000,
    discount: 4000,
    finalPrice: 82000,
    vehicleType: 'Sedan',
    inclusions: ['Breakfast', 'Sightseeing'],
    exclusions: ['Entry tickets'],
    status: 'Accepted',
    notes: 'Customer prefers flexible timing and cozy stay.',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'demo-quotation-3',
    quotationNumber: 'QT-2026-003',
    clientName: 'Vikram Desai',
    contact: '+91 9988776603',
    numberOfPax: 3,
    numberOfRooms: 1,
    roomType: 'Standard',
    route: 'North Goa - South Goa',
    tripDuration: '3N / 4D',
    destination: 'Goa',
    basePrice: 62000,
    discount: 6000,
    finalPrice: 56000,
    vehicleType: 'SUV',
    inclusions: ['Breakfast', 'Pickup and Drop'],
    exclusions: ['Water sports'],
    status: 'Draft',
    notes: 'Awaiting client confirmation on hotel category.',
    createdAt: daysAgo(1),
    updatedAt: now.toISOString(),
  },
];

export const demoInvoices = [
  {
    _id: 'demo-invoice-1',
    invoiceNumber: 'INV-2026-001',
    quotationId: 'demo-quotation-1',
    clientName: 'Rohan & Neha Kapoor',
    contact: '+91 9988776601',
    email: 'kapoor.family@example.com',
    destination: 'Kashmir',
    tripDuration: '5N / 6D',
    travelDate: daysFromNow(25),
    numberOfPax: 4,
    baseAmount: 152000,
    discount: 7000,
    finalAmount: 145000,
    advanceAmount: 58000,
    balanceAmount: 87000,
    payments: [{ amount: 58000, date: daysAgo(2), method: 'UPI', reference: 'UPI-KAP-001', note: 'Advance received' }],
    paymentStatus: 'Partial',
    notes: 'Balance due one week before travel.',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'demo-invoice-2',
    quotationId: 'demo-quotation-2',
    invoiceNumber: 'INV-2026-002',
    clientName: 'Meera Iyer',
    contact: '+91 9988776602',
    email: 'meera.iyer@example.com',
    destination: 'Sikkim',
    tripDuration: '4N / 5D',
    travelDate: daysFromNow(18),
    numberOfPax: 2,
    baseAmount: 86000,
    discount: 4000,
    finalAmount: 82000,
    advanceAmount: 82000,
    balanceAmount: 0,
    payments: [{ amount: 82000, date: daysAgo(1), method: 'Bank Transfer', reference: 'NEFT-MEERA-002', note: 'Full payment received' }],
    paymentStatus: 'Paid',
    notes: 'Invoice settled in full.',
    createdAt: daysAgo(1),
    updatedAt: now.toISOString(),
  },
];

export const demoCommunications = [
  {
    _id: 'demo-communication-1',
    title: 'Summer Escape Offer',
    type: 'Offer',
    content: 'Exclusive savings on Kashmir and Sikkim departures this season. Contact the PSTourism team to confirm availability.',
    targetAudience: 'Leads',
    status: 'Sent',
    tags: ['seasonal', 'offer'],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'demo-communication-2',
    title: 'Weekend Departure Reminder',
    type: 'Update',
    content: 'Please carry valid ID proof and arrive 30 minutes before the scheduled departure time.',
    targetAudience: 'Travellers',
    status: 'Draft',
    tags: ['update'],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
];

export function getDemoDashboardData() {
  const recentQuotations = [...demoQuotations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentLeads = [...demoLeads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const activeLeads = demoLeads.filter((lead) => ['New', 'Contacted', 'Interested'].includes(lead.status)).length;

  return {
    totalQuotations: demoQuotations.length,
    totalTravellers: demoTravellers.length,
    totalLeads: demoLeads.length,
    totalInvoices: demoInvoices.length,
    activeLeads,
    recentQuotations,
    recentLeads,
  };
}

export function getDemoCollection(resource) {
  const collections = {
    travellers: demoTravellers,
    leads: demoLeads,
    quotations: demoQuotations,
    invoices: demoInvoices,
    communications: demoCommunications,
  };

  return collections[resource] || [];
}

export function getDemoRecord(resource, id) {
  return getDemoCollection(resource).find((item) => item._id === id) || null;
}
