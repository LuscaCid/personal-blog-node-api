const express =require('express')
const likesRoutes = express()
const ensureAuth = require('../middleware/ensureAuth')
const LikesControllers = require('../controllers/LikesControllers')
const likesControllers = new LikesControllers()

likesRoutes.use(express.json())
likesRoutes.use(ensureAuth)

likesRoutes.post('/like/', likesControllers.like)

likesRoutes.delete('/unlike', likesControllers.unlike)

likesRoutes.get('/check', likesControllers.checkIfWasLiked)


module.exports  = likesRoutes