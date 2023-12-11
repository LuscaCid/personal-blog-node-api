
const express = require('express')
const Router = express()
const userRoutes = require('./users.routes')
const sessionsRoutes = require('./sessions.routes')
const postsRoutes = require('./posts.routes')
const followersRoutes = require('./followers.routes')
const commentsRoutes = require('./comments.routes')
const likesRoutes = require('./likes.routes')

Router.use('/likes', likesRoutes)
Router.use('/comments', commentsRoutes)
Router.use('/followers', followersRoutes)
Router.use('/users', userRoutes)
Router.use('/posts', postsRoutes)
Router.use('/sessions',sessionsRoutes)
module.exports = Router