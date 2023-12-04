const { Router } = require('express')
const dto = require('../../models/dto/dto.js')
const logger = require('../../logger/index.js')
const { authToken } = require('../../utils/generateToken.js')


class CustomRouter  {
    constructor() {
        this.router = Router()
        this.init()
    }

    init() {
        // vacio en la clase base
    }

    getRouter() {
        return this.router
    }

    async get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
    }
    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map((cb) => async (...params) => {
            try {
                await cb.apply(this, params)
            } catch (e) {
                logger.error(e)
            }
        })
    }

    generateCustomResponses(_, res, next) {
        res.sendError = (err) => {
            res.status(500).send(
                {
                    success: false,
                    error: err.stack
                }
            )
        }

        res.sendSuccess = (payload) => {
            res.send({
                success: true,
                payload
            })
        }

        next()
    }

    // 4 tipos de usuario: PUBLIC, CUSTOMER, PREMIUM, ADMIN

    handlePolicies(policies) {
      return async (req, res, next) => {
        if(policies[0] === "public") {
          return next()
        }
        let user
        if(req.session.passport){ 
          user = await dto.setUser(req.session.passport.user) 
        } else if(req.headers.authorization){
            const { authorization } =  req.headers 
            const token = authorization.split(' ')[1] // separa el barear para que solo quede el token
            user = authToken(token) // consigue el usuario
        }
        else { user = null}
        if (!user) {
            return res.status(401).send({
                error: "Not logged in"
            })
        }
        
            if (!policies.includes(user.role)) {
                return res.status(403).send({
                    success: false,
                    error: "Forbbiden"
                })
            }
            logger.info("rol correcto")
            next()
        }
    }
}

module.exports = CustomRouter