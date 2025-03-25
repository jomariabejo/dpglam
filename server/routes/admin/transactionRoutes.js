const express = require('express');
const { authenticateToken, isAdmin } = require('../../middleware/authMiddleware');
const Transaction = require('../../models/Transaction');
require('dotenv').config();

const router = express.Router();


// ==================================== CREATE TRANSACTION (POST)
router.post('/admin/transaction',authenticateToken,isAdmin,
  async (req, res) => {

    try {
      // Validate customerId manually to allow null values
      if (req.body.customerId && !mongoose.Types.ObjectId.isValid(req.body.customerId)) {
        return res.status(400).json({ error: 'Invalid customer ID format' });
      }

      // Ensure required fields are present
      const { molinoCost, pricePerKG, quantityKG, totalCost } = req.body;
      if (!molinoCost || !pricePerKG || !quantityKG || !totalCost) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }

      // Set customerId to null if not provided
      if (!req.body.customerId) {
        req.body.customerId = null;
      }

      // Create transaction
      const newTransaction = new Transaction(req.body);
      await newTransaction.save();

      res.status(201).json({
        message: 'Transaction recorded successfully',
        transaction: newTransaction,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
);

// ==================================== GET ALL TRANSACTIONS
router.get('/admin/transactions', authenticateToken, isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve transactions.' });
  }
});

// ==================================== GET SINGLE TRANSACTION
router.get('/admin/transaction/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }
    res.status(200).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve transaction.' });
  }
});

// ==================================== UPDATE TRANSACTION (PUT)
router.put('/admin/transaction/:id', authenticateToken, isAdmin, async (req, res) => {

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true});
    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }
    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction.' });
  }
});

// ==================================== DELETE TRANSACTION
router.delete('/admin/transaction/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction.' });
  }
});


// ==================================== DELETE TRANSACTION
router.get('/admin/transactions/day/:date?', authenticateToken, isAdmin, async (req, res) => {
  try {
    // If no date is provided, use today's date (YYYY-MM-DD)
    const date = req.params.date || new Date().toISOString().split('T')[0];

    // Convert the date string into a proper Date object
    const selectedDate = new Date(date);

    // Find transactions within the given day
    const transactions = await Transaction.find({
      createdAt: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      }
    }).sort({ createdAt: -1 });

    // If no transactions found, return a meaningful message
    if (transactions.length === 0) {
      return res.status(200).json({ message: `No transactions found for ${date}.` });
    }

    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve transactions for the specified day.' });
  }
});

module.exports = router;
