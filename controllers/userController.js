const User = require("../models/userModel");
const factory = require("./handlerFactory");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const getUserById = factory.getOne(User);

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
const deleteUser = factory.deleteOne(User);

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
};
