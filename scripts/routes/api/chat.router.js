const { Router } = require('express')
const router = Router()

const {isAuth} = require('../../../middleware/auth.middleware')
const userManager = require('../../managers/userManager')

router.get(('/'), isAuth, async (req, res) => {
  const _user = await userManager.getById(req.session.passport.user)
  res.render('chat', {user:_user} )
})



module.exports = router;