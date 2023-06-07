const express = require('express')
const eventController = require('../controllers/eventController')
const discussionRouter = express.Router()

discussionRouter.get('/:id', eventController.getDiscussion)

module.exports = discussionRouter