const mongoose = require('mongoose')

const EventSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    location: {
        type: String
    },
    date: {
        type: Date
    },
    courtPrice: {
        type: Number
    },
    expectedPrice: {
        type: String
    },
    status: {
        type: String,
        default: 'Open'
    },
    limitParticipants: {
        type: Number
    },
    totalParticipants:{
        type: Number,
        default: 1
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
})

const Event = mongoose.model("Event", EventSchema)

module.exports = Event