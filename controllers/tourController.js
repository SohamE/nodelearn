const Tour = require("../models/tourModel");
const { catchAsync } = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const getAllTours = catchAsync(async (req, res, next) => {
  const queryObject = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObject[el]);
  const tours = await Tour.find({ ...req.query });
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

const getTourById = factory.getOne(Tour, "reviews");

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create({
    ...req.body,
  });

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
const deleteTour = factory.deleteOne(Tour);

const getTourStats = async (req, res) => {
  try {
    const tourStats = await Tour.aggregate([
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRating: { $sum: "$ratingQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { numTours: -1 },
      },
    ]);
    console.log(tourStats);
    res.status(200).json({
      status: "success",
      data: {
        status: tourStats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
};
