const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .get(authController.protect, reviewController.getReviews);

reviewRouter
  .route("/")
  .post(authController.protect, reviewController.createReview);

module.exports = reviewRouter;
