const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// GET dashboard stats


module.exports = router;
