const ProductManager = require('../scripts/managers/index.js')
const productManager = new ProductManager()
const userManager = require('../scripts/managers/userManager.js')


const getAll =  async (req, res) => {
  let { limit, page, sort, query } = req.query
  var _user
  if (req.session.passport){
    _user = await userManager.getById(req.session.passport.user)
  }
  else{ _user = null}

  if (!limit) limit = 10
  if (!page) page = 1
  if (!sort) sort = 1
  if (!query) query = null
  try {
      const {docs: products, ...pageInfo} = await productManager.getAllByPage(page, limit, sort, query)
      pageInfo.prevLink = pageInfo.hasPrevPage ? `/api/products/?page=${pageInfo.prevPage}&limit=${limit}&query=${query}&sort=${sort}` : null
      pageInfo.nextLink = pageInfo.hasNextPage ? `/api/products/?page=${pageInfo.nextPage}&limit=${limit}&query=${query}&sort=${sort}` : null
      res.render('home', {productos:products, pageInfo:pageInfo, user: _user ?  {..._user, isAdmin: _user?.role == 'admin',} : null})
    }
    catch (error) {
      res.status(404).send("parametros erroneos")
      console.error(error)
    }
  }

  const getById = async (req, res) => {

    const { id } = req.params
    const product = await productManager.getProductById(id)
    const item = product[0]
    if (!product){
      res.sendStatus(404)
      return
    }
    var _user
    if (req.session.passport){
    _user = await userManager.getById(req.session.passport.user)
  }
  else{ _user = null}
    res.render ('displayProduct', {item:item, user: _user ?  {..._user, isAdmin: _user?.role == 'admin',} : null})
  }

  const createProduct = async (req, res) => {
    const { body } = req
    const product = await productManager.addProduct(body)
    //await productManager.addProduct(body)
    res.send(`Producto creado con el _id ${product._id}` ) 
  }

  const modifyProduct = async (req,res) => {
    const {pid} = req.params
    const {body} = req
    try {
    const result = await productManager.modifyProduct(pid, body)
    console.log(result)
    if (result) {
      res.sendStatus(202)
      return
    }
    res.sendStatus(404)
    }
    catch(e){
      console.error(e)
      res.sendStatus(500)
    }
  }

  const deleteProduct = async (req,res) => {
    const {pid} = req.params
  
    try {
        //await productManager.deleteProduct(pid)
        const result = await productManager.deleteProduct(pid)
  
        if (result) {
          res.sendStatus(200)
          res.send("Producto Eliminado")
          return
        }
        res.sendStatus(404)
        res.send("Producto no encontrado, pruebe con otro id")
  
    } catch (error) {
      console.error(error)
    }
  }

  const realTimeProduct = async (req, res) => {
    const products = await productManager.getAll()
    res.render ('realTimeProducts', {productos: products, admin: true, user: req.session.user})
  }

module.exports = {
  getAll,
  getById,
  createProduct,
  modifyProduct,
  deleteProduct,
  realTimeProduct
}