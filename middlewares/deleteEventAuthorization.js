const Event = require('../models/Event')

const deleteEventAuthorization = async (req, res, next) => {

    try {
        const foundEvent = await Event.findOne({
            _id: req.params.eventId
        })
        // console.log(foundEvent)
        // console.log(foundEvent, "MASUK DELETE")
        if(!foundEvent){
            console.log("EVENTNYA GAK ADA BRO")
            throw {name: "notFound"}
        }
        if (!foundEvent.creator.equals(req.user._id)) {
            throw { name: 'Unauthorized' }
        } 
        console.log('pass');
        next()
    }
    catch(err){
        next(err)
    }

}
module.exports = {deleteEventAuthorization}                                                      