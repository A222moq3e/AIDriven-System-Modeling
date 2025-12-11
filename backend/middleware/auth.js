import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Authentication middleware to protect routes
 * Verifies the access token from Authorization header
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      message: 'No token provided or invalid format' 
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    // Check if it's a token verification error (invalid/expired)
    // verifyAccessToken throws Error with message 'Invalid or expired access token'
    // or it could be a JWT library error (JsonWebTokenError, TokenExpiredError)
    if (error.message?.includes('token') || 
        error.name === 'JsonWebTokenError' || 
        error.name === 'TokenExpiredError' ||
        error.message === 'Invalid or expired access token') {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    
    // Unexpected errors (e.g., missing secret, network issues, etc.)
    console.error('Unexpected authentication error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Authentication error' 
    });
  }
};

