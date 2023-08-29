const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_PAYLOAD } = require('../config/config.jwt');

const jwtVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).send({
      status: "error",
      error: "not Aunthenticated"
    })
    return
  }

  const token = authHeader.replace("Bearer ", "")

  try {
    const credentials = jwt.verify(token, JWT_SECRET)
    req.user = credentials
    next()
  } catch (error) {
    console.error(error)
    res.status(400).send({
      status: "error",
      error: error
    });
    res.end()
  }
}

module.exports = {
  jwtVerifyToken,

}