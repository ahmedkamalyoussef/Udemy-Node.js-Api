const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/ApiError");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const generateJwtToken = (payload) => {
  return jwt.sign({ id: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = generateJwtToken(user._id);
  res.status(201).json({
    data: user,
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }
  const token = generateJwtToken(user._id);
  res.status(200).json({
    data: user,
    token,
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  //check if the token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(new ApiError("You are not logged in", 401));

  //verify token (expiray and no changes happend)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //check if the user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new ApiError("User no longer exists", 401));

  //check if the user changed his password after login
  
});
