const mongoose = require('mongoose');
const ClaimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  policyNumber: { type: String, required: true },
  incidentDate: { type: Date, required: true },
  claimType: { type: String, enum: ['Motor','Home','Health','Other'], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Draft','Pending','Under Review','Approved','Rejected'], default: 'Draft' },
  submittedAt: {type: Date }, }, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);