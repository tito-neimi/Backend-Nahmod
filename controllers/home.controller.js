const logger = require('../logger');
const dto = require('../models/dto/dto');
const userManager = require('../scripts/repositories/user.repository');
const { generateToken } = require('../utils/generateToken.js');
const {generateUUID} = require('../utils/generateUUID')
const tokenManager = require('../scripts/repositories/token.repository');
const mailSenderService = require('../sevices/mail.sender.service');
const { isValidPassword, hashPassword } = require('../utils/password.utils');

const home = async (req, res) => {
  let _user
  if (req.session.passport)  _user =  await dto.setUser(req.session.passport.user)
  else _user = null

  let token
  if (req.user) {token = generateToken(_user); res.cookie('token', token, {httpOnly: true, maxAge: 60*60*1000*24,});}
  
  res.render('inicio',
  {
    user: _user ?  {
    ..._user,
    isAdmin: _user?.role == 'admin' || _user?.role == 'premium'} : null,
  }
  )
}



const resetPassword = async (req, res) => {
  // try {
    const {email} = req.body

  const user = await userManager.getByEmail(email)

  if(!user) {
    res.render('resetPassword', {error: "User not found"})
    return
  }

    const token = {
      token: generateUUID(),
      email: email
    }
    tokenManager.add(token)
    mailSenderService.send(email, `Change your password in this link http://localhost:8080/changepassword/${token.token}`)
    res.render('resetPassword', {response: 'An email has been sent to your email account'})

  }
// catch (e) {
//     logger.error(e)
//     res.render('resetPassword', {error: "An error has ocurred"})
//   }
// }

const changePasswordView = async (req, res) => {
  const {token} = req.params
  const data = await tokenManager.getByToken(token)
  if (data){
      logger.info('Token valido')
      res.render('changePassword')
    } else{
      logger.warn('token viejo o invalido')
      res.render('passwordError')
    }
  }

  const changePassword = async (req, res) => {
    const {password, password2} = req.body
    const {token} = req.params

    if(password !== password2){
      res.render('changePassword', {error: 'The password do not match'})
      return
    }

    const tokenData = await tokenManager.getByToken(token)
    const user = await userManager.getByEmail(tokenData.email)

    if (!isValidPassword(password, user.password)){
      res.render('changePassword', {error: 'password in use'})
      return
    }

    try {
      logger.info(user.password)
      user.password = hashPassword(password)
      logger.warn(user.password)
      userManager.modifyElement(user._id, user)
      tokenManager.delete(token._id)
      res.render('changePassword', {succes: true})
    } catch (error) {
      res.render('changePassword', {error: 'Unhandled Error'})
    }

  }

const logout =  async (req, res) => {
  const {username, _id} = req.user
  res.clearCookie('token')
  console.log(req.user)
  req.logOut(async (error) => { 
    if (!error) {
      await userManager.modifyProperty(_id, "lastConection", Date.now())
      res.render('logout', {user: username})
    }
  })
}

module.exports = {
  home,
  resetPassword,
  logout,
  changePasswordView,
  changePassword,
}