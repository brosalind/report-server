const express = require("express");
const userRouter = express.Router();
const Controller = require("../controllers/userController");
const { authentication } = require("../middlewares/authentication");

const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dxac9jx9p",
  api_key: "174134652753486",
  api_secret: "4RPErPs4Ay0-VUVUb4qtG1lEFE8",
});

const multer = require("multer");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Re-Port User Profile Folder",
    public_id: (req, file) => {
      const filename = file.originalname;
      const extension = path.extname(filename);
      return filename.slice(0, -extension.length);
    },
  },
});

const upload = multer({ storage: storage });

userRouter.post("/", Controller.createUser);
userRouter.post("/login", Controller.userLogin);
userRouter.post("/googleLogin", Controller.googleLogin);
userRouter.get("/data", Controller.getAllUser);
userRouter.put("/addSports", authentication, Controller.addUserSports);
userRouter.put(
  "/editGenderProf",
  upload.single("images"),
  authentication,
  Controller.editUserGenderProf
);
userRouter.put(
  "/editProfile",
  upload.single("images"),
  authentication,
  Controller.editUserProfile
);
userRouter.get("/data/:id", Controller.getUserById);
userRouter.post("/tes", upload.single("images"), (req, res) => {
  console.log(req.file);
  res.status(200).json(req.file.path);
});
module.exports = userRouter;
