const mongoose = require('mongoose');
const {Review} = require('./review');
const {UserSchema, User} = require('./user');

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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imgUrls: {}
});

const Cafe = mongoose.model('Cafe', cafeSchema, 'cafes');

Cafe.getReviews = async function(forCafe){
  if (forCafe && forCafe._id) 
    return await Review.find({myOwner : forCafe}).populate('author');
  else
    throw new Error('Error in Cafe.getReviews, forCafe param and/or its id is undefined.');
};

module.exports = {Cafe};