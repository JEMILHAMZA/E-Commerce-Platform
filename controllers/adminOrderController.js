// controllers/adminOrderController.js
const Order = require('../models/Order');
exports.getManageOrders = async (req, res) => {
  
    try {
        // Fetch all orders
        
        const orders = await Order.find().sort({ orderDate: -1 });
       
        res.render('adminManageOrders', { orders });
    } catch (err) {
        console.error('Error fetching orders for admin:',err);
        res.status(500).send('Server Error');
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        // Update order status
        const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
        if (!order) {
            return res.status(404).send('Order not found');
        }
        res.redirect('/admin/manage-orders');
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).send('Server Error');
    }
};
