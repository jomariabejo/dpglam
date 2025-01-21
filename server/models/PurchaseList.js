const mongoose = require('mongoose');

const purchaseListSchema = new mongoose.Schema({
  purchaseID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CustomerPurchase', // Reference to the CustomerPurchase model 
    required: true 
  },
  productID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', // Reference to the Product model
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  priceAtPurchase: { 
    type: Number, 
    required: true 
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields automatically 
});

const PurchaseList = mongoose.model('PurchaseList', purchaseListSchema);

module.exports = PurchaseList;
