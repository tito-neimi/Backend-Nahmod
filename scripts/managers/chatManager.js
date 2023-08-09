const chatMessageModule = require('../../models/chat.message.model')

class chatMessageManager {
  getAll() {
    return chatMessageModule.find().lean()
  }
  createMessage(msg){
    return chatMessageModule.create(msg)

  }
}

module.exports = new chatMessageManager()