require('dotenv').config({path:'.env'})
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const {server} = require('../app')


mongoose.connect(process.env.DB_LINK).then(() => {
  console.log("connected to db")
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch((err) => {
  console.log(err)
})
