const {faker} = require('@faker-js/faker')

const getProducts = async () => {
  const product = {
    title: faker.commerce.product(),
    price: faker.commerce.price({min:1, max:500}),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({min:10, max:200}),
    category: faker.commerce.department(),
    thumbnail: faker.image.url()

  }
  return product
}

module.exports = {
  getProducts
}