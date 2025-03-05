const glopalError = (err, req, res, next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV == "development") {
        errForDevelopment(err, res);
    } else {
        errForProduction(err, res);
    }
};
const errForDevelopment = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const errForProduction = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};
module.exports = glopalError;