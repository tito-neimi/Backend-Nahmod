

console.log('ola')
const socket = io()

const deleteProduct = () => {
  var selectElement = document.getElementById("inputGroupSelect01")
  let id = selectElement.value
  socket.emit('deleteProduct', id)
}

const addProduct = () => {
  event.preventDefault();
  const form = document.getElementById('formProduct');
  const datos = Object.fromEntries(new FormData(form))
  socket.emit('addProduct', datos )
}












socket.on('dataUpdated', (products) => {
  console.log(products)
  var result = ""
  let container = document.getElementById("products")
  products.forEach(item => {
     result += `<div class="card m-2" style="width: 18rem;">
     <img src= ${item.thumbnail} class="card-img-top" alt=${item.title}>
       <div class="card-body">
         <h4 class="card-title">${item.title}</h4>
         <h5 class="card-text">$${item.price}</h5>
         <p class="card-text">${item.description}</p>
      </div>
     </div>`
  });
  container.innerHTML = result

})