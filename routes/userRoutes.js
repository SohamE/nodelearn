const express = require("express");

const userRouter = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// Users route

userRouter.route("/signup").post(authController.userSignup);
userRouter.route("/login").post(authController.userLogin);

// After the following line all the defined routes will be protected using authcontroller.protect, as middleware work in sequence.
userRouter.use(authController.protect);

userRouter.get(
  "/me",
  // authController.protect,
  userController.getMe,
  userController.getUserById
);

userRouter.use(authController.restrictTo("admin"));
userRouter
  .route("/")
  .get(
    // authController.protect,
    userController.getAllUsers
  )
  .post(
    // authController.protect,
    userController.createUser
  );

userRouter
  .route("/:id")
  .get(
    // authController.protect,
    userController.getUserById
  )
  .patch(
    // authController.protect,
    userController.updateUser
  )
  .delete(
    // authController.protect,
    userController.deleteUser
  );

module.exports = userRouter;
