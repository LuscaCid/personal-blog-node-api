
exports.up = knex => knex.schema.createTable('posts', table => {
  table.increments('id').primary().notNullable()
  table.text('title').notNullable()
  table.text('content')//all the content in post of blogger
  table.text('post_image_index')
  table.integer("user_id").references('id').inTable('users')
  table.timestamp('created_at').default(knex.fn.now())
  table.timestamp('updated_at').default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable('posts')
