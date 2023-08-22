const { Socket } = require("socket.io")

const chatContainer = document.getElementById("messages-Container")
const inputMessage = document.getElementById('messagesInput')
const button = document.getElementById('button-addon2')


if (chatContainer) {
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
  let user 
  let currentMessages = []
  
  socket.on('chat-messages', (messagesList) => {
    currentMessages = messagesList
    displayMessages(currentMessages)
  })
  
    socket.on('add-message', (msg) => {
      console.log("ejecutando mensaje")
      appendMessage(msg.userName, msg.message, msg.createdDate)
    })
    button.addEventListener('click', () => {
      if (user) {
        const inputValue = inputMessage.value
        if (!inputValue){
          return
        }
  
        const fecha = new Date()
  
        const message = {userName: user, message: inputValue, createdDate: fecha}
        socket.emit('chat-message', message)
        
        inputMessage.value = ""
        appendMessage(user,inputValue,fecha.toLocaleTimeString('en-US'))
      }
    })
  
  const setUser = async () => {
    socket.emit('getUser', )
  }
  
  const displayMessages = (currentMessages) => {
    for (const {userName, message, createdDate} of currentMessages) {
      appendMessage(userName, message, createdDate)
    }
  }
  const parseCookies = () => {
    const cookies = document.cookie.split(';')
    const obj = cookies.reduce((obj, cookie) => {
      const keyValue = cookie.split('=')
      return {...obj, [keyValue[0].trim()]: keyValue[1]}
    }, {})
    return obj
  }
  const cookies = parseCookies()
  
  setUser()
}
  
