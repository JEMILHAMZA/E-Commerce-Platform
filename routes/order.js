// routes/order.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authUser = require('../middlewares/authUser');


// Order success page
router.get('/success', (req, res) => {
  res.render('order-success');
});




// Get user's orders
router.get('/', authUser, orderController.getUserOrders);





module.exports = router;
