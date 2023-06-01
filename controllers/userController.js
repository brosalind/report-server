const User = require("../models/User")

class Controller {
    static async createUser(req, res, next){
        try {
            const { name, username, email, password, role, pic, score, rating } = req.body

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw { name: "User already exist" }
            }

            const user = await User.create({
                name,
                username,
                email,
                password,
                role,
                pic,
                score,
                rating
            })

            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            console.error(error);
            next(error)
        }
    }
}

module.exports = Controller