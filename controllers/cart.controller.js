
const factoryManager = require('../scripts/repositories/factory.manager')
const CartManager = factoryManager.getManagerInstance('cart')
const cartPopulate = require('../scripts/cart.populate.js')
const productManager = require('../scripts/repositories/product.repository')
const CartModel = require('../models/cart.model')
const ticketRepository = require('../scripts/repositories/ticket.repository')
const ProductManager = new productManager()
const dto = require('../models/dto/dto')
const mailSenderService = require('../sevices/mail.sender.service')
const { generateUUID } = require('../utils/generateUUID')
const customError = require('../errors/custom.error')
const errorType = require('../errors/errorTypes')

const setCart = async (req, res, next, cartId) => {
  try {
    const cart = await CartManager.getCartById(cartId)

    if (!cart){
      customError.createError({
        name: "Product not found",
        cause: "ID not found",
        msg: errorMesage.notFound(cartId),
        code: errorType.INVALID_TYPES
      })
      return res.status(404).send({
        succes: false,
        error: 'Cart not found'
      })}
      req.cart = cart
  } catch (error) {
    res.status(500).send({
      succes: false,
      error: error.stack
    })
  }
}

const getAllCarts =  async (req, res) => {
  try {
    console.log("ejecutando callback")
    const carts =  await CartManager.getAllCarts()
    res.send(carts)
  } catch (error) {
    res.status(500).send({
      error: error.stack
    })
  }
}

const getCartById = async (req, res) => {
  try {
    console.log("buscando cart")
    const { cid } = req.params
  const cart = await cartPopulate(cid)
  const totalPrice = getTotalPrice(cart)
  res.render ('singleCart', {cart: cart, totalPrice: totalPrice })
  } catch (error) {
    customError.createError({
      name: "Product not found",
      cause: "ID not found",
      msg: errorMesage.notFound(cid),
      code: errorType.INVALID_TYPES
    })
    res.status(404).send("Error 404 Cart Not found")
  }
}

const purchase = async (req, res) => {
  try {
    const {cid} = req.params
    const cart = await cartPopulate(cid)
    const newCart = []
    const purchaseCart = []
    let amount = 0
    if (!cart) {
      customError.createError({
        name: "Product not found",
        cause: "ID not found",
        msg: errorMesage.notFound(cid),
        code: errorType.INVALID_TYPES
      })
      res.status(404).send({
        error: "cart not found"
      })
    }
    for (const product of cart.products) {
      if (product._id.stock >= product.quantity){
        const newStock = product._id.stock - product.quantity
        amount += product.quantity * product._id.price
        ProductManager.modifyElement(product._id, {stock: newStock}, {nes:true}, (err, doc) => {
          if (err) console.log(err)
          else console.log(doc)
      })
      const obj = {_id: product._id._id, quantity: product.quantity, price: product._id.price, title: product._id.title}
      purchaseCart.push(obj)
    }
    else {
      const obj = {_id: product._id._id, quantity: product.quantity}
      newCart.push(obj) //Guardo un nuevo carrito para los productos que se quedaron si stock
      console.log("not purchased:" ,newCart)
    }
  }
  
  const result = await CartModel.findOneAndUpdate({_id:cid}, {$set: {products: newCart}}, {new: true})

  if (purchaseCart.length !== 0) { //Compruebo que se haya comprado almenos un producto
    const user = await dto.setUser(req.session.passport.user) 
    const code = generateUUID()
    ticketRepository.add({email: user.email, purchaseCart, amount, code})
    mailSenderService.send(user.email, JSON.stringify(purchaseCart))
  }
  console.log("resultado", result)
  } catch (error) {
    console.error("error ", error)
  }
  res.send("ok")
}


const modifyCartQuantity = async (req, res) => {
  const {cid, pid} = req.params
  const { body } = req
  const result = await CartManager.updateQuantity(cid,pid,body)
  res.send(result)
}

const deleteCartProduct = async (req, res) => {
  const {cid, pid} = req.params
  const result = await CartManager.deleteProductFromCart(cid, pid)
  res.send(result)
}

const modifyCart =  async (req, res) => {
  const { cid } = req.params
  const { body } = req
  const result = await CartManager.updateProductFromCart(cid, body)
  res.send(result)
}

const addProductToCart = async (req, res) => {
  const {cid, pid} = req.params
  const item = {id: pid, quantity: 1}
  CartManager.addProductToCart(cid, item)
  res.send("Ok")
}

const getTotalPrice = (cart) => {
  let totalPrice = 0
  for (const product of cart.products) {
    const subtotal = product._id.price * product.quantity;
    totalPrice += subtotal;
}
  return totalPrice
}


module.exports = {
  setCart,
  getAllCarts,
  getCartById,
  modifyCartQuantity,
  deleteCartProduct,
  modifyCart,
  addProductToCart,
  purchase
}