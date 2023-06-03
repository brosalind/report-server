const express = require('express')
const router = express.Router()
const userRouter = require('../routers/user')
const eventRouter = require('../routers/event')
const {errorHandler} = require('../middlewares/errorHandler')
const {authentication} = require('../middlewares/authentication')

router.use('/user', userRouter)
router.use('/event', authentication, eventRouter)
router.use(errorHandler)
module.exports = router ,userRouter, eventRouter