const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSignup = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });

    res.status(201).json({
      status: "success",
      token,
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

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide both email and password!",
    });
  }
  try {
    const user = await User.findOne({
      email,
    }).select("+password");
    // const isValidUser = await user.correctPassword(password, user.password);
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect Email or Password!",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: err,
    });
  }
};

module.exports = {
  userSignup,
  userLogin,
};
