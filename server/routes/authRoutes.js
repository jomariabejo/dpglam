const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../models/User');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate the token (using email as a payload)
      const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });

      // Token expiry date (1 hour from now)
      const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour in milliseconds

      console.log('Generated Token:', token); // Log the generated token for debugging

      // If role is not provided, default to 'customer'
      const userRole = role || 'customer'; // Set role to 'customer' if not provided

      // Create a new user and include the role
      const user = new User({
          username,
          email,
          passwordHash: hashedPassword,
          token,
          tokenExpiry,
          role: userRole // Use the role from the request body
      });

      // Save the user to the database
      await user.save();

      console.log('User saved with token:', user);  // Log the user object after saving

      // Respond to the client with success message and token
      res.status(201).json({
          message: 'User registered successfully',
          token
      });

  } catch (err) {
      console.error('Error during registration:', err); // Log any errors
      res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});






// Login user route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Create JWT token with expiration of 1 hour
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


        // Optionally, issue a refresh token (this can be used to get a new JWT after it expires)
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Send back the JWT and refresh token
        res.json({ token, refreshToken });

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
