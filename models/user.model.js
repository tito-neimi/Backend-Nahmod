const { Schema, model } = require('mongoose')



const schema  = new Schema({
  cartId: String, 
  firstName: String,
  lastName: String, 
  email: String,
  username: String,
  password: String,
  gender: String,
  lastConection: {type: Date, default: Date.now()},
  createdDate: {type:Date, default: Date.now()},
  role: {type: String, default: "customer"},
  files: {type: 
    [
      {
        name: String, 
        tipo: String, // document || profile || product
        reference: String,
      }
    ]
  , default:[]}
})


const userModel = model('users', schema)

module.exports = userModel