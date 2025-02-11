const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database")
    }
    catch (err) {
        console.error(err.message);
    }
}

module.exports = connectDB;