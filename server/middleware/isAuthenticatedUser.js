// Middleware to check if the user is authenticated
const isAuthenticatedUser = (req, res, next) => {
    // Check if the user object exists (i.e., if user is authenticated)
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated. Please log in.' });
    }
  
    // Optionally, you can check the user's role (if needed)
    // if (req.user.role !== 'customer' && req.user.role !== 'admin') {
    //   return res.status(403).json({ error: 'You do not have permission to access this route' });
    // }
  
    // If the user is authenticated, allow the request to proceed
    next();
  };
  
  module.exports = { isAuthenticatedUser };
  