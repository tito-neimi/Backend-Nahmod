const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET, JWT_PAYLOAD } = require('../config/config.jwt');

const options = {
  algorithm: 'HS256',
  expiresIn: '59m',
}

const generateToken = (user) => {
  const result = jsonwebtoken.sign(user ,JWT_SECRET, options)
  return result
}

const authToken =  (token) => {
  try {
    const result = jsonwebtoken.verify(token, JWT_SECRET)
    return(result)
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = {
  generateToken,
  authToken
}