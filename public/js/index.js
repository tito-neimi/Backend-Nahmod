
const socket = io()

const deleteProduct = () => {
  var selectElement = document.getElementById("inputGroupSelect01")
  let id = selectElement.value
  socket.emit('deleteProduct', id)
}

const addProduct = async () => {
  event.preventDefault();
  const form =  document.getElementById('formProduct');
  let datos = Object.fromEntries(new FormData(form))
  datos.owner = user.id
  socket.emit('addProduct', datos )
  form.reset()
}

let user

const reset = () => {
  const formu = document.getElementById('formProduct');
  formu.reset()
}
var contador = 1
const increase = () => {
  contador++
  document.getElementById("counter").innerHTML = contador;
}

const decrease = () => {
  if(contador > 1){
    contador--
    document.getElementById("counter").innerHTML = contador;
  }
}

const addProductToCart = (pid) => {
  if(!user){
    Toastify({
      text: `You have to log in to be able to add products to your cart.`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(to right, #ed213a, #93291e)",
      },
    }).showToast();
    return
  }
  socket.emit('addToCart',user.cartId ,pid, contador)
}

socket.on('addToCartResponse', (response) => {
  if(response.error){
    Toastify({
      text: `${response.error}`,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(to right, #ed213a, #93291e)",
      },
    }).showToast();  } else{
      const button = document.getElementById('addButton')
      button.remove()
      const div = document.getElementById('div-body')
      var nuevoParrafo = document.createElement("h5");
          nuevoParrafo.textContent = "Product added to your cart"
      div.appendChild(nuevoParrafo)
    }
})

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
  var select = document.getElementById("inputGroupSelect01")
  let resultOption = ""
  products.forEach(item => {
    resultOption += `<option value=${item._id}>${item.title}</option>`
  })
  select.innerHTML = resultOption
})

const radioBtn = document.querySelectorAll("input[name='inlineRadioOptions']")
let sort = 1
const limit = 10
const page = 1


socket.on('getUser', (data) => {
  user = data
})

const findSelected = () => {
  let select = document.querySelector("input[name='inlineRadioOptions']:checked")
  sort = select.value
}
const buttonA = document.getElementById("submitFilters")

if (buttonA) {
  buttonA.addEventListener('click', (event) => {
    var query = document.getElementById("filterSelected").value
    event.preventDefault()
    window.location.href = `?limit=${limit}&page=${page}&sort=${sort}&query=${query}`;
  })
}

radioBtn.forEach(radioBtn => {
  radioBtn.addEventListener('change', findSelected)
})

const changeRoleForm = document.getElementById('changeRole')
const changeRole = (id) => {
  const select = document.getElementById('changeRoleSelect')
  console.log(select.value)
  socket.emit('changeRole', {id: id, role: select.value})
  
}
// changeRoleForm.addEventListener('submit', changeRole)