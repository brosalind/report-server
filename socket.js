const Discussion = require("./models/Discussion");
const Message = require("./models/Message");
const User = require("./models/User");

module.exports = (io, socket) => {
  socket.on("message:send", (payload) => {
    console.log(payload, "here");
    socket.emit("message:send", payload);
  });

  socket.on("message-received", async (data) => {
    try {
      const doesDiscussionExist = await Discussion.find({
        eventId: new Object(data.eventId),
      });

      const findUser = await User.find({ email: data.userEmail });

      if (doesDiscussionExist.length > 1) {
        const newMessage = await Message.create({
          sender: findUser._id,
          content: data.message,
          discussion: doesDiscussionExist[0]._id,
        });
      } else {
        const newDiscussion = await Discussion.create({
          eventId: data.eventId,
          users: findUser._id,
        });
        const newMessage = await Message.create({
          sender: findUser._id,
          content: data.message,
          discussion: newDiscussion._id,
        });
      }

      // kalo pake socket.broadcast.emit sender tidak dapat broadcast jadi di testing tidak dapat di expect. jadi sementara diganti jadi pake io.emit agar sender dapat broadcast. mungkin di client perlu penyesuaian. ref: https://socket.io/docs/v4/emit-cheatsheet/
      io.emit("message-stored", data.message);
    } catch (err) {
      console.log(err, "here");
    }
  });
};
