const express = require('express');
const { validationResult } = require('express-validator');
const PurchaseList = require('../models/PurchaseList');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new purchase list entry
router.post('/purchase-list', authenticateToken, async (req, res) => {
  const { purchaseID, productID, quantity, priceAtPurchase } = req.body;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check for required fields
  if (!purchaseID || !productID || !quantity || !priceAtPurchase) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a new PurchaseList object
    const newPurchaseList = new PurchaseList({
      purchaseID,
      productID,
      quantity,
      priceAtPurchase
    });

    // Save to the database
    await newPurchaseList.save();

    res.status(201).json({ message: 'Purchase list created successfully', newPurchaseList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Get all purchase lists
router.get('/purchase-list', authenticateToken, async (req, res) => {
  try {
    const purchaseLists = await PurchaseList.find();
    res.status(200).json({ purchaseLists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Get a purchase list by ID
router.get('/purchase-list/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const purchaseList = await PurchaseList.findById(id);

    if (!purchaseList) {
      return res.status(404).json({ error: 'Purchase list not found' });
    }

    res.status(200).json({ purchaseList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Update a purchase list by ID
router.put('/purchase-list/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { purchaseID, productID, quantity, priceAtPurchase } = req.body;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const purchaseList = await PurchaseList.findById(id);

    if (!purchaseList) {
      return res.status(404).json({ error: 'Purchase list not found' });
    }

    // Update the fields
    purchaseList.purchaseID = purchaseID || purchaseList.purchaseID;
    purchaseList.productID = productID || purchaseList.productID;
    purchaseList.quantity = quantity || purchaseList.quantity;
    purchaseList.priceAtPurchase = priceAtPurchase || purchaseList.priceAtPurchase;

    // Save the updated purchase list
    await purchaseList.save();

    res.status(200).json({ message: 'Purchase list updated successfully', purchaseList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Delete a purchase list by ID
router.delete('/purchase-list/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const purchaseList = await PurchaseList.findByIdAndDelete(id);

    if (!purchaseList) {
      return res.status(404).json({ error: 'Purchase list not found' });
    }

    res.status(200).json({ message: 'Purchase list deleted successfully', purchaseList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;
