const mongoose = require('mongoose');

const customerPurchaseSchema = new mongoose.Schema({
  userID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Failed'], 
    required: true 
  },
  shippingAddress: { 
    type: String, 
    required: true 
  },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Canceled'], 
    default: 'Processing' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields automatically 
});

const CustomerPurchase = mongoose.model('CustomerPurchase', customerPurchaseSchema);

module.exports = CustomerPurchase;
