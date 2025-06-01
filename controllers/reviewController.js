const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");

const getReviews = async (req, res) => {
  try {
    const { tourId } = req.params;
    const reviews = await Review.find({ tour: tourId });
    res.status(200).json({
      status: "success",
      data: {
        reviews,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err,
    });
  }
};

const createReview = async (req, res) => {
  try {
    const { review, rating } = req.body;

    const { tourId } = req.params;
    const { _id } = req.user;
    const newReview = await Review.create({
      review,
      rating,
      createdAt: Date.now(),
      tour: tourId,
      user: _id,
    });

    res.status(200).json({
      status: "success",
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err,
    });
  }
};

const deleteReview = factory.deleteOne(Review);

module.exports = {
  getReviews,
  createReview,
  deleteReview,
};
