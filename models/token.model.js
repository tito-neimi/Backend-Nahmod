const { Schema, model } = require('mongoose')

const schema  = new Schema({
  token: String,
  email: String,
  createdDate: {type:Date, default: new Date()},
})


const tokenModel = model('token', schema)

module.exports = tokenModel