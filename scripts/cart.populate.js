const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect("mongodb+srv://app:nOUBMYzHv2F2HGyr@cluster0.oa8pf35.mongodb.net/ecommerce?retryWrites=true&w=majority")
async function main (cid) {

  const cartModel = require('../models/cart.model')

  let cart = await cartModel.findOne({_id: cid })
  .populate({path:'products._id', select: ['title', 'price', 'stock']})
  .lean()
  
  return cart
}

module.exports = main