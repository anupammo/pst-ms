import connectDB from '../../../lib/mongodb';
import { isMongoConnectionIssue, sendApiError, sendDemoFallback } from '../../../lib/api-error';
import { getDemoCollection } from '../../../lib/demo-data';
import Traveller from '../../../models/Traveller';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    if (req.method === 'GET' && isMongoConnectionIssue(error)) {
      return sendDemoFallback(res, getDemoCollection('travellers'));
    }

    return sendApiError(res, error);
  }

  if (req.method === 'GET') {
    try {
      const travellers = await Traveller.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: travellers });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'POST') {
    try {
      const traveller = await Traveller.create(req.body);
      return res.status(201).json({ success: true, data: traveller });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
