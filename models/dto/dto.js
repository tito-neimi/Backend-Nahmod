const userManager = require('../../scripts/repositories/user.repository')

class Dto{
  
  async setUser(id){
    if (id){
      const user = await userManager.getElementById(id)
      console.log(user)
    return {firstame: user.firstName, lastName: user.lastName, username: user.username, email: user.email, gender: user.gender, cartId: user.cartId || null, id: id, role: user.role}
    }
    return null
  }
}

module.exports = new Dto()