const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Path to your User model

const authenticateUser = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token

  // If no token is provided
  if (!token) {
    return res.status(401).json({ error: 'No token provided, authentication required.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID
    const user = await User.findById(decoded.userId);
    
    // If user doesn't exist
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach the user to the request object (so it can be used in other routes)
    req.user = user;

    // Move to the next middleware or route handler
    next();

  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser; // Export for use in routes
