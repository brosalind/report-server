const Rating = require('../models/Rating')
const User = require('../models/User')

class ratingController {
    static async addRating(req, res, next) {
        try {
            const { userId, rating } = req.body;
            const currentGiverId = req.user._id;

            await Rating.create({
                userId: userId,
                rating: rating,
                currentGiverId: currentGiverId
            })

            const userRatings = await Rating.find({ userId: userId });

            const totalRating = userRatings.reduce((sum, rating) => sum + rating.rating, 0);
            const ratingLength = userRatings.length;
            const newRating = totalRating / ratingLength

            const ratedUser = await User.findOne({ _id: userId });
            if (!ratedUser) {
                throw { name: 'notFound' }
            }

            ratedUser.rating = newRating;
            await ratedUser.save();

            res.status(200).json({ message: 'Rating added successfully' });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = ratingController