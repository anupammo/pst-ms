import connectDB from '../../../lib/mongodb';
import { isMongoConnectionIssue, sendApiError, sendDemoFallback } from '../../../lib/api-error';
import { getDemoCollection } from '../../../lib/demo-data';
import Lead from '../../../models/Lead';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    if (req.method === 'GET' && isMongoConnectionIssue(error)) {
      return sendDemoFallback(res, getDemoCollection('leads'));
    }

    return sendApiError(res, error);
  }

  if (req.method === 'GET') {
    try {
      const leads = await Lead.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: leads });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'POST') {
    try {
      const lead = await Lead.create(req.body);
      return res.status(201).json({ success: true, data: lead });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
