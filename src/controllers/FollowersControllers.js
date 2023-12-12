const AppError = require('../utils')
const knex = require('../database/knex')
class FollowersControllers{

  searchFollowers = async (request, response) => {
    const {username} = request.query
    const user_id = request.user.id

    const usersSearched = await knex('users')
    .select('*')
    .whereLike("username", `%${username}%`)

    const thisUserFollows = usersSearched.map(async (user) => {
      const userFollowing = await knex('users_followers')
      .where({following_id : user.id})
      .andWhere({follower_id : user_id })
      .first()
      return {
        user,
        following :userFollowing //pode ser undefined quanto pode ser 
      }
    })
    const result = await Promise.all(thisUserFollows)
    return response.json(result)
  }

  follow = async (request, response) => {
    const user_id = request.user.id
    const {followed_id} = request.query

    const thisUserReallyExists = await knex('users')//verify if this user exists coz im folling by 'request.params.id'
    .where({id : followed_id})
    .first()
    .then(id => id)
    .catch(e =>{
      throw new AppError(`${e.message}`, 500)
    })
    if(!thisUserReallyExists || thisUserReallyExists.id == user_id)throw new AppError('Este usuário não encontrado.', 404)
    console.log(followed_id, user_id, "ids")
    const alreadyConnected = await knex('users_followers')
    .where({following_id: followed_id})
    .andWhere({follower_id : user_id })
    .first()

    console.log(alreadyConnected)
    if(alreadyConnected)throw new AppError('Voçês ja se seguem!')

    await knex('users_followers')
    .insert({//table for link the follower to the followed
        friendship_status : "connected", 
        follower_id : user_id,//seguidor --> quem segue
        following_id: followed_id//seguindo, quem é seguido, ou seja, para quem se envia a solicitacao
    })
    .then(id => {
      console.log('criado')
      return response.status(200).json(id)
    })
  }

  unFollow = async(request, response) =>{
    const {unfollowing} = request.query //the id from the user thats we want to unfollow, its became from the list of all following

    const user_id = request.user.id
    await knex('users_followers')
    .where({following_id : unfollowing})
    .andWhere({follower_id : user_id})
    .delete()
    .then(() => {
      return response.status(200).json({message : "deletado com sucesso"})
    })
    .catch(e => console.error(e))

  }

  countFollowers = async (request, response) => {
    const user_id = request.user.id

    const followers = await knex('users_followers')
    .count('* as total_followers')
    .where({following_id : user_id})

    return response.json(followers)
  }

  listInfoFollowers = async (request, response) => {
    const user_id = request.user.id

    try{
      const allFollowersInfo = await knex('users_followers as uf')
      .select(["name", "username", "follower_id"])
      .where({following_id : user_id})//onde eh seguido
      .innerJoin("users as u", "uf.follower_id", "=", "u.id")
      .then((data) => {
        console.log('success at querying')
        return data
      })

      return response.status(200).json(allFollowersInfo)

    } catch (error) {
      throw new AppError(`${error.message}`, 404)
    }

  }

}
module.exports=FollowersControllers