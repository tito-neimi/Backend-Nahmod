const jwt = require('passport-jwt');
const {authToken} = require('../utils/generateToken');
const {JWT_SECRET} = require('./config.jwt')

const JWTstrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const handler = (token, done) => {
try {
  if (!authToken(token)) {
    done(null, false)
  }
  else {
    done(null, token)
  }
} catch (error) {
  
}
}
const extractor = (req) => {
  if (!req) return null
  if (!req.cookies) return null

  return req.cookies['token']
}

const srategy = new JWTstrategy({
  jwtFromRequest: ExtractJWT.fromExtractors([extractor]),
  secretOrKey:JWT_SECRET
}, handler)


module.exports = srategy