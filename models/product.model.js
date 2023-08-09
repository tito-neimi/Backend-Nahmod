const { Schema, model } = require('mongoose')

const schema  = new Schema({
  id: String,
  title: String,
  price: Number,
  stock: {type: Number, default: 0},
  description: String,
  category: String,
  thumbnail: String
})


const ProductModel = model('products', schema)

module.exports = ProductModel