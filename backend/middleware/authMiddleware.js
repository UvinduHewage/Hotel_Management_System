const jwt = require('jsonwebtoken');
const User = require('../models/Uvindu_models/User');

// Middleware to check if user is authenticated
const isAuth = async (req, res, next) => {
  try {
    // Get token from authorization header and remove "Bearer " prefix if present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = { isAuth, isAdmin };