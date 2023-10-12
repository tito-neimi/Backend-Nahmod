const githubStrategy = require('passport-github2')
const userManager = require('../scripts/repositories/user.repository')
const config = require('../config/config.js')
const logger = require('../logger/index')

const gitHubAccesConfig = {
  clientID: config.GITHUB_CLIENT_ID,
  clientSecret: config.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/githubSessions"
}

const gitHubUser = async (profile, done) => {
  let {name, email} = profile._json
  //en caso de que el email sea null, hardcodeo el email con un usuario existente para que se puesda seguir ejecutando el codigo
  //Esto pasa porque github solo comparte tu email si lo tenes configurado, y no todo el mundo tiene su email en publico. Esto es temporal para la entrega
  if (!email && name) {
    email = "joacaponah@gmail.com"
  }
  const _user = await userManager.getByEmail(email)

  if (!_user) {
    logger.warn("usuario no encontrado, Intento de inicio de sesion con github")
    const newUser = {
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1],
      email: email,
      password: "",
      gender:"Other"
    }

    const result = userManager.addUser(newUser)
    return done(null, result )

  }
  _user.id = _user._id

  return done(null, _user)
}
const profileGithubController = async (accessToken, refreshToken, profile, done) => {
  try {
    return await gitHubUser(profile, done)
  } catch (error) {
    done(error)
  }
}


module.exports = {
  githubStrategy,
  gitHubAccesConfig,
  profileGithubController,
  strategyName: "github"
}