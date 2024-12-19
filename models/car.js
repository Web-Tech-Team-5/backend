const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Not-Available'],
        default: 'Available'
    },
    soldBy:
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User',
            required: true
        },
    rentedFrom: {
        type: Date,
        default: null,
    },
    rentedTo: {
        type: Date,
        default: null,
    },

    type:{
        type: String,
        enum: ['suv', 'sedan','hackbacks','luxury'],
        default: 'sedan',
    },
}, {
    timestamps: true
});

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

module.exports = Car;