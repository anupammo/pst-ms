import connectDB from '../../../lib/mongodb';
import { isMongoConnectionIssue, sendApiError, sendDemoFallback } from '../../../lib/api-error';
import { getDemoCollection } from '../../../lib/demo-data';
import Quotation from '../../../models/Quotation';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    if (req.method === 'GET' && isMongoConnectionIssue(error)) {
      return sendDemoFallback(res, getDemoCollection('quotations'));
    }

    return sendApiError(res, error);
  }

  if (req.method === 'GET') {
    try {
      const quotations = await Quotation.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: quotations });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'POST') {
    try {
      const count = await Quotation.countDocuments();
      const quotationNumber = `PST-Q-${String(count + 1).padStart(4, '0')}`;
      const quotation = await Quotation.create({ ...req.body, quotationNumber });
      return res.status(201).json({ success: true, data: quotation });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
