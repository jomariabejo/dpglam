const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const aws = require('aws-sdk');
const authenticateUser = require('../../middleware/authenticateUser');
const { authenticateToken, isAdmin } = require('../../middleware/authMiddleware');
require('dotenv').config();

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


// Create an S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
  },
});

// Multer Storage for S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dpglam-storage-bucket',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `profile-images/${Date.now()}_${file.originalname}`);
    },
  }),
});

// Update User Profile
router.put('/user/update', authenticateUser, upload.single('profileImage'), async (req, res) => {
  const { username, email, password } = req.body;
  const profileImageUrl = req.file ? req.file.location : null; // Get S3 URL

  if (!username && !email && !password && !profileImageUrl) {
    return res.status(400).json({ error: 'At least one field must be updated' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Username is already in use' });
      }
      user.username = username;
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
      user.email = email;
    }

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    if (profileImageUrl) {
      user.profileImageUrl = profileImageUrl;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', profileImageUrl: user.profileImageUrl });
  } catch (err) {
    console.error('Error updating profile:', err);
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
