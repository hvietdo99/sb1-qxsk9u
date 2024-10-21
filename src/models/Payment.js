const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'refunded', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);