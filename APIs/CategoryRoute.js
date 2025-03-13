const express = require("express");
const subCategoryRoute = require("./subCategoryRoute");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../Utils/validators/categoryValidators");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../Services/categoryService");
const authService = require("../Services/authService");

const router = express.Router();

router.use("/:categoryId/subCategories", subCategoryRoute);

router.use(authService.protect);
router
  .route("/")
  .post(
    authService.allowedTo("admin", "manager"),
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(
    authService.allowedTo("admin", "manager"),
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.allowedTo("admin", "manager"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
