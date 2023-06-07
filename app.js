require("dotenv").config({ path: ".env" });
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const router = require("./routers");

const cors = require("cors");
const { Server } = require("socket.io");
const handleSocket = require("./socket");
const server = require("http").createServer(app);

//const io = require("socket.io")(
//  server,
//  {
//    cors: {
//      origin: "*",
//      methods: ["GET", "POST"],
//    },
//  },
//  {
//    pingTimeout: 60000,
//  }
//);

const io = new Server(
  server,
  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  },
  {
    pingTimeout: 60000,
  }
);

// const Discussion = require('./models/Discussion')
// const Message = require('./models/Message')
// const User = require('./models/User')

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

//mongoose
//  .connect(process.env.DB_LINK)
//  .then(() => {
//    console.log("connected to db");
//    server.listen(port, () => {
//      console.log(`Example app listening on port ${port}`);
//    });
//  })
//  .catch((err) => {
//    console.log(err);
//  });

const onConnection = (socket) => {
  handleSocket(io, socket);
};

io.on("connection", onConnection);

// io.on("connection", (socket) => {
//   console.log("connected", socket.id)

//   socket.on("message-received", async (data) => {
//     try {
//       const doesDiscussionExist = await Discussion.find({ eventId: data.eventId })

//         const findUser = await User.find({ email: data.userEmail })

//         if (doesDiscussionExist.length > 1) {
//           const newMessage = await Message.create({
//             sender: findUser._id,
//             content: data.message,
//             discussion: doesDiscussionExist[0]._id
//           })
//         } else {
//           const newDiscussion = await Discussion.create({
//             eventId: data.eventId,
//             users: findUser._id
//           })
//           const newMessage = await Message.create({
//             sender: findUser._id,
//             content: data.message,
//             discussion: newDiscussion._id
//           })
//         }
//         socket.broadcast.emit("message-stored", data.message)
//       } catch (err) {
//         console.log(err)
//       }
//   })

//   socket.on('disconnect', () => {
//     console.log("disconnected")
//   })
// })

// module.exports = app

module.exports = { io, server };
