require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const router = require('./routers')
const cors = require('cors')
const socket = require('socket.io')
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
}, {
  pingTimeout: 60000,
}
)

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(router)

mongoose.connect(process.env.DB_LINK).then(() => {
  console.log("connected to db")
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch((err) => {
  console.log(err)
})


io.on("connection", (socket) => {
  console.log("connected", socket.id)

  socket.on('disconnect', () => {
    console.log("disconnected")
  })
})

module.exports = app