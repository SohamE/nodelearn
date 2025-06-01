const express = require("express");
const tourRouter = express.Router();

const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes");

// only runs for if param id is present in route.
// This middleware will not run for any other routers such as userRouter, as it is only specified in tourRouter.
tourRouter.param("id", (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  next();
});

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );

// Same piece of code is defined in routeController as well, hence duplicate code is not required.
// tourRouter
//   .route("/:tourId/reviews")
//   .post(authController.protect, reviewController.createReview);
// use the following
tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter.route("/tour-stats").get(tourController.getTourStats);

tourRouter
  .route("/:id")
  .get(tourController.getTourById)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.deleteTour
  );

module.exports = tourRouter;
