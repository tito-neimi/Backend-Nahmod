const logger = require('../../logger')
const cartModel = require('../../models/cart.model')
const productManager = require('./product.repository')
const ProductManager = new productManager()


class cartManager {
  constructor() {
    this.carts = []
  }

  async newCart (body) {
    const cart = await cartModel.create({products: body ? body.products : []})
    console.log('carrito agregado')
    return cart._id
  }

  async getCartById(cid) {
    const cart = await cartModel.find({_id : cid}).lean()
    return cart
  }

  async addProductToCart (cid,item, user) {

    const product = ProductManager.getElementById(item._id)
    if (user.owner !== product.owner){

      const result = await cartModel.findOneAndUpdate(
      { _id: cid },
      { $push: { products: {_id: item._id, quantity: item.quantity} } },
      { new: true }
      );
      logger.info("producto agregado al carrito, nuevo carriot :", result)
      }else {
        return false
      }
    }

  async deleteProductFromCart (cid, pid) {
    if (pid) {
      const cart = await this.getCartById(cid)
      const itemRef = cart[0].products.filter(prod => prod !== pid)
      cart[0].products = itemRef
      const result = await cartModel.updateOne({_id: cid}, {$set: {products: cart[0].products}})
      return result
    }
    else {
      const result = await cartModel.updateOne({_id:cid}, {$set: {products: []}})
      return result
    }
  }
  
  
  async updateProductFromCart (cid, items) {
    const result = await cartModel.updateOne({_id: cid}, {$set:{products: items}})
    return result 
  }

  async updateQuantity (cid, pid, body) {
    //Yo al mandar el objeto por el postaman lo mando como array ([1]) ya que no me deja mandarlo solo
    const result = await cartModel.updateOne({_id: cid, "products.pid": pid}, {$set:{"products.$.quantity": body[0]}}) 
    return result
  }

  async getAllCarts(){
    return await cartModel.find({}).lean()
  }
  }


module.exports = cartManager
