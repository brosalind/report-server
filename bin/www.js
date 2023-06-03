const { default: mongoose } = require("mongoose");
const app = require("../app");
const port = process.env.PORT || 3000

mongoose.connect("mongodb+srv://chris:qwe123asd@chris.fzatjb9.mongodb.net/?retryWrites=true&w=majority").then(() => {
    console.log("connected to db")
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  }).catch((err) => {
    console.log(err)
  })
