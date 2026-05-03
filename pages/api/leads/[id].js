import connectDB from '../../../lib/mongodb';
import { isMongoConnectionIssue, sendApiError, sendDemoFallback } from '../../../lib/api-error';
import { getDemoRecord } from '../../../lib/demo-data';
import Lead from '../../../models/Lead';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await connectDB();
  } catch (error) {
    if (req.method === 'GET' && isMongoConnectionIssue(error)) {
      const lead = getDemoRecord('leads', id);
      return lead
        ? sendDemoFallback(res, lead)
        : res.status(404).json({ success: false, error: 'Not found' });
    }

    return sendApiError(res, error);
  }

  if (req.method === 'GET') {
    try {
      const lead = await Lead.findById(id);
      if (!lead) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: lead });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'PUT') {
    try {
      const lead = await Lead.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!lead) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: lead });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else if (req.method === 'DELETE') {
    try {
      const lead = await Lead.findByIdAndDelete(id);
      if (!lead) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'PATCH') {
    try {
      const lead = await Lead.findByIdAndUpdate(
        id,
        { $push: { followUps: req.body }, updatedAt: Date.now() },
        { new: true }
      );
      if (!lead) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: lead });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
