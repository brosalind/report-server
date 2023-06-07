const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { signToken, verifyToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config({ path: "../.env" });
const Sport = require("../models/Sport");

class Controller {
  static async createUser(req, res, next) {
    try {
      const { name, username, gender, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw { name: "User already exists" };
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
        rating: 0,
      });

      const access_token = signToken({
        id: user._id,
        email: user.email,
      });

      res
        .status(201)
        .json({ message: "User created successfully", user, access_token });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async userLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "noEmail" };
      }
      if (!password) {
        throw { name: "noPassword" };
      }

      const findUser = await User.findOne({ email });

      if (!findUser) {
        throw { name: "userDoesNotExist" };
      } else {
        const isPasswordValid = bcrypt.compareSync(
          req.body.password,
          findUser.password
        );

        if (!isPasswordValid) {
          throw { name: `Invalid Login` };
        } else {
          const access_token = signToken({
            id: findUser._id,
            email: findUser.email,
          });
          const user = {
            id: findUser._id,
            name: findUser.name,
            username: findUser.username,
            gender: findUser.gender,
            email: findUser.email,
            role: findUser.role,
            pic: findUser.pic,
            score: findUser.score,
            rating: findUser.rating,
          };
          res.status(200).json({
            user,
            access_token: access_token,
          });
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { googletoken } = req.headers;
      const clientId = process.env.CLIENT_ID;
      console.log(clientId);
      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({
        idToken: googletoken,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      const email = payload.email;
      const name = payload.name;

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          email,
          name,
          password: "12345",
          gender: "male",
        });
      }
      const access_token = signToken({
        id: user.id,
        email: user.email,
      });

      const data = {
        id: user._id,
        email: user.email,
        score: user.score,
        username: user.username,
      };
      console.log(access_token, data);
      res.status(201).json({ access_token, data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getAllUser(req, res, next) {
    try {
      console.log("MASUKKKKKK");
      const users = await User.find();

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findOne({ _id: id });
      console.log(id, user, "<<");
      if (!user) {
        throw { name: "notFound" };
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async addUserSports(req, res, next) {
    try {
      const currentUser = await User.findById(req.user._id);

      const { sportList } = req.body;

      console.log(sportList);
      let result = [];
      await Promise.all(
        sportList.map(async (el) => {
          let sport = await Sport.find({ name: el.name });
          console.log(sport);
          let obj = {
            name: sport[0]._id,
            // level: el.isPressed,
          };
          result.push(obj);
        })
      );

      currentUser.sport = result;

      await currentUser.save();

      const currentUserUpdate = await User.findById(req.user._id).populate(
        "sport.name"
      );

      res.json({ currentUserUpdate });
    } catch (err) {
      next(err);
    }
  }

  static async editUserGenderProf(req, res, next) {
    try {
      let { gender, location } = req.body;
      let pic = req.file?.path;

      if (!pic || !pic.trim().length) {
        pic =
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
      }

      let newData = {
        pic,
      };

      if (gender) {
        newData.gender = gender;
      }

      if (location) {
        newData.location = location;
      }

      const update = {
        $set: newData,
      };
      const user = await User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        update
      );

      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async editUserProfile(req, res, next) {
    try {
      const update = {
        $set: {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          gender: req.body.gender,
          sportList: req.body.sportList,
          pic: req.path?.file,
        },
      };

      const user = await User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        update
      );

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
