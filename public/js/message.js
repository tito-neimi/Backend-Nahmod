const chatContainer = document.getElementById("messages-Container")
const inputMessage = document.getElementById('messagesInput')
const button = document.getElementById('button-addon2')

chatContainer.innerHTML = ("")

const  appendMessage = async (userName,msg,date) => {
  const div = document.createElement('div')
  div.classList = "m-5"
  div.innerHTML =`<span class"d-flex flex-column gap-2"><h5>${userName}</h5><p>${msg}</p><p class"fst-italic ">${date}</p></span>`
  chatContainer.appendChild(div)

  await setTimeout(() => {
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
  }, 250);
}

let user = null
let currentMessages = []

socket.on('chat-messages', (messagesList) => {
  currentMessages = messagesList
})


const setUser = async () => {
  await Swal.fire({
    title: 'Enter your Name',
    input: 'text',
    inputLabel: 'YourName',
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write your name!'
      }
      user = value
    }
  })
  
  displayMessages()
    socket.on('add-message', (msg) => {
      console.log("ejecutando mensaje")
      appendMessage(msg.userName, msg.message, msg.createdDate)
    })
}
    button.addEventListener('click', () => {
      const inputValue = inputMessage.value
      console.log(inputValue)
      if (!inputValue){
        return
      }

      const fecha = new Date()

      const message = {userName: user, message: inputValue, createdDate: fecha}
      socket.emit('chat-message', message)
      
      inputMessage.value = ""
      appendMessage(user,inputValue,fecha.toLocaleTimeString('en-US'))
    })
    

const displayMessages = () => {
  for (const {userName, message, createdDate} of currentMessages) {
    appendMessage(userName, message, createdDate)
  }
}

setUser()