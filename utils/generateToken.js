const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET, JWT_PAYLOAD } = require('../config/config.jwt');

const generateToken = (user) => {
  return jsonwebtoken.sign( {user} ,JWT_SECRET, JWT_PAYLOAD )
}

module.exports = {
  generateToken,
}