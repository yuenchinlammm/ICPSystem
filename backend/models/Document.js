const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  claimId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  filename: { type: String, required: true },
  mimetype: { type: String, enum: ['application/pdf','image/jpeg','image/png'], required: true },
  size:     { type: Number, max: 10 * 1024 * 1024, required: true },
  path:     { type: String, required: true } // disk path
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
