// require('dotenv').config({path:'.env'})
// const port = process.env.PORT || 3000
// const mongoose = require('mongoose');
// const {server} = require('../app')


// mongoose.connect(process.env.DB_LINK).then(() => {
//   console.log("connected to db")
//   server.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
//   })
// }).catch((err) => {
//   console.log(err)
// })

const mongoose = require("mongoose");
const { server } = require("../app");
const port = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://chris:qwe123asd@chris.fzatjb9.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to db");
    server.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });