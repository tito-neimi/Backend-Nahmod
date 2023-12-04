const local = require('passport-local')
const factoryManager = require('../scripts/repositories/factory.manager')
const userManager = factoryManager.getManagerInstance('user')
const {hashPassword, isValidPassword} = require('../utils/password.utils')
const Dto = require('../models/dto/dto.js')
const logger = require('../logger')

const LocalStrategy = local.Strategy

const signup = async (req, email, password, done) => {
  const {password: _password, password2: _password2, ...user } = req.body

  const _user = await userManager.getByEmail(email)

  if(_user) {
    console.log("el usuario ya existe")
    return done(null, false)
  }
  try {
    const newUser = await userManager.addUser({
      ...user,
      password: hashPassword(password),
    })
    console.log(newUser)
    return done(null, newUser)
  } catch (error) {
    logger.error(error)
    done(error, false)
  }
  
}

const login = async (email, password, done) => {
  try {
    const user = await userManager.getByEmail(email)
    if (!user) {
      return done("Usuario no encontrado", false)
    }
    if (!password){
      return done("Contraseña no ingresada", false)
    }
    if(!isValidPassword(password, user.password )) {
      return done("Contraseña incorrecta", false)
    }
    await userManager.modifyProperty(user._id, "lastConection", Date.now())
    return done(null, user)

  } catch (error) {
    return (error, false)
  }
}


module.exports = {signup, login, LocalStrategy}