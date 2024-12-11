const mongoose = require("mongoose");
const validator = require('validator');

//definition of user
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => validator.isEmail(email),
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'buyer', 'seller'],
        default: 'buyer',
    },
}, {
    timestamps: true
});

//model of user
const User = mongoose.model('User', UserSchema) || mongoose.models.User;

module.exports = User;