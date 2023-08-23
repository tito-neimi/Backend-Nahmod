const bcrypt = require('bcrypt')

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

const isValidPassword = (psw1, psw2) => {
  console.log(psw1, psw2)
  return bcrypt.compareSync(psw1, psw2)
}

module.exports = {hashPassword, isValidPassword}