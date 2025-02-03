// server/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const PurchaseListRoutes = require('./routes/PurchaseListRoutes');
const productRoutes = require('./routes/productRoutes')

// Initialize environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Use distinct prefixes for each route
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/user', userRoutes); // User routes
app.use('/api/products', productRoutes); // Product routes
app.use('/api/purchase', PurchaseListRoutes); // Purchase list routes

module.exports = app;


