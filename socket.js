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
        console.log("here?")
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
      io.emit("message-stored", data.message);
    } catch (err) {
      console.log(err, "here");
    }
  });
};
// const Discussion = require('./models/Discussion')
// const Message = require('./models/Message')
// const User = require('./models/User')

// function handleSocket(io, socket){
//         console.log("connected", socket.id)

//         socket.on("message-received", async (data) => {
//           console.log("masuk", data)
//           try {
            
//             const doesDiscussionExist = await Discussion.find({ eventId: new Object(data.eventId) })
        
//               const findUser = await User.find({ email: data.userEmail })

//               if (doesDiscussionExist.length > 1) {
//                 const newMessage = await Message.create({
//                   sender: findUser?.[0]?._id,
//                   content: data.message,
//                   discussion: doesDiscussionExist[0]._id
//                 })
   
//               } else {
//                 const newDiscussion = await Discussion.create({
//                   eventId: data.eventId,
//                   users: findUser?.[0]?._id
//                 })
//                 const newMessage = await Message.create({
//                   sender: findUser?.[0]?._id,
//                   content: data.message,
//                   discussion: newDiscussion._id
//                 })
//               }
//               console.log("fin sebelum emit")
//               socket.broadcast.emit("message-stored", data.message)
//             } catch (err) {
//               console.log(err)
//             }   
//         })
      
//         // socket.on('disconnect', () => {
//         //   // console.log("disconnected")
//         // })

// }

// module.exports = {handleSocket}