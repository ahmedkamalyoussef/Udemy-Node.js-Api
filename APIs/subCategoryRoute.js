const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  SetCategoryIdToBody,
  createFilter,
} = require("../Services/subCategoryService");
const {
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  getSubCategoryValidator,
} = require("../Utils/validators/subCategoryValidators");
const authService = require("../Services/authService");
//mergeParams allows us to access params from other or "parent" route
const router = express.Router({ mergeParams: true });

router.use(authService.protect);

router
  .route("/")
  .post(
    authService.allowedTo("admin", "manager"),
    SetCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilter, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategoryById)
  .put(
    authService.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
