const dotenv = require("dotenv");
const fs = require('fs');
const myController = require("./myController");
dotenv.config();

const express = require("express");
const app = express();
app.use(express.json());
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

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body};
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({ 
      status: 'success',
      data: {
        tour: newTour
      }
     })
  })
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
