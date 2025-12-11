import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';
import { generateAccessToken } from '../utils/jwt.js';

/**
 * @desc    Signup a new user
 * @route   POST /api/users/signup
 * @access  Public
 */
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and password are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
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
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user (MongoDB will auto-generate _id)
    const newUser = new User({
      email,
      name: name || undefined,
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
          email: createdUser.email,
          name: createdUser.name,
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

  try {
    // Find user by email
    const user = await User.findOne({ email });

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
          email: user.email,
          name: user.name,
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
