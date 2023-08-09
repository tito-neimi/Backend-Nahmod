const fs = require('fs/promises')
const path = require('path')
const cartModel = require('../../models/cart.model')

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

  async newCart () {
    const cart = cartModel.create()
    this.carts.push(cart)
    this.Update()
  }

  getCartById(cid) {
    let index = this.carts.findIndex((cart) => cart.cartId == cid);
    if (index === -1) {
      console.error(`Error CartId:${cid} not found`);
      return false
    } else {
      return this.carts[index];
    }
  }

  addProductToCart (cid,item) {
    if (!this.getId(cid, item.id)) {
      const cartIndex = this.getCartById(cid)
      cartIndex.cartProducts.push(item);
      this.Update()
      return true;
    } else {
      console.warn(`el producto ${item.title}, con el codigo ${item.code} ya a sido creado`);
      return false;
    }
  }

  getAll() {
    return this.carts
  }
  }



module.exports = cartManager
