const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String
  },
  myOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true
  },
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
const Review = mongoose.model('Review',reviewSchema,'reviews');
module.exports = {Review};