const express = require('express');
const mongoose = require('mongoose');
const {Review} = require('../models/review');
const {ReviewValidator} = require('../models/reviewValidator');
const { catchAsync } = require('../utils/catchAsync');
const passport = require('passport')

reviewRouter = express.Router();

reviewRouter.delete('/:id', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), catchAsync(async function (req, res) {
  const { id } = req.params;
  const { fromCafeId } = req.query;
  const review = await Review.findByIdAndDelete(id);
  if (fromCafeId)
    res.redirect(`/cafes/${fromCafeId}`);
  else
    res.redirect('/cafes');
}));

module.exports = reviewRouter;