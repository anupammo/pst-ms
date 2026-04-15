import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number },
  date: { type: Date },
  method: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'] },
  reference: { type: String },
  note: { type: String },
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
  clientName: { type: String, required: true },
  contact: { type: String },
  email: { type: String },
  destination: { type: String },
  tripDuration: { type: String },
  travelDate: { type: Date },
  numberOfPax: { type: Number },
  baseAmount: { type: Number },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number },
  advanceAmount: { type: Number },
  balanceAmount: { type: Number },
  payments: [PaymentSchema],
  paymentStatus: { type: String, enum: ['Pending', 'Partial', 'Paid'], default: 'Pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
