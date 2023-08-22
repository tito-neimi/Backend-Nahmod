const userModel = require('../../models/user.model')

class userManager{
  async addUser(user){
    return await userModel.create(user)
  }
  async updateUser(user){
    return await userModel.updateOne(user)
  }
  async getAll(){
    return await userModel.find({}).lean()
  }
  async getByUser(user){
    const result = await userModel.find({username : user}).lean()
    return result[0]
  }
  async getById(id){
    return await userModel.find({_id : id}).lean()
  }
  async deleteUser(id){
    await userModel.deleteOne({_id:id})
  }
  async logIn(email, password){
    const result = await userModel.find({email: email, password: password})
    return result[0]
  }
}

module.exports = new userManager()