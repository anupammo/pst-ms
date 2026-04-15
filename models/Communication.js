import mongoose from 'mongoose';

const CommunicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['Offer', 'Greeting', 'Update', 'Newsletter', 'Other'],
    default: 'Offer',
  },
  content: { type: String, required: true },
  targetAudience: {
    type: String,
    enum: ['All', 'Leads', 'Travellers', 'Custom'],
    default: 'All',
  },
  scheduledDate: { type: Date },
  sentDate: { type: Date },
  status: { type: String, enum: ['Draft', 'Scheduled', 'Sent'], default: 'Draft' },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Communication || mongoose.model('Communication', CommunicationSchema);
