// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Sign up new user
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.redirect('/signin'); // After sign-up, redirect to sign-in
  } catch (err) {
    res.status(500).send('Server Error');
  }
};






exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store the token in the session
    req.session.token = token;

    // Store the user in the session
    req.session.user = user;

    // Store the session creation time (used for enforcing the 24-hour session limit)
    req.session.createdAt = Date.now(); // Save the current time when the session is created

    // Redirect to the homepage
   
    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
};








// Logout user
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
};
