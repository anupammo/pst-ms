import connectDB from '../../../lib/mongodb';
import { isMongoConnectionIssue, sendApiError, sendDemoFallback } from '../../../lib/api-error';
import { getDemoRecord } from '../../../lib/demo-data';
import Quotation from '../../../models/Quotation';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await connectDB();
  } catch (error) {
    if (req.method === 'GET' && isMongoConnectionIssue(error)) {
      const quotation = getDemoRecord('quotations', id);
      return quotation
        ? sendDemoFallback(res, quotation)
        : res.status(404).json({ success: false, error: 'Not found' });
    }

    return sendApiError(res, error);
  }

  if (req.method === 'GET') {
    try {
      const quotation = await Quotation.findById(id);
      if (!quotation) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: quotation });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'PUT') {
    try {
      const quotation = await Quotation.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!quotation) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: quotation });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else if (req.method === 'DELETE') {
    try {
      const quotation = await Quotation.findByIdAndDelete(id);
      if (!quotation) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
