
exports.up = knex => knex.schema.createTable('users', t => {
    t.increments('id').notNullable().primary()
    t.text('name').notNullable()
    t.text('username').primary()
    t.text('email').notNullable()
    t.text('password').notNullable()
    t.text('biography')
    t.text('avatar').defaultTo(null)
})

exports.down = knex => knex.schema.dropTable('users')
