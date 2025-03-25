const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Nullable Customer ID
  molinoCost: { type: Number, required: true },
  pricePerKG: { type: Number, required: true },
  quantityKG: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  otherFees: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
