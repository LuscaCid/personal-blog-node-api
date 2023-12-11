
exports.up = knex => knex.schema.createTable('tags', table =>{
  table.increments('id').primary()
  table.text('tag').notNullable()
  table.integer('post_id').references('id').inTable('posts')
  table.integer('user_id').references('id').inTable('users')
})
exports.down = knex => knex.schema.dropTable('tags')
