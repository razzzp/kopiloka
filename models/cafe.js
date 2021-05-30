const mongoose = require('mongoose')

const cafeSchema = new mongoose.Schema({
  name: String,
  location: String,
  avgPrice: Number
})

const Cafe = mongoose.model('Cafe', cafeSchema, 'cafes')
module.exports.Cafe = Cafe