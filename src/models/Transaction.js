const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  buyOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  sellOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  escrowId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);