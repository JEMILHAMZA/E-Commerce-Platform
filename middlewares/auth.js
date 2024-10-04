


// middlerwares/auth.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');  // Assuming this is the correct path to your Admin model

module.exports = async function (req, res, next) {
  const token = req.session.token;
  if (!token) {
    return res.redirect('/admin/login');  // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, 'jwtSecret');  // Verify the token

    // Fetch the full admin details using the id from the decoded token
    const admin = await Admin.findById(decoded.admin.id);  // Make sure the token has the admin's id

    if (!admin) {
      return res.redirect('/admin/login');  // Redirect if admin not found
    }

    req.admin = admin;  // Store full admin object in req.admin
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    res.redirect('/admin/login');
  }
};

