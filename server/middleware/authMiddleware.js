// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Use this middleware for your admin routes
router.get('/admin', authenticateToken, isAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});
