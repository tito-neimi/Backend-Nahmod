const tokenModel = require('../../models/token.model');
const BaseMananger = require('./base.repository.managers');

class tokenManager extends BaseMananger{
  constructor(){
    super(tokenModel)
  }
  async getByToken(token){
    return await this.model.findOne({token : token}).lean()
  }
}

module.exports = new tokenManager()