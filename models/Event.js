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

class EventModel {
    static async findAll(){
        try {
            return await Event.find().populate('creator').populate('participants.user').populate('sport')
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    static async findById(id){
        try {
            return await Event.findById().populate('creator').populate('participants.user').populate('sport')
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    static async findByIdAndUpdate(id, user){
        try {
            return await Event.findByIdAndUpdate(id, { $pull: { participants: { user: user } } },
                { new: true })
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
Event.EventModel = EventModel
module.exports = Event