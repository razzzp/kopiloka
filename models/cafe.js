const mongoose = require('mongoose')

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
})

const Cafe = mongoose.model('Cafe', cafeSchema, 'cafes')
module.exports.Cafe = Cafe