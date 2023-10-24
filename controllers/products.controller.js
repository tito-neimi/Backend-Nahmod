const dto = require('../models/dto/dto.js')
const CustomError = require('../errors/custom.error')
const ProductManager = require('../scripts/repositories/product.repository.js')
const productManager = new ProductManager()
const errorMesage = require('../errors/errorMesage')
const errorType = require('../errors/errorTypes')
const logger = require('../logger')
const { authToken } = require('../utils/generateToken.js')

const getAll =  async (req, res) => {
  let { limit, page, sort, query } = req.query
  var _user
  if (req.session.passport){
    _user = await dto.setUser(req.session.passport.user)
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
      res.render('home', {productos:products, pageInfo:pageInfo, user: _user ?  {..._user, isAdmin: _user?.role == 'admin' || _user?.role == 'premium'} : null})
    }
    catch (error) {
      res.status(404).send("parametros erroneos")
      
    }
  }

  const getById = async (req, res) => {
    const { id } = req.params
    try {
      const product = await productManager.getElementById(id)
      var _user
      if (req.session.passport){
        _user = await dto.setUser(req.session.passport.user)
        }

      else{ _user = null}
    res.render ('displayProduct', {item:product, user: _user ?  {..._user, isAdmin: _user?.role == 'admin' || _user?.role == 'premium'} : null})
    } catch (error) {
      console.log(error)
      CustomError.createError({
        name: "Product not foundd",
        cause: "ID not found",
        msg: errorMesage.notFound(id),
        code: errorType.INVALID_TYPES
      })
      res.sendStatus(404)
      return
    }
  }
    

  const createProduct = async (req, res) => {
    const body = req.body
    const { authorization } =  req.headers 

    const token = authorization.split(' ')[1] 
    user = authToken(token)
    body.owner = (user.role !== 'admin') ? user.id : 'admin'

    const product = await productManager.add(body)
    res.send({
      message:`Producto creado con el _id ${product._id}`,
      code: 202
    }).status(202)
  }

  const modifyProduct = async (req,res) => {
    const { pid } = req.params
    const {body} = req
    const { authorization } =  req.headers 

    const token = authorization.split(' ')[1] 
    user = authToken(token)

    try {
      if(user.role == 'admin' || product.owner == user._id){
        const result = await productManager.modifyElement(pid, body)
        console.log(result)
        if (result) {
          res.sendStatus(202)
          return
        }
        res.sendStatus(404)
        CustomError.createError({
          name: "Product not found",
          cause: "ID not found",
          msg: errorMesage.notFound(pid),
          code: errorType.INVALID_TYPES
        })
        } else{
          res.send({
            message: 'Insufficient permissions',
            code: 401
          }).code(401)
        }
    }
    catch(e){
      console.error(e)
      res.sendStatus(500)
    }
  }

  const deleteProduct = async (req,res) => {
    const { pid } = req.params
    const { authorization } =  req.headers 

    const token = authorization.split(' ')[1] 
    user = authToken(token)
    try {
        const product = await productManager.getElementById(pid)
        if(user.role == 'admin' || product.owner == user._id){
          const result = await productManager.delete(pid)
          if (result) {
            res.send({
              message: "Producto Eliminado",
              code: 200
            }).code(200)
            return
          }
        }else{
          res.send({
            message: 'Insufficient permissions',
            code: 401
          }).code(401)
        }
  
    } catch (error) {
      console.error(error)
    }
  }

  const realTimeProduct = async (req, res) => {
    if (req.session.passport){
      _user = await dto.setUser(req.session.passport.user)
    }
    const products = await productManager.getByOwner((_user.role !== 'admin') ? _user.id : 'admin')
    res.render ('realTimeProducts', {productos: products, admin: true, user: _user})
  }

module.exports = {
  getAll,
  getById,
  createProduct,
  modifyProduct,
  deleteProduct,
  realTimeProduct
}