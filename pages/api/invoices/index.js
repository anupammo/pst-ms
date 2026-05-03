import connectDB from '../../../lib/mongodb';
import { isMongoConnectionIssue, sendApiError, sendDemoFallback } from '../../../lib/api-error';
import { getDemoCollection } from '../../../lib/demo-data';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    if (req.method === 'GET' && isMongoConnectionIssue(error)) {
      return sendDemoFallback(res, getDemoCollection('invoices'));
    }

    return sendApiError(res, error);
  }

  if (req.method === 'GET') {
    try {
      const invoices = await Invoice.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'POST') {
    try {
      const count = await Invoice.countDocuments();
      const invoiceNumber = `PST-INV-${String(count + 1).padStart(4, '0')}`;
      const invoice = await Invoice.create({ ...req.body, invoiceNumber });
      return res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
