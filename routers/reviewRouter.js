const express = require('express');
const mongoose = require('mongoose');
const {Review} = require('../models/review');
const {ReviewValidator} = require('../models/reviewValidator');
const { catchAsync } = require('../utils/catchAsync');
const passport = require('passport');
const { requireLogin, isReviewAuthor } = require('../middlewares');

reviewRouter = express.Router();

reviewRouter.delete('/:reviewId', 
  requireLogin,
  isReviewAuthor,
  catchAsync(async function (req, res) {
  const { reviewId } = req.params;
  const { fromCafeId } = req.query;
  const review = await Review.findByIdAndDelete(reviewId);
  if (fromCafeId)
    res.redirect(`/cafes/${fromCafeId}`);
  else
    res.redirect('/cafes');
}));

module.exports = reviewRouter;