const User = require("../models/User")
const bcrypt = require("bcryptjs");
const { signToken, verifyToken } = require("../helpers/jwt");
const { OAuth2Client } = require('google-auth-library')

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

            const access_token = signToken(
                {
                    id: user._id,
                    email: user.email,
                }
            )

            res.status(201).json({ message: 'User created successfully', user, access_token });
        } catch (error) {
            console.error(error);
            next(error)
        }
    }

    static async userLogin(req, res, next) {
        try {
            const {email, password} = req.body

            if(!email){
                throw { name: 'noEmail' }
            }
            if(!password){
                throw { name: 'noPassword' }
            }

            const findUser = await User.findOne({ email })

            if (!findUser) {
                throw { name: 'userDoesNotExist' }
            } else {
                const isPasswordValid = bcrypt.compareSync(req.body.password, findUser.password)

                if (!isPasswordValid) {
                    throw { name: `Invalid Login` }
                } else {
                    const access_token = signToken(
                        {
                            id: findUser._id,
                            email: findUser.email,
                        }
                    )
                    res.status(200).json(access_token)
                }
            }
        } catch (err) {
            next(err)
        }
    }

    static async googleLogin(req, res, next){

    }
}

module.exports = Controller