require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const router = require('./routers')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(router)


mongoose.connect(process.env.DB_LINK).then(() => {
  console.log("connected to db")
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch((err) => {
  console.log(err)
})