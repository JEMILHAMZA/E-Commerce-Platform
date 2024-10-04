

// routes/index.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');

// Get all products with optional filtering and search
router.get('/', async (req, res) => {
  try {
    const { category, priceMin, priceMax, sort, ratingMin, ratingMax, search } = req.query;

    // Filter criteria
    let filterCriteria = {};

    if (category) {
      filterCriteria.category = category;
    }
    if (priceMin || priceMax) {
      filterCriteria.price = {};
      if (priceMin) filterCriteria.price.$gte = parseFloat(priceMin);
      if (priceMax) filterCriteria.price.$lte = parseFloat(priceMax);
    }

    // Add search functionality (search by name or description)
    if (search) {
      filterCriteria.$or = [
        { name: { $regex: search, $options: 'i' } },  // Case-insensitive search on product name
        { description: { $regex: search, $options: 'i' } }  // Case-insensitive search on product description
      ];
    }

    // Fetch products matching the filter criteria
    let products = await Product.find(filterCriteria).lean();

    // Calculate the average rating for each product
    const productIds = products.map(product => product._id);
    const ratings = await Review.aggregate([
      { $match: { productId: { $in: productIds } } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" }
        }
      }
    ]);

    // Attach average rating to each product
    products = products.map(product => {
      const ratingInfo = ratings.find(r => r._id.toString() === product._id.toString());
      product.avgRating = ratingInfo ? ratingInfo.avgRating : 0; // Set avgRating to 0 if no rating is available
      return product;
    });

    // Filter products by rating range if provided
    if (ratingMin || ratingMax) {
      products = products.filter(product => {
        const avgRating = product.avgRating;
        return (!ratingMin || avgRating >= parseFloat(ratingMin)) &&
               (!ratingMax || avgRating <= parseFloat(ratingMax));
      });
    }

    // Sort products if sorting is provided
    if (sort) {
      if (sort === 'priceAsc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'priceDesc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'newest') {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    res.render('index', { products, query: req.query });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
