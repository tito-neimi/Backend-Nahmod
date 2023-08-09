const { Schema, model } = require('mongoose')

const schema  = new Schema({
  products: {type: [String], default:[]}
})


const CartModel = model('carts', schema)

module.exports = CartModel