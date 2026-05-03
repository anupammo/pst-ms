import connectDB from '../../../lib/mongodb';
import { isMongoConnectionIssue, sendApiError, sendDemoFallback } from '../../../lib/api-error';
import { getDemoRecord } from '../../../lib/demo-data';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await connectDB();
  } catch (error) {
    if (req.method === 'GET' && isMongoConnectionIssue(error)) {
      const invoice = getDemoRecord('invoices', id);
      return invoice
        ? sendDemoFallback(res, invoice)
        : res.status(404).json({ success: false, error: 'Not found' });
    }

    return sendApiError(res, error);
  }

  if (req.method === 'GET') {
    try {
      const invoice = await Invoice.findById(id).populate('quotationId');
      if (!invoice) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'PUT') {
    try {
      const invoice = await Invoice.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!invoice) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else if (req.method === 'DELETE') {
    try {
      const invoice = await Invoice.findByIdAndDelete(id);
      if (!invoice) return res.status(404).json({ success: false, error: 'Not found' });
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return sendApiError(res, error);
    }
  } else if (req.method === 'PATCH') {
    try {
      const invoice = await Invoice.findById(id);
      if (!invoice) return res.status(404).json({ success: false, error: 'Not found' });

      invoice.payments.push(req.body);
      const totalPaid = invoice.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      if (totalPaid >= (invoice.finalAmount || 0)) {
        invoice.paymentStatus = 'Paid';
      } else if (totalPaid > 0) {
        invoice.paymentStatus = 'Partial';
      }
      invoice.updatedAt = Date.now();
      await invoice.save();
      return res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      return sendApiError(res, error, { status: 400 });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
