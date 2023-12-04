const { Schema, model } = require('mongoose')
const paginate = require('mongoose-aggregate-paginate-v2')

const schema  = new Schema({
  id: String,
  owner: {type: String, default: "admin"},
  title: String,
  price: Number,
  stock: {type: Number, default: 10},
  description: String,
  category: String,
  thumbnail: String
})

schema.plugin(paginate)  

const ProductModel = model('products', schema)

module.exports = ProductModel