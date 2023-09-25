const { Router } = require('express')
const router = Router()
const express = require('express')

const CustomRouter = require('../custom.router.api')
const { setCart, getAllCarts, getCartById, modifyCartQuantity, deleteCartProduct, modifyCart, addProductToCart } = require('../../../controllers/cart.controller')

router.use(express.json())
router.use(express.urlencoded({extended: true}))

class CartRouter extends CustomRouter {
  init () {
    this.router.param('cartId', setCart)

    this.get('/', ["admin"], getAllCarts)

    this.get('/:cartId/products', ['customer', 'admin'], getCartById)

    //To do: poner verificaciones para el producto y el carrito
    this.put('/:cartId/products/productId', ['customer', 'admin'], modifyCartQuantity)
      //to do: poner verificaciones tanto en el cid como en el pid
    this.delete('/:cid/product/:pid', ['customer', 'admin'], deleteCartProduct)

    this.put('/:cid', ['admin'], modifyCart)

    this.post('/:cid/product/:pid',['admin'], addProductToCart)

  }

}



module.exports = {
  custom: new CartRouter()
}