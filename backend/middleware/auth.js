const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const cookieParser = require('cookie-parser')
// const express = require("express");
// const app = express()
// app.use(cookieParser());

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(req.cookies,"req")
  console.log(token,"tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt")

  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  console.log(roles,"roles")
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(req.user,"rrrrrrrrrrr")
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
