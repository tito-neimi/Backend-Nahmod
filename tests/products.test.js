const {getProducts} = require('./mockingProducts')



const productTest = async () => {
  
  console.log(`Test 1: devuelve 100 productos`)
  console.log(`Productos:`)

  let productArray = []

  for(let i = 0; i<100; i++){

    const prod = await getProducts()
    productArray.push(prod)
  }
  
  return productArray
}


module.exports = {
  productTest
}