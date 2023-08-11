const { Schema, model } = require('mongoose')

const schema  = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  createdDate: {type:String, default: Date.now()},
  password: String,
  role: String,
  products: {type: [String], default:[]}
})


const CartModel = model('users', schema)

module.exports = CartModel