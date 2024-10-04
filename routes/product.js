// routes/product.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');

const auth = require('../middlewares/auth');
const productController = require('../controllers/productController');



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


// routes/product.js
router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;

  // Validate the productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send('Invalid Product ID');
  }

  try {
    const objectId = new mongoose.Types.ObjectId(productId);

    // Fetch product details
    const product = await Product.findById(objectId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Calculate average rating and total reviews
    const reviewSummary = await Review.aggregate([
      { $match: { productId: objectId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const summary = reviewSummary.length > 0 ? reviewSummary[0] : { avgRating: 0, totalReviews: 0 };

    // Fetch detailed reviews and populate the user name
    const reviews = req.query.showDetails 
      ? await Review.find({ productId: objectId }).populate('userId', 'name') 
      : [];

    res.render('productDetails', { 
      product, 
      reviews, 
      user: req.session.user, 
      avgRating: summary.avgRating || 0, 
      totalReviews: summary.totalReviews || 0,
      showDetails: req.query.showDetails === 'true'  // Convert to boolean
    });
  } catch (err) {
    console.error('Error loading product and reviews:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
