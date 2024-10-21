const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  cryptocurrency: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['open', 'matched', 'completed', 'cancelled'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);