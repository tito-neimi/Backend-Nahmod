const { Router } = require('express')
const router = Router()
const express = require('express')

const ProductManager = require('../../index')
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
    res.send(filter)
  }
  else {
    res.send (products)
  }
})

router.get (('/:code'), async (req, res) => {

  const { code } = req.params
  const product = products.find(producto => producto.code === +code);
  res.send (product)
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