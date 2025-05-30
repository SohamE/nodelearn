const express = require("express");

const userRouter = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// Users route

userRouter.route("/signup").post(authController.userSignup);
userRouter.route("/login").post(authController.userLogin);

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
