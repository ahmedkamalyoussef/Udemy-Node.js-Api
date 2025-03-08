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

const router = express.Router();

router
  .route("/")
  .post(createProductValidator, createProduct)
  .get(getProductsValidator, getProducts);

router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
