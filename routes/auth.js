// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Sign-up route
router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', authController.signup);

// Sign-in route
router.get('/signin', (req, res) => res.render('signin'));
router.post('/signin', authController.signin);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
