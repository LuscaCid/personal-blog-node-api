
exports.up = knex => knex.schema.createTable('comments', table => {
  table.increments('id').primary().notNullable()
  table.text('content').notNullable() //what i'll be wrote in the comment
  table.integer('post_id').references('id').inTable('posts') //fk to link the post when renderize post info
  table.integer('created_by').references('id').inTable('users')//fk to link the user witch made the comment
  table.timestamp('created_at').default(knex.fn.now()) //this displays at the frontend
  
})

exports.down = knex => knex.schema.dropTable('comments')

//preciso fazer com que inicialmente, ao abrir a conta seja renderizado os posts dos usuarios que quem esta logado, apareçam, desta forma, ao passar das authRoutes, preciso coletar os id's dos usuarios que este segue e renderizar os seus posts, porem nao todos de vez e utilizar do suspense do react para fazer aguardar passando a fallback = {<component de loading/>}
//e dentro o componente de feed que vai alimentar a pagina principal deste usuario!