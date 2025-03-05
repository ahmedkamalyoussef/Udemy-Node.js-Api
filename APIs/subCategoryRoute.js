const express = require('express');
const {
    createSubCategory,
    getSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
    SetCategoryIdToBody,
    createFilter
} = require('../Services/subCategoryService');
const {
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
    getSubCategoryValidator,
} = require('../Utils/validators/subCategoryValidators');

//mergeParams allows us to access params from other or "parent" route
const router = express.Router({ mergeParams: true  });


router.route('/')
    .post(SetCategoryIdToBody, createSubCategoryValidator, createSubCategory)
    .get(createFilter, getSubCategories);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategoryById)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
