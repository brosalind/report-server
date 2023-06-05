const mongoose = require('mongoose')

const RatingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        default: 0
    },
    currentGiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Rating = mongoose.model("Rating", RatingSchema)

module.exports = Rating