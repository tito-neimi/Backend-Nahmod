const {Command} = require('commander')
const { errorMonitor } = require('connect-mongo')
const {getAll} = require('./controllers/products.controller')
const program = new Command()

let products = [] 

program.option('-p <port>' , 'Puerto', 8080)
        .option('--mode <mode>', 'Mode de ejecucion', 'production')
        .requiredOption('-u', 'Usuario del proceso', null)

program.parse()

console.log(program.opts())
console.log(program.args)

process.on('exit', () => {
        console.log("proceso terminado")
})

process.on('uncaughtException', (err) => {
        console.log('ocurrio una exepcion: ', err)
})
