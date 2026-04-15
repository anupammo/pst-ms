import connectDB from '../../../lib/mongodb';
import Quotation from '../../../models/Quotation';
import Traveller from '../../../models/Traveller';
import Lead from '../../../models/Lead';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const [totalQuotations, totalTravellers, totalLeads, totalInvoices, recentQuotations, recentLeads, activeLeads] =
      await Promise.all([
        Quotation.countDocuments(),
        Traveller.countDocuments(),
        Lead.countDocuments(),
        Invoice.countDocuments(),
        Quotation.find({}).sort({ createdAt: -1 }).limit(5),
        Lead.find({}).sort({ createdAt: -1 }).limit(5),
        Lead.countDocuments({ status: { $in: ['New', 'Contacted', 'Interested'] } }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalQuotations,
        totalTravellers,
        totalLeads,
        totalInvoices,
        activeLeads,
        recentQuotations,
        recentLeads,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
