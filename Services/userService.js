const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const factoryHandlers = require("./factoryHandlers");
const ApiError = require("../Utils/ApiError");
const User = require("../models/user");
const generateJwtToken = require("../Utils/generateJwtToken");

exports.createUser = factoryHandlers.createOne(User);

exports.getUsers = factoryHandlers.getAll(User);

exports.getUserById = factoryHandlers.getById(User);

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      role: req.body.role,
      profileImageUrl: req.body.profileImage,
    },
    {
      new: true,
    }
  );
  if (!user) return next(new ApiError("user not found", 404));
  res.status(200).json({ data: user });
});

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangeTime: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) return next(new ApiError("user not found", 404));
  res.status(200).json({ data: user });
});

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangeTime: Date.now(),
    },
    {
      new: true,
      select: "-password", // Exclude password from response
    }
  );

  if (!user) return next(new ApiError("User not found", 404));

  const token = generateJwtToken(user._id);
  res.status(200).json({
    message: "Password changed successfully",
    data: { user, token },
  });
});


exports.deleteUser = factoryHandlers.deleteOne(User);
