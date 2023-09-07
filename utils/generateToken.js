const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET, JWT_PAYLOAD } = require('../config/config.jwt');

const generateToken = (user) => {
  const result = jsonwebtoken.sign( {user} ,JWT_SECRET, JWT_PAYLOAD )
  return result
}

const authToken = (token) => {
  try {
    return jsonwebtoken.verify(token, JWT_SECRET, JWT_PAYLOAD)
  } catch (error) {
    return false
  }
}

module.exports = {
  generateToken,
  authToken
}