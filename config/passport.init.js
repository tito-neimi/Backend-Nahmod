const { signup, login, LocalStrategy } = require("./passport.local.config")

const passport = require('passport')
const userManager = require('../scripts/managers/userManager')

const {githubStrategy, gitHubAccesConfig, profileGithubController, strategyName} = require('./passport.github')



const init = () => {
  passport.use('local-signup', new LocalStrategy({usernameField: 'email', passReqToCallback: true},signup))
  passport.use('local-login', new LocalStrategy({usernameField: 'email'}, login))
  passport.use(strategyName, new githubStrategy(gitHubAccesConfig, profileGithubController)) //strategyname = "github"

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    const user = userManager.getById(id)
    done(null, user)
  })
}

module.exports = init