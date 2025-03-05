const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


exports.createSubCategoryValidator = [
    check('name').notEmpty().withMessage('name is required')
        .isLength({ min: 3 }).withMessage('name is too short')
        .isLength({ max: 32 }).withMessage('name is too long'),
    check('categoryId').notEmpty()
        .withMessage('categoryId is required')
        .isMongoId()
        .withMessage('invalid category Id'),
    validatorMiddleware,
];

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('invalid Id'),
    validatorMiddleware,
];

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('invalid Id'),
    validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('invalid Id'),
    validatorMiddleware,
];