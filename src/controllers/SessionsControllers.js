const AuthConfig = require('../configs/AuthConfig')
const {compare, hash} = require('bcryptjs')
const {sign} = require('jsonwebtoken')
const AppError = require('../utils')
const knex = require('../database/knex')
class SessionsControllers{
    
    login = async (request, response) => {
        const {email, password} = request.body
        console.log('chegou')
        let userInApp = null
        try {
            if(email)userInApp = await knex('users').where({email}).first()
        if(!userInApp)throw new AppError('E-mail ou senha inválidos', 401)
         
        const dbPassword = userInApp.password
        const checkPassword = await compare( password, dbPassword)
        if(!checkPassword)throw new AppError('E-mail ou senha inválidos', 401)
        
        console.log(userInApp.id)
        const {secret, expiresIn} = AuthConfig.jwt

        const token = sign({}, secret, {
            subject : String(userInApp.id),
            expiresIn 
        })
        
        return response.status(200).json({user : userInApp, token})
        } catch (error){
            throw new AppError(`${error.message}`, 500)
        }
            
    }

    register = async (request, response) => {
        const {email, formPassword, username, name} = request.body
        try{
            const userExists = await knex('users')
            .where({email})
            .orWhere({username})
            .first()

            if(userExists)throw new AppError('E-mail ou nome de usuário já cadastrado na aplicação.', 401)

            const hashedPassword = await hash(formPassword, 8)
            const [user_ID] = await knex('users')
            .insert({
                name,
                email,
                username,
                password : hashedPassword    
            })
            return response.status(201).json({
                message : "Usuário cadastrado com sucesso!",
                status : 201,
                user_ID 
            })
        } catch (error){
            throw new AppError(`${error.message}`, 401)
        }
            
        
    } 
}
module.exports = SessionsControllers