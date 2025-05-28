const Tour = require("../models/tourModel");

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findOne({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create({
      ...req.body,
    });

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      {
        returnDocument: "after",
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
const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findOneAndDelete({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      data: {
        tour: deletedTour,
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
};
