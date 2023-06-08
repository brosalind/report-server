const jwt = require("jsonwebtoken");
const { verifyToken } = require("../helpers/jwt");
const User = require("../models/User");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    // console.log(access_token, "<<token");

    if (!access_token) {
      throw { name: "Unauthorized" };
    } else {
      const decodeToken = verifyToken(access_token);

      const userDatabase = await User.findById(decodeToken.id);

      if (!userDatabase) {
        throw { name: "Unauthorized" };
      } else {
        req.user = userDatabase;
        next();
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { authentication };
