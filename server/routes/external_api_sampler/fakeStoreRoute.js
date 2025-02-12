const express = require('express');
const router = express.Router();
const axios = require('axios')

// Route to fetch products from FakeStoreAPI
router.get('/products', async (req, res) => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});


// GET Product by ID from FakeStoreAPI
router.get('/products/:id', async (req, res) => {
    const { id } = req.params;

    // Validate ID (ensure it's a positive number)
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        res.status(200).json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});


module.exports = router;

