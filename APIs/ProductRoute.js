const express = require("express");
const subCategoryRoute = require("./subCategoryRoute");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductsValidator,
} = require("../Utils/validators/productValidator");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../Services/productService");
const authService = require("../Services/authService");

const router = express.Router();

router.use(authService.protect);
router
  .route("/")
  .post(
    authService.allowedTo("admin", "manager"),
    createProductValidator,
    createProduct
  )
  .get(getProductsValidator, getProducts);

router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(
    authService.allowedTo("admin", "manager"),
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
