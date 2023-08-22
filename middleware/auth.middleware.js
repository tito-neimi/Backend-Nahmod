function isAuth (req, res, next) {
  if (req.user) {
    next()
    return
  }
  res.redirect('/login')
}

function isAdmin (req, res, next) {
  console.log(req.user)
  if (req.user.role == "admin") {
    next()
    return
  }
  res.redirect('/')
}

module.exports = {isAuth, isAdmin}