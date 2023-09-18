function isAuth (req, res, next) {
  if (req.user) {
    next()
    return
  }
  res.redirect('/login')
}

function isAdmin (req, res, next) {
  console.log(req.session.user.role)
  if (req.session.user == "admin") {
    next()
    return
  }
  res.redirect('/')
}

module.exports = {isAuth, isAdmin}