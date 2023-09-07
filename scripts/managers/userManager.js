const userModel = require('../../models/user.model')
const CartManager = require('./cartManager')
const cartManager = new CartManager()

class userManager{
  async addUser(user){
    if (!user.cartId) {
      user.cartId =  await cartManager.newCart()
    }
    console.log(user)
    return await userModel.create(user)
  }
  async updateUser(user){
    return await userModel.updateOne(user)
  }
  async getAll(){
    return await userModel.find({}).lean()
  }
  async getByUser(user){
    const result = await userModel.findOne({username : user}).lean()
    return result
  }
  async getById(id){
    return await userModel.findOne({_id : id}).lean()
  }
  async getByEmail (email) {
    return await userModel.findOne({email: email}).lean()

  }
  async deleteUser(id){
    await userModel.deleteOne({_id:id})
  }
  async logIn(email, password){
    const result = await userModel.find({email: email, password: password})
    return result
  }
}

module.exports = new userManager()