import connectDB from '../../../lib/mongodb';
import { isMongoConnectionIssue, sendApiError, sendDemoFallback } from '../../../lib/api-error';
import { getDemoCollection } from '../../../lib/demo-data';
import Communication from '../../../models/Communication';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    if (req.method === 'GET' && isMongoConnectionIssue(error)) {
      return sendDemoFallback(res, getDemoCollection('communications'));
    }

    return sendApiError(res, error);
  }

  if (req.method === 'GET') {
    try {
      const communications = await Communication.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: communications });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'POST') {
    try {
      const communication = await Communication.create(req.body);
      return res.status(201).json({ success: true, data: communication });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
