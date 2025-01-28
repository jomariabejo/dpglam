const express = require('express');
const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); // Import the middleware functions

const router = express.Router();

// Create product route - Protected by authentication and admin check
router.post('/admin/products', authenticateToken, isAdmin, async (req, res) => {
  const { 
    name, 
    description, 
    price, 
    stockQuantity,
    category,
    sku,
    image
  } = req.body;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check for required fields
  if (!name || !description || !price || !stockQuantity ||  
      !category || !sku) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the product already exists by name
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({ error: 'Product with this name already exists' });
    }

    // Create a new product object
    const newProduct = new Product({
      name,
      description,
      price,
      stockQuantity,
      category,
      sku,
      image
    });

    // Save product to the database
    await newProduct.save();

    // Respond with success
    res.status(201).json({
      message: 'Product registered successfully',
      product: newProduct
    });

  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;
