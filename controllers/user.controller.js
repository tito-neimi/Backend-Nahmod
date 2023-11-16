const userManager = require('../scripts/repositories/user.repository')

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



module.exports = {
  changeUserPremium,
  uploadDocuments
}