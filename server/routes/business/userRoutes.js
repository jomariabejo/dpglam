const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const authenticateUser = require('../../middleware/authenticateUser');  // Assuming you have this middleware for authentication
const { authenticateToken, isAdmin } = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
      const users = await User.find().select('-passwordHash'); // Exclude passwordHash
      res.status(200).json({ users });
  } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /user/update - Update user profile
router.put('/user/update', authenticateUser, async (req, res) => {
    const { username, email, password } = req.body;
  
    // Ensure at least one field is provided
    if (!username && !email && !password) {
      return res.status(400).json({ error: 'Username, email, or password must be provided' });
    }
  
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the user fields if provided
      if (username) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername && existingUsername._id.toString() !== user._id.toString()) {
          return res.status(400).json({ error: 'Username is already in use by another user' });
        }
        user.username = username;
      }
  
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
          return res.status(400).json({ error: 'Email is already in use by another user' });
        }
        user.email = email;
      }
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.passwordHash = hashedPassword;  // Save the new hashed password
      }
  
      await user.save();
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update profile. Please try again later.' });
    }
  });


  router.delete('/user/delete', authenticateUser, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// ADMIN can update user details
router.put('/user/update/:id/:username/:role', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const newUsername = req.params.username;
    const newRole = req.params.role;

    // Find and update the user in one step
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        username: newUsername, 
        role: newRole,
        updatedAt: new Date() // Ensure `updatedAt` is refreshed
      },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found 🥲' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/user/delete/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
      const userId = req.params.id; // Get user ID from URL parameter
      const user = await User.findById(userId);
      
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Failed to delete user' });
  }
});

  
// GET /user/count - Get total number of users
router.get('/user/count', authenticateUser, async (req, res) => {
    try {
      // Count the number of users in the database
      const userCount = await User.countDocuments();
  
      res.status(200).json({ userCount });
    } catch (err) {
      console.error('Error counting users:', err);
      res.status(500).json({ error: 'Failed to count users' });
    }
  });

module.exports = router;
