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
  if (req.user) {token = generateToken({_user}); res.cookie('token', token, {httpOnly: true});}
  
  res.render('inicio',
  {
    user: _user ?  {
    ..._user,
    isAdmin: _user?.role == 'admin',} : null,
  }
  )
})


const login = async (req, res) => {
  const {email, password} = req.body
  //res.cookie('user', username, { maxAge:604800000 })
  try {
    const _user = await userManager.getByEmail(email)
    if (!_user) {
      res.render('login', {error: "user not found"})
      return
    }

    
    if (!password) {
      res.render('login', {error: "password is required"})
      return
    }
    if (!isValidPassword(password, _user.password)){
      res.render('login', {error: "Invalid password"})
      return
    }
    const {password: _password, ...user} = _user

    req.session.user = {
      name: user.username,
      id: user._id,
      ...user
    }
    console.log(req.session.user)
    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.render('login', {error: "An error occurred, please try again later."})
  }
}
const sigunp = async (req, res) => { 
  const user = req.body

  const existing = await userManager.getByUser(user.username)
  
  if (existing){
    res.render('signup', {error: "The user already exist"})
    return
  }

  if (user.password !== user.password2){
    res.render('signup', {error: "Passwords do not match "})
    return
  }

  try {
    const result =  await userManager.addUser({
      ...user,
      password: hashPassword(user.password)
    })
    req.session.user = {
      name: result.username,
      id: result._id,
      ...result._doc
    }
    res.redirect('/')
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}
const logout = (req, res) => {
  // const {user} = req.cookies
  // res.clearCookie('user')
  req.session.destroy((err) => {
    if (err) {
      console.error(err)
    }
  })

  res.render('logout', {user: req.user.name})
  req.user = null
}
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
// homeRouter.post('/login', (req, res, next) => {
//   passport.authenticate('local-login', (error, user, info) => {
//     if (error) {
//       return res.render('login', { error: error });
//     } else {
//       return res.redirect('/');
//     }
//   })(req, res, next);
// });
homeRouter.post('/login', passport.authenticate('local-login', 
{
    successRedirect: '/',
    failureRedirect: '/login'
})
);

// homeRouter.post('/login' , passport.authenticate('local-login', {
//   successRedirect :'/',
//   failureRedirect: '/login',

// }))

//Rutas GitHub

homeRouter.get('/github', passport.authenticate('github'), (_, res) => {})
homeRouter.get('/githubSessions', passport.authenticate('github'), githubLogin)


homeRouter.get('/logout', isAuth, async (req, res) => {
  const {username} = await req.user
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