const request = require("supertest")
const app = require("../app")
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require("../models/User");
const Controller = require("../controllers/userController");
let id

beforeAll(async () => {
    //JANGAN LUPA GANTI LINK KE TESTING MONGO DATABASE. JANGAN PAKE ACTUALY DATABASE PLEASE!!!!!!!!!!!!!!!
    await mongoose.connect("mongodb+srv://chris:qwe123asd@chris.fzatjb9.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await User.deleteMany({});

    const newUser = {
        name: 'Kasfi',
        username: 'fi',
        email: 'fi@mail.com',
        password: '12345',
        gender: 'male'
    }

    const response = await request(app)
        .post('/user')
        .send(newUser)

    id = response._body.user._id

    console.log(id)
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
                password: '12345',
                gender: 'male'
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
                password: '12345',
                gender: 'male'
            }

            const response = await request(app)
                .post('/user')
                .send(newUser)

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Email is required')
        })

        // test('Should return Email is required', async () => {
        //     const newUser = {
        //         name: 'de',
        //         username: 'de',
        //         email: '',
        //         password: '12345'
        //     }

        //     const response = await request(app)
        //         .post('/user')
        //         .send(newUser)

        //     expect(response.status).toBe(400)
        //     expect(response.body.message).toBe('Email is required')
        // })

        test('Should return Email or username already exists', async () => {
            const newUser = {
                name: 'Kasfi',
                username: 'fi',
                email: 'fi@mail.com',
                password: '12345',
                gender: 'male'
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
                password: '',
                gender: 'male'
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
                password: '12345',
                gender: 'female'
            }

            const response = await request(app)
                .post('/user')
                .send(newUser)

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Name is required')
        })

        // test('Should return Gender is required', async () => {
        //     const newUser = {
        //         name: 'hehehehehe',
        //         username: 'heheheheheh',
        //         email: 'hehehehehe@mail.com',
        //         password: '12345',
        //         gender: ''
        //     }

        //     const response = await request(app)
        //         .post('/user')
        //         .send(newUser)

        //     expect(response.status).toBe(400)
        //     expect(response.body.message).toBe('Gender is required')
        // })
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


            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Invalid Login')
        })

        test('Should return Please input your email', async () => {
            const data = {
                email: '',
                password: '12345555555555'
            }
            const response = await request(app)
                .post('/user/login')
                .send(data)


            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Please input your email.')
        })

        test('Should return Please input your password', async () => {
            const data = {
                email: 'fi@mail.com',
                password: ''
            }
            const response = await request(app)
                .post('/user/login')
                .send(data)


            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Please input your password.')
        })
    })

    describe('User Data', () => {
        test('Should return All User', async () => {
            const response = await request(app)
                .get('/user/data')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
        })

        test('Should return Error not found', async () => {
            const response = await request(app)
                .get('/user/datas')

            expect(response.status).toBe(404)
        })

        test('Should handle error and call next', async () => {
            User.find = jest.fn().mockRejectedValue(new Error('Database error'));

            const next = jest.fn();

            await Controller.getAllUser({}, {}, next);

            expect(next).toHaveBeenCalledWith(new Error('Database error'));
        });

        test('Should get user data by ID', async () => {
            const response = await request(app).get(`/user/data/${id}`)

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(false)
            expect(response._body.name).toBe('Kasfi')
        });

        test('Should return not found when get user data by ID', async () => {
            const response = await request(app).get(`/user/data/647ea5a5b0077449929216b5`)

            expect(response.status).toBe(404)
            expect(Array.isArray(response.body)).toBe(false)
            expect(response.body.message).toBe("What you're looking for does not exist.")
        });
    })
})