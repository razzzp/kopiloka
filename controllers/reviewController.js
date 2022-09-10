const {Review} = require('../models/review');
const {ReviewValidator} = require('../models/reviewValidator');
const mongoose = require('mongoose');

const createReview = async function (req, res) {
    const { cafeid } = req.params;
    const { review } = req.body;
    // console.log(`Post review in cafe ${id} `)
    ReviewValidator.validate(review)
    const newReview = new Review(review);
    newReview.myOwner = mongoose.Types.ObjectId(cafeid);
    newReview.author = req.user;
    await newReview.save();
    res.redirect(`/cafes/${cafeid}`);
};

const deleteReview = async function (req, res) {
    const { reviewId } = req.params;
    const { fromCafeId } = req.query;
    const review = await Review.findByIdAndDelete(reviewId);
    if (fromCafeId)
      res.redirect(`/cafes/${fromCafeId}`);
    else
      res.redirect('/cafes');
}

module.exports = {
    createReview,
    deleteReview
};