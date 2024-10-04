

// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authUser = require('../middlewares/authUser');

// View Cart
router.get('/',authUser, cartController.viewCart);

// Add Product to Cart (Protected by auth middleware)
router.post('/add/:productId', authUser, cartController.addToCart);

// Remove Product from Cart
router.post('/remove/:productId',authUser, cartController.removeFromCart);

// Update Quantity (Increase or Decrease)
router.post('/update/:productId/:action', authUser, cartController.updateCartQuantity);


module.exports = router;












