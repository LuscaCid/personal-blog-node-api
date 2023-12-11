const DiskStorage = require('../providers/diskStorage')
const AppError = require('../utils')
const knex = require('../database/knex')

class ImagesControllers{//resolve first the user avatar
  postContent = async (request, response) =>{
    const diskStorage = new DiskStorage()
    const {post_id} = request.query
    const user_id = request.user.id
    const file = request.file.filename

    const userAuth = await knex('users')
    .where({id : user_id})
    .first()

    if(!userAuth) throw new AppError('Usuário não autenticado.')
    
    const filename = await diskStorage.saveFile(file)

    await knex("posts")
    .where({id : post_id})
    .update({post_image_index : filename})
    .then(() => {
      console.log(filename)
      return response.status(200).json({message : "foto adicionada ao post"})
    })
    .catch(e => console.error(e))
    //api.defaults.headers('/files', {post.filename})
    
  }
 
  updateFile = async (request, response) =>{ 
    const diskStorage = new DiskStorage()

    const user_id = request.user.id
    const file = request.file.filename

    const user  = await knex('users')
    .where({id : user_id})
    .first()

    if(!user)throw new AppError('Usuário não autenticado.')

    if(user.avatar) await diskStorage.deleteFile(file)
    
    const filename = await diskStorage.saveFile(file)//e é aqui que é inserido n pasta
  
    await knex('users')
    .where({id : user_id})
    .update({avatar : filename})

    return response.status(201).json(user)
  }

}

module.exports = ImagesControllers

//inicialmente vou criar o registro do post, caso haja alguma imagem, primeiro se cria o post e dps atualiza o campo de endereco da imagem, ouseja, duas apis sao consumidas nessa brincadeira, uma de criar com title, content, tags e links e outra que recebe o filename dentro de request.file.filename com campo de post