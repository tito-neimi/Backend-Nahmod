const { Router } = require('express')
const router = Router()
const express = require('express')

const cartManager = require('../../managers/cartManager')
const CartManager = new cartManager()
const ProductManager = require('../../managers/index')
const productManager = new ProductManager()
const cartPopulate = require('../../cart.populate')

router.use(express.json())
router.use(express.urlencoded({extended: true}))


const getTotalPrice = (cart) => {
  let totalPrice = 0
  for (const product of cart.products) {
    const subtotal = product._id.price * product.quantity;
    totalPrice += subtotal;
}
  return totalPrice
}

router.post (('/'), async (req, res) => {
  const { body } = req
  console.log(body)
  await CartManager.newCart(body) 
  res.send("Ok")
})

router.get(("/"), async (req, res) => {
  res.send( await CartManager.getAll())
})
router.get (('/:cid'), async (req, res) => {

  try {
    const { cid } = req.params
  const cart = await cartPopulate(cid)
  const totalPrice = getTotalPrice(cart)
  res.render ('singleCart', {cart: cart, totalPrice: totalPrice })
  } catch (error) {
    res.status(404).send("Error 404 Cart Not found")
  }
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
  const { cid } = req.params
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