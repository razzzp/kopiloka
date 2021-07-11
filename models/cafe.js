const mongoose = require('mongoose');
const Review = require('./review');
const cafeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  desc: String,
  avgPrice: Number,
  imgUrls: {}
});

const Cafe = mongoose.model('Cafe', cafeSchema, 'cafes');

Cafe.getReviews = async function(forCafe){
  if (forCafe && forCafe._id) 
    return Review.find({myOwner : forCafe});
  else
    throw new Error('Error in Cafe.getReviews, forCafe param and/or its id is undefined.');
};

module.exports = Cafe;