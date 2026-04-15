import connectDB from '../../../lib/mongodb';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const invoice = await Invoice.findById(id).populate('quotationId');
      if (!invoice) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const invoice = await Invoice.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!invoice) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const invoice = await Invoice.findByIdAndDelete(id);
      if (!invoice) return res.status(404).json({ success: false, error: 'Not found' });
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PATCH') {
    // Add payment
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
      res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
