const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  stockQuantity: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  sku: { 
    type: String, 
    unique: true, 
    required: true 
  },
  image: { 
    type: String // URL or file path to product image 
  },
  dateAdded: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields automatically 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
