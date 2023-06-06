const mongoose = require('mongoose')

const sportSchema = mongoose.Schema({
    name: {
        type: String, 
        default: true
    },
})

const Sport = mongoose.model("Sport", sportSchema)

module.exports = Sport