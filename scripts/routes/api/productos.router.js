
const { getAll, getById, createProduct, modifyProduct, deleteProduct, realTimeProduct } = require('../../../controllers/products.controller')
const CustomRouter = require('../custom.router.js')

class productRouter extends CustomRouter {
  init () {

    this.get('/', ["public","customer","admin"], getAll)
    this.get('/:id/', ['public','customer', 'admin'], getById)
    this.post('/',['admin'], createProduct)
    this.put('/:pid', ['admin'], modifyProduct)
    this.delete('/:pid', ['admin'], deleteProduct)

    this.get('/:realTimeProducts', ['admin'], realTimeProduct)

  }

}
module.exports = {
  custom: new productRouter()
}