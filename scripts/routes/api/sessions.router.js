const {Router} = require('express')
const router = Router()
const userManager = require('../../managers/userManager')

router.get('/current', async (req, res) => {
  const userId = req.session.passport.user
  const user = await userManager.getById(userId)
  res.render('profile', {user: user})
})

module.exports = router