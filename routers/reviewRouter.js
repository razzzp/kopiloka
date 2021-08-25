const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/review');
const ReviewValidator = require('../models/reviewValidator');
const { catchAsync } = require('../utils/catchAsync');

reviewRouter = express.Router();

reviewRouter.delete('/reviews/:id', catchAsync(async function (req, res) {
  const { id } = req.params;
  const { fromCafeId } = req.query;
  const review = await Review.findByIdAndDelete(id);
  if (fromCafeId)
    res.redirect(`/cafes/${fromCafeId}`);
  else
    res.redirect('/cafes');
}));

module.exports = reviewRouter;