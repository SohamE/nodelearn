const express = require("express");

const userRouter = express.Router();

const userController = require("../controllers/userController");

// Users route

userRouter.route("/signup").post(userController.userSignup);

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
