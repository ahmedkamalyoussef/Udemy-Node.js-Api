const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/user");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name is too short"),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("user already in use");
      }
    }),

  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password cant be empty"),

  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (req.body.confirmPassword && password !== req.body.confirmPassword)
        throw new Error("Passwords do not match");
      return true;
    }),

  check("role").optional(),
  check("profileImage").optional(),

  check("phone").isMobilePhone(["ar-EG", "ar-SA"]).optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid Id"),

  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom(async (confirmPassword, { req }) => {
      if (confirmPassword !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
    }),

  check("newPassword").custom(async (newPassword, { req }) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      throw new Error("Incorrect current password");
    }

    return true;
  }),

  validatorMiddleware,
];
exports.changePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom(async (confirmPassword, { req }) => {
      if (confirmPassword !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
    }),

  check("newPassword").custom(async (newPassword, { req }) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      throw new Error("Incorrect current password");
    }

    return true;
  }),

  validatorMiddleware,
];


exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid Id"),
  validatorMiddleware,
];
