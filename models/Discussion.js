const mongoose = require("mongoose");

const discussionSchema = mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    },
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    }
  },
  { timestamps: true }
)

const Discussion = mongoose.model("Discussion", discussionSchema)

module.exports = Discussion