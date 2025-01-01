const request = require('supertest');
const app = require('../../index');
const { connectDB, closeDB, clearDB } = require('../db');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

beforeAll(async () => {
    await connectDB();
});

afterEach(async () => {
    await clearDB();
});

afterAll(async () => {
    await closeDB();
});

describe('Auth Controller', () => {
    describe('Register User', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register') // Corrected route
                .send({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'StrongP@ssword1',
                    role: 'buyer',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.newUser.email).toBe('johndoe@example.com');
        });

        it('should not register a user with existing email', async () => {
            await User.create({
                name: 'Existing User',
                email: 'existing@example.com',
                password: 'StrongP@ssword1',
                role: 'buyer',
            });

            const res = await request(app)
                .post('/api/auth/register') // Corrected route
                .send({
                    name: 'Another User',
                    email: 'existing@example.com',
                    password: 'StrongP@ssword1',
                    role: 'buyer',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User already exists');
        });
    });

    describe('Login User', () => {
        it('should log in an existing user', async () => {
            const hashedPassword = await bcrypt.hash('StrongP@ssword1', 10);
            await User.create({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: hashedPassword,
                role: 'buyer',
            });

            const res = await request(app)
                .post('/api/auth/login') // Corrected route
                .send({
                    email: 'johndoe@example.com',
                    password: 'StrongP@ssword1',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
        });

        it('should not log in with incorrect password', async () => {
            const hashedPassword = await bcrypt.hash('StrongP@ssword1', 10);
            await User.create({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: hashedPassword,
                role: 'buyer',
            });

            const res = await request(app)
                .post('/api/auth/login') // Corrected route
                .send({
                    email: 'johndoe@example.com',
                    password: 'WrongPassword',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Wrong password, Please try again');
        });
    });

    describe('Logout User', () => {
        it('should log out the user', async () => {
            const res = await request(app).post('/api/auth/logout'); // Corrected route
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Logged out successfully!');
        });
    });
});
