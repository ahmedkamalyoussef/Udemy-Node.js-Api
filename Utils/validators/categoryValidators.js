const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


exports.createCategoryValidator = [
    check('name').notEmpty().withMessage('name is required')
    .isLength({ min: 3 }).withMessage('name is too short')
    .isLength({ max: 32 }).withMessage('name is too long'),
    validatorMiddleware,
];

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('invalid Id'),
    validatorMiddleware,
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('invalid Id'),
    validatorMiddleware,
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('invalid Id'),
    validatorMiddleware,
];