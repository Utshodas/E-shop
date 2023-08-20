const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
  bankAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
});

transactionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

transactionSchema.set('toJSON', {
  virtuals: true,
});

exports.Transaction = mongoose.model('Transaction', transactionSchema);
