const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  shippingAddress: { 
    type: String, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Failed'], 
    required: true 
  },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Canceled'], 
    default: 'Processing' 
  },
  datePlaced: { 
    type: Date, 
    default: Date.now 
  },
  dateShipped: { 
    type: Date 
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields automatically 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
