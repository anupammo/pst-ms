import connectDB from '../../../lib/mongodb';
import Communication from '../../../models/Communication';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const communications = await Communication.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: communications });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const communication = await Communication.create(req.body);
      res.status(201).json({ success: true, data: communication });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
