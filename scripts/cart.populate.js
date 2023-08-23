const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

async function main (cid) {
  mongoose.connect("mongodb+srv://app:nOUBMYzHv2F2HGyr@cluster0.oa8pf35.mongodb.net/ecommerce?retryWrites=true&w=majority")

  const cartModel = require('../models/cart.model')
  const userModel = require('../models/user.model')

  let cart = await cartModel.findOne({_id: cid })
  .populate({path:'products._id', select: ['title', 'price']})
  .populate({path: 'user', select: ['firstName', 'lastName']})
  .lean()
  
  return cart

}

module.exports = main