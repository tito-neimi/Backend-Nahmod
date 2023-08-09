const routes = require('./scripts/routes')
const express = require('express')
const http = require('http')
const { Server} = require('socket.io')
const path = require('path')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')

const ProductManager = require('./scripts/managers/index')
const productManager = new ProductManager()
const chatMessageManager = require('./scripts/managers/chatManager')

const port = 8080;

const app = express();
const server = http.createServer(app)
const io = new Server(server)


app.engine('handlebars', handlebars.engine()) 
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'handlebars')
app.use('/static', express.static(path.join(__dirname,'/public')))

mongoose.set('strictQuery', true)
mongoose.connect("mongodb+srv://app:shJC72qyXeSLyNf3@cluster0.bf73bfz.mongodb.net/ecommerce?retryWrites=true&w=majority"), (error) => {
  if (error) {
    console.log('coneccion fallida', error)
    process.exit()
  }
  else {
    console.log('base de datos conectada')
  }
}

//Routes
app.get('/', (req, res) => {
  res.render('inicio')
})
app.use('/api', routes)

io.on('connection', async (socket) => {
  console.log(`Se ha conectado el usuario ${socket.id}`)
  productManager.getAll()

  const messages = await chatMessageManager.getAll()
  
  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id)
    io.emit('dataUpdated', await productManager.getAll())
  })

  socket.emit('chat-messages', messages)

  socket.on('chat-message', (message) => {
    messages.push(message)
    chatMessageManager.createMessage(message)
    console.log("add", messages)
    socket.broadcast.emit('add-message', message)
  })

  socket.on ('addProduct', async (data) => {
    await productManager.addProduct(data)
    io.emit('dataUpdated', await productManager.getAll())
  })

  socket.on('disconnect', () => {
    console.log('usuario desconectado')
  })
})


server.listen(port, () => {
  console.log(`La app se esta ejecutando en el puerto ${port}`)
})


