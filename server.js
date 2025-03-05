const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const ApiError = require('./Utils/ApiError');
dotenv.config({ path: 'config.env' });

//DB Connection
const dbConnection = require('./Configurations/database');
const categoryRoute = require('./APIs/CategoryRoute');
//connect with db
dbConnection();
//App
const app = express();

//middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode : ${process.env.NODE_ENV}`);
}


//mount routes
app.use('/api/v1/categories', categoryRoute);

app.all('*', (req, res, next) => {
    // const err = new Error(`can't find this route : ${req.originalUrl}`);
    next(new ApiError(`can't find this route : ${req.originalUrl}`,400));
})

app.use((err, req, res, next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`app running on port : ${PORT}`);
});
