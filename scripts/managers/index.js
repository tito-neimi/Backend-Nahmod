const fs = require('fs/promises')
const path = require('path')

const productModel = require('../../models/product.model');
const { reset } = require('nodemon');

class productManager {
  
  constructor() {
    this.filepath = path.join(__dirname, 'productos.json')
    this.productos = []
  }

  async getAll () {
    const products = productModel.find().lean()
    this.productos = products
    return products;
  }

  async getAllByPage (page, limit, sort, query) {
    const paginateOptions = {page: page, limit:limit}
    let myAggregate
    if (query == "null" || query == null){
      myAggregate = productModel.aggregate([{$sort:{price: +sort}}])
    }
    else {
      myAggregate = productModel.aggregate([
        {
          $match:{category: query}
        },
        {$sort:{price: +sort}}
    ]) 
    }
  
    
    const products = await productModel.aggregatePaginate(myAggregate, paginateOptions)
    return products
    
  }


  async addProduct(item) {
      const result = await productModel.create(item)
      this.Update()
      return true;
  }

  async deleteProduct (id) {
    if (await !this.getProductById(id)) {
      console.error("el producto no existe")
      return false
    }
    else {
      await productModel.deleteOne({_id : id})
      console.log("producto eliminado")
      return true
      this.Update()
    }
  }

  async getProductById(id) {
    const product = await productModel.find({_id : id}).lean()
    console.log("producto", product)
    return product
   }

  getProducts () {
    return (this.productos)
  }

  async modifyProduct (id, item) {
    try {
      const result = await productModel.updateOne({_id : id}, item)
      if (result.matchedCount >= 1) {return item}
      this.Update()
    }
    catch(e){
      console.error(e)
      return false;
    }
  }

  async Update () {
      this.productos = this.getAll()
      await fs.writeFile("productos.json", JSON.stringify(this.productos))
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