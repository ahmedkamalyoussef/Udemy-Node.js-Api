const { check, query, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");
const slugify = require("slugify");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title is too short")
    .isLength({ max: 128 })
    .withMessage("Title is too long"),

  check("slug")
    .optional()
    .isString()
    .withMessage("Slug must be a string")
    .toLowerCase(),

  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description is too short")
    .isLength({ max: 512 })
    .withMessage("Description is too long"),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),

  check("discountPrice")
    .optional()
    .isNumeric()
    .withMessage("Discount price must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Discount price must be less than the actual price");
      }
      return true;
    }),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be at least 1"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Sold quantity cannot be negative"),

  check("colors").optional().isArray().withMessage("Colors must be an array"),

  check("images").optional().isArray().withMessage("Images must be an array"),

  check("imageCover")
    .notEmpty()
    .withMessage("Product cover image is required")
    .isString()
    .withMessage("Cover image must be a string"),

  check("categoryId")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (id) => {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("category not found");
      }
    }),

  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Subcategories must be an array")
    .isMongoId()
    .custom(async (ids) => {
      const subcategories = await SubCategory.find({ _id: { $in: ids } });
      if (subcategories.length !== ids.length) {
        throw new Error("Some subcategories not found");
      }
    })
    .custom(async (ids, { req }) => {
      const subcategories = await SubCategory.find({
        _id: { $in: ids },
        categoryId: req.body.categoryId,
      });
      if (subcategories.length !== ids.length) {
        throw new Error(
          "Some subcategories not found or do not belong to the specified category"
        );
      }
    }),

  check("brandId")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format"),

  check("ratingAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating quantity must be a number"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
exports.getProductsValidator = [
  query("minPrice")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("minPrice must be a positive number")
    .toFloat()
    .default(0),

  query("maxPrice")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("maxPrice must be greater than or equal to 1")
    .toFloat()
    .default(Number.MAX_VALUE),

  // Validate minRating and maxRating
  query("minRating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("minRating must be between 1 and 5")
    .toFloat()
    .default(1),

  query("maxRating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("maxRating must be between 1 and 5")
    .toFloat()
    .default(5),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
