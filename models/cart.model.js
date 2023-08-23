const { Schema, model } = require('mongoose')

const schema  = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'users'},
  products: {type: 
    [
      {
        _id: {type: Schema.Types.ObjectId, ref: 'products'}, 
        quantity: {type: Number, default: 1}
      }
    ]
  , default:[]}
})

schema.pre("findOne", function() {
  this.populate("_id", ["title", "price"])
})

const CartModel = model('carts', schema)

module.exports = CartModel