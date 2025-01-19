const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../models/User');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userRole = role || 'customer';

      const user = new User({
          username,
          email,
          passwordHash: hashedPassword,
          role: userRole
      });

      await user.save();

      // Create the JWT token (sign using the JWT_SECRET from .env)
      const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET, // Use the secret from the .env file
        { expiresIn: '1h' }
      );

      res.status(201).json({
          message: 'User registered successfully',
          token
      });

  } catch (err) {
      res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});


// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Create JWT token (using JWT_SECRET from .env)
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,  // This ensures you're using the secret from the .env file
      { expiresIn: '7h' }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});


// Refresh token route
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token is required' });

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

        // Issue a new access token
        const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token: newToken });
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
});

// Middleware to verify the token (for protected routes)
router.use(async (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        // Verify token using jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach the user object to the request
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});


// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


// Update user profile route
router.put('/user/update', async (req, res) => {
  const { username, email } = req.body;

  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  try {
    // Update the user's profile fields (like username and email)
    req.user.username = username || req.user.username;
    req.user.email = email || req.user.email;

    await req.user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete user account route
router.delete('/user/delete', async (req, res) => {
  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  try {
    // Delete the user from the database
    await req.user.remove();

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Protect your routes using this middleware
router.get('/products', authenticateToken, async (req, res) => {
  // Handle the logic for retrieving products
  const products = await Product.find();
  res.json(products);
});


router.use(async (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      req.user = user;
      next();  // Proceed to the next route handler
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  });
  

module.exports = router;
