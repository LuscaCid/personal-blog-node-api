const knex = require('../database/knex')
const AppError = require('../utils')

const ImagesControllers = require('../controllers/ImagesControllers')

class PostsControllers{
  //create an post to the application
  create = async (request, response) => {
    const imagesControllers = new ImagesControllers()
    let filename ;
    const {title, content, tags, links} = request.body
    
    const user_id = request.user.id
    let post_id; // for all functions can see
    try{
      [post_id] = await knex('posts')
      .insert({
        title,
        content,
        user_id,
        
      }).then((id) => {
        console.log('inserted with success!')
        return id
      })
    } catch (error){
      throw new AppError(`${error}`, 500)
    }
      
    console.log(post_id, "id")
    //tags and links are arrays to insert one per one inside of table
    
    const tags_insert = tags.map(tag => {
      return {
        tag : tag,
        user_id,
        post_id
      }
    })
    try{
      if(tags.length > 0 ){
        await knex('tags')
        .insert(tags_insert)
        .then(() => {
          console.log('inserted with success!')
        })
        .catch(e => console.log(e))
        
      } else return response.status(201).json(post_id)
      
    } catch (error){
      throw new AppError(`${error}`, 500)
    }
  
    const links_insert = links.map(link => (
      {
        url : link.url,
        post_id
      }
    ))
    
    try{
      if(links.length == 0)return response.json(post_id)
      
      await knex('links')
      .insert(links_insert)
      .then(() => {
        console.log('inserted with success!')
      })
      .catch(e => console.log(e))
      
    } catch (error){
      throw new AppError(`${error}`, 500)
    }
    return response.json(post_id)
  }

  update = async (request,response) => {
    const { newTitle, newContent } = request.body
    const { post_id } = request.params
    const user_id = request.user.id
    
    if(newTitle){
      try{
        const user_has_this_posts = await knex('posts')
        .where({id : post_id})
        .andWhere({user_id})
        .update({
          title : newTitle
        })
        .then((id) => {
          console.log("atualizado com sucesso!")
          return id
        })
        .catch(e => (
          console.log(e, `error`)
        ))
          
        if(!user_has_this_posts)throw new AppError("este usuário não possui acesso a este post")

      } catch(error){
        throw new AppError(`${error}`, 500)
      }
    }
    if(newContent){
      try{
        const user_has_this_posts = await knex('posts')
        .where({id : post_id})
        .andWhere({user_id})
        .update({
          content : newContent
        })
        .then((id) => {
          console.log("atualizado com sucesso!")
          return id
        })
        .catch(e => (
          console.log(e, `error`)
        ))
          
        if(!user_has_this_posts)throw new AppError("este usuário não possui acesso a este post")

      } catch(error){
        throw new AppError(`${error}`, 500)
      }
    }
    return response.status(200).json({message : "Atualizado com sucesso!"})
  }

  viewAll = async(request, response) => {//self posts only 
    const {title} = request.query
    const user_id = request.user.id
    const allPosts = await knex('posts')
    .select('*')
    .where({user_id})
    //.whereLike("title", `%${title}%`)
    
    const allUserTags =await knex('tags')
    .where({user_id})
    .orderBy('tag')

    const allUserReceivedLikes = await knex('likes')
    .select('*')
    .where({user_id})
    
    const postsWithTagsWithLikes = allPosts.map(post => {
      const postTags = allUserTags.filter(tag => {
        if(tag.post_id == post.id)return tag.tag
      })
      const postLikes = allUserReceivedLikes.filter(like => {
        if(post.id == like.post_id) return true
      })
      return {
        ...post,
        tags : postTags,
        likes : postLikes.length
      }
    })
    
    //i need to add all likes and all comments from this post here also

    return response.status(200).json(postsWithTagsWithLikes)
  }
  
  
  //when clicks on post, that opens an modal for more info, and this opens the comments
  viewInsideMoreInfo = async(request, response) => { 
    const {post_id} = request.query
    const user_id = request.user.id

    console.log(post_id)
    const postInfoAndId = await knex('posts')
    .select('*')
    .where({post_id})
    .first()
    .then((data) => {
      console.log('found, success')
      
      return data
    })
    .catch(e => {
      throw new AppError(`${e.message}`, 500) 
    })
    console.log(postInfoAndId.id)
    const allPostTags = await knex('tags')//its an array
    .select('*')
    .where({post_id : postInfoAndId.post_id})
    .orderBy("tag")
    .then((tagsData) =>{
      console.log('success at tags')
      return tagsData
    })
    .catch(e => console.error(e))

    const allCommentsInPost = await knex('comments as c')
    .select(["content", "name", "users.id"])
    .where({post_id : postInfoAndId.post_id})
    .innerJoin('users', "c.created_by", "users.id")
    .orderBy('content')

    const userData = await knex('posts')
    .select(['id','name', "username", "avatar"])
    .where({post_id})
    .innerJoin('users', 'users.id', 'posts.user_id')
    .first()
    const structuredPostToRender = {
      ...postInfoAndId,
      allPostTags,
      allCommentsInPost,
      userData
    }
    console.log(structuredPostToRender)

    return response.status(200).json(structuredPostToRender)

  }//thats can be to hidden a lot of  info from screen user

  feed = async (request, response) => {
    const user_id = request.user.id
    console.log('ta no feed')
    const myFollowing = await knex('users_followers')
    .select([ 'name', 'username', 'avatar', 'following_id'])
    .where({follower_id : user_id})
    .innerJoin('users as u', 'u.id', 'users_followers.following_id')
    .orderBy('name') 

    async function fetchData(follower){
      const following = follower.following_id
      const posts=  await knex('posts')
      .select('*')
      .where({user_id : following})
      .innerJoin('users as u', 'u.id', 'posts.user_id')
      .limit(8)
      .then((data)=> data )
      .catch(e => console.error(e))

      const postWithLikes = posts.map(async (posts) => {
        console.log(posts)
          const postLikes = await knex('likes')
          .count('* as likes')
          .where({post_id : posts.post_id})
          .first()
          return {...posts, postLikes}
        
      })
      const postsUsers =  await Promise.all(postWithLikes); 
      console.log(postsUsers)
      return postsUsers
    }
    const feedPosts = myFollowing.map(async (follower) => {
      const posts = await fetchData(follower)
      console.log(posts)
      
      return posts
    })
  
    const userPosts = await Promise.all(feedPosts);

    console.log(userPosts)
    
    return response.status(200).json(userPosts)
  }
  
} 
module.exports = PostsControllers