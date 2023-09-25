const fs = require('fs/promises')
const path = require('path')

const productModel = require('../../models/product.model');
const BaseMananger = require('./base.repository.managers.js')


class productManager  extends BaseMananger{
  
  constructor() {
    super(productModel)
  }

  // async getAll () {
  //   const products = productModel.find().lean()
  //   return products;
  // }

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

  // async addProduct(item) {
  //     const result = await productModel.create(item)
  //     this.Update()
  //     return result;
  // }

  // async deleteProduct (id) {
  //   if (await !this.getProductById(id)) {
  //     console.error("el producto no existe")
  //     return false
  //   }
  //   else {
  //     await productModel.deleteOne({_id : id})
  //     console.log("producto eliminado")
  //     return true
  //     this.Update()
  //   }
  //}

  // async getProductById(id) {
  //   const product = await productModel.find({_id : id}).lean()
  //   console.log("producto", product)
  //   return product
  // }

  // async modifyProduct (id, item) {
  //   try {
  //     const result = await productModel.updateOne({_id : id}, item)
  //     if (result.matchedCount >= 1) {return item}
  //     this.Update()
  //   }
  //   catch(e){
  //     console.error(e)
  //     return false;
  //   }
  // }
}


module.exports = productManager
