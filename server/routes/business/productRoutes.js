const express = require('express');
const { validationResult } = require('express-validator');
const Product = require('../../models/Product');
const { authenticateToken, isAdmin } = require('../../middleware/authMiddleware'); // Import the middleware functions

const router = express.Router();


// Create new product
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

// Find a product by ID
router.get('/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Search for the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond with the found product
    res.status(200).json({ product });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Find product by SKU or Name (optional flexibility)
router.get('/admin/products', authenticateToken, isAdmin, async (req, res) => {
  const { sku, name } = req.query;

  try {
    // Build the query
    const query = {};
    if (sku) query.sku = sku;
    if (name) query.name = { $regex: name, $options: 'i' };  // Case-insensitive search for name

    // Find products matching the query
    const products = await Product.find(query);

    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }

    // Respond with the found products
    res.status(200).json({ products });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Find product by SKU or Name (optional flexibility)
router.get('/products', async (req, res) => {
  const { sku, name } = req.query;

  try {
    // Build the query
    const query = {};
    if (sku) query.sku = sku;
    if (name) query.name = { $regex: name, $options: 'i' };  // Case-insensitive search for name

    // Find products matching the query
    const products = await Product.find(query);

    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }

    // Respond with the found products
    res.status(200).json({ products });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Count all products
router.get('/product/count', async (req, res) => {
  const totalOrders = await Order.countDocuments();
  return totalOrders;
})

// Update product by ID
router.put('/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stockQuantity, category, sku, image } = req.body;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product's fields if they are provided in the request body
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stockQuantity = stockQuantity || product.stockQuantity;
    product.category = category || product.category;
    product.sku = sku || product.sku;
    product.image = image || product.image;

    // Save the updated product
    await product.save();

    // Respond with the updated product
    res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Delete product by ID
router.delete('/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;  // Get the id from the URL params

  try {
    // Find and delete the product by _id (MongoDB's default identifier)
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond with success message
    res.status(200).json({
      message: 'Product deleted successfully',
      product
    });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;
