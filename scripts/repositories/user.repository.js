const logger = require('../../logger')
const userModel = require('../../models/user.model')
const BaseMananger = require('./base.repository.managers')
const CartManager = require('./cart.repository')
const cartManager = new CartManager()


class userManager extends BaseMananger{

  constructor(){
    super(userModel)
  }

  async addUser(user){
    if (!user.cartId) {
      user.cartId =  await cartManager.newCart()
    }
    logger.info("nuevo usuario: ", user)
    return await userModel.create(user)
  }
  async getByEmail (email) {
    return await userModel.findOne({email: email}).lean()
  }
  async logIn(email, password){
    const result = await userModel.find({email: email, password: password})
    return result
  }
}

module.exports = new userManager()