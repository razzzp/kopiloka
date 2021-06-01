const mongoose = require('mongoose')

const cafeSchema = new mongoose.Schema({
  name: String,
  location: String,
  desc: String,
  avgPrice: Number,
  imgUrls: {}
})

const Cafe = mongoose.model('Cafe', cafeSchema, 'cafes')
module.exports.Cafe = Cafe