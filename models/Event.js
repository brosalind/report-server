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
        type: String
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
    sport: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Sport"
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        attended: {
            type: Boolean,
            default: false}
    }]
})

const Event = mongoose.model("Event", EventSchema)

module.exports = Event