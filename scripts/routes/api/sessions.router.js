const {Router} = require('express')
const router = Router()
const dto = require('../../../models/dto/dto')
const {isAuth} = require('../../../middleware/auth.middleware')

router.get('/current',isAuth ,async (req, res) => {
  let user
  if(req.session.passport){
    user = dto.setUser(req.session.passport.user)
  }
  res.render('profile', {user: user, isAdmin: user.role == 'admin' || user?.role == 'premium'})
})

module.exports = router