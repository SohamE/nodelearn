const fs = require("fs");

const home = (req, res) => {
  res.status(200).send("Home");
};


const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
}

const getTourById = (req, res) => {
  console.log(req.params);
  const tour = tours.filter((tour) => tour.id == req.params.id);
  if (tour.length == 0) {
    res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  }
}

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
}

const updateTour = (req, res) => {};
const deleteTour = (req, res) => {};


module.exports = {
  home,
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
};
