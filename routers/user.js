const express = require('express')
const userRouter = express.Router()
const Controller = require('../controllers/userController')
const { authentication } = require('../middlewares/authentication')


userRouter.post('/', Controller.createUser)
userRouter.post('/login', Controller.userLogin)
userRouter.post('/googleLogin', Controller.googleLogin)
userRouter.put('/addSports', authentication, Controller.addUserSports)
userRouter.put('/editGenderProf', authentication, Controller.editUserGenderProf)
userRouter.put('/editProfile', authentication, Controller.editUserProfile)
module.exports = userRouter