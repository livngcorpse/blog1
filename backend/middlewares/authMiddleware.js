const { verifyToken } = require('../utils/firebaseVerify');
const User = require('../models/User');

/**
 * Middleware to authenticate requests using Firebase token
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify token with Firebase
    const decodedToken = await verifyToken(idToken);
    
    // Find user in database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please complete profile setup.' });
    }
    
    // Attach user to request
    req.user = {
      id: user._id,
      firebaseUid: decodedToken.uid,
      username: user.username,
      email: decodedToken.email,
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed: ' + error.message });
  }
};

/**
 * Optional auth - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await verifyToken(idToken);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (user) {
        req.user = {
          id: user._id,
          firebaseUid: decodedToken.uid,
          username: user.username,
          email: decodedToken.email,
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = { authMiddleware, optionalAuth };
