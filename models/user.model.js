const { Schema, model } = require('mongoose')
const cartManager = require('../scripts/managers/cartManager')
const CartManager = new cartManager()


const schema  = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
  gender: String,
  createdDate: {type:String, default: Date.now()},
  role: {type: String, default: "customer"},
})


const userModel = model('users', schema)

module.exports = userModel