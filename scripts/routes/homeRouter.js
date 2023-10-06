const { Router } = require('express');
const {isAuth} = require('../../middleware/auth.middleware');
const passport = require('passport')

const homeRouter = Router()

const { log } = require('handlebars');
const { home, resetPassword, logout } = require('../../controllers/home.controller');
const dto = require('../../models/dto/dto');
const { productTest } = require('../../tests/products.test');


homeRouter.get('/', home)





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


homeRouter.get('/logout', isAuth, logout)

homeRouter.get('/signup', (_, res) => {
  res.render('signup')
})

homeRouter.get('/mockingproducts', async  (req, res) => {
  const response = await productTest()
  res.send(JSON.stringify(response))
})

homeRouter.post('/signup', passport.authenticate('local-signup',{
  successRedirect: '/',
  failureRedirect: '/signup'
}))

homeRouter.get('/profile', isAuth , async (req, res) => {
  _user = await dto.setUser(req.session.passport.user)
  res.render('profile', {user: _user})
})

homeRouter.get('/resetPassword', (req, res) => {
  res.render('resetPassword')
})

homeRouter.post('/resetPassword', resetPassword)

module.exports = homeRouter