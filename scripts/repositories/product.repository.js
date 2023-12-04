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
  async getByOwner  (owner) {
    const result =  await this.model.find({owner: owner}).lean()
    return result
  }
}


module.exports = productManager
