const { Router } = require('express')
const {authToken} = require('../../utils/generateToken')


class CustomRouter  {
    constructor() {
        this.router = Router()
        this.init()
        this.counter = 0
    }

    init() {
        // vacio en la clase base
    }

    getRouter() {
        return this.router
    }

    get(path, policies, ...callbacks) {
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
                console.log(e)
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

    // 3 tipos de usuario: PUBLIC, CUSTOMER, ADMIN

    handlePolicies(policies) {
        return (req, res, next) => {
            if(policies[0] === "public") {
                return next()
            }

            const { authorization } =  req.headers 

            if (!authorization) {
                return res.status(401).send({
                    error: "Not a valid user"
                })
            }

            const token = authorization.split(' ')[1] // separa el barear para que solo quede el token
            const user = authToken(token) // consigue el usuario 

            console.log(user)


            if (!user) {
                return res.status(401).send({
                    error: "Not a valid user"
                })
            }
            if (!policies.includes(user.user._user.role)) {
                return res.status(403).send({
                    success: false,
                    error: "Forbbiden"
                })
            }

            next()
        }
    }
}

module.exports = CustomRouter