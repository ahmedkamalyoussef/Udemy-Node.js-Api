const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const glopalError = require('./middlewares/errMiddleware');
const ApiError = require('./Utils/ApiError');

dotenv.config({ path: 'config.env' });

//DB Connection
const dbConnection = require('./Configurations/database');

const categoryRoute = require('./APIs/CategoryRoute');
const subCategoryRoute = require('./APIs/subCategoryRoute');

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
app.use('/api/v1/subCategories', subCategoryRoute);


// 404 error handler
app.all('*', (req, res, next) => {
    // const err = new Error(`can't find this route : ${req.originalUrl}`);
    next(new ApiError(`can't find this route : ${req.originalUrl}`,400));
})
//global error handler
app.use(glopalError);

const {PORT} = process.env;
const server = app.listen(PORT, () => {
    console.log(`app running on port : ${PORT}`);
});

// handle uncaught promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`unhandledRejection error : ${err.name} | ${err.message}`);
    server.close(() => {
        console.log('shutting down ...');
        process.exit(1);
    })
})