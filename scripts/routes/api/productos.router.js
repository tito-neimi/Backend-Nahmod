const { Router } = require('express')
const router = Router()
const express = require('express')

const ProductManager = require('../../managers/index')
const productManager = new ProductManager()
const { isAdmin, isAuth } = require('../../../middleware/auth.middleware')
const { getAll, getById, createProduct, modifyProduct, deleteProduct, realTimeProduct } = require('../../../controllers/products.controller')


router.use(express.json())
router.use(express.urlencoded({extended: true}))

let products = [] 

const start = async () => {
  products = await productManager.getAll()
}
start();

router.get ('/', getAll )
router.get ('/:id', getById)
router.post ('/', createProduct)
router.put ('/:pid', modifyProduct)
router.delete ('/:pid', deleteProduct)
router.get('/realTimeProducts', isAuth ,isAdmin, realTimeProduct)

module.exports = router