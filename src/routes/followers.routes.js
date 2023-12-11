const express = require('express')
const followersRoutes = express()
const ensureAuth = require('../middleware/ensureAuth')
const FollowersControllers = require('../controllers/FollowersControllers')
const followersControllers = new FollowersControllers()
followersRoutes.use(express.json())
followersRoutes.use(ensureAuth)

followersRoutes.post('/follow/:id', followersControllers.follow )
followersRoutes.delete('/unfollow/:id', followersControllers.unFollow )
followersRoutes.get('/list', followersControllers.countFollowers)
followersRoutes.get('/followersinfo', followersControllers.listInfoFollowers) 


module.exports = followersRoutes