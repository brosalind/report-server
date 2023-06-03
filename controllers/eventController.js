const Event = require('../models/Event')
const { formatPrice } = require('../helpers/formatPrice')

class eventController {
    static async addEvent(req, res, next) {
        try {
            const { title, location, date, courtPrice, limitParticipants } = req.body

            let expectedPrice = `${formatPrice(courtPrice / limitParticipants)} - ${formatPrice(courtPrice)}`

            const newEvent = await Event.create({
                title: title,
                location: location,
                date: date,
                courtPrice: courtPrice,
                expectedPrice: expectedPrice,
                limitParticipants: limitParticipants,
                totalParticipants: 1,
                status: 'Open',
                creator: req.user._id
            })
            res.status(201).json(newEvent)
        } catch (err) {
            next(err)
        }
    }

    static async getAllEvents(req, res, next) {
        try {
            const allEvents = await Event.find().populate('creator')
            res.status(200).json(allEvents)
        } catch (err) {
            next(err)
        }
    }

    static async getMyEvents(req, res, next) {
        try {
            const myEvents = await Event.find({
                creator: req.user._id
            }).populate('creator')
            res.json(myEvents)
        } catch (err) {
            next(err)
        }
    }

    static async joinEvent(req, res, next){
        try {
            const {eventId} = req.params.eventId 

            const newParticipant = req.user 


        }catch(err){
            next(err)
        }
    }

}

module.exports = eventController