const request = require("supertest")
const app = require("../app")
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require("../models/User");

beforeAll(async () => {
    await mongoose.connect("mongodb+srv://chris:qwe123asd@chris.fzatjb9.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await User.deleteMany({});

    const newUser = {
        name: 'Kasfi',
        username: 'fi',
        email: 'fi@mail.com',
        password: '12345'
    }

    const response = await request(app)
        .post('/user')
        .send(newUser)
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
});

describe('User API', () => {
    describe('User Register', () => {
        test('Should return User created successfully', async () => {
            const newUser = {
                name: 'de',
                username: 'de',
                email: 'de@mail.com',
                password: '12345'
            }

            const response = await request(app)
                .post('/user')
                .send(newUser)
                .expect(201);

            expect(response.status).toBe(201)
            expect(response.body.message).toBe('User created successfully')
        })

        test('Should return Email is required', async () => {
            const newUser = {
                name: 'de',
                username: 'de',
                email: '',
                password: '12345'
            }

            const response = await request(app)
                .post('/user')
                .send(newUser)

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Email is required')
        })

        test('Should return Email is required', async () => {
            const newUser = {
                name: 'de',
                username: 'de',
                email: '',
                password: '12345'
            }

            const response = await request(app)
                .post('/user')
                .send(newUser)

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Email is required')
        })

        test('Should return Email or username already exists', async () => {
            const newUser = {
                name: 'Kasfi',
                username: 'fi',
                email: 'fi@mail.com',
                password: '12345'
            }

            const response = await request(app)
                .post('/user')
                .send(newUser)

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Email or username already exists')
        })

        test('Should return Password is required', async () => {
            const newUser = {
                name: 'Rocky',
                username: 'ki',
                email: 'ki@mail.com',
                password: ''
            }

            const response = await request(app)
                .post('/user')
                .send(newUser)

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Password is required')
        })

        test('Should return Name is required', async () => {
            const newUser = {
                name: '',
                username: 'del',
                email: 'del@mail.com',
                password: '12345'
            }

            const response = await request(app)
                .post('/user')
                .send(newUser)

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Name is required')
        })
    })

    describe('User Login', () => {
        test('Should return access_token', async () => {
            const data = {
                email: 'de@mail.com',
                password: '12345'
            }
            const response = await request(app)
                .post('/user/login')
                .send(data)


            expect(response.status).toBe(200)
        })

        test('Should return Invalid user', async () => {
            const data = {
                email: 'invalid@mail.com',
                password: '12345'
            }
            const response = await request(app)
                .post('/user/login')
                .send(data)


            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Invalid user. Please register first or make sure your login details are correct.')
        })

        test('Should return Invalid Login', async () => {
            const data = {
                email: 'fi@mail.com',
                password: '12345555555555'
            }
            const response = await request(app)
                .post('/user/login')
                .send(data)


            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Invalid Login')
        })
    })
})