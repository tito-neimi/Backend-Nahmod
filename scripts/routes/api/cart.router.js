const { Router } = require('express')
const router = Router()
const express = require('express')

const cartManager = require('../../managers/cartManager')
const CartManager = new cartManager()
const ProductManager = require('../../managers/index')
const productManager = new ProductManager()

router.use(express.json())
router.use(express.urlencoded({extended: true}))


router.post (('/'), async (req, res) => {
  await CartManager.newCart() 
  res.send("Ok")
})

router.get(("/"), async (req, res) => {
  res.send( await CartManager.getAll())
})
router.get (('/:cid'), async (req, res) => {

  const { cid } = req.params
  const cart = await CartManager.getCartById(cid)
  res.render ('singleCart', {cart: cart})
})

router.post(('/:cid/product/:pid'), async (req, res) => {
  const {cid, pid} = req.params
  const item = {id: pid, quantity: 1}
  CartManager.addProductToCart(cid, item)
  res.send("Ok")
})

router.delete(('/:cid/product/:pid'), async (req, res) => {
  const {cid, pid} = req.params
  const result = await CartManager.deleteProductFromCart(cid, pid)
  res.send(result)
})

router.delete(('/:cid'), async (req, res) => {
  const {cid} = req.params
  const result = await CartManager.deleteProductFromCart(cid)
  res.send(result)
})

router.put(('/:cid'), async (req, res) => {
  const {cid} = req.params
  const { body } = req
  const result = await CartManager.updateProductFromCart(cid, body)
  res.send(result)
})

router.put(('/:cid/products/:pid'), async (req, res) => {
  const {cid, pid} = req.params
  const { body } = req
  const result = await CartManager.updateQuantity(cid,pid,body)
  res.send(result)
})

module.exports = router