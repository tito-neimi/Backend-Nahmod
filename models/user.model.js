const { Schema, model } = require('mongoose')



const schema  = new Schema({
  cartId: String, 
  fisrtName: String,
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