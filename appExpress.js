const dotenv = require("dotenv");
const fs = require('fs');
const myController = require("./myController");
dotenv.config();

const express = require("express");
const app = express();
// app.get("/", myController.home);
// app.get("/", (req, res) => {
//   res.status(404).json("Not found");
// });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})


app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
