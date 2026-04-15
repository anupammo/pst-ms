import connectDB from '../../../lib/mongodb';
import Communication from '../../../models/Communication';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const communication = await Communication.findById(id);
      if (!communication) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: communication });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const communication = await Communication.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!communication) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: communication });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const communication = await Communication.findByIdAndDelete(id);
      if (!communication) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
