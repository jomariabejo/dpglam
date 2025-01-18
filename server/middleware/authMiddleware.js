const jwt = require('jsonwebtoken');

// Use the secret key from the .env file
const secretKey = process.env.JWT_SECRET_KEY;

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Assuming the token is in the "Authorization" header

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });
    }
    req.user = user;
    next();
  });
};

// Authorization middleware to restrict access to certain roles (e.g., admin)
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access Forbidden' });
    }
    next();
  };
};

module.exports = { authenticateJWT, authorizeRole };
