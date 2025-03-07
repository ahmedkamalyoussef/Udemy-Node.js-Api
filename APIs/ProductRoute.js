const express = require('express');
const subCategoryRoute = require('./subCategoryRoute');
const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator
} = require('../Utils/validators/productValidator');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../Services/productService');

const router = express.Router();

router.use('/:categoryId/subCategories', subCategoryRoute);

router.route('/')
    .post(createProductValidator, createProduct)
    .get(getProducts);

router.route('/:id')
    .get(getProductValidator, getProductById)
    .put(updateProductValidator,updateProduct)
    .delete(deleteProductValidator,deleteProduct);

module.exports = router;
