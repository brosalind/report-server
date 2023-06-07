const request = require("supertest")
const app = require("../app")
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Event = require("../models/Event");
const eventController = require("../controllers/eventController");


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

describe('Event API', () => {
    describe('Add Event', () => {
        test('Should create new event', async () => {

            let access_token;

            const newEvent = {
                title: 'Test Event',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 100000,
                limitParticipants: 8,
            }

            const user = {
                name: 'Chris',
                username: 'Chris',
                email: 'chris@mail.com',
                password: '12345',
                gender: 'male'
            }

            const account = await request(app)
                .post('/user')
                .send(user)

            access_token = account._body.access_token

            const response = await request(app)
                .post('/event')
                .send(newEvent)
                .set('access_token', access_token)
                .expect(201);

            expect(response.status).toBe(201)
            expect(response._body).toHaveProperty("title")
            expect(response._body).toHaveProperty("_id")
            expect(response._body).toHaveProperty("courtPrice")
            expect(response._body).toHaveProperty("creator")
            expect(response._body).toHaveProperty("date")
            expect(response._body).toHaveProperty("expectedPrice")
            expect(response._body).toHaveProperty("limitParticipants")
            expect(response._body).toHaveProperty("location")
            expect(response._body).toHaveProperty("status")
            expect(response._body).toHaveProperty("totalParticipants")
            expect(response._body).toHaveProperty("participants")
        })

        test('Should return Title is required', async () => {
            let access_token;

            const newEvent = {
                title: '',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 100000,
                limitParticipants: 8,
            }

            const user = {
                name: 'HEHE',
                username: 'hehe',
                email: 'hehe@mail.com',
                password: '12345',
                gender: 'male'
            }

            const account = await request(app)
                .post('/user')
                .send(user)
            access_token = account._body.access_token

            const response = await request(app)
                .post('/event')
                .send(newEvent)
                .set('access_token', access_token)

            expect(response.status).toBe(400)
            expect(response._body.message).toBe("Title is required")

        })
    })

    describe('Get All Events', () => {
        test('Should return all events', async () => {
            const response = await request(app)
                .get('/eventList')

            expect(response.status).toBe(200)
        })

        // test('Should handle error and call next', () => {
        //     const error = new Error('Database error');
        //     Event.find.mockRejectedValue(error);
        //     const next = jest.fn();

        //     return Controller.getAllEvents({}, {}, next).catch((err) => {
        //         expect(err).toBe(error);
        //         expect(next).toHaveBeenCalledWith(error);
        //     });
        // });
    })

    // describe('Get My Events', () => {
    //     // test('Should return upcoming and previous events for the authenticated user', async () => {
    //     //     // const user = /* create a test user */;
    //     //     let access_token;
    //     //     const user = {
    //     //         name: 'Chris',
    //     //         username: 'Chris',
    //     //         email: 'chris@mail.com',
    //     //         password: '12345',
    //     //         gender: 'male'
    //     //     }

    //     //     const account = await request(app)
    //     //         .post('/user')
    //     //         .send(user)

    //     //     access_token = account._body.access_token

    //     //     const event1 = await Event.create({
    //     //         title: 'Test Event',
    //     //         location: 'Test Location',
    //     //         date: '2023-06-07',
    //     //         courtPrice: 100000,
    //     //         limitParticipants: 8, 
    //     //         });
    //     //     const event2 = await Event.create({
    //     //         title: 'Test Event 2',
    //     //         location: 'Test Location 2',
    //     //         date: '2023-06-07',
    //     //         courtPrice: 100000,
    //     //         limitParticipants: 8, 
    //     //         });

    //     //     // Add the user as a participant to event1
    //     //     event1.participants.push({ user: user._id });
    //     //     await event1.save();

    //     //     const response = await request(app)
    //     //         .get('/eventlist')
    //     //         // .set('Authorization', `Bearer ${/* insert a valid access token for the user */}`)
    //     //         .expect(200);

    //     //         console.log(response)
    //     //     expect(response.status).toBe(200);
    //     //     expect(response.body.upcomingEvents).toHaveLength(1); // Assert that the response contains the upcoming event
    //     //     expect(response.body.previousEvents).toHaveLength(1); // Assert that the response contains the previous event

    //     //     // Assert that the creator and participants are populated for the events
    //     //     expect(response.body.upcomingEvents[0].creator).toBeDefined();
    //     //     expect(response.body.upcomingEvents[0].participants[0].user).toBeDefined();
    //     //     expect(response.body.previousEvents[0].creator).toBeDefined();
    //     //     expect(response.body.previousEvents[0].participants[0].user).toBeDefined();
    //     // })

    //     test('Should return event details', async () => {
            
    //         const mockEvent = new Event({
    //             title: 'Test Event',
    //             location: 'Test Location',
    //             date: '2023-06-07',
    //             courtPrice: 100,
    //             limitParticipants: 10,
    //             creator: 'user_id',
    //           });
    //           await mockEvent.save();

    //         // Send a request to the API endpoint
    //         const response = await request(app)
    //           .get(`/event/${mockEvent._id}`)
    //           .expect(200);
        
    //         // Assert the response
    //         expect(response.status).toBe(200);
    //         expect(response.body.title).toBe(mockEvent.title);
    //         expect(response.body.location).toBe(mockEvent.location);
    //         // ... assert other properties as needed
        
    //         // Clean up: delete the mock event from the database
    //         await Event.findByIdAndDelete(mockEvent._id);
    //       });
    // })
})