
const dto = require('../../../models/dto/dto')
const CustomRouter = require('../custom.router')

class chatRouter extends CustomRouter {
  init () {

    this.get('/', ["customer","admin"],  async (req, res) => {
      const _user = dto.setUser(req.session.passport.user)
      res.render('chat', {user:_user, isAdmin: _user.role == 'admin' || _user?.role == 'premium'} )
    })
  }

}
module.exports = {
  custom: new chatRouter()
}

