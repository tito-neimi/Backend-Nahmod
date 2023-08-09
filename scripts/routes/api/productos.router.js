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
  products = await ProductModel.find().lean()
}
start();


router.get (('/'), async (req, res) => {
  const { limit } = req.query
  if (limit) {
    const products = await ProductModel.find().limit(limit).lean()
    res.render('home', {productos:products})  }
  else {
    const products = await productManager.getAll()
    res.render('home', {productos:products}) 
  }
})

router.get(('/realtimeproducts/'), (req, res) => {

  res.render ('realTimeProducts', {productos: products})
})
router.get(('/realtimeproducts/admin'), (req, res) => {

  res.render ('realTimeProducts', {productos: products, admin: true})
})

router.get (('/:id'), async (req, res) => {

  const { id } = req.params
  const product = productManager.getProductById(id)
  if (!product){
    res.sendStatus(404)
    return
  }
  res.send(product);
  res.render ('displayProduct', {item:product})
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