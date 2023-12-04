const ticketModel = require('../../models/ticket.model');
const BaseMananger = require('./base.repository.managers');

class ticketManager extends BaseMananger{
  constructor(){
    super(ticketModel)
  }

  
}

module.exports = new ticketManager()