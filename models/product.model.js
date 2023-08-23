const { Schema, model } = require('mongoose')
const paginate = require('mongoose-aggregate-paginate-v2')

const schema  = new Schema({
  id: String,
  title: String,
  price: Number,
  stock: {type: Number, default: 0},
  description: String,
  category: String,
  thumbnail: String
})

schema.plugin(paginate)  

const ProductModel = model('products', schema)

module.exports = ProductModel