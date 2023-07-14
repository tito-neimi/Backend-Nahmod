const { Router } = require('express');
const ProducRouter = require('./api/productos.router');
const CartRouter = require('./api/cart.router');

const router = Router()

//Rutas

router.use('/products', ProducRouter)
router.use('/cart', CartRouter)

module.exports = router