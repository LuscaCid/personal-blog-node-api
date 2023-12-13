const knex = require('../database/knex')
const AppError = require('../utils')

class CommentsControllers{

  create = async (request, response) => {
    const created_by = request.user.id
    const {post_id} = request.params
    const {content} = request.body

    const thisPostsExists = await knex('posts')
    .where({post_id})
    .first()
    .then((data) => {
      console.log('finder success')
      return data // nao tava retornando nada pra dentro de thispostsexists 
    })
    .catch(e => console.error(e))

    if(!thisPostsExists)throw new AppError("invalid post", 404)

    const comment_id = await knex('comments')
    .insert({ 
      content, 
      created_by, 
      post_id 
    })
    .then(id => {
      console.log('commented with success')
      return id
    })
    return response.status(200).json(comment_id)

  }
  update = async(request, response) => {
    const {newContent, comment_id} = request.body 
    const user_id = request.user.id
    
    await knex('comments')
    .where({id : comment_id})
    .andWhere({user_id})
    .update({
      content : newContent      
    })
    .then(() => console.log('comment updated!'))
    .catch(e => console.error(e))

    return response.status(200).json()
  }

  delete = async (request, response) =>{
    const user_id = request.user.id
    const {comment_id} = request.body 
    
    const thisUserHasThisComment = await knex('comments')
    .where({created_by : user_id})
    .andWhere({id : comment_id})
    .first()

    if(!thisUserHasThisComment)throw new AppError('invalid access: denied', 401)

    await knex('comments')
    .where({id : comment_id})
    .delete()
    .then(()=>console.log('deleted with succes'))
    .catch(e => console.error(e))

    return response.json({message : "deleted with success"})
  }
}

//vou ter que retornar o id do comentario quando for renderizar, para que se caso o usuario quiser editar, poder clicar sobre ele e desta forma ter acesso a sua chave que dará acesso ao update

//mds ainda preciso refatorar a maioria das funcoes com repositories e services...

module.exports = CommentsControllers

//onfocus estabelece a conexao da funcao, e se onchange do input for ativo, eu posso ja estabelecer dentro do params o id do post e se o input for enviado naquele post em especifico, o gatilho eh disparado