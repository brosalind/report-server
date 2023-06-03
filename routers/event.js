const express = require('express')
const eventController = require('../controllers/eventController')
const eventRouter = express.Router()

eventRouter.post('/', eventController.addEvent)
eventRouter.get('/myevents', eventController.getMyEvents)
eventRouter.put('/:eventId', eventController.joinEvent)
module.exports = eventRouter