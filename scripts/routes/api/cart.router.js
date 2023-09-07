const { Router } = require('express')
const router = Router()
const express = require('express')

const cartManager = require('../../managers/cartManager')
const CartManager = new cartManager()
const ProductManager = require('../../managers/index')
const productManager = new ProductManager()
const cartPopulate = require('../../cart.populate')

const {jwtVerifyToken} = require('../../../middleware/jwt.auth')
const CustomRouter = require('../custom.router')

router.use(express.json())
router.use(express.urlencoded({extended: true}))



class CartRouter extends CustomRouter {
  init () {
    this.router.param('cartId', async (req, res, next, cartId) => {
      try {
        const cart = await CartManager.getCartById(cartId)

        if (!cart){
          return res.status(404).send({
            succes: false,
            error: 'Cart not found'
          })
          
          req.cart = cart

        }
      } catch (error) {
        res.status(500).send({
          succes: false,
          error: error.stack
        })
      }
    })

    this.get('/', ["admin"], async (req, res) => {
      try {
        const carts =  await CartManager.getAll()
        res.send(carts)
      } catch (error) {
        res.status(500).send({
          error: error.stack
        })
      }
    })

    this.get('/:cartId/products', ['customer', 'admin'], async (req, res) => {
      try {
        const { cid } = req.params
      const cart = await cartPopulate(cid)
      const totalPrice = getTotalPrice(cart)
      res.render ('singleCart', {cart: cart, totalPrice: totalPrice })
      } catch (error) {
        res.status(404).send("Error 404 Cart Not found")
      }
    })

    //To do: poner verificaciones para el producto y el carrito
    this.put('/:cartId/products/productId', ['customer', 'admin'], async (req, res) => {
        const {cid, pid} = req.params
        const { body } = req
        const result = await CartManager.updateQuantity(cid,pid,body)
        res.send(result)
      })
      //to do: poner verificaciones tanto en el cid como en el pid
      this.delete('/:cid/product/:pid', ['customer', 'admin'], async (req, res) => {
        const {cid, pid} = req.params
        const result = await CartManager.deleteProductFromCart(cid, pid)
        res.send(result)
      })

      this.put(('/:cid'), ['admin'], async (req, res) => {
        const { cid } = req.params
        const { body } = req
        const result = await CartManager.updateProductFromCart(cid, body)
        res.send(result)
      })

      this.post(('/:cid/product/:pid'),['admin'], async (req, res) => {
        const {cid, pid} = req.params
        const item = {id: pid, quantity: 1}
        CartManager.addProductToCart(cid, item)
        res.send("Ok")
      })
      

  }

}


const getTotalPrice = (cart) => {
  let totalPrice = 0
  for (const product of cart.products) {
    const subtotal = product._id.price * product.quantity;
    totalPrice += subtotal;
}
  return totalPrice
}

// router.post (('/'), async (req, res) => {
//   const { body } = req
//   console.log(body)
//   await CartManager.newCart(body) 
//   res.send("Ok")
// })

// router.get(("/"), async (req, res) => {
//   res.send( await CartManager.getAll())
// })
// router.get (('/:cid'), async (req, res) => {

//   try {
//     const { cid } = req.params
//   const cart = await cartPopulate(cid)
//   const totalPrice = getTotalPrice(cart)
//   res.render ('singleCart', {cart: cart, totalPrice: totalPrice })
//   } catch (error) {
//     res.status(404).send("Error 404 Cart Not found")
//   }
// })


// router.delete(('/:cid/product/:pid'), jwtVerifyToken,async (req, res) => {
//   const {cid, pid} = req.params
//   const result = await CartManager.deleteProductFromCart(cid, pid)
//   res.send(result)
// })

// router.delete(('/:cid'),jwtVerifyToken, async (req, res) => {
//   const {cid} = req.params
//   const result = await CartManager.deleteProductFromCart(cid)
//   res.send(result)
// })





module.exports = {
  custom: new CartRouter()
}