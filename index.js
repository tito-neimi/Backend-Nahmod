const cluster = require('cluster')
const os = require('os')

if (cluster.isPrimary) {
  //fork
  for (let i = 0; i < os.cpus().length; i++) {
  cluster.fork()
  }

} else{
  //Worker
  console.log(`Worker con el id ${process.pid}`)
}