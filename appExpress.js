const dotenv = require("dotenv");
const myController = require("./myController");
dotenv.config();

const express = require("express");
const app = express();
app.use(express.json());

// Custom middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  // Without the following the request - response cycle stops.
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// GET Method
// app.get("/api/v1/tours", myController.getAllTours);
// app.get("/api/v1/tours/:id", myController.getTourById);

// POST Method
// app.post("/api/v1/tours", myController.createTour);

// Patch Method
// app.patch("/api/v1/tours/:id", myController.updateTour);

// Delete Method
// app.delete("/api/v1/tours/:id", myController.deleteTour);

app
  .route("/api/v1/tours")
  .get(myController.getAllTours)
  .post(myController.createTour);

app
  .route("/api/v1/tours/:id")
  .get(myController.getTourById)
  .patch(myController.updateTour)
  .delete(myController.deleteTour);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
