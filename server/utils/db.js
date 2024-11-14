const mongoose = require('mongoose');
const URL = process.env.MONGODB_URL;

console.log(URL);
const connectDb = async ()=>{
    try {
        await mongoose.connect(URL);
        console.log('Connection successfull to DB');
    } catch (error) {
        console.error("Database connection failed");
        process.exit(0);
    }
}

module.exports = connectDb;