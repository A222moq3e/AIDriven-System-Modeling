import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';
import { generateAccessToken } from '../utils/jwt.js';

/**
 * @desc    Signup a new user
 * @route   POST /api/users/signup
 * @access  Public
 */
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Username, email and password are required' 
    });
  }

  // Normalize username and email to lowercase for consistency (matches User model schema)
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedEmail = email.toLowerCase().trim();

  // Validate username format (alphanumeric and underscores, 3-30 chars)
  const usernameRegex = /^[a-z0-9_]{3,30}$/;
  if (!usernameRegex.test(normalizedUsername)) {
    return res.status(400).json({ 
      success: false,
      message: 'Username must be 3-30 characters and contain only lowercase letters, numbers, and underscores' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid email format' 
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 6 characters long' 
    });
  }

  try {
    // Check if user already exists (by username or email)
    const existingUser = await User.findOne({ 
      $or: [
        { username: normalizedUsername },
        { email: normalizedEmail }
      ]
    });

    if (existingUser) {
      if (existingUser.username === normalizedUsername) {
        return res.status(409).json({ 
          success: false,
          message: 'Username already taken' 
        });
      }
      return res.status(409).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user (MongoDB will auto-generate _id)
    // Use normalized username and email to match what's stored in database
    const newUser = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();

    // Generate access token
    const accessToken = generateAccessToken({ 
      userId: createdUser._id.toString(), 
      email: createdUser.email 
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: createdUser._id.toString(),
          username: createdUser.username,
          email: createdUser.email,
          createdAt: createdUser.createdAt,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during signup' 
    });
  }
};

/**
 * @desc    Login a user
 * @route   POST /api/users/login
 * @access  Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and password are required' 
    });
  }

  // Normalize email to lowercase for consistency (matches User model schema)
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Find user by email (use normalized email to match database)
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate access token
    const accessToken = generateAccessToken({ 
      userId: user._id.toString(), 
      email: user.email 
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

/**
 * @desc    Logout a user
 * @route   POST /api/users/logout
 * @access  Private (requires authentication)
 */
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout' 
    });
  }
};
