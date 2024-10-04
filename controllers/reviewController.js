// controllers/reviewController.js
const Review = require('../models/Review');
const Order = require('../models/Order');

// Submit a Review
exports.submitReview = async (req, res) => {
  const productId = req.params.productId;
  const { rating, comment } = req.body;

  try {
    // Check if user has purchased the product
    const order = await Order.findOne({ userId: req.user._id, 'items.productId': productId });
    if (!order) {
      return res.status(403).send('You can only review products you have purchased');
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({ productId, userId: req.user._id });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
    } else {
      // Create a new review
      const newReview = new Review({
        productId,
        userId: req.user._id,
        rating,
        comment,
      });
      await newReview.save();
    }

    res.redirect(`/product/${productId}`);
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).send('Server Error');
  }
};
