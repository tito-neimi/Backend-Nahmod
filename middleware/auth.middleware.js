function isAuth (req, res, next) {
  if (req.session.pasport) {
    next()
    return
  }
  res.redirect('/login')
}

function isAdmin (req, res, next) {
  if (req.session.user == "admin") {
    next()
    return
  }
  res.redirect('/')
}

module.exports = {isAuth, isAdmin}