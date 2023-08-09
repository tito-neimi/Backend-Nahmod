const { Schema, model } = require('mongoose')

const schema  = new Schema({
  userName: String,
  message: String,
  createdDate: {type:String, default: Date.now()}
})


const ChatMessagesModel = model('messages', schema)

module.exports = ChatMessagesModel