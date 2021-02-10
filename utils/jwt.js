const JWT = require('jsonwebtoken')

const generarJWT = async ( uid) => {
    return new Promise( (resolve, reject) => {
        const payload = { uid }

        JWT.sign(payload, process.env.JWT_KEY, {
            expiresIn: "24h"
        }, (err, token) => {
            if (err) {
                reject(err)
            }else{
                resolve(token)
            }
        })
    } )
}

const consultarJWT = (token= '') => {
    try {
        const {uid} = JWT.verify(token, process.env.JWT_KEY);
        return [true,uid]
    } catch (error) {
        return [false,null]
    }
}

module.exports = {
    generarJWT,
    consultarJWT
}