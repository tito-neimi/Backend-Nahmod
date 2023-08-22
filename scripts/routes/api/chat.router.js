const { Router } = require('express')
const router = Router()

const isAuth = require('../../../middleware/auth.middleware')

router.get(('/'), (req, res) => {
  res.render('chat', {user:req.session.user} )
})



module.exports = router;
  