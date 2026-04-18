import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import mongoose from 'mongoose';

function loadEnvFile(fileName = '.env.local') {
  const envPath = path.join(process.cwd(), fileName);

  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, '');

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function buildDemoData() {
  const quotationIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
  ];

  return {
    travellers: [
      {
        name: 'Aarav Sharma',
        contact: '+91 9876500011',
        email: 'aarav.sharma@example.com',
        address: 'Bengaluru, Karnataka',
        idProofType: 'Passport',
        idProofNumber: 'N1234567',
        dateOfBirth: new Date('1991-03-14'),
        numberOfPax: 2,
        specialRequirements: 'Early check-in and vegetarian meals',
        tags: ['family', 'premium'],
        createdAt: daysAgo(12),
        updatedAt: daysAgo(2),
      },
      {
        name: 'Priya Mehta',
        contact: '+91 9876500022',
        email: 'priya.mehta@example.com',
        address: 'Ahmedabad, Gujarat',
        idProofType: 'Aadhaar',
        idProofNumber: '4587-3321-9012',
        dateOfBirth: new Date('1994-07-09'),
        numberOfPax: 4,
        specialRequirements: 'Child-friendly room setup',
        tags: ['group', 'repeat'],
        createdAt: daysAgo(8),
        updatedAt: daysAgo(1),
      },
      {
        name: 'Kabir Singh',
        contact: '+91 9876500033',
        email: 'kabir.singh@example.com',
        address: 'Delhi, India',
        idProofType: 'Driving License',
        idProofNumber: 'DL-1122334455',
        dateOfBirth: new Date('1988-11-21'),
        numberOfPax: 1,
        specialRequirements: 'Airport transfer required',
        tags: ['solo', 'corporate'],
        createdAt: daysAgo(5),
        updatedAt: new Date(),
      },
    ],
    leads: [
      {
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
        followUps: [
          { date: daysAgo(2), note: 'Sent pricing breakdown', doneBy: 'Riya', createdAt: daysAgo(2) },
        ],
        notes: 'Interested in snow view rooms and private cab.',
        assignedTo: 'Riya',
        createdAt: daysAgo(4),
        updatedAt: daysAgo(2),
      },
      {
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
    ],
    quotations: [
      {
        _id: quotationIds[0],
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
          { day: 3, description: 'Pahalgam valley excursion' },
        ],
        itineraryLink: 'https://example.com/itinerary/kashmir-premium',
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
        _id: quotationIds[1],
        quotationNumber: 'QT-2026-002',
        clientName: 'Meera Iyer',
        contact: '+91 9988776602',
        numberOfPax: 2,
        numberOfRooms: 1,
        roomType: 'Deluxe',
        route: 'Gangtok - Tsomgo - Lachung',
        tripDuration: '4N / 5D',
        destination: 'Sikkim',
        itinerary: [
          { day: 1, description: 'Airport pickup and transfer to Gangtok' },
          { day: 2, description: 'Local sightseeing with monastery tour' },
        ],
        itineraryLink: 'https://example.com/itinerary/sikkim-deluxe',
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
        _id: quotationIds[2],
        quotationNumber: 'QT-2026-003',
        clientName: 'Vikram Desai',
        contact: '+91 9988776603',
        numberOfPax: 3,
        numberOfRooms: 1,
        roomType: 'Standard',
        route: 'North Goa - South Goa',
        tripDuration: '3N / 4D',
        destination: 'Goa',
        itinerary: [
          { day: 1, description: 'Hotel check-in and evening leisure' },
          { day: 2, description: 'North Goa beach circuit' },
        ],
        itineraryLink: 'https://example.com/itinerary/goa-weekend',
        basePrice: 62000,
        discount: 6000,
        finalPrice: 56000,
        vehicleType: 'SUV',
        inclusions: ['Breakfast', 'Pickup and Drop'],
        exclusions: ['Water sports'],
        status: 'Draft',
        notes: 'Awaiting client confirmation on hotel category.',
        createdAt: daysAgo(1),
        updatedAt: new Date(),
      },
    ],
    invoices: [
      {
        invoiceNumber: 'INV-2026-001',
        quotationId: quotationIds[0],
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
        payments: [
          { amount: 58000, date: daysAgo(2), method: 'UPI', reference: 'UPI-KAP-001', note: 'Advance received' },
        ],
        paymentStatus: 'Partial',
        notes: 'Balance due one week before travel.',
        createdAt: daysAgo(2),
        updatedAt: daysAgo(1),
      },
      {
        invoiceNumber: 'INV-2026-002',
        quotationId: quotationIds[1],
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
        payments: [
          { amount: 82000, date: daysAgo(1), method: 'Bank Transfer', reference: 'BNK-MEE-002', note: 'Full payment received' },
        ],
        paymentStatus: 'Paid',
        notes: 'Paid in full.',
        createdAt: daysAgo(1),
        updatedAt: new Date(),
      },
    ],
    communications: [
      {
        title: 'Summer Escape Offer',
        type: 'Offer',
        content: 'Special early booking discounts for Kashmir and Sikkim departures this season.',
        targetAudience: 'Leads',
        scheduledDate: daysFromNow(2),
        status: 'Scheduled',
        tags: ['summer', 'offer', 'conversion'],
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1),
      },
      {
        title: 'Welcome Back Travellers',
        type: 'Greeting',
        content: 'Thank you for choosing PSTourism. Share your experience and unlock referral rewards.',
        targetAudience: 'Travellers',
        sentDate: daysAgo(3),
        status: 'Sent',
        tags: ['retention', 'feedback'],
        createdAt: daysAgo(5),
        updatedAt: daysAgo(3),
      },
    ],
  };
}

async function seedDemo() {
  loadEnvFile();

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing. Add it to .env.local before running the seed command.');
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  const db = mongoose.connection.db;
  const demo = buildDemoData();

  await Promise.all([
    db.collection('communications').deleteMany({}),
    db.collection('invoices').deleteMany({}),
    db.collection('quotations').deleteMany({}),
    db.collection('travellers').deleteMany({}),
    db.collection('leads').deleteMany({}),
  ]);

  await db.collection('travellers').insertMany(demo.travellers);
  await db.collection('leads').insertMany(demo.leads);
  await db.collection('quotations').insertMany(demo.quotations);
  await db.collection('invoices').insertMany(demo.invoices);
  await db.collection('communications').insertMany(demo.communications);

  console.log('Demo data inserted successfully.');
  console.log(
    JSON.stringify(
      {
        travellers: demo.travellers.length,
        leads: demo.leads.length,
        quotations: demo.quotations.length,
        invoices: demo.invoices.length,
        communications: demo.communications.length,
      },
      null,
      2
    )
  );
}

seedDemo()
  .catch((error) => {
    if (/ENOTFOUND|querySrv/i.test(error.message)) {
      console.error('MongoDB cluster DNS could not be resolved. Copy the exact SRV connection string from Atlas into .env.local and run npm run seed:demo again.');
    } else if (/auth/i.test(error.message)) {
      console.error('MongoDB authentication failed. Update the Atlas username, password, or network access and run npm run seed:demo again.');
    } else {
      console.error(error.message);
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
