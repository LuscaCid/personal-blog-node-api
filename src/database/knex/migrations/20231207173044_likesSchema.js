
exports.up = knex => knex.schema.createTable('likes', t =>{
  t.increments('id').primary()
  t.text('status')//
  t.integer('post_id').references('id').inTable('posts')
  t.integer('user_id').references('id').inTable('users')

})//if already liked its alive, if likes again, delete


exports.down = knex => knex.schema.dropTable('likes')
