const JWT = require('jsonwebtoken')
require('dotenv').config()

const authenticationMiddleware = async (req, res, next) => {
        const {authorization} = req.headers;
        if (!authorization) return res.status(401).json({msg: 'You are unauthorized to access this route'})

        const schema = authorization.split(' ')[0]
        if (schema !== 'Bearer') return res.status(401).json({msg: 'You are unauthorized to access this route'})

        const token = authorization.split(' ')[1]
        if (!token) return res.status(401).json({msg: 'You are unauthorized to access this route'})

        try{
            const {id, name} = JWT.verify(token, process.env.JWT_SECRET)
            req.user = {id, name}
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
        next()
}

module.exports = authenticationMiddleware