const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authenticateUser = require('../middleware/authenticateUser');  // Assuming you have this middleware for authentication

const router = express.Router();


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
  

// DELETE /user/delete - Delete user account
router.delete('/user/delete', authenticateUser, async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
  
    try {
      // Delete the user from the database using the User model's findByIdAndDelete method
      await User.findByIdAndDelete(req.user._id);
  
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
      console.error('Error deleting user account:', err);
      res.status(500).json({ error: 'Failed to delete account' });
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
