import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret-change-in-production';

// Access token expires in 3 months (90 days)
const ACCESS_TOKEN_EXPIRES_IN = '90d';

/**
 * Generate access token
 * @param {Object} payload - Token payload (userId, email, etc.)
 * @returns {string} Access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

/**
 * Verify access token
 * @param {string} token - Access token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

