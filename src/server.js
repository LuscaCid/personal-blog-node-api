require('express-async-errors')
require('dotenv').config()
const UploadsConfigs = require('./configs/UploadsConfigs')
const AppError = require('./utils')//only apperror to trate the exceptions
const cors = require('cors')
const express = require('express')
const application = express()
const Routes = require('./routes')
application.use(express.json())
application.use(cors())
application.use(Routes)

application.use('/files', express.static( UploadsConfigs.UPLOADS_FOLDER ))

const port = process.env.PORT || 3000 //importing the process...

application.use((error, request, response, next) => {
    if(error instanceof AppError){
        return response.status(error.status).json({
            message : error.message,
            status : error.status
        })
    }
    console.error(error)
    return response.status(500).json({
        message : "internal server",
        status : 500
    })
})

//at least we have to made the services and repositories

application.listen(port, ()=> console.log(`Server is running on ${port}`) )