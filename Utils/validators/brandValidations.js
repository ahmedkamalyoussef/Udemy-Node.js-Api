const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


exports.createBrandValidator = [
    check('name').notEmpty().withMessage('name is required')
    .isLength({ min: 3 }).withMessage('name is too short')
    .isLength({ max: 32 }).withMessage('name is too long'),
    validatorMiddleware,
];

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('invalid Id'),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('invalid Id'),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('invalid Id'),
    validatorMiddleware,
];