const { Router } = require('express');
const SessionsRouter = require('./api/sessions.router');
const usersRouter = require('./api/users.router.js')
const {custom: CartRoutes } = require('./api/cart.router')
const {custom: ChatRoutes } = require('./api/chat.router')
const {custom: productRoutes } = require('./api/productos.router.js')

const router = Router()

//Rutas

router.use('/products', productRoutes.getRouter())
router.use('/cart', CartRoutes.getRouter())
router.use('/chat', ChatRoutes.getRouter())
router.use('/users', usersRouter)
router.use('/sessions', SessionsRouter)

module.exports = router