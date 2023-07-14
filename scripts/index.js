const fs = require('fs/promises')
const path = require('path')


class productManager {
  
  constructor() {
    this.filepath = path.join(__dirname, 'productos.json')
    this.productos = []; 
  }

   async setProductos () {
    const data = await fs.readFile("productos.json", 'utf-8');
    this.productos =  JSON.parse(data);

    return this.productos;
  }


   addProduct(item) {
    if (!this.getCode(item.code)) {
      item.id = this.generateUUID();
      this.productos.push(item);
      this.Update()
      return true;
    } else {
      console.warn(`el producto ${item.title}, con el codigo ${item.code} ya a sido creado`);
      return false;
    }
  }

   deleteProduct (code) {
    if (!this.getCode(code)) {
      console.error("el producto no existe")
    }
    else {
      const NewProductos = this.productos.filter(prod => prod.code != code);
      this.productos = NewProductos;
      console.log("producto eliminado")
      this.Update()
    }
  }

   getProductById(id) {
    let index = this.productos.findIndex((a) => a.id === id);
    if (index === -1) {
      console.error(`Error id:${id} not found`);
      return false
    } else {
      return this.productos[index];
    }
  }

   getProducts () {
    return(this.productos)
  }

   getCode(code) {
    let index = this.productos.findIndex((a) => a.code == code);
    if (index === -1) {
      return false
    } else {
      return this.productos[index];
    }
  }

   modifyProduct (code, item) {
    let index = this.productos.findIndex((a) => a.code == code )
    if (index === -1) {
      console.error("el producto no existe entonces no puede ser modificado")
    }
    else {
      const newItem = this.productos[index]
      newItem.title = item.title
      newItem.description = item.description
      newItem.price = item.price
      newItem.stock = item.stock
      newItem.thumbnail = item.thumbnail
      this.productos[index] = newItem
      this.Update()
    }
  }
  
    async Update () {
      await fs.writeFile("productos.json", JSON.stringify(this.productos))
  }

   clearProducts () {
    this.productos = [];
    this.Update()
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

}

class product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

module.exports = productManager

const controlPanel = new productManager()
controlPanel.setProductos()

//PRUEBAS 

// productManager.addProduct(mate = new product("Mate", "Un mate", 200, `./assets/mate.jpg`, 1002, 20))
// productManager.addProduct(termo = new product("Termo", "Un termo", 2200, `./assets/termo.jpg`, 1001, 10))
// productManager.addProduct(mate = new product("Mate", "Un mate", 200, `./assets/mate.jpg`, 1002, 20))
// //productManager.deleteProduct(1002)
// // console.log(productManager.getProducts())
// // console.log("funcion getProductByID",productManager.getProductById(2))
// productManager.modifyProduct(productManager.getCode(1001),"Termo modificado", "Un mate con la descripcion modificada", 999, `./assets/mate.jpg`, 1001, 20)
// // console.log(productManager.getProductById(2))
// console.log(productManager.generateUUID())