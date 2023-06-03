const express = require('express')
const eventController = require('../controllers/eventController')
const eventRouter = express.Router()
const {authorization} = require('../middlewares/authorization')

eventRouter.post('/', eventController.addEvent)
eventRouter.get('/myevents', eventController.getMyEvents)
eventRouter.put('/:eventId', eventController.joinEvent)
eventRouter.delete('/:eventId', authorization, eventController.cancelEvent)
module.exports = eventRouter