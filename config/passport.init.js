const { signup, login, LocalStrategy } = require("./passport.local.config")

const passport = require('passport')
const userManager = require('../scripts/repositories/user.repository')

const {githubStrategy, gitHubAccesConfig, profileGithubController, strategyName} = require('./passport.github')
const logger = require("../logger")



const init = () => {
  passport.use('local-signup', new LocalStrategy({usernameField: 'email', passReqToCallback: true},signup))
  passport.use('local-login', new LocalStrategy({usernameField: 'email'}, login))
  passport.use(strategyName, new githubStrategy(gitHubAccesConfig, profileGithubController)) //strategyname = "github"

  
  passport.serializeUser((user, done) => {
    logger.debug('usuario guardado')
    done(null, user._id);
  });
  
  passport.deserializeUser(async (user, done) => {
    const _user = await userManager.getElementById(user)
    done(null, _user)
  })
  // passport.use('jwt', jwt )
}

module.exports = init