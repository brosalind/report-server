const express = require('express')
const userRouter = express.Router()
const Controller = require('../controllers/userController')
const { authentication } = require('../middlewares/authentication')


userRouter.post('/', Controller.createUser)
userRouter.post('/login', Controller.userLogin)
userRouter.post('/googleLogin', Controller.googleLogin)
userRouter.get('/data', Controller.getAllUser)
userRouter.put('/addSports', authentication, Controller.addUserSports)
userRouter.put('/editGenderProf', authentication, Controller.editUserGenderProf)
userRouter.put('/editProfile', authentication, Controller.editUserProfile)
userRouter.get('/data/:id', Controller.getUserById)
module.exports = userRouter