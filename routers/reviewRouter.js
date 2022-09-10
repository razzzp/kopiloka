const express = require('express');
const { catchAsync } = require('../utils/catchAsync');
const { requireLogin, isReviewAuthor } = require('../middlewares');
const reviewController = require('../controllers/reviewController')

reviewRouter = express.Router();

reviewRouter.post('/:cafeid', requireLogin, catchAsync(reviewController.createReview));

reviewRouter.delete('/:reviewId', requireLogin, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = reviewRouter;