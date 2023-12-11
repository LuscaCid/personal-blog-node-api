const express =require('express')
const commentsRoutes = express()
const ensureAuth = require('../middleware/ensureAuth')
const CommentsControllers = require('../controllers/CommentsControllers')
const commentsControllers = new CommentsControllers()

commentsRoutes.use(express.json())
commentsRoutes.use(ensureAuth)

commentsRoutes.post('/create/:post_id', commentsControllers.create)
commentsRoutes.patch('/update', commentsControllers.update)
commentsRoutes.delete('/delete', commentsControllers.delete)

module.exports = commentsRoutes