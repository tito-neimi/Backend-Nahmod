const userManager = require('../scripts/repositories/user.repository');
const { generateToken } = require('../utils/generateToken.js');


const home = async (req, res) => {
  const _user =  await req.user
  console.log(_user)
  let token
  if (req.user) {token = generateToken(_user); res.cookie('token', token, {httpOnly: true, maxAge: 60*60*1000*24, signed: true});}
  
  res.render('inicio',
  {
    user: _user ?  {
    ..._user,
    isAdmin: _user?.role == 'admin',} : null,
  }
  )
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
    userManager.modifyElement({
      ...user,
      password: hashPassword(password)
    })
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.render('resetPassword', {error: "An erros has ocurred"})
  }
}

const logout =  async (req, res) => {
  const {username} = req.user
  res.clearCookie('token')
  req.logOut((error) => { 
    if (!error) {
      res.render('logout', {user: username})
    }
  })
}

module.exports = {
  home,
  resetPassword,
  logout,
}