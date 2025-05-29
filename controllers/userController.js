const User = require("../models/userModel");

const userSignup = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: err,
    });
  }
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined",
  });
};

const getUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined",
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not defined",
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  userSignup,
};
