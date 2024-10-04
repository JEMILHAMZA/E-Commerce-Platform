const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');
const auth = require('../middlewares/auth');

// Admin dashboard order management
router.get('/manage-orders', auth, adminOrderController.getManageOrders);


router.post('/update-order-status/:orderId', auth, adminOrderController.updateOrderStatus);

module.exports = router;
