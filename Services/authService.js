const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/ApiError");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendEmail = require("../Utils/sendEmail");
const { resetPasswordTemplate } = require("../Utils/resetPasswordTemplate");
const generateJwtToken = require("../Utils/generateJwtToken");

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
  if (currentUser.passwordChangeTime) {
    const changeTimeStamp = parseInt(
      currentUser.passwordChangeTime.getTime() / 1000,
      10
    );
    if (changeTimeStamp > decoded.iat)
      return next(
        new ApiError("password changed recently ,please login again", 401)
      );
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ApiError("You are not authorized to access this resource", 403)
      );
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ApiError("User not found", 404));
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();
  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      message: `Your reset code is: ${resetCode}`,
      html: resetPasswordTemplate(resetCode),
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("Failed to send email", 500));
  }

  res.status(200).json({
    message: "Reset code sent successfully",
  });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  console.log(hashedCode);
  const user = await User.findOne({
    passwordResetCode: hashedCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new ApiError("Invalid or expired reset code", 401));
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    message: "Reset code verified successfully",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    passwordResetVerified: true,
    email: req.body.email,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new ApiError("User not found", 404));
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = false;
  await user.save();
  res.status(200).json({
    message: "Password reset successfully",
  });
});
