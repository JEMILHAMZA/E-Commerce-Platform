// controllers/adminControllers.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Register Admin
exports.registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      // If admin already exists, redirect back to register route
      return res.redirect('/admin/register?error=exists');
    }

    // Create a new admin
    admin = new Admin({ username, email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);
    await admin.save();

    // If successful, redirect to login
    res.redirect('/admin/login');
  } catch (err) {
    // Handle server error
    res.status(500).send('Server error');
  }
};




// Admin Login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if admin exists
      let admin = await Admin.findOne({ email });
      if (!admin) {
        // If admin does not exist, redirect to login with error
        return res.redirect('/admin/login?error=invalid');
      }
  
      // Check if the password matches
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        // If password does not match, redirect to login with error
        return res.redirect('/admin/login?error=invalid');
      }
  
      // If login is successful, create a JWT token
      const payload = { admin: { id: admin.id } };
      const token = jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 });
  
      // Save token in session or cookie (for simplicity, using session here)
      req.session.token = token;
  
      // Redirect to admin dashboard
      res.redirect('/admin/dashboard');
    } catch (err) {
      // Handle server error
      res.status(500).send('Server error');
    }
  };
  
