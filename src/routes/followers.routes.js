const express = require('express')
const followersRoutes = express()
const ensureAuth = require('../middleware/ensureAuth')
const FollowersControllers = require('../controllers/FollowersControllers')
const followersControllers = new FollowersControllers()
followersRoutes.use(express.json())
followersRoutes.use(ensureAuth)

followersRoutes.post('/follow/', followersControllers.follow )
followersRoutes.delete('/unfollow/', followersControllers.unFollow )
followersRoutes.get('/list', followersControllers.countFollowers)
followersRoutes.get('/followersinfo', followersControllers.listInfoFollowers) 
followersRoutes.get('/searchfollowers', followersControllers.searchFollowers)

module.exports = followersRoutes