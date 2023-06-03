const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    username: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true 
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        uniqueCaseInsensitive: true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
          }
      },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        default: 'user'
    },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    score: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    gender: {
        type: String,
        required: [true, "Gender is required"]
    }
})

UserSchema.plugin(uniqueValidator, {message: "Email is already in use. Please use another one or login with your current account."});

UserSchema.pre('save', async function(next) {
    let user = this;

    if (!user.isModified('password')) {
        next()
    }

    const salt = bcrypt.genSaltSync(10)
    user.password = bcrypt.hashSync(user.password, salt)

})
const User = mongoose.model("User", UserSchema)

module.exports = User