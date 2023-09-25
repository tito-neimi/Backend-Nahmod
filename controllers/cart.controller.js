
const factoryManager = require('../scripts/repositories/factory.manager')
const CartManager = factoryManager.getManagerInstance('cart')
const cartPopulate = require('../scripts/cart.populate.js')


const setCart = async (req, res, next, cartId) => {
  try {
    const cart = await CartManager.getCartById(cartId)

    if (!cart){
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
    res.status(404).send("Error 404 Cart Not found")
  }
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
  addProductToCart
}