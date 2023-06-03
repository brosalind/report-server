const Event = require('../models/Event')

const deleteEventAuthorization = async (req, res, next) => {

    try {
        const foundEvent = await Event.findOne({
            _id: req.params.eventId
        })
        if(!foundEvent){
            throw {name: "notFound"}
        }
        if (!foundEvent.creator.equals(req.user._id)) {
            throw { name: 'Unauthorized' }
        } 
        next()
    }
    catch(err){
        next(err)
    }

}
module.exports = {deleteEventAuthorization}                                                      