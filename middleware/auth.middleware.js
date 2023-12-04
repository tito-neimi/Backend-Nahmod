function isAuth (req, res, next) {
  if (req.session.passport.user) {
    next()
    return
  }
  else {
    res.redirect('/login')
  }
}

function isAdmin (req, res, next) {
  if (req.session.user == "admin") {
    next()
    return
  }
  res.redirect('/')
}

module.exports = {isAuth, isAdmin}