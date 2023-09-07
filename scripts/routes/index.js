const { Router } = require('express');
const ProducRouter = require('./api/productos.router');
const CartRouter = require('./api/cart.router');
const ChatRouter = require('./api/chat.router')
const {custom: CartRoutes } = require('./api/cart.router')

const router = Router()

//Rutas

router.use('/products', ProducRouter)
router.use('/cart', CartRoutes.getRouter())
router.use('/chat', ChatRouter)

module.exports = router