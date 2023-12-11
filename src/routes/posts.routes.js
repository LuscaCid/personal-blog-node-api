const express = require('express')
const PostsControllers = require('../controllers/PostsControllers')
const postsControllers = new PostsControllers()
const ImagesControllers = require('../controllers/ImagesControllers')
const imagesControllers = new ImagesControllers()

const ensureAuth = require('../middleware/ensureAuth')
const multer = require('multer')
const UploadsConfigs = require('../configs/UploadsConfigs')
const upload = multer(UploadsConfigs.MULTER)

const postsRoutes = express()
postsRoutes.use(express.json())
postsRoutes.use(ensureAuth)

postsRoutes.post('/create', postsControllers.create)
postsRoutes.post('/upload', ensureAuth, upload.single('post'), imagesControllers.postContent)

postsRoutes.get("/postsview", postsControllers.viewAll)//self posts

postsRoutes.get('/inside', postsControllers.viewInsideMoreInfo)

postsRoutes.get('/feed', postsControllers.feed)

postsRoutes.put('/update/:post_id', postsControllers.update)
module.exports = postsRoutes