// // middlewares/authUser.js


const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Set a constant for the token lifespan (in milliseconds)
const TOKEN_REFRESH_TIME = 5 * 60 * 1000; // 5 minutes before token expires
const MAX_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours session lifespan

const authUser = async (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.redirect('/signin'); // Redirect to login if no token is found
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    const now = Date.now();

    // Check if the session started more than 24 hours ago
    if (now - req.session.createdAt > MAX_SESSION_DURATION) {
      req.session.destroy(); // Destroy the session after 24 hours
      return res.redirect('/signin'); // Force logout after 24 hours
    }

    // Refresh token if it's about to expire within 5 minutes
    const timeUntilExpiration = decoded.exp * 1000 - now; // Calculate time remaining
    if (timeUntilExpiration < TOKEN_REFRESH_TIME) {
      const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Create new token
      req.session.token = newToken; // Store the new token in session
    }

    req.user = await User.findById(decoded.id); // Find user by ID and attach to req.user
    if (!req.user) {
      return res.redirect('/signin'); // Redirect if user is not found
    }

    next();
  } catch (err) {
    console.error('Error authenticating user:', err);
    return res.redirect('/signin');
  }
};

module.exports = authUser;
