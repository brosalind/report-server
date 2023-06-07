const mongoose = require("mongoose");
const { server } = require("../app");
const port = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://benitajenniefer:CSbd0r5HgFjDSF15@project.gvpxier.mongodb.net/reporttest?retryWrites=true&w=majority"
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