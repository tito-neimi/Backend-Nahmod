const { Router } = require('express');
const {isAuth, isAdmin, } = require('../../middleware/auth.middleware');

const homeRouter = Router()

const userManager = require('../managers/userManager')


homeRouter.get('/',(req, res) => {
  res.render('inicio', 
  {
    user: req.user ?  {
    ...req.user,
    isAdmin: req.session.user?.role == 'admin',} : null,
  }
  )
})


homeRouter.get('/login', (_, res) => {
  res.render('login')
})
homeRouter.post('/login' ,async (req, res) => {
  const user = req.body
  //res.cookie('user', username, { maxAge:604800000 })
  try {
    const result = await userManager.logIn(user.email, user.password)
    if (!result) {
      res.render('login', {error: "wrong email or password"})
      return
    }
    req.session.user = {
      name: user.username,
      ...result._doc
    }
    console.log(req.session.user)
    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.render('login', {error: "An error occurred, please try again later."})
  }
})

homeRouter.get('/logout', isAuth, (req, res) => {
  // const {user} = req.cookies
  // res.clearCookie('user')
  req.session.destroy((err) => {
    if (err) {
      console.error(err)
    }
  })

  res.render('logout', {user: req.user.name})
  req.user = null
})

homeRouter.get('/signup', (_, res) => {
  res.render('signup')
})
homeRouter.post('/signup', async (req, res) => {
  const user = req.body

  const existing = await userManager.getByUser(user.username)
  
  if (existing){
    res.render('signup', {error: "The user already exist"})
    return
  }
  try {
    const result =  await userManager.addUser(user)
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
})

homeRouter.get('/profile', isAuth, (req, res) => {
  res.render('profile', {user:req.session.user})
})

module.exports = homeRouter