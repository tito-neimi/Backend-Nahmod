const { Router } = require('express')
const router = Router()
const express = require('express')

const ProductManager = require('../../managers/index')
const productManager = new ProductManager()
const ProductModel = require('../../../models/product.model')

router.use(express.json())
router.use(express.urlencoded({extended: true}))

let products = [] 

const start = async () => {
  products = await productManager.getAll()
}
start();


router.get (('/'), async (req, res) => {
  let { limit, page, sort, query } = req.query
  
  if (!limit) limit = 10
  if (!page) page = 1
  if (!sort) sort = 1
  if (!query) query = null
  try {
      const {docs: products, ...pageInfo} = await productManager.getAllByPage(page, limit, sort, query)
      console.log(pageInfo)
      pageInfo.prevLink = pageInfo.hasPrevPage ? `/api/products/?page=${pageInfo.prevPage}&limit=${limit}&query=${query}&sort=${sort}` : null
      pageInfo.nextLink = pageInfo.hasNextPage ? `/api/products/?page=${pageInfo.nextPage}&limit=${limit}&query=${query}&sort=${sort}` : null
      console.log(pageInfo)
      //const responseObjetct = {payload: products, totalPages: pageInfo.totalPages, hasPrevPage: pageInfo.hasPrevPage, hasNextPage: pageInfo.hasNextPage, prevPage:pageInfo.prevPage, nextPage:pageInfo.nextPage, prevLink:pageInfo.prevLink, nextLink:pageInfo.nextLink}
      res.render('home', {productos:products, pageInfo:pageInfo})
    }
    catch (error) {
      res.status(404).send("parametros erroneos")
      console.error(error)
    }

  }
)
router.get(('/realTimeProducts'), (req, res) => {

  res.render ('realTimeProducts', {productos: products})
})
router.get(('/realtimeproducts/admin'), (req, res) => {

  res.render ('realTimeProducts', {productos: products, admin: true})
})
router.get (('/:id'), async (req, res) => {

  const { id } = req.params
  const product = await productManager.getProductById(id)
  const item = product[0]
  if (!product){
    res.sendStatus(404)
    return
  }
  res.render ('displayProduct', {item:item})
})

 


router.post (('/'), async (req, res) => {
  const { body } = req
  const product = await productManager.addProduct(body)
  //await productManager.addProduct(body)
  res.send(`Producto creado con el _id ${product._id}` )
    
})

router.put (('/:pid'), async (req,res) => {
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
})

router.delete (('/:pid'), async (req,res) => {
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
})

module.exports = router