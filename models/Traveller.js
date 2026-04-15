import mongoose from 'mongoose';

const TravellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String },
  email: { type: String },
  address: { type: String },
  idProofType: {
    type: String,
    enum: ['Aadhaar', 'Passport', 'Voter ID', 'Driving License', 'PAN Card', 'Other'],
  },
  idProofNumber: { type: String },
  dateOfBirth: { type: Date },
  anniversary: { type: Date },
  numberOfPax: { type: Number, default: 1 },
  specialRequirements: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Traveller || mongoose.model('Traveller', TravellerSchema);
