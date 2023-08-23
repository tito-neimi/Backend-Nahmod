const fs = require('fs/promises')
const path = require('path')
const cartModel = require('../../models/cart.model')
const { captureRejectionSymbol } = require('events')

class cartManager {
  constructor() {
    this.filepaht = path.join(__dirname, '../../data', 'cart.json')
    this.carts = []
    this.setCarritos()
  }

  async setCarritos () {
    const data = await fs.readFile(this.filepaht, 'utf-8');
    this.carts = JSON.parse(data) || [];
  }
  
  async Update () {
    await fs.writeFile(this.filepaht, JSON.stringify(this.carts))
    }

  async newCart (body) {
    const cart = await cartModel.create({user: body.user, products: body.products ? body.products : null})
    console.log('carrito agregado')
    this.carts.push(cart)
  }

  async getCartById(cid) {
    const cart = await cartModel.find({_id : cid}).lean()
    return cart
  }

  async addProductToCart (cid,item) {
    // const cart = await this.getCartById(cid)
    // const products = cart[0].products
    // products.push({_id: item._id, quantity: item.quantity})
    // if (cart) {
    //   const result = await cartModel.updateOne({_id: cid}, {$set: {products: products}})
    //   console.log(result)
    // }
    console.log(item.quantity)

     const result = await cartModel.findOneAndUpdate(
    { _id: cid },
    { $push: { products: {_id: item._id, quantity: item.quantity} } },
    { new: true }
    );
    console.log(result)
    }

  async deleteProductFromCart (cid, pid) {
    if (pid) {
      const cart = await this.getCartById(cid)
      const itemRef = cart[0].products.filter(prod => prod !== pid)
      cart[0].products = itemRef
      const result = await cartModel.updateOne({_id: cid}, {$set: {products: cart[0].products}})
      console.log(result)
      return result
    }
    else {
      const result = await cartModel.updateOne({_id:cid}, {$set: {products: []}})
      console.log(result)
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
 
  async getAll() {
    let cart = await cartModel.findOne({_id: "64d001e65a9ce9d273c430f8"})
    console.log(cart)
  }
  }


module.exports = cartManager