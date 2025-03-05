const express = require('express');
const {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand
} = require('../Services/brandService');
const {
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
    getBrandValidator,
} = require('../Utils/validators/brandValidations');

const router = express.Router(); 



router.route('/')
    .post(createBrandValidator, createBrand)
    .get(getBrands);

router.route('/:id')
    .get(getBrandValidator, getBrandById)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;