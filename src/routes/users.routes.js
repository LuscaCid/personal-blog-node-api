const express = require('express')
const userRoutes = express()
const UserControllers = require('../controllers/UserControllers')
const userControllers = new UserControllers()
const ImagesControllers = require('../controllers/ImagesControllers')
const imagesControllers = new ImagesControllers()

const UploadsConfigs = require('../configs/UploadsConfigs')
const multer = require('multer')
const upload = multer(UploadsConfigs.MULTER)

const ensureAuthenticated = require('../middleware/ensureAuth')
userRoutes.use(express.json())
userRoutes.use(ensureAuthenticated)

userRoutes.post('/update', userControllers.update)

userRoutes.patch('/avatar',ensureAuthenticated , upload.single('avatar'), imagesControllers.updateFile)

userRoutes.post('/upload', ensureAuthenticated, upload.single('post'), imagesControllers.postContent)
module.exports = userRoutes
