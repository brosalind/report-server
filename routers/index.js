const express = require('express')
const router = express.Router()
const userRouter = require('../routers/user')
const eventRouter = require('../routers/event')
const {errorHandler} = require('../middlewares/errorHandler')

router.use('/user', userRouter)
router.use('/event', eventRouter)
router.use(errorHandler)
module.exports = router ,userRouter, eventRouter