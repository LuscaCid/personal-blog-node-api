
exports.up = knex=> knex.schema.createTable('links', table => {
  table.increments('id').primary()
  table.text('url').notNullable()
  table.integer('post_id').references('id').inTable('posts')

})

exports.down = knex=> knex.schema.dropTable('links')
