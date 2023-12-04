const userManager = require('../../scripts/repositories/user.repository')

class Dto{
  
  async setUser(id){
    if (id){
      const user = await userManager.getElementById(id)
    return {firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email, gender: user.gender, cartId: user.cartId || null, id: id, role: user.role}
    }
    return null
  }

  mainData(user){
    const newUser = {name: `${user.firstName + user.lastName}`, email: user.email, role: user.role, lastConection: user.lastConection, id: user._id}
    return(newUser)
  }
}

module.exports = new Dto()