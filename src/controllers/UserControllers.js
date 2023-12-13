const knex = require('../database/knex')
const AppError = require('../utils')
const {hash, compare} = require('bcryptjs')
class UserControllers{

    update = async (request, response) => {
        const {biography, newName, newUsername, newEmail, oldPassword, newPassword} = request.body
        const user_id = request.user.id
        if(biography){
            try{
            await knex("users")
            .where({user_id})
            .update({
                biography
            })
            } catch (error){
                throw new AppError(`${error.message}`, 401)
            }
        }
        
        if(newName){
            try{
            await knex("users")
            .where({user_id})
            .update({
                name : newName
            })
            } catch (error){
                throw new AppError(`${error.message}`, 401)
            }
        }
        if(newUsername){
            try{
                const hasUsersWithThisUsername = await knex('users')
                .where({username : newUsername})
                .first()

                if(hasUsersWithThisUsername)throw new AppError('nome de usuário já utilizado.', 401)

                await knex("users")
                .where({user_id})
                .update({
                    username : newUsername
                })
            } catch (error){
                throw new AppError(`${error.message}`, 401)
            }
        }
        if(newEmail){
            try{
                const hasUsersWithThisEmail = await knex('users')
                .where({email : newEmail})
                .first()
                if(hasUsersWithThisEmail)throw new AppError('E-mail em uso.', 401)
                await knex("users")
                .where({user_id})
                .update({
                    email : newEmail
                })
            } catch (error){
                throw new AppError(`${error.message}`, 401)
            }
        }

        if(newPassword && oldPassword){
            const user = await knex('users')
            .where({id : user_id})
            .first()

            const hashedPassword = user.password
            const checkOldPasswordAndActual = await compare (user.password, oldPassword )

            if(!checkOldPasswordAndActual)throw new AppError('As senhas diferem')

            const hashPassword = await hash(newPassword, 8)

            await knex('users')
            .where({id : user_id})
            .update({
                password : hashPassword
            })
            .then(()=> console.log('updated with success'))
            .catch(e => console.error(e))

        }


        return response.json({message : "Atualizado com sucesso!"})



    }

}
module.exports = UserControllers