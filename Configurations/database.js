const mongoose = require('mongoose');

const dbConnection = () => {
    mongoose.connect(process.env.DB_URI).then((conn) => {
        console.log(`DB connected on : ${conn.connection.host}`);
    })//.catch((err) => {
    //     console.log(`DB err : ${err}`);
    //     process.exit(1);
    // });
};

module.exports = dbConnection;