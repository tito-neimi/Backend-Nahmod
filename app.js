const routes = require('./scripts/routes')
const express = require('express')
const http = require('http')
const { Server} = require('socket.io')
const path = require('path')
const fs = require('fs')
const handlebars = require('express-handlebars')

const ProductManager = require('./scripts/managers/index')
const productManager = new ProductManager()

const port = 8080;

const app = express();
const server = http.createServer(app)
const io = new Server(server)

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'handlebars')
app.use('/static', express.static(path.join(__dirname,'/public')))




//Routes
app.get('/', (req, res) => {
  res.render('inicio')
})
app.use('/api', routes)

io.on('connection', (socket) => {
  console.log(`Se ha conectado el usuario ${socket.id}`)
  productManager.setProductos()
  
  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id)
    io.emit('dataUpdated', productManager.productos)
  })

  socket.on ('addProduct', async (data) => {
    await productManager.addProduct(data)
    io.emit('dataUpdated', productManager.productos)
  })

  socket.on('disconnect', () => {
    console.log('usuario desconectado')
  })
})


server.listen(port, () => {
  console.log(`La app se esta ejecutando en el puerto ${port}`)
})


