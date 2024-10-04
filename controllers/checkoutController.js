
// controllers/checkoutController.js
const Cart = require('../models/cart');
const Order = require('../models/Order'); // We will define this model below


// controllers/checkoutController.js
exports.getCheckout = async (req, res) => {
    try {
        // Find the user's cart and populate product details
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        // Calculate total cost of the cart
        const totalCost = cart.items.reduce((total, item) => {
            // Ensure item.productId exists before accessing its properties
            if (item.productId && item.productId.price) {
                return total + item.productId.price * item.quantity;
            } else {
                return total; // Skip item if the product is not found
            }
        }, 0);

        // Render the checkout page with cart details
        res.render('checkout', { cart: cart.items.filter(item => item.productId), totalCost });
    } catch (err) {
        console.error('Error loading checkout:', err);
        res.status(500).send('Server Error');
    }
};



// controllers/checkoutController.js
exports.placeOrder = async (req, res) => {
    const { addressLine1, addressLine2, city, state, postalCode, paymentMethod, fullName, phoneNumber } = req.body;

    try {
        // Find the user's cart and populate product details
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        // Calculate total cost of the cart
        const totalCost = cart.items.reduce((total, item) => {
            // Ensure item.productId exists before accessing its properties
            if (item.productId && item.productId.price) {
                return total + item.productId.price * item.quantity;
            } else {
                return total; // Skip item if the product is not found
            }
        }, 0);

        // Filter out items with deleted products
        const validItems = cart.items.filter(item => item.productId);

        // Create a new order
        const order = new Order({
            userId: req.user._id,
            items: validItems,
            totalCost,
            shippingAddress: {
                addressLine1,
                addressLine2,
                city,
                state,
                postalCode,
            },
            paymentMethod,
            fullName,
            phoneNumber,
        });

        // Save the order to the database
        await order.save();

        // Clear the user's cart
        cart.items = [];
        await cart.save();

        // Redirect to a success page (or order confirmation)
        res.redirect('/order/success');
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).send('Server Error');
    }
};
