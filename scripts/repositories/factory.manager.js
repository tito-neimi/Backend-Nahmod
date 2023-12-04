const cartManager = require('./cart.repository')
const CartManager = new cartManager()
const productManager = require('./product.repository')
const ProductManager = new productManager()
const userManager = require('./user.repository')
const chatManager = require('./chat.repository')
const { PERSISTANCE } = require('../../config/config')


class factoryManager{

  static getManagerInstance(name){
    if (PERSISTANCE == "mongo"){
      switch (name) {
        case 'products':
          return ProductManager;
        case 'user':
          return userManager;
        case 'cart':
          return CartManager;
        case 'chat':
          return chatManager;
      }
    }
  }
}

module.exports = factoryManager