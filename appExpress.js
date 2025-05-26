const dotenv = require("dotenv");
const myController = require("./myController");
dotenv.config();

const express = require("express");
const app = express();
app.get("/", myController.home);
app.get("/", (req, res) => {
  res.status(404).json("Not found");
});
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
