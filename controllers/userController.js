const User = require("../models/User")
const bcrypt = require("bcryptjs");
const { signToken, verifyToken } = require("../helpers/jwt");

class Controller {
    static async createUser(req, res, next){
        try {
            const { name, username, email, password } = req.body

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw { name: "User already exist" }
            }

            const user = await User.create({
                name,
                username,
                email,
                password,
                role: "user",
                pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
                score: 0,
                rating: 0
            })

            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            console.error(error);
            next(error)
        }
    }

    static async userLogin(req, res, next) {
        try {
            const {email} = req.body
            const user = await User.findOne({ email })

            console.log(user)

            if (!user) {
                throw { name: 'userDoesNotExist' }
            } else {
                const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)

                if (!isPasswordValid) {
                    throw { name: `Invalid Login` }
                } else {
                    const access_token = signToken(
                        {
                            id: user._id,
                            email: user.email,
                        }
                    )
                    res.status(200).json(access_token)
                }
            }
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
}

module.exports = Controller