// routes/checkout.js

const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const authUser = require('../middlewares/authUser');

// Get the checkout page
router.get('/', authUser, checkoutController.getCheckout);

// Post the order
router.post('/', authUser, checkoutController.placeOrder);

module.exports = router;
