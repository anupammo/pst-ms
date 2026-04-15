import connectDB from '../../../lib/mongodb';
import Traveller from '../../../models/Traveller';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const travellers = await Traveller.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: travellers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const traveller = await Traveller.create(req.body);
      res.status(201).json({ success: true, data: traveller });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
