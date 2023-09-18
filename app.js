
const {Command} = require('commander')
const program = new Command()
const path = require('path')

//Para ejecutar el modo developent se inicia asi: npm run start:express -- --env development
program.option('-e, --env <env>','Entorno de desarrollo', 'production')
program.parse()
const {env} = program.opts()

const dotenv = require('dotenv')
dotenv.config({
  path: path.join(__dirname, env == 'development' ? '.env.development' : '.env')
})


const routes = require('./scripts/routes')
const express = require('express')
const http = require('http')
const { Server} = require('socket.io')
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars')
const homeRouter = require('./scripts/routes/homeRouter')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const session = require('express-session')
const MongoStrore = require('connect-mongo')
const passport = require('passport')


const ProductManager = require('./scripts/managers/index')
const productManager = new ProductManager()
const chatMessageManager = require('./scripts/managers/chatManager')
const cartManager = require('./scripts/managers/cartManager')
const CartManager = new cartManager()
const initPassportLocal = require('./config/passport.init')
const userManager = require('./scripts/managers/userManager')



const app = express();
const server = http.createServer(app)
const io = new Server(server)

const config = require('./config/config.js')
const port = config.PORT

app.engine('handlebars', handlebars.engine()) 
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'handlebars')
app.use('/static', express.static(path.join(__dirname,'/public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('contraseña'))

app.use(session({
  secret: 'contraseña',
  resave: true,
  saveUninitialized: true,
  store: MongoStrore.create({
    mongoUrl: config.MONGO_URL,
    ttl: 86400
  })
}))

mongoose.set('strictQuery', true)
mongoose.connect(config.MONGO_URL), (error) => {
  if (error) {
    console.log('coneccion fallida', error)
    process.exit()
  }
  else {
    console.log('base de datos conectada')
  }
}

initPassportLocal()
app.use(passport.initialize())
app.use(passport.session())
let _user
app.use( async (req, res, next) => {
  if (req.session.passport) {
    _user = await userManager.getById(req.session.passport.user)
 }
 else{
  _user = null
 }
  next()


})

//Routes
app.use('/', homeRouter)
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
    socket.broadcast.emit('add-message', message)
  })

  socket.on('addToCart', async (cid, pid, quantity = 1) => {
    await CartManager.addProductToCart(cid, {_id: pid, quantity:quantity})
  })  

  socket.on ('addProduct', async (data) => {
    await productManager.addProduct(data)
    io.emit('dataUpdated', await productManager.getAll())
  })

  socket.emit('getUser', _user)

  

  socket.on('disconnect', () => {
    console.log('usuario desconectado')
  })
})


server.listen(port, () => {
  console.log(`La app se esta ejecutando en el puerto ${port}`)
})


