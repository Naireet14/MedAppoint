const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('MongoDB is connected Successfully!')
})

connection.on('error', () => {
    console.log("Error in MongoDB Connection", error);
})

module.exports = mongoose;