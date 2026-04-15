import connectDB from '../../../lib/mongodb';
import Lead from '../../../models/Lead';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const leads = await Lead.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: leads });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const lead = await Lead.create(req.body);
      res.status(201).json({ success: true, data: lead });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
