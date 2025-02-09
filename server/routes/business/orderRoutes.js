const express = require('express');
const { validationResult } = require('express-validator');
const Order = require('../../models/Order');
const { authenticateToken, isAdmin } = require('../../middleware/authMiddleware'); // Import the middleware functions

const router = express.Router();

// Create new order
router.post('/orders', authenticateToken, async (req, res) => {
  const { userID, totalAmount, shippingAddress, paymentStatus, orderStatus } = req.body;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check for required fields
  if (!userID || !totalAmount || !shippingAddress || !paymentStatus) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a new order object
    const newOrder = new Order({
      userID,
      totalAmount,
      shippingAddress,
      paymentStatus,
      orderStatus
    });

    // Save order to the database
    await newOrder.save();

    // Respond with success
    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Get order by ID
router.get('/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Search for the order by ID
    const order = await Order.findById(id).populate('userID', 'name email');  // Populate user info

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Respond with the found order
    res.status(200).json({ order });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Get all orders (optional for admins)
router.get('/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find().populate('userID', 'name email');  // Optionally populate user info

    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    // Respond with the found orders
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Update order by ID (for admins)
router.put('/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, orderStatus, dateShipped } = req.body;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find the order by ID
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order fields
    order.paymentStatus = paymentStatus || order.paymentStatus;
    order.orderStatus = orderStatus || order.orderStatus;
    order.dateShipped = dateShipped || order.dateShipped;

    // Save the updated order
    await order.save();

    // Respond with the updated order
    res.status(200).json({
      message: 'Order updated successfully',
      order
    });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Delete order by ID (for admins)
router.delete('/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the order by _id (MongoDB's default identifier)
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Respond with success message
    res.status(200).json({
      message: 'Order deleted successfully',
      order
    });
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;
