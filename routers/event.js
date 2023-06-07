const express = require('express')
const eventController = require('../controllers/eventController')
const eventRouter = express.Router()
const {deleteEventAuthorization} = require('../middlewares/deleteEventAuthorization')
const { leaveEventAuthorization } = require('../middlewares/leaveEventAuthorization')
const { authentication } = require('../middlewares/authentication')


eventRouter.post('/', eventController.addEvent)
eventRouter.get('/myevents', eventController.getMyEvents)
eventRouter.put('/:eventId', authentication, eventController.joinEvent)
eventRouter.get('/:eventId', eventController.getEventDetails)
eventRouter.delete('/:eventId', deleteEventAuthorization, eventController.cancelEvent)
eventRouter.patch('/:eventId', deleteEventAuthorization, eventController.closeEvent)
eventRouter.patch('/:id', deleteEventAuthorization, eventController.startEvent)
eventRouter.put('/:myEventId/leave',leaveEventAuthorization, eventController.leaveEvent)
module.exports = eventRouter