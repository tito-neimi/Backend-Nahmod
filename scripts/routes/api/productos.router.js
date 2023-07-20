const { Router } = require('express')
const router = Router()
const express = require('express')

const ProductManager = require('../../managers/index')
const productManager = new ProductManager()

router.use(express.json())
router.use(express.urlencoded({extended: true}))

let products = [] 

const start = async () => {
  products = await productManager.setProductos()
}
start();


router.get (('/'), async (req, res) => {
  const { limit } = req.query
  const products = await productManager.setProductos()

  if (limit) {
    const filter = products.slice(0, +limit)
    res.render('home', {productos:filter})  }
  else {
    res.render('home', {productos:products}) 
  }
})

router.get(('/realtimeproducts/'), (req, res) => {
  const {password} = req.params

  res.render ('realTimeProducts', {productos: products})
})
router.get(('/realtimeproducts/admin'), (req, res) => {
  const {password} = req.params

  res.render ('realTimeProducts', {productos: products, admin: true})
})

router.get (('/:code'), async (req, res) => {

  const { code } = req.params
  const product = products.find(producto => producto.code === +code);
  res.render ('displayProduct', {item:product})
})


router.post (('/'), async (req, res) => {
  const { body } = req

  await productManager.addProduct(body)

  res.send("OK")
  
})

router.put (('/:id'), async (req,res) => {
  const {id} = req.params
  const {body} = req
  
  await productManager.modifyProduct(id,body)
  res.send("Ok")
})

router.delete (('/:id'), async (req,res) => {
  const {id} = req.params
  const {body} = req

  await productManager.deleteProduct(id)
  res.send("OK")
})

module.exports = router