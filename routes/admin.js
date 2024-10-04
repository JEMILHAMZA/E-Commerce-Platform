// routes/admin.js

const express = require('express');
const auth = require('../middlewares/auth'); // JWT Authentication middleware
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const orderController = require('../controllers/orderController');

const productController = require('../controllers/productController');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const adminOrderController = require('../controllers/adminOrderController');
const SupportRequest= require('../models/SupportRequest');


// GET login page
router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/login', loginAdmin);

// GET register page
router.get('/register', (req, res) => {
    res.render('admin/register');
});

router.post('/register', registerAdmin);


// Admin Logout
router.get('/logout', auth, (req, res) => {
  // Clear the session token
  req.session.token = null;

  // Redirect to login page after logout
  res.redirect('/admin/login');
});




// Admin Dashboard (Protected Route)
router.get('/dashboard', auth, (req, res) => {
  
  res.render('admin/dashboard', { admin: req.admin });  // Render the dashboard view
  
});






// Admin dashboard order management
router.get('/manage-orders', auth, adminOrderController.getManageOrders);
router.post('/update-order-status/:orderId', auth, adminOrderController.updateOrderStatus);


// Route to render the support requests page
router.get('/support-requests', auth, async (req, res) => {
  const supportRequests = await SupportRequest.find().sort({ createdAt: -1 });
  res.render('admin/supportRequests', { supportRequests });
});

// Route to update the "isResponded" status
router.post('/support-requests/:id/responded', auth, async (req, res) => {
  const requestId = req.params.id;
  const supportRequest = await SupportRequest.findById(requestId);

  // Toggle the isResponded status
  supportRequest.isResponded = !supportRequest.isResponded;
  await supportRequest.save();

  res.redirect('/admin/support-requests');
});











// const { getProducts, addProduct, deleteProduct, editProduct } = require('../controllers/productController');

// Manage Products - List all products
router.get('/products', auth, productController.getAllProducts);

// Create new product
router.get('/products/new', auth, (req, res) => res.render('admin/newProduct'));
router.post('/products', auth, productController.createProduct);

// Edit product
router.get('/products/edit/:id', auth, productController.editProductForm);
router.post('/products/edit/:id', auth, productController.updateProduct);

// Delete product
router.post('/products/delete/:id', auth, productController.deleteProduct);



module.exports = router;



















