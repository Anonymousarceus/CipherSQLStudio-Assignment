const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: existingUser.email === email 
        ? 'Email already registered' 
        : 'Username already taken'
    });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for verification
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Generate token
  const token = generateToken(user._id);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('completedAssignments.assignment', 'title difficulty');

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        completedAssignments: user.completedAssignments,
        completedCount: user.completedCount,
        createdAt: user.createdAt
      }
    }
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const updateData = {};

  if (username) updateData.username = username;
  if (email) updateData.email = email;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
