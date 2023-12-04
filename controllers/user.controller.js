const { mainData } = require('../models/dto/dto')
const userManager = require('../scripts/repositories/user.repository')
const mailSender = require('../sevices/mail.sender.service')
const dto = require('../models/dto/dto')

const changeUserPremium =  async (req, res) => {
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
  if(user.role == 'customer'){
    const requirements = ['identificacion', 'comprobanteDomicilio', 'comprobanteCuenta'] //Los archivos tienen que estar subidos con este nombre
    const isOk = requirements.every( doc => {
      return user?.files.some(obj => obj.tipo === doc);
    })
  
    if(!isOk){
      res.send({
        message:'No se puede acceder por falta de documentos. Los nombres de los documentos a cargar tienen que ser exactamente: identificacion, comprobanteDomicilio, comprobanteCuenta',
        status: 401
      }).status(401)
      console.info('No se puede acceder por falta de documentos')
      return
    }
  }


  ( user.role == 'customer') ? user.role = 'premium' : (user.role == 'premium' ? user.role = 'customer' : null)

  userManager.modifyElement(uid, user)

  res.send({
    message: `Nuevo rol: ${user.role}`,
    status: true,
  }).status(200)
}


const uploadDocuments = async (req, res) => {
  const {uid} = req.params
  let user = await userManager.getElementById(uid)
  const file = req.file
  console.log(file)
  if (!user) {
    res.send({
      error: 'User not found',
      status: false
    }).status(404)
    return
  }else if(!file){
    res.send({
      error: 'Files not uploaded',
      status: false
    }).status(404)
    return
  }
  
  if(!user.files){
    await userManager.modifyElement(uid, {
      ...user,
      files: [
        {
          name: req.body.name,
          reference: req.file.path,
          tipo: req.body.type
        }
      ]
    })
  }else {
    console.log('existente')
    user.files.push({
      name: req.body.name,
      reference: req.file.path,
      tipo: req.body.type
  })
  console.log(user)
    await userManager.modifyElement(uid, user)
  }

  res.send({
    status: 200,
    message: "Recibido"
  }).status(200)
}

const getAll = async (req, res ) => {
  const users = await userManager.getAll()
  let newUsers = []
  for(let i = 0; i< users.length; i++){
    let newUser = mainData(users[i])
    console.log(newUser)
    newUsers.push(newUser)
  }
  res.send({
    status: 202,
    payload: newUsers
  }).status(202)
}

const deleteUsers = async (req, res) => {
  const users = await userManager.getAll()
  const date = new Date()
  const limit = 48 //En horas

  date.setDate(date.getHours() - limit)

  let oldUsers = users.filter(user => {
    let lasConnectionDate = new Date(user.lastConection)
    if (!user.lastConection) return true
    return lasConnectionDate < date
  })
  for(let i = 0; i < oldUsers.length; i++ ){
    await userManager.delete(users[i]._id)
    mailSender.send(users[i].email, "Tu cuenta en Plis U a sido eliminada debido a tu incatividad en la pagina, puedes volver a crearte una cuenta gratuitamente en nuestra pagina, te esperamos")
  }



  res.send({
    status:202,
    message: `Los que han estado inactivos por mas de ${limit} dias han sido eliminados`,
    payload: oldUsers,
  })
}

const dashboardRender = async (req, res) => {
  var user
  if (req.session.passport){
    user = await dto.setUser(req.session.passport.user)
  } else{ user = null}

  if(user?.role == 'admin'){

    const users = await userManager.getAll()
    let data = []
    for(let i = 0; i< users.length; i++){
      const newUser = dto.mainData(users[i])
      newUser.lastConection = newUser.lastConection.getHours()
      data.push(newUser)
    }
    res.render('userDashboard', {user:{...user, isAdmin: true}, users: data})
  } else {
    res.send({
      status:401,
      message: 'Unauthorized'
    }).status(401)
  }
}

module.exports = {
  changeUserPremium,
  uploadDocuments,
  getAll,
  deleteUsers,
  dashboardRender
}