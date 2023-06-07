const Event = require('../models/Event')

const leaveEventAuthorization = async (req, res, next) => {

    try {
        const foundEvent = await Event.findById(req.params.myEventId).elemMatch('participants', {user: {$eq: req.user}})
        console.log(req.params.myEventId, req.user)
        if (!foundEvent) {
            throw { name: "Unauthorized" }
        } 
        next()
    }
    catch(err){
        next(err)
    }

}
module.exports = {leaveEventAuthorization}                                                      