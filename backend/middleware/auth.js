import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Authentication middleware to protect routes
 * Verifies the access token from Authorization header
 */
export const authenticate = (req, res, next) => {
  try {
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
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Authentication error' 
    });
  }
};

