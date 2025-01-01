const request = require('supertest');
const app = require('../../index'); // Make sure your app is being exported correctly
const { connectDB, closeDB, clearDB } = require('../db');
const Car = require('../../models/car');
const User = require('../../models/user');

let seller;

beforeAll(async () => {
    await connectDB();
    // Create a mock seller to associate with cars
    seller = await User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'seller',
        password: 'SecureP@ss123',
    });
});

afterEach(async () => {
    await clearDB();
});

afterAll(async () => {
    await closeDB();
});

describe('Car Controller', () => {
    // Register a new car
    describe('POST /api/car/register', () => {
        it('should register a new car successfully', async () => {
            const res = await request(app)
                .post('/api/car/register')
                .send({
                    make: 'Toyota',
                    model: 'Corolla',
                    year: 2021,
                    mileage: 15000,
                    condition: 'Used',
                    status: 'Available',
                    soldBy: seller._id,
                    type: 'sedan',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Car listed successfully');
            expect(res.body.car).toHaveProperty('make', 'Toyota');
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/car/register')
                .send({
                    make: 'Toyota',
                    model: 'Corolla',
                    year: 2021,
                    mileage: 15000,
                    condition: 'Used',
                    status: 'Available',
                    soldBy: seller._id,
                    // Missing type
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('All fields (make, model, year, mileage, condition, type, soldBy) are required.');
        });

        it('should return 400 if soldBy is not a valid MongoDB ObjectId', async () => {
            const res = await request(app)
                .post('/api/car/register')
                .send({
                    make: 'Toyota',
                    model: 'Corolla',
                    year: 2021,
                    mileage: 15000,
                    condition: 'Used',
                    status: 'Available',
                    soldBy: 'invalidObjectId',
                    type: 'sedan',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid user ID for soldBy.');
        });
    });

    // Get all cars
    describe('GET /api/car/get-all-cars', () => {
        it('should fetch all cars successfully', async () => {
            await Car.create({
                make: 'Toyota',
                model: 'Corolla',
                year: 2021,
                mileage: 15000,
                condition: 'Used',
                status: 'Available',
                soldBy: seller._id,
                type: 'sedan',
            });

            const res = await request(app).get('/api/car/get-all-cars');
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.cars).toBeInstanceOf(Array);
            expect(res.body.cars.length).toBeGreaterThan(0);
        });
    });

    // Get car by id
    describe('GET /api/car/get-car-by-id/:id', () => {
        it('should fetch car by ID', async () => {
            const car = await Car.create({
                make: 'Toyota',
                model: 'Corolla',
                year: 2021,
                mileage: 15000,
                condition: 'Used',
                status: 'Available',
                soldBy: seller._id,
                type: 'sedan',
            });

            const res = await request(app).get(`/api/car/get-car-by-id/${car._id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.car).toHaveProperty('make', 'Toyota');
        });

        it('should return 400 for invalid car ID', async () => {
            const res = await request(app).get('/api/car/get-car-by-id/invalidId');
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid car ID.');
        });

        it('should return 404 if car not found', async () => {
            const res = await request(app).get('/api/car/get-car-by-id/60d3b41abd9c5a6e4e2b5d55');
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Car not found.');
        });
    });

    // Update car
    describe('PUT /api/car/update/:id', () => {
        it('should update car details successfully', async () => {
            const car = await Car.create({
                make: 'Toyota',
                model: 'Corolla',
                year: 2021,
                mileage: 15000,
                condition: 'Used',
                status: 'Available',
                soldBy: seller._id,
                type: 'sedan',
            });

            const res = await request(app)
                .put(`/api/car/update/${car._id}`)
                .send({ mileage: 16000, condition: 'New' });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.car).toHaveProperty('mileage', 16000);
            expect(res.body.car).toHaveProperty('condition', 'New');
        });

        it('should return 400 for invalid car ID', async () => {
            const res = await request(app)
                .put('/api/car/update/invalidId')
                .send({ mileage: 16000 });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid car ID.');
        });
    });

    // Delete car
    describe('DELETE /api/car/delete/:id', () => {
        it('should delete car successfully', async () => {
            const car = await Car.create({
                make: 'Toyota',
                model: 'Corolla',
                year: 2021,
                mileage: 15000,
                condition: 'Used',
                status: 'Available',
                soldBy: seller._id,
                type: 'sedan',
            });

            const res = await request(app).delete(`/api/car/delete/${car._id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Car deleted successfully');
        });

        it('should return 400 for invalid car ID', async () => {
            const res = await request(app).delete('/api/car/delete/invalidId');
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid car ID.');
        });

        it('should return 404 if car not found', async () => {
            const res = await request(app).delete('/api/car/delete/60d3b41abd9c5a6e4e2b5d55');
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Car not found.');
        });
    });
});
