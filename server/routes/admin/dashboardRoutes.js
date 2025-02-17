const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const User = require("../../models/User");
const { authenticateToken, isAdmin } = require("../../middleware/authMiddleware");

// GET dashboard stats
  router.get("/admin/dashboard/stats", authenticateToken, isAdmin, async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();
      const totalUsers = await User.countDocuments();
  
      res.status(200).json({
        orders: totalOrders,
        users: totalUsers,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
