exports.up = knex => knex.schema.createTable('users_followers', table => {
  table.increments('id').primary()
  table.text('friendship_status').defaultTo("none")//a depender, vai renderizar um component diferente no frontend com react
  table.integer('follower_id').references('id').inTable('users')
  table.integer('following_id').references('id').inTable('users')
})
//exemplo, sou um usuario, quando alguem me segue, um registro desta tabela eh gerado, recebendo no campo de following_id o meu id e follower_id o id de quem me seguiu, sendo assim, da pra contar quantos seguimores eu tenho quando realizo um count id where following_id = meu proprio id que vem de request.user.id e depois quando eu for entrar na area dos meus seguimores, posso simplesmente um inner join onde o follower_id = users.id e dou select no name e no avatar para renderizar ao lado !

exports.down = knex => knex.schema.dropTable('users_followers')

