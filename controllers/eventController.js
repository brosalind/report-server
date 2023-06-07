const Event = require('../models/Event')
const { formatPrice } = require('../helpers/formatPrice')
const Sport = require('../models/Sport')
// const {EventModel} = require('../models/Event')

class eventController {
    static async addEvent(req, res, next) {
        try {
            const { title, location, date, courtPrice, limitParticipants, sport } = req.body

            let expectedPrice = `${formatPrice(courtPrice / limitParticipants)} - ${formatPrice(courtPrice)}`

            let sportInfo = await Sport.findOne({ name: sport })

            if (!sportInfo) {
                let newSport = await Sport.create({ name: sport })
                let sportId = newSport._id

                const newEvent = await Event.create({
                    title: title,
                    location: location,
                    date: date,
                    courtPrice: courtPrice,
                    expectedPrice: expectedPrice,
                    limitParticipants: limitParticipants,
                    totalParticipants: 1,
                    status: 'Open',
                    creator: req.user._id,
                    sport: sportId
                })
                res.status(201).json(newEvent)
            } else {
                let sportId = sportInfo._id
                const newEvent = await Event.create({
                    title: title,
                    location: location,
                    date: date,
                    courtPrice: courtPrice,
                    expectedPrice: expectedPrice,
                    limitParticipants: limitParticipants,
                    totalParticipants: 1,
                    status: 'Open',
                    creator: req.user._id,
                    sport: sportId
                })

                res.status(201).json(newEvent)
            }
        } catch (err) {
            next(err)
        }
    }

    static async getAllEvents(req, res, next) {
        try {
            const allEvents = await Event.EventModel.findAll()
            
            res.status(200).json(allEvents)
        } catch (err) {
            next(err)
        }
    }

    static async getMyEvents(req, res, next) {
        try {
            const upcomingEvents = await Event.find({
                $and: [
                    {
                        $or: [
                            { creator: req.user._id },
                            {
                                participants: {
                                    $elemMatch: {
                                        user: req.user._id.toString()
                                    }
                                }
                            }
                        ]

                    },
                    {
                        $or: [
                            { status: 'Open' },
                            { status: 'Ongoing' }
                        ]
                    }
                ]
            }).populate('creator').populate('participants.user').populate('sport')

            const previousEvents = await Event.find({
                $and: [
                    {
                        $or: [
                            { creator: req.user._id },
                            {
                                participants: {
                                    $elemMatch: {
                                        user: req.user._id.toString()
                                    }
                                }
                            }
                        ]

                    },
                    {
                        status: "Closed"
                    }
                ]
            }).populate('creator').populate('participants.user').populate('sport')

            res.json({ upcomingEvents: upcomingEvents, previousEvent: previousEvents })
        } catch (err) {
            next(err)
        }
    }

    static async getEventDetails(req, res, next) {
        try {
            const eventId = req.params.eventId
            const selectedEvent = await Event.EventModel.findById({
                _id: eventId
            })
            
            // Event.populate('creator').populate('participants.user').populate('sport')
            res.status(200).json(selectedEvent)
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

            if (!currentEvent) {
                throw { name: "notFound" }
            }

            const isUserAlreadyAParticipant = currentEvent.participants.find(user => user = req.user._id)
            if (isUserAlreadyAParticipant) {
                throw { name: "alreadyJoined" }
            }

            if (currentEvent.creator.equals(req.user._id)) {
                throw { name: "participantCreator" }
            }


            if (currentEvent.totalParticipants === currentEvent.limitParticipants) {
                throw { name: "eventFull" }
            }
            currentEvent.participants.push({ user: req.user._id })

            await currentEvent.save()

            let newTotalParticipants = currentEvent.totalParticipants + 1
            let newExpectedPrice = `${formatPrice(currentEvent.courtPrice / newTotalParticipants)} - ${formatPrice(currentEvent.courtPrice)}`

            const update = {
                $set: {
                    totalParticipants: newTotalParticipants,
                    expectedPrice: newExpectedPrice
                }
            }
            const updateEvent = await Event.findOneAndUpdate({
                _id: eventId
            }, update)


            const updatedEvent = await Event.findById({
                _id: eventId
            }).populate('creator').populate('participants.user').populate('sport')


            res.json(updatedEvent)

        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static async cancelEvent(req, res, next) {
        try {
            const eventId = req.params.eventId
            const deletedEvent = await Event.findOneAndRemove({
                _id: eventId
            })

            res.json({ message: `${deletedEvent.title} was cancelled.` })

        } catch (err) {
            console.log(err, "INI CANCEL ERROR")
            next(err)
        }
    }

    static async leaveEvent(req, res, next) {
        console.log('pass');
        try {
            const myEventId = req.params.myEventId

            const event = await Event.EventModel.findByIdAndUpdate(
                myEventId, req.user
            )
            
            // .populate('creator').populate('participants.user').populate('sport')

            // if (!event) {
            //     throw { name: "notFound" }
            // }

            let newTotalParticipant = event.totalParticipants - 1
            let newExpectedPrice = `${formatPrice(event.courtPrice / newTotalParticipant)} - ${formatPrice(event.courtPrice)}`

            const update = {
                $set: {
                    totalParticipants: newTotalParticipant,
                    expectedPrice: newExpectedPrice
                }
            }
            const updateEvent = await Event.findOneAndUpdate({
                _id: myEventId
            }, update)

            res.json({ message: `You have successfully leave ${updateEvent.title}` })
        } catch (err) {
            console.log(err, 'Ini ERROR LEAVE')
            next(err)
        }
    }

    static async closeEvent(req, res, next) {
        try {
            const eventId = req.params.eventId

            const currentEvent = await Event.findById({
                _id: eventId
            })

            if (currentEvent.status === 'Close') {
                throw { name: "alreadyClose" }
            }

            const update = {
                $set: {
                    status: 'Close',
                }
            }
            const updateEventStatus = await Event.findOneAndUpdate({
                _id: eventId
            }, update)


            const updatedEvent = await Event.findById({
                _id: eventId
            }).populate('creator').populate('participants.user').populate('sport')


            res.json(updatedEvent)

        } catch (err) {
            next(err)
        }
    }

    static async startEvent(req, res, next) {
        try {
            const eventId = req.params.eventId
            
            const currentEvent = await Event.findById({
                _id: eventId
            })
            // console.log(currentEvent)
            
            if (currentEvent.status === 'Close') {
                throw { name: "alreadyClose" }
            }
            
            const update = {
                $set: {
                    status: 'Ongoing',
                }
            }
            console.log("WOI")
            
            const updateEventStatus = await Event.findOneAndUpdate({
                _id: eventId
            }, update)


            const updatedEvent = await Event.findById({
                _id: eventId
            }).populate('creator').populate('participants.user').populate('sport')


            res.json(updatedEvent)

        } catch (err) {
            next(err)
        }
    }

}

module.exports = eventController