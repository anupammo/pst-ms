import connectDB from '../../../lib/mongodb';
import Lead from '../../../models/Lead';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const lead = await Lead.findById(id);
      if (!lead) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: lead });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const lead = await Lead.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!lead) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: lead });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const lead = await Lead.findByIdAndDelete(id);
      if (!lead) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PATCH') {
    // Add follow-up
    try {
      const lead = await Lead.findByIdAndUpdate(
        id,
        { $push: { followUps: req.body }, updatedAt: Date.now() },
        { new: true }
      );
      if (!lead) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: lead });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
