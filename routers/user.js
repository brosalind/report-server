const express = require('express')
const userRouter = express.Router()
const Controller = require('../controllers/userController')

userRouter.post('/', Controller.createUser)

module.exports = userRouter