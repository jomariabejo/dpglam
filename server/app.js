// server/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes')
const fakeStoreRoutes = require('./routes/fakeStoreRoute')
const dashboardRoutes = require('./routes/dashboardRoutes')
const orderRoutes = require('./routes/orderRoutes')


// Initialize environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/auth', productRoutes);
app.use('/api/auth', fakeStoreRoutes);
app.use("/api/auth", dashboardRoutes);
app.use("/api/auth", orderRoutes);

module.exports = app;
