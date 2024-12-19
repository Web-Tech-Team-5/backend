// const Car = require('../../models/car');

// // Create a new car listing
// const registerCar = async (req, res) => {
//     try {
//         // Destructure required fields from the request body
//         const { make, model, year, mileage, condition, status,soldBy,type } = req.body;

//         // Check if all required fields are present
//         if (!make || !model || !year || !mileage || !condition ||!soldBy || !type) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields (make, model, year, mileage, condition, type, soldBy) are required.',
//             });
//         }

//         // Validate that soldBy is a valid MongoDB ObjectId
//         if (!soldBy.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid user ID for soldBy.',
//             });
//         }

//         // Create a new car instance
//         const car = new Car({ make, model, year, mileage, condition, status, soldBy,type});

//         // Save the car to the database
//         await car.save();

//         // Respond with success
//         res.status(201).json({
//             success: true,
//             message: 'Car listed successfully',
//             car,
//         });
//     } catch (error) {
//         // Handle errors
//         res.status(400).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// // Get all cars
// const getAllCars = async (req, res) => {
//     try {
//         const cars = await Car.find().populate('soldBy', 'name email role');
//         res.status(200).json({ success: true, cars });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Get all available cars
// const getAllAvailableCars = async (req, res) => {
//     try {
//         const cars = await Car.find({
//             status:"Available",
//         }).populate('soldBy', 'name email role');
//         res.status(200).json({ success: true, cars });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Get all not-available cars
// const getAllNotAvailableCars = async (req, res) => {
//     try {
//         const cars = await Car.find({
//             status:"Not-Available",
//         }).populate('soldBy', 'name email role');
//         res.status(200).json({ success: true, cars });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// //Get car by id
// const getCarById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({ success: false, message: 'Invalid car ID.' });
//         }

//         const car = await Car.findById(id).populate('soldBy', 'name email role');

//         if (!car) {
//             return res.status(404).json({ success: false, message: 'Car not found.' });
//         }

//         res.status(200).json({ success: true, car });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// //Update car details
// const updateCar = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;

//         if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({ success: false, message: 'Invalid car ID.' });
//         }

//         const car = await Car.findByIdAndUpdate(id, updates, { new: true });

//         if (!car) {
//             return res.status(404).json({ success: false, message: 'Car not found.' });
//         }

//         res.status(200).json({ success: true, message: 'Car updated successfully', car });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// //Delete car
// const deleteCar = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({ success: false, message: 'Invalid car ID.' });
//         }

//         const car = await Car.findByIdAndDelete(id);

//         if (!car) {
//             return res.status(404).json({ success: false, message: 'Car not found.' });
//         }

//         res.status(200).json({ success: true, message: 'Car deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// module.exports = {registerCar,getAllCars,getAllNotAvailableCars,getAllAvailableCars,getCarById,updateCar,deleteCar};

const Car = require('../../models/car');
const User = require('../../models/user'); // Ensure you have a User model if you're referencing users

// Create a new car listing
const registerCar = async (req, res) => {
    try {
        // Destructure required fields from the request body
        const { make, model, year, mileage, condition, status, soldBy, type, price, rating } = req.body;

        // Check if all required fields are present
        if (!make || !model || !year || !mileage || !condition || !status || !soldBy || !type || !price || !rating) {
            return res.status(400).json({
                success: false,
                message: 'All fields (make, model, year, mileage, condition, status, soldBy, type, price, rating) are required.',
            });
        }

        // Validate that soldBy is a valid MongoDB ObjectId
        if (!soldBy.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID for soldBy.',
            });
        }

        // Check if the soldBy user exists
        const user = await User.findById(soldBy);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found for the provided soldBy ID.',
            });
        }

        // Create a new car instance with all required fields
        const car = new Car({
            make, model, year, mileage, condition, status, soldBy, type, price, rating
        });

        // Save the car to the database
        await car.save();

        // Respond with success
        res.status(201).json({
            success: true,
            message: 'Car listed successfully',
            car,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all cars
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find().populate('soldBy', 'name email role');
        res.status(200).json({ success: true, cars });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all available cars
const getAllAvailableCars = async (req, res) => {
    try {
        const cars = await Car.find({
            status: "Available",
        }).populate('soldBy', 'name email role');
        res.status(200).json({ success: true, cars });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all not-available cars
const getAllNotAvailableCars = async (req, res) => {
    try {
        const cars = await Car.find({
            status: "Not-Available",
        }).populate('soldBy', 'name email role');
        res.status(200).json({ success: true, cars });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get car by id
const getCarById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid car ID.' });
        }

        const car = await Car.findById(id).populate('soldBy', 'name email role');

        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found.' });
        }

        res.status(200).json({ success: true, car });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update car details
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid car ID.' });
        }

        // Check if all required fields are present before updating
        const { make, model, year, mileage, condition, status, soldBy, type, price, rating } = updates;
        if (!make || !model || !year || !mileage || !condition || !status || !soldBy || !type || !price || !rating) {
            return res.status(400).json({
                success: false,
                message: 'All fields (make, model, year, mileage, condition, status, soldBy, type, price, rating) are required.',
            });
        }

        // Validate that soldBy is a valid MongoDB ObjectId
        if (!soldBy.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID for soldBy.',
            });
        }

        // Check if the soldBy user exists
        const user = await User.findById(soldBy);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found for the provided soldBy ID.',
            });
        }

        const car = await Car.findByIdAndUpdate(id, updates, { new: true });

        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found.' });
        }

        res.status(200).json({ success: true, message: 'Car updated successfully', car });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete car
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid car ID.' });
        }

        const car = await Car.findByIdAndDelete(id);

        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found.' });
        }

        res.status(200).json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerCar,
    getAllCars,
    getAllNotAvailableCars,
    getAllAvailableCars,
    getCarById,
    updateCar,
    deleteCar,
};
