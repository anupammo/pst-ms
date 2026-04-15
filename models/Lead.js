import mongoose from 'mongoose';

const FollowUpSchema = new mongoose.Schema({
  date: { type: Date },
  note: { type: String },
  doneBy: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const LeadSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  contact: { type: String },
  email: { type: String },
  source: {
    type: String,
    enum: ['Website', 'WhatsApp', 'Referral', 'Social Media', 'Walk-in', 'Other'],
    default: 'Other',
  },
  interestedPackage: { type: String },
  destination: { type: String },
  budget: { type: Number },
  travelDate: { type: Date },
  numberOfPax: { type: Number },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Interested', 'Converted', 'Lost'],
    default: 'New',
  },
  followUps: [FollowUpSchema],
  notes: { type: String },
  assignedTo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
