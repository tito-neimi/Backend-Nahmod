const passport = require('passport')
const local = require('passport-local')

const userManager = require('../scripts/managers/userManager')
const {hashPassword, isValidPassword} = require('../utils/password.utils')
const { estimatedDocumentCount } = require('../models/user.model')


const LocalStrategy = local.Strategy

const signup = async (req, email, password, done) => {
  const {email: _email, password: _password, password2: _password2, ...user } = req.body

  const _user = await userManager.getByEmail(email)

  if(_user) {
    console.log("el usuario ya existe")
    return done(null, false)
  }
  try {
    const newUser = await userManager.addUser({
      ...user,
      password: hashPassword(password)
    })
    console.log(newUser)
    return done(null, {
      name: newUser.username,
      id: newUser._id,
      ...newUser
    })
  } catch (error) {
    console.log(error)
    done(error, false)
  }
  
}

const login = async (email, password, done) => {
  // const {email: , password} = req.body
  try {
    const _user = await userManager.getByEmail(email)
    if (!_user) {
      console.log("el usuario no existe")
      return done(null, false)
    }

    
    if (!password) {
      console.log("contraseña no ingresada")
      return done(null, false)
    }
    if (!isValidPassword(password, _user.password)){
      console.log("contraseña incorrecta")
      return done(null, false)
    }
    const {password: _password, ...user} = _user

    done(null, {
      name: user.username,
      id: user._id,
      ...user
    } ) 
  } catch (error) {
    console.log(error)
    done(e, false)
  }
}
const init = () => {
  passport.use('local-signup', new LocalStrategy({usernameField: 'email', passReqToCallback: true},signup))
  passport.use('local-login', new LocalStrategy({usernameField: 'email'}, login))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    const user = userManager.getById(id)
    done(null, user)
  })
}

module.exports = init