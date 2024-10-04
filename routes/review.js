// routes/review.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authUser = require('../middlewares/authUser');



// Submit a review
router.post('/:productId/review', authUser, reviewController.submitReview);

module.exports = router;
