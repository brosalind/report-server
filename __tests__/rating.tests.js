const request = require("supertest")
const app = require("../app")
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require("../models/User");
const Rating = require("../models/Rating")
const ratingController = require("../controllers/ratingController");

beforeAll(async () => {
    //JANGAN LUPA GANTI LINK KE TESTING MONGO DATABASE. JANGAN PAKE ACTUALY DATABASE PLEASE!!!!!!!!!!!!!!!
    await mongoose.connect("mongodb+srv://chris:qwe123asd@chris.fzatjb9.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});


describe('Add Rating', () => {
    test('Should add rating and update user rating', async () => {
        let userId1;
        let userId2;

        let accToken1;
        let acctToken2;

        const newUser1 = {
            name: 'gusion',
            username: 'gus',
            email: 'gus@mail.com',
            password: '12345',
            gender: 'male'
        }
        const newUser2 = {
            name: 'layla',
            username: 'layla',
            email: 'layla@mail.com',
            password: '12345',
            gender: 'female'
        }
        const account1 = await request(app)
                .post('/user')
                .send(newUser1)

        const account2 = await request(app)
                .post('/user')
                .send(newUser2)
        userId1 = account1._body.user._id
        userId2 = account2._body.user._id

        const data1 = {
            email: 'gus@mail.com',
            password: '12345'
        }

        const response1 = await request(app)
            .post('/user/login')
            .send(data1)

            accToken1 = response1._body.access_token

        ratingData = {
            userId: userId2,
            rating: 9
        }

        const giveRating = await request(app)
            .post('/rating')
            .set('access_token', accToken1)
            .send(ratingData)

            expect(giveRating.status).toBe(200)
            expect(giveRating._body.message).toBe('Rating added successfully')
      });
      
    test('Should return error', async () => {
        let accToken;

        const data1 = {
            email: 'gus@mail.com',
            password: '12345'
        }

        const response1 = await request(app)
            .post('/user/login')
            .send(data1)

        accToken = response1._body.access_token

        ratingData = {
            userId: "647ef8856634d77d16c96f11",
            rating: 9
        }

        const giveRating = await request(app)
            .post('/rating')
            .set('access_token', accToken)
            .send(ratingData)

            expect(giveRating.status).toBe(404)
            expect(giveRating._body.message).toBe("What you're looking for does not exist.")
      })
})
