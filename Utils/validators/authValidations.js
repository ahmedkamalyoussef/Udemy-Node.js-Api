const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/user");


exports.registerValidator = [
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

  check("profileImage").optional(),

  check("phone").isMobilePhone(["ar-EG", "ar-SA"]).optional(),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  validatorMiddleware,
];