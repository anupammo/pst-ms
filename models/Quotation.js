import mongoose from 'mongoose';

const ItineraryDaySchema = new mongoose.Schema({
  day: Number,
  description: String,
});

const QuotationSchema = new mongoose.Schema({
  quotationNumber: { type: String, unique: true },
  clientName: { type: String, required: true },
  contact: { type: String },
  numberOfPax: { type: Number, required: true },
  numberOfRooms: { type: Number },
  roomType: { type: String, enum: ['Standard', 'Deluxe', 'Premium'], default: 'Standard' },
  route: { type: String },
  tripDuration: { type: String },
  destination: { type: String },
  itinerary: [ItineraryDaySchema],
  itineraryLink: { type: String },
  basePrice: { type: Number },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number },
  vehicleType: { type: String },
  inclusions: [String],
  exclusions: [String],
  status: { type: String, enum: ['Draft', 'Sent', 'Accepted', 'Rejected'], default: 'Draft' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

QuotationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (!this.finalPrice && this.basePrice != null) {
    this.finalPrice = this.basePrice - (this.discount || 0);
  }
  next();
});

export default mongoose.models.Quotation || mongoose.model('Quotation', QuotationSchema);
