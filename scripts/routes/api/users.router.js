const {Router} = require('express')
const router = Router()
const userManager = require('../../repositories/user.repository.js')


router.get('/premium/:uid' ,async (req, res) => {
  const {uid} = req.params
  if (!uid) {
    res.send({
      error: 'Not found',
      status: false
    }).status(404)
    return
  }

  let user = await userManager.getElementById(uid)

  if (!user){
    res.send({
      error: 'Not found',
      status: false
    }).status(404)
    return
  }

  ( user.role == 'customer') ? user.role = 'premium' : (user.role == 'premium' ? user.role = 'customer' : null)

  userManager.modifyElement(uid, user)

  res.send({
    message: `Nuevo rol: ${user.role}`,
    status: true,
  }).status(200)
})

module.exports = router