const jwt = require('jsonwebtoken')
const { verifyToken } = require('../helpers/jwt')
const { User } = require('../models')

const authentication = async (req, res, next) => {
    try {
    const { access_token } = req.headers

    console.log(access_token)

    if(!access_token){
        throw {name: 'Unauthorized'}
    } else{
        const decodeToken = verifyToken(access_token, process.env.SECRET_KEY)

        const userDatabase = await User.findByPk(decodeToken.id)

        if(!userDatabase){
            throw {name: 'Unauthorized'}
        }else{
            req.user = userDatabase
            next()
        }
    }
    } catch (err) {
        console.log(err)
        if(err.name === 'JsonWebTokenError'){
            throw {name: 'JsonWebTokenError'}
        }else{
           next(err)
        }
    }
}

module.exports = authentication