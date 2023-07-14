const ProductManager = require('./index.js')
const productManager = new ProductManager()
const routes = require('./routes')
const express = require('express')

const port = 8080;
const app = express();

app.get('/', (req, res) => {
  res.send(
    `
    <html lang="es">
      <head>
        <title>Ecommerce</title>
      </head>
      <body>
        <header>
          <h2>Bienvenido a Plis U</h2>
        </header>
        <main>
          <h3>Para navegar en la pagina agregue /productos al link, si quiere ir a un producto en especifico agregue un / con el code del producto al que desea ver </h3>
        </main>
        <footer>   
        </footer>
        <script src="./scripts/index.js"></script>
      </body>
    </html>
    `
  )
})

app.use('/api', routes)

app.listen(port, () => {
  console.log(`La app se esta ejecutando en el puerto ${port}`)
})


