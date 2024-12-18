const express = require('express');
const {registerCar,getAllCars,getCarById,updateCar,deleteCar,getAllAvailableCars,getAllNotAvailableCars} = require("../controllers/car/car-controller");
const carRouter = express.Router();

carRouter.post('/register', registerCar);
carRouter.put('/update/:id', updateCar);
carRouter.delete('/delete/:id', deleteCar);
carRouter.get('/get-all-cars',getAllCars);
carRouter.get('/get-all-available-cars',getAllAvailableCars);
carRouter.get('/get-all-not-available-cars',getAllNotAvailableCars);
carRouter.get('/get-car-by-id/:id',getCarById);

module.exports = carRouter;