const express = require('express')
const ratingRouter = express.Router()
const ratingController = require('../controllers/ratingController')
const { authentication } = require('../middlewares/authentication')

ratingRouter.post('/', authentication, ratingController.addRating)

module.exports = ratingRouter