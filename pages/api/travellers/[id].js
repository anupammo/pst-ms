import connectDB from '../../../lib/mongodb';
import { isMongoConnectionIssue, sendApiError, sendDemoFallback } from '../../../lib/api-error';
import { getDemoRecord } from '../../../lib/demo-data';
import Traveller from '../../../models/Traveller';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await connectDB();
  } catch (error) {
    if (req.method === 'GET' && isMongoConnectionIssue(error)) {
      const traveller = getDemoRecord('travellers', id);
      return traveller
        ? sendDemoFallback(res, traveller)
        : res.status(404).json({ success: false, error: 'Not found' });
    }

    return sendApiError(res, error);
  }

  if (req.method === 'GET') {
    try {
      const traveller = await Traveller.findById(id);
      if (!traveller) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: traveller });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'PUT') {
    try {
      const traveller = await Traveller.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!traveller) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: traveller });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else if (req.method === 'DELETE') {
    try {
      const traveller = await Traveller.findByIdAndDelete(id);
      if (!traveller) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
