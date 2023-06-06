const express = require('express')
const userRouter = express.Router()
const Controller = require('../controllers/userController')

userRouter.post('/', Controller.createUser)
userRouter.post('/login', Controller.userLogin)
userRouter.post('/googleLogin', Controller.googleLogin)
userRouter.get('/data', Controller.getAllUser)
userRouter.get('/data/:id', Controller.getUserById)

module.exports = userRouter