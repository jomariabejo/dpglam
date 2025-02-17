const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const authenticateUser = require('../../middleware/authenticateUser');
require('dotenv').config();
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

    // Default profile image from S3
    const defaultProfileImageUrl = process.env.AWS_DEFAULT_PROFILE_IMAGE;

    const user = new User({
      username,
      email,
      passwordHash: hashedPassword,
      role: userRole,
      profileImageUrl: defaultProfileImageUrl // Set default profile image
    });

    await user.save();

    // Create the JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;



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
      { userId: user._id, username: user.username, email: user.email, role: user.role , profileImageUrl: user.profileImageUrl},
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
