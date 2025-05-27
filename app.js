const dotenv = require("dotenv");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
dotenv.config();

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

module.exports = app;