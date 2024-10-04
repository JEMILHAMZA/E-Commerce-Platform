

// controllers/cartController.js
const Cart = require('../models/cart');
const Product = require('../models/Product');


exports.viewCart = async (req, res) => {
  try {
      // Find the cart by userId and populate the product details for each item
      const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  
      if (!cart || cart.items.length === 0) {
          return res.render('cart', { cart: [], totalCost: 0, totalQuantity: 0 });
      }
  
      // Calculate total cost of the cart
      const totalCost = cart.items.reduce((total, item) => {
          // Check if the product exists before accessing its price
          if (item.productId && item.productId.price) {
              return total + item.productId.price * item.quantity;
          } else {
              return total; // Skip item if the product is not found
          }
      }, 0);
      
      // Calculate total quantity of items in the cart
      const totalQuantity = cart.items.reduce((total, item) => {
          // Check if the product exists before adding its quantity
          if (item.productId) {
              return total + item.quantity;
          } else {
              return total; // Skip item if the product is not found
          }
      }, 0);
  
      // Render the cart view with populated product details, total cost, and total quantity
      res.render('cart', { cart: cart.items, totalCost, totalQuantity });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};


// Add Product to Cart
exports.addToCart = async (req, res) => {
    const productId = req.params.productId;
  
    try {
      // Ensure req.user exists
      if (!req.user || !req.user._id) {
        return res.status(401).send('User not authenticated');
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      // Find or create the user's cart
      let cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        cart = new Cart({ userId: req.user._id, items: [] });
      }
  
      // Check if product is already in the cart
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
  
      if (existingItem) {
        existingItem.quantity++; // Increase quantity if item is already in the cart
      } else {
        cart.items.push({ productId: product._id, quantity: 1 }); // Add new item to cart
      }
  
      // Save the updated cart
      await cart.save();
      res.redirect('/cart');
    } catch (err) {
      console.error('Error adding product to cart:', err);
      res.status(500).send('Server Error');
    }
  };
  

// Remove Product from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.redirect('/cart');
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    
    await cart.save();
    res.redirect('/cart');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};








// Update Product Quantity in Cart
exports.updateCartQuantity = async (req, res) => {
  const { productId, action } = req.params;

  try {
    // Find the cart for the authenticated user
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.redirect('/cart');
    }

    const cartItem = cart.items.find(item => item.productId.toString() === productId);
    if (!cartItem) {
      return res.status(404).send('Item not found in cart');
    }

    // Increase or decrease the quantity
    if (action === 'increase') {
      cartItem.quantity++;
    } else if (action === 'decrease' && cartItem.quantity > 1) {
      cartItem.quantity--;
    } else if (action === 'decrease' && cartItem.quantity === 1) {
      // Remove item if quantity becomes 0
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    }

    // Save the updated cart
    await cart.save();
    res.redirect('/cart');
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    res.status(500).send('Server Error');
  }
};










