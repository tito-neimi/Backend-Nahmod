const { Schema, model } = require('mongoose')
const schema  = new Schema({
  code: String,
  purchase_dateTime: {type:String, default: Date.now()},
  amount: Number,
  email: String,
  purchaseCart: {type: 
    [
      {
        _id: {type: Schema.Types.ObjectId, ref: 'products'}, 
        quantity: {type: Number, default: 1}
      }
    ]
  }
  
})

const TicketModel = model('tickets', schema)

module.exports = TicketModel