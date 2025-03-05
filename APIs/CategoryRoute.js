const express = require('express');
const subCategoryRoute = require('./subCategoryRoute');
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../Utils/validators/categoryValidators');
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../Services/categoryService');

const router = express.Router();

router.use('/:categoryId/subCategories', subCategoryRoute);

router.route('/')
    .post(createCategoryValidator, createCategory)
    .get(getCategories);

router.route('/:id')
    .get(getCategoryValidator, getCategoryById)
    .put(updateCategoryValidator,updateCategory)
    .delete(deleteCategoryValidator,deleteCategory);

module.exports = router;
