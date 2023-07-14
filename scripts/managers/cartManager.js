const fs = require('fs/promises')
const path = require('path')

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

  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  
  async Update () {
    await fs.writeFile(this.filepaht, JSON.stringify(this.carts))
    }

  async newCart () {
    const cart = {cartId:this.generateUUID(), cartProducts:[]}
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

  getId (cid, id){
    let cart = this.getCartById(cid)
    const index = cart.cartProducts.findIndex(item => item.id == id)
    if (index === -1) {
      console.log("Producto con el id", id, "no encontrado")
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
  }



module.exports = cartManager
