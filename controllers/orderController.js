const Order = require('../models/Order');

exports.getUserOrders = async (req, res) => {
    try {
        // Fetch orders based on user ID and status
        const orders = await Order.find({ userId: req.user._id }).sort({ orderDate: -1 });
        
        // Categorize orders
        const categories = {
            Processing: orders.filter(order => order.orderStatus === 'Processing'),
            Shipped: orders.filter(order => order.orderStatus === 'Shipped'),
            Delivered: orders.filter(order => order.orderStatus === 'Delivered'),
            Cancelled: orders.filter(order => order.orderStatus === 'Cancelled'),
        };

        res.render('orderTracking', { categories });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Server Error');
    }
};
