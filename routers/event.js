const express = require('express')
const eventController = require('../controllers/eventController')
const eventRouter = express.Router()
const {deleteEventAuthorization} = require('../middlewares/deleteEventAuthorization')
const { leaveEventAuthorization } = require('../middlewares/leaveEventAuthorization')


eventRouter.post('/', eventController.addEvent)
eventRouter.get('/myevents', eventController.getMyEvents)
eventRouter.put('/:eventId', eventController.joinEvent)
eventRouter.delete('/:eventId', deleteEventAuthorization, eventController.cancelEvent)
eventRouter.put('/:myEventId/leave',leaveEventAuthorization, eventController.leaveEvent)
module.exports = eventRouter