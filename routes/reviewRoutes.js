const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const reviewRouter = express.Router({
  mergeParams: true, // each route has access to their our route params
});

reviewRouter
  .route("/") // here we don't have access to the tourId param even though we are adding the middleware in tourRoutes. To enable that access use mergeParams.
  .get(authController.protect, reviewController.getReviews);

reviewRouter
  .route("/")
  .post(authController.protect, reviewController.createReview);

module.exports = reviewRouter;
