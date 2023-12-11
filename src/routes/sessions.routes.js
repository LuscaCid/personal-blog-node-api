const express = require('express')
const sessionsRoutes = express()
const SessionsControllers = require('../controllers/SessionsControllers')
const sessionsControllers = new SessionsControllers()

sessionsRoutes.use(express.json())

sessionsRoutes.post('/register', sessionsControllers.register)

sessionsRoutes.post('/', sessionsControllers.login)

module.exports = sessionsRoutes 