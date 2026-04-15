import connectDB from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const invoices = await Invoice.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const count = await Invoice.countDocuments();
      const invoiceNumber = `PST-INV-${String(count + 1).padStart(4, '0')}`;
      const invoice = await Invoice.create({ ...req.body, invoiceNumber });
      res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
