const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDatabase = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
}

module.exports = connectDatabase;