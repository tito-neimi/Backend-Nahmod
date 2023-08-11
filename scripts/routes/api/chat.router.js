const { Router } = require('express')
const router = Router()

const chatManager = require('../../managers/chatManager')

router.get('/', (req, res) => {
  res.render('chat' )
})



module.exports = router;
  