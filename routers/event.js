const express = require('express')
const eventController = require('../controllers/eventController')
const eventRouter = express.Router()

eventRouter.post('/', eventController.addEvent)
module.exports = eventRouter