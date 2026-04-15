import connectDB from '../../../lib/mongodb';
import Traveller from '../../../models/Traveller';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const traveller = await Traveller.findById(id);
      if (!traveller) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: traveller });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const traveller = await Traveller.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!traveller) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: traveller });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const traveller = await Traveller.findByIdAndDelete(id);
      if (!traveller) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
