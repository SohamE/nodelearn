const express = require("express");
const tourRouter = express.Router();

const tourController = require("../controllers/tourController");

// only runs for if param id is present in route.
// This middleware will not run for any other routers such as userRouter, as it is only specified in tourRouter.
tourRouter.param("id", (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  next();
});

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

tourRouter
  .route("/:id")
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
