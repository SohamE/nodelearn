const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

const userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Please provide both email and password!", 400);
    // return res.status(400).json({
    //   status: "fail",
    //   message: "Please provide both email and password!",
    // });
  }
  const user = await User.findOne({
    email,
  }).select("+password");
  // const isValidUser = await user.correctPassword(password, user.password);
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("Incorrect Email or Password!", 401);
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});

const protect = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // Check if authorization header is present.
    if (!authorization || !authorization.startsWith("Bearer")) {
      return res.status(401).json({
        status: "fail",
        message: "Authorization code is not present",
      });
    }

    // Check if jwt token is valid.
    const token = authorization.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user exists.
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User does not exists",
      });
    }
    // Check if the user has not changed password while prev token in valid.
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err,
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    const isRestricted = !roles.includes(req.user.role);
    if (isRestricted) {
      return res.status(401).json({
        status: "fail",
        message: "Authorization code is not present",
      });
    }
    next();
  };
};

module.exports = {
  userSignup,
  userLogin,
  protect,
  restrictTo,
};
