const express = require("express");
const tourRouter = express.Router();

const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

// only runs for if param id is present in route.
// This middleware will not run for any other routers such as userRouter, as it is only specified in tourRouter.
tourRouter.param("id", (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  next();
});

tourRouter
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

tourRouter
  .route("/:tourId/reviews")
  .post(authController.protect, reviewController.createReview);

tourRouter.route("/tour-stats").get(tourController.getTourStats);

tourRouter
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.getTourById
  )
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.deleteTour
  );

module.exports = tourRouter;
