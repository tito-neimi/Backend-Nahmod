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
  CartManager.newCart()
  res.send("Ok")
})

router.get (('/:cid'), async (req, res) => {

  const { cid } = req.params
  const cart = CartManager.getCartById(cid)
  res.send (cart.cartProducts)
  
})

router.post(('/:cid/product/:pid'), async (req, res) => {
  const {cid, pid} = req.params
  const item = {id: pid, quantity: 1}
  CartManager.addProductToCart(cid, item)
  res.send("Ok")
})

module.exports = router