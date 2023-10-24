
const { getAll, getById, createProduct, modifyProduct, deleteProduct, realTimeProduct } = require('../../../controllers/products.controller')
const CustomRouter = require('../custom.router.js')

class productRouter extends CustomRouter {
  init () {

    this.get('/', ["public","customer","premium","admin"], getAll)
    this.get('/realtimeproducts', ["premium", 'admin'], realTimeProduct)
    this.get('/:id/', ['public','customer',"premium", 'admin'], getById)

    this.post('/',["premium",'admin'], createProduct)
    this.put('/:pid', ['premium', 'admin'], modifyProduct)
    this.delete('/:pid/', ['premium','admin'], deleteProduct)
  }
}
module.exports = {
  custom: new productRouter()
}