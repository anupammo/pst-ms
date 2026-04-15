import connectDB from '../../../lib/mongodb';
import Quotation from '../../../models/Quotation';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const quotations = await Quotation.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: quotations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const count = await Quotation.countDocuments();
      const quotationNumber = `PST-Q-${String(count + 1).padStart(4, '0')}`;
      const quotation = await Quotation.create({ ...req.body, quotationNumber });
      res.status(201).json({ success: true, data: quotation });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
