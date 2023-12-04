
const {Command} = require('commander')
const program = new Command()
const path = require('path')

//Para ejecutar el modo developent se inicia asi: npm run start -- --env development
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
// const mongoose = require('mongoose')
const mongoDbservice = require('./sevices/mongo.db.js')



const bodyParser = require('body-parser');
const session = require('express-session')
const MongoStrore = require('connect-mongo')
const passport = require('passport')


const ProductManager = require('./scripts/repositories/product.repository')
const productManager = new ProductManager()
const chatMessageManager = require('./scripts/repositories/chat.repository')
const cartManager = require('./scripts/repositories/cart.repository')
const CartManager = new cartManager()
const userManager = require('./scripts/repositories/user.repository.js')
const initPassportLocal = require('./config/passport.init')
const dto = require('./models/dto/dto.js')
const handleError = require('./middleware/errors/index.js')

const app = express();
const server = http.createServer(app)
const io = new Server(server)

const config = require('./config/config.js')
const port = config.PORT

const logger = require('./logger/index.js')
const loggerMiddleware = require('./middleware/logger.middleware.js')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')

app.engine('handlebars', handlebars.engine()) 
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'handlebars')
app.use(loggerMiddleware)
app.use('/static', express.static(path.join(__dirname,'/public')))
app.use(cookieParser('contraseña'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

  // const mongoService = mongoDbservice.getInstance()
  // const connection = mongoService.connection

app.use(session({
  secret: 'contraseña',
  resave: true,
  saveUninitialized: true,
  store: MongoStrore.create({
    mongoUrl: config.MONGO_URL,
    ttl: 86400
  })
}))


initPassportLocal()
app.use(passport.initialize())
app.use(passport.session())


let _user
app.use( async (req, res, next) => {
  if (req.session.passport) {
    _user = await dto.setUser(req.session.passport.user)
  }
  else{
    _user = null
  }
  
  next()
  
  
})

//Routes
app.use('/', homeRouter)
app.use('/api', routes)

const specs = swaggerJsDoc({
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Plis U ecommerce',
      description: 'An ecommerce for the clothing brand plis U'
    }
  },
  apis: [`${__dirname}/docs/*.yaml`]
})

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(handleError)

io.on('connection', async (socket) => {
  logger.info(`Se ha conectado el usuario ${socket.id}`)
  productManager.getAll()
  
  const messages = await chatMessageManager.getAll()
  
  
  socket.on('deleteProduct', async (id) => {
    await productManager.delete(id)
    io.emit('dataUpdated', await productManager.getByOwner((_user.role !== 'admin') ? _user.id : 'admin'))
  })

  socket.emit('chat-messages', messages)

  socket.on('chat-message', (message) => {
    messages.push(message)
    chatMessageManager.createMessage(message)
    socket.broadcast.emit('add-message', message)
  })

  socket.on('addToCart', async (cid, pid, quantity = 1) => {
    console.log(`cid: ${cid}, pid: ${pid}, quantity: ${quantity}`)
    const response = await CartManager.addProductToCart(cid, {_id: pid, quantity:quantity}, _user)
    if (!response){
      socket.emit('addToCartResponse', {error: "You cannot add your own products to the cart"})
    }else{
      socket.emit('addToCartResponse', {message: "Product added to cart successfully"})
    }
  })  

  socket.on ('addProduct', async (data) => {
    await productManager.add(data)
    const newData = await productManager.getByOwner((_user.role !== 'admin') ? _user.id : 'admin')
    io.emit('dataUpdated', newData )
  })

  socket.emit('getUser', _user)

  socket.on('changeRole', async ({id, role}) => {
    userManager.modifyProperty(id,'role',role)
  })

  socket.on('disconnect', () => {
    logger.info('usuario desconectado')
  })
})


server.listen(port, () => {
  logger.info(`La app se esta ejecutando en el puerto ${port}`)
})


