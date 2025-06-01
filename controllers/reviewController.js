const Review = require("../models/reviewModel");

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
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
    const { review, rating, createdAt, tour } = req.body;
    const { _id } = req.user;
    const newReview = await Review.create({
      review,
      rating,
      createdAt,
      tour,
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

module.exports = {
  getReviews,
  createReview,
};
