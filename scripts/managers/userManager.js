const userModel = require('../../models/cart.model')

class userManager{
  addUser(user){
    userModel.create(user)
  }
  updateUser(user){
    userModel.updateOne(user)
  }
}

module.exports = userManager()