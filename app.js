const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require("./utils/appError");
const errorController = require("./controllers/errorController");

const express = require("express");
const app = express();
app.use(express.json());
// to server static files to client
app.use(express.static(`${__dirname}/public`));

// Custom middleware
app.use((req, res, next) => {
  console.log("Hello from the middleware");
  // Without the following the request - response cycle stops.
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("/*splat", (req, res, next) => {
  // res.json(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;

  // If we pass an parameter in next argument, express will consider it as error and call error middleware.
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// by passing 4 params in middleware, express takes it as a error handling middleware
app.use(errorController.handleError);

module.exports = app;
