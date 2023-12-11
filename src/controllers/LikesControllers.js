const AppError = require('../utils')
const knex = require('../database/knex')

class LikesControllers{

  like = async (request, response) => {
    const user_id = request.user.id
    const {post_id} = request.query //will be inserted on the headers of request at the backend with react-params

    const thisUserAlreadyLikedThisPost = await knex('likes')
    .where({post_id})
    .andWhere({user_id})
    .first()

    if(thisUserAlreadyLikedThisPost)return response.json({wasLiked : true})

    const ownerPostId = await knex('posts')
    .select('*')
    .where({post_id})
    .first()
    .then((data) => {
      console.log('success')
      return data
    })
    .catch(e => console.error(e))
    console.log(ownerPostId, "id do usuario liked")

    await knex('likes')
    .insert({
      post_id,
      user_id,
      status : "active"
    })
    .then(() => console.log('liked'))
    .catch(e => console.error(e))
   
    return response.status(200).json({wasLiked : true})
  }

  unlike = async (request, response) => {
    const {post_id} = request.query

    await knex('likes')
    .where({post_id})
    .delete()
    .then(() => console.log('deleted'))
    .catch(e => {
      console.error(e.message)
      throw new AppError(`${e.message}`, 500)
    })
    return response.json({wasLiked : false})
  } 

  checkIfWasLiked = async (request, response) => {
    const {post_id} = request.query
    const user_id = request.user.id

    const userAlreadyLiked = await knex('likes')
    .where({post_id})
    .andWhere({user_id})
    .first()

    if(userAlreadyLiked) return response.json({liked : true})
    else return response.json({liked : false})
  }
}

module.exports = LikesControllers