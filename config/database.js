const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDatabase = async () => {
    // Connect to database
    if (process.env.NODE_ENV !== 'test') {
        await mongoose.connect(process.env.MONGODB_URI);
    }
}

module.exports = connectDatabase;