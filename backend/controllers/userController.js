const User = require('../models/User');

// @desc    Login or Signup a user (Lightweight)
// @route   POST /api/users/auth
// @access  Public
const loginOrSignup = async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name: name || 'User' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  loginOrSignup,
};
