const { signup, login,loginn, LocalStrategy } = require("./passport.local.config")

const passport = require('passport')
const userManager = require('../scripts/repositories/user.repository')

const {githubStrategy, gitHubAccesConfig, profileGithubController, strategyName} = require('./passport.github')



const init = () => {
  passport.use('local-signup', new LocalStrategy({usernameField: 'email', passReqToCallback: true},signup))
  passport.use('local-login', new LocalStrategy({usernameField: 'email'}, loginn))
  passport.use(strategyName, new githubStrategy(gitHubAccesConfig, profileGithubController)) //strategyname = "github"

  
  passport.serializeUser((user, done) => {
    console.log('usuario guardado')
    done(null, user._id);
  });
  
  passport.deserializeUser(async (user, done) => {
    const _user = await userManager.getElementById(user)
    done(null, _user)
  })
  // passport.use('jwt', jwt )
}

module.exports = init