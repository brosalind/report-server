const User = require("../models/User")
const bcrypt = require("bcryptjs");
const { signToken, verifyToken } = require("../helpers/jwt");
const { OAuth2Client } = require('google-auth-library')
require('dotenv').config({path:'../.env'})
const Sport = require('../models/Sport')

class Controller {
    
    static async createUser(req, res, next) {
        try {
            const { name, username, gender, email, password } = req.body

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw { name: "User already exist" }
            }

            const user = await User.create({
                name,
                username,
                gender,
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
            const { email, password } = req.body

            if (!email) {
                throw { name: 'noEmail' }
            }
            if (!password) {
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
                    res.status(200).json({
                        name: findUser.name,
                        username: findUser.username,
                        gender: findUser.gender,
                        email: findUser.email,
                        role: findUser.role,
                        pic: findUser.pic,
                        score: findUser.score,
                        rating: findUser.rating,
                        access_token: access_token
                    })
                }
            }
        } catch (err) {
            next(err)
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const { googletoken } = req.headers
            const clientId = process.env.CLIENT_ID
            console.log(clientId);
            const client = new OAuth2Client(clientId);
            const ticket = await client.verifyIdToken({
                idToken: googletoken,
                requiredAudience: clientId
            });
            const payload = ticket.getPayload();
            const email = payload.email
            const name = payload.name

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    email,
                    name,
                    password: "12345",
                    gender: 'male'
                });
            }
            const access_token = signToken(
                {
                    id: user.id,
                    email: user.email,
                }
            )
            res.json(
                access_token,
            )

        } catch (error) {
            console.log(error)
            next(error)
        }
    }


    static async getAllUser(req, res, next) {
        try {
            console.log("MASUKKKKKK")
            const users = await User.find();

            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static async getUserById(req, res, next) {
        try {
            console.log("MASUK")
            const { id } = req.params;

            const user = await User.findOne({ _id: id });

            if (!user) {
                throw { name: 'notFound' };
            }

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    static async addUserSports(req, res, next){
        try {
            const currentUser = await User.findById(req.user._id)
        
            const {sportList} = req.body 

            let result = []
            const sports = await Promise.all(sportList.map(async (el) => {

                let sport = await Sport.find({name: el.name})   
                
                let obj = {
                    name: sport[0]._id,
                    level: el.level
                }
                result.push(obj)
                return result

            }))

            currentUser.sport = result

            await currentUser.save()

            const currentUserUpdate = await User.findById(req.user._id).populate('sport.name')

            res.json({ currentUserUpdate})

        } catch(err){
            next(err)
        }
    }


    static async editUserGenderProf(req, res, next){
        try {

            const {pic, gender} = req.body

            if(!req.body.pic.length || !req.body.pic.trim().length){
                pic = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
            }

            const update = {
                $set: {
                    gender: gender,
                    pic: pic
                }
            }
            const user = await User.findOneAndUpdate({
                _id: req.user._id
            }, update)

            res.json(user)

        } catch(err){
            next(err)
        }

    }


    static async editUserProfile(req, res, next){
        try {
            const update = {
                $set: {
                    name: req.body.name,
                    username: req. body.username,
                    email: req.body.email, 
                    gender: req.body.gender,
                    sportList: req.body.sportList,
                    pic: req.body.pic
                }
            }

            const user = await User.findOneAndUpdate({
                _id: req.user._id
            }, update)

            res.json(user)

        } catch(err){
            next(err)
        }
    }
}

module.exports = Controller