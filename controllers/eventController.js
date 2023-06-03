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
            const allEvents = await Event.find().populate('creator').populate('participants.user')
            res.status(200).json(allEvents)
        } catch (err) {
            next(err)
        }
    }

    static async getMyEvents(req, res, next) {
        try {
            const myEvents = await Event.find({
                creator: req.user._id
            }).populate('creator').populate('participants.user')
            res.json(myEvents)
        } catch (err) {
            next(err)
        }
    }

    static async joinEvent(req, res, next) {
        try {
            const eventId = req.params.eventId

            const currentEvent = await Event.findById({
                _id: eventId
            })

            if(!currentEvent){
                throw {name: "notFound"}
            }

            currentEvent.participants.push({user: req.user._id})
    
            await currentEvent.save()

            const updatedEvent = await Event.findById({
                _id: eventId
            }).populate('creator').populate('participants.user')

            res.json(updatedEvent)

        } catch (err) {
            next(err)
        }
    }

    static async cancelEvent(req, res, next) {
        try {
            const eventId = req.params.eventId
            const deletedEvent = await Event.findOneAndRemove({
                _id: eventId
            })

            if (!deletedEvent) {
                throw { name: "notFound" }
            }
            res.json({ message: `${deletedEvent.title} was cancelled.` })

        } catch (err) {
            next(err)
        }
    }

    static async leaveEvent(req, res, next){
        try {
            const myEventId = req.params.myEventId

            const event = await Event.findByIdAndUpdate(
                myEventId,
                { $pull: {participants: {user: req.user}}},
                {new: true}
            ).populate('creator').populate('participants.user')

            if (!event) {
                throw { name: "notFound" }
            }

            res.json({message: `You have successfully leave ${event.title}`})
        } catch(err){
            next(err)
        }
    }

}

module.exports = eventController