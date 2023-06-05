const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            trim: true
        },
        discussion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Discussion"
        }
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema)
module.exports = Message