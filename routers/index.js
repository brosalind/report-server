const express = require('express')
const router = express.Router()
const userRouter = require('../routers/user')
const eventRouter = require('../routers/event')
const {errorHandler} = require('../middlewares/errorHandler')
const {authentication} = require('../middlewares/authentication')
const eventController = require('../controllers/eventController')

router.use('/user', userRouter)
router.get('/eventlist', eventController.getAllEvents)
router.use('/event', authentication, eventRouter)
router.use(errorHandler)
module.exports = router ,userRouter, eventRouter