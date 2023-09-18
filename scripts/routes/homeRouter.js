const { Router } = require('express');
const {isAuth, isAdmin, } = require('../../middleware/auth.middleware');
const {hashPassword, isValidPassword} = require('../../utils/password.utils')
const passport = require('passport')

const homeRouter = Router()

const userManager = require('../managers/userManager');
const { log } = require('handlebars');
const { generateToken } = require('../../utils/generateToken');


homeRouter.get('/', async (req, res) => {
  const _user =  await req.user
  let token
  if (req.user) {token = generateToken(_user); res.cookie('token', token, {httpOnly: true, maxAge: 60*60*1000*24, signed: true});}
  
  res.render('inicio',
  {
    user: _user ?  {
    ..._user,
    isAdmin: _user?.role == 'admin',} : null,
  }
  )
})



const resetPassword = async (req, res) => {
  const {email, password, password2} = req.body

  
  const user = await userManager.getByEmail(email)
  console.log(user)

  if(!user) {
    res.render('resetPassword', {error: "User not found"})
    return
  }

  if(password !== password2) {
    res.render('resetPassword', {error: "Passwords do not match"})
    return
  }

  try {
    userManager.updateUser({
      ...user,
      password: hashPassword(password)
    })
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.render('resetPassword', {error: "An erros has ocurred"})
  }
}

const githubLogin = async (req, res) => {
  const user = req.user
  req.session.user = {
    id: user.id,
    name: user.firstName,
    role: user.role,
    email: user.email
  }
  res.redirect("/")
}

homeRouter.get('/login', (_, res) => {
  res.render('login')
})

homeRouter.post('/login', passport.authenticate('local-login', 
{
    successRedirect: '/',
    failureRedirect: '/login'
})
);


//Rutas GitHub

homeRouter.get('/github', passport.authenticate('github'), (_, res) => {})
homeRouter.get('/githubSessions', passport.authenticate('github'), githubLogin)


homeRouter.get('/logout', isAuth, async (req, res) => {
  const {username} = req.user
  res.clearCookie('token')
  req.logOut((error) => { 
    if (!error) {
      res.render('logout', {user: username})
    }
  })
})

homeRouter.get('/signup', (_, res) => {
  res.render('signup')
})
homeRouter.post('/signup', passport.authenticate('local-signup',{
  successRedirect: '/',
  failureRedirect: '/signup'
}))

homeRouter.get('/profile', isAuth, async (req, res) => {
  res.render('profile', {user: await req.user})
})

homeRouter.get('/resetPassword', (req, res) => {
  res.render('resetPassword')
})

homeRouter.post('/resetPassword', resetPassword)

module.exports = homeRouter