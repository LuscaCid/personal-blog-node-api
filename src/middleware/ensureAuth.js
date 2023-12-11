const {verify} = require('jsonwebtoken')
const AppError = require('../utils')
const AuthConfig = require('../configs/AuthConfig')

function ensureAuthenticated (request, response, next){
  const authHeader = request.headers.authorization
    
    if(!authHeader)throw new AppError("jwt dont passed")

    const [,token] = authHeader.split(' ')


  try{
    const {secret} = AuthConfig.jwt
    const {sub : user_id} = verify(token, secret )
    request.user ={
      id : Number(user_id)
    }
    return next()
  }catch (error){
    throw new AppError(`${error}`, `${error instanceof AppError ? 401 : 500}`)
  }
    
} 

module.exports = ensureAuthenticated