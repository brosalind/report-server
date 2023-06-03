const Event = require('../models/Event')
const {formatPrice} = require('../helpers/formatPrice')

class eventController{
    static async addEvent(req, res, next){
        try {
            const {title, location, date, courtPrice, limitParticipants} = req.body

            let expectedPrice = `${formatPrice(courtPrice/limitParticipants)} - ${formatPrice(courtPrice)}`

            const newEvent = await Event.create({
                title: title,
                location: location,
                date: date,
                courtPrice: courtPrice,
                expectedPrice: expectedPrice,
                limitParticipants: limitParticipants,
                totalParticipants: 1,
                status: 'Open',
                creator: new Object("6478754b9bcd503c8327a81b")
            })

            res.status(201).json(newEvent)
            
        } catch (err) {
            next(err)
            
        }
    }

}

module.exports = eventController