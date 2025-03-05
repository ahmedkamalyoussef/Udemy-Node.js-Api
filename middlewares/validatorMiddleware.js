const { validationResult } = require('express-validator');


const validatorMiddleware = (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({ errors: errs.array() });
    }
    next();
};

module.exports = validatorMiddleware;