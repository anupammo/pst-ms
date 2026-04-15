import connectDB from '../../../lib/mongodb';
import Quotation from '../../../models/Quotation';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const quotation = await Quotation.findById(id);
      if (!quotation) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: quotation });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const quotation = await Quotation.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!quotation) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: quotation });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const quotation = await Quotation.findByIdAndDelete(id);
      if (!quotation) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
