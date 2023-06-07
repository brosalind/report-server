const request = require("supertest")
const app = require("../app")
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Event = require("../models/Event");
const eventController = require("../controllers/eventController");
const User = require("../models/User");
const { signToken } = require("../helpers/jwt");
let access_token;
let access_token2;
let eventId;
let eventId2;
let eventId3;

beforeEach(() => {
    jest.restoreAllMocks();
});

beforeAll(async () => {
    //JANGAN LUPA GANTI LINK KE TESTING MONGO DATABASE. JANGAN PAKE ACTUALY DATABASE PLEASE!!!!!!!!!!!!!!!
    await mongoose.connect("mongodb+srv://chris:qwe123asd@chris.fzatjb9.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const user = await User.create({
        name: 'udin',
        username: 'udin',
        email: 'udin@mail.com',
        password: '12345',
        gender: 'male'
    })

    access_token = signToken(
        {
            id: user._id,
            email: "udin@mail.com",
        }
    )

    const user2 = await User.create({
        name: 'ipin',
        username: 'ipin',
        email: 'ipin@mail.com',
        password: '12345',
        gender: 'male'
    })

    access_token2 = signToken(
        {
            id: user2._id,
            email: "ipin@mail.com",
        }
    )

    const event = await Event.create({
        title: 'This is global state event',
        location: 'Test Location',
        date: '2023-06-07',
        courtPrice: 100000,
        limitParticipants: 8,
        creator: user._id
    })
    eventId = event._id

    const event2 = await Event.create({
        title: 'This is global state event',
        location: 'Test Location',
        date: '2023-06-07',
        courtPrice: 100000,
        limitParticipants: 8,
        creator: user2._id,
        participants: [
            { user2 }
        ]
    })
    eventId2 = event2._id

    const event3 = await Event.create({
        title: 'This is global state event',
        location: 'Test Location',
        date: '2023-06-07',
        courtPrice: 100000,
        limitParticipants: 8,
        creator: user._id,
        status: 'Close'
    })
    eventId3 = event3._id

}, 10000);

afterAll(async () => {
    // await Event.deleteMany({});
    await User.deleteMany({});
    await Event.deleteMany({});
    await mongoose.disconnect();
}, 10000);

describe('Event API', () => {
    describe('Add Event', () => {
        test('Should create new event (WITHOUT SPORT INFO)', async () => {

            // let access_token;

            const newEvent = {
                title: 'Test Event',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 100000,
                limitParticipants: 8,
            }

            // const user = {
            //     name: 'Chris',
            //     username: 'Chris',
            //     email: 'chris@mail.com',
            //     password: '12345',
            //     gender: 'male'
            // }

            // const account = await request(app)
            //     .post('/user')
            //     .send(user)

            // access_token = account._body.access_token

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

        test('Should create new event (WITH SPORT INFO)', async () => {
            let access_token;

            const newEvent = {
                title: 'Add testing',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 100000,
                limitParticipants: 8,
                sport: "647eeec34f723f72eaf5833e"
            }

            const user = {
                name: 'christopher',
                username: 'christopher',
                email: 'christopher@mail.com',
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

        test('Should return error', async () => {
            jest.spyOn(Event.EventModel, "findAll").mockRejectedValue("Error");
            // Event.find = jest.fn().mockResolvedValue("Error")
            const response = await request(app)
                .get('/eventList')

            expect(response.status).toBe(500)
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

    describe('Event Details', () => {
        test('Should return event by ID', async () => {
            let access_token;
            let eventId;

            const user = {
                name: 'jennifer',
                username: 'jennifer',
                email: 'jennifer@mail.com',
                password: '12345',
                gender: 'female'
            }

            const account = await request(app)
                .post('/user')
                .send(user)

            access_token = account._body.access_token

            const event = {
                title: 'Test Event',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 100000,
                limitParticipants: 8,
            }

            const response = await request(app)
                .post('/event')
                .send(event)
                .set('access_token', access_token)

            eventId = response._body._id

            const eventById = await request(app)
                .get(`/event/${eventId}`)
                .set('access_token', access_token)

            expect(response.status).toBe(201)
        })

        // test('Should return error on event by ID', async () => {
        //     let access_token
        //     let eventId

        //     const user = {
        //         name: 'celine',
        //         username: 'celine',
        //         email: 'celine@mail.com',
        //         password: '12345',
        //         gender: 'female'
        //     }

        //     const account = await request(app)
        //         .post('/user')
        //         .send(user)

        //     access_token = account._body.access_token

        //     const event = {
        //         title: 'Test Error get by id',
        //         location: 'Test Location',
        //         date: '2023-06-07',
        //         courtPrice: 100000,
        //         limitParticipants: 8,
        //     }

        //     const response = await request(app)
        //         .post('/event')
        //         .send(event)
        //         .set('access_token', access_token)

        //         eventId = response._body._id

        //     Event.findById = jest.fn().mockResolvedValue("Error")

        //     const response1 = await request(app)
        //         .get(`/event/${eventId}`)

        //     expect(response1.status).toBe(500)
        // })

        test('Should return error on event by ID', async () => {
            jest.spyOn(Event.EventModel, "findById").mockRejectedValue("Error");
            const response = await request(app)
                .get(`/event/${eventId}`)
                .set('access_token', access_token)

            console.log(response.body, "INI RESPONSE")
            expect(response.status).toBe(500)
            expect(response.body.message).toBe('Something happened. Please try again later.')
        })
    })
    describe('Cancel Event', () => {
        test('Should cancel the event and return a success message', async () => {
            let creatorId
            let access_token;
            let eventId;

            const testingEvent = {
                title: 'Test Delete Event',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 50000,
                limitParticipants: 6,
            }

            const user = {
                name: 'lmao',
                username: 'lmao',
                email: 'lamo@mail.com',
                password: '12345',
                gender: 'female'
            }

            const account = await request(app)
                .post('/user')
                .send(user)
            access_token = account._body.access_token

            // console.log(account, 'INI ACCOUNT')
            // console.log(access_token, "INI ACCESS TOKEN")


            const response = await request(app)
                .post('/event')
                .send(testingEvent)
                .set('access_token', access_token)
                .expect(201);

            creatorId = response._body.creator
            eventId = response._body._id

            const deleteEvent = await request(app)
                .delete(`/event/${eventId}`)
                .set('access_token', access_token)

            // expect(deleteEvent.status).toBe(200)
        })
        test('Should return notfound event', async () => {
            let access_token;
            let eventId = "647f5fd16634d77d16c68fcb"

            const user = {
                name: 'lmfao',
                username: 'lmfao',
                email: 'lmfao@mail.com',
                password: '12345',
                gender: 'female'
            }

            const account = await request(app)
                .post('/user')
                .send(user)
            access_token = account._body.access_token

            const testingEvent = {
                title: 'Test Cancel Event Failed',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 50000,
                limitParticipants: 6,
            }

            const response = await request(app)
                .post('/event')
                .send(testingEvent)
                .set('access_token', access_token)
                .expect(201);
            // eventId = response._body._id

            const failedCancel = await request(app)
                .delete(`/event/${eventId}`)
                .set('access_token', access_token)

            // console.log(failedCancel.body)
            expect(failedCancel.status).toBe(404)
            expect(failedCancel.body.message).toBe("What you're looking for does not exist.")
        })
        test('Should return Internal Server Error', async () => {
            jest.spyOn(Event, "findOneAndRemove").mockRejectedValue("Error");
            const response = await request(app)
                .delete(`/event/${eventId}`)
                .set('access_token', access_token)

            console.log(response.body)
        })
        test('Should return Unauthorized', async () => {
            let access_token;

            const user = {
                name: 'odin',
                username: 'odin',
                email: 'odin@mail.com',
                password: '12345',
                gender: 'male'
            }

            const account = await request(app)
                .post('/user')
                .send(user)
            access_token = account._body.access_token

            const failedCancel = await request(app)
                .delete(`/event/${eventId}`)
                .set('access_token', access_token)

            // console.log(failedCancel.body)
            expect(failedCancel.status).toBe(403)
            expect(failedCancel.body.message).toBe("We're sorry, but you don't have access.")
        })
        test('Should return event not found', async () => {
            let eventId = "64803d52ad314bedab2a3263"

            const response = await request(app)
                .delete(`/event/${eventId}`)
                .set('access_token', access_token)

            // console.log(response)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe("What you're looking for does not exist.")
        })
    })

    describe('Join Event', () => {
        test('should join the event and return the updated event details', async () => {
            let access_token1;
            let access_token2;
            let eventId;

            const user1 = {
                name: 'eren',
                username: 'eren',
                email: 'eren@mail.com',
                password: '12345',
                gender: 'male'
            }

            const account1 = await request(app)
                .post('/user')
                .send(user1)
            access_token1 = account1._body.access_token

            const user2 = {
                name: 'mikasa',
                username: 'mikasa',
                email: 'mikasa@mail.com',
                password: '12345',
                gender: 'female'
            }

            const account2 = await request(app)
                .post('/user')
                .send(user2)
            access_token2 = account2._body.access_token

            const mockEvent = {
                title: 'Test Delete Event',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 50000,
                limitParticipants: 6,
            }

            const response = await request(app)
                .post('/event')
                .send(mockEvent)
                .set('access_token', access_token1)

            eventId = response._body._id


            const joinEvent = await request(app)
                .put(`/event/${eventId}`)
                .set('access_token', access_token2)
                .expect(200)
        });

        test('should return error participantCreator', async () => {
            let access_token1;
            let access_token2;
            let eventId;

            const user1 = {
                name: 'erwin',
                username: 'erwin',
                email: 'erwin@mail.com',
                password: '12345',
                gender: 'male'
            }

            const account1 = await request(app)
                .post('/user')
                .send(user1)
            access_token1 = account1._body.access_token

            const user2 = {
                name: 'hange',
                username: 'hange',
                email: 'hange@mail.com',
                password: '12345',
                gender: 'female'
            }

            const account2 = await request(app)
                .post('/user')
                .send(user2)
            access_token2 = account2._body.access_token

            const mockEvent = {
                title: 'Test Delete Event',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 50000,
                limitParticipants: 6,
            }

            const response = await request(app)
                .post('/event')
                .send(mockEvent)
                .set('access_token', access_token1)

            eventId = response._body._id


            const joinEvent = await request(app)
                .put(`/event/${eventId}`)
                .set('access_token', access_token1)
                .expect(400)

            expect(joinEvent._body.message).toBe("You can't join an event you create.")
        })

        test('should return error notFound', async () => {
            let eventId = '647f64c07b21b45496acd009'

            const joinEvent = await request(app)
                .put(`/event/${eventId}`)
                .set('access_token', access_token)
                .expect(404)

            expect(joinEvent._body.message).toBe("What you're looking for does not exist.")
        })
        //ERROR
        test('should return error eventFull', async () => {
            let access_token1;
            let access_token2;
            let eventId;

            const user1 = {
                name: 'derrick',
                username: 'derrick',
                email: 'derrick@mail.com',
                password: '12345',
                gender: 'male'
            }

            const account1 = await request(app)
                .post('/user')
                .send(user1)
            access_token1 = account1._body.access_token

            const user2 = {
                name: 'patrick',
                username: 'patrick',
                email: 'patrick@mail.com',
                password: '12345',
                gender: 'female'
            }

            const account2 = await request(app)
                .post('/user')
                .send(user2)
            access_token2 = account2._body.access_token

            const mockEvent = {
                title: 'Test Delete Event',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 50000,
                limitParticipants: 6,
                totalParticipants: 6
            }

            const response = await request(app)
                .post('/event')
                .send(mockEvent)
                .set('access_token', access_token1)

            eventId = response._body._id


            const joinEvent = await request(app)
                .put(`/event/${eventId}`)
                .set('access_token', access_token2)
                .expect(403)

            expect(joinEvent._body.message).toBe("We're sorry, but the event is already full.")
        })
    })

    describe('Close Event', () => {
        test('should close the current event and change status to CLOSE', async () => {
            let access_token1
            let eventId;
            let eventStatus;

            const user1 = {
                name: 'danke',
                username: 'danke',
                email: 'danke@mail.com',
                password: '12345',
                gender: 'male'
            }

            const account1 = await request(app)
                .post('/user')
                .send(user1)
            access_token1 = account1._body.access_token

            const mockEvent = {
                title: 'Close Event Testing',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 50000,
                limitParticipants: 6,
            }

            const response = await request(app)
                .post('/event')
                .send(mockEvent)
                .set('access_token', access_token1)

            eventId = response._body._id
            eventStatus = response._body.status

            const closeEvent = await request(app)
                .patch(`/event/${eventId}`)
                .set("access_token", access_token1)

            expect(closeEvent._body.status).toBe('Close')
        })
        test('should return error alreadyClose', async () => {
            const closeEvent = await request(app)
                .patch(`/event/${eventId3}`)
                .set("access_token", access_token)
            console.log(closeEvent)


            expect(closeEvent.body.message).toBe('Event has finished already.')
            expect(closeEvent.status).toBe(400)
        })
        // test nex(err) nya
        test('should return server internal error', async () => {

        })
    })

    describe('Leave Event', () => {
        test('should leave current event', async () => {
            let access_token1
            let access_token2
            let eventId
            let eventTitle;

            const user1 = {
                name: 'mama',
                username: 'mama',
                email: 'mama@mail.com',
                password: '12345',
                gender: 'female'
            }

            const user2 = {
                name: 'papa',
                username: 'papa',
                email: 'papa@mail.com',
                password: '12345',
                gender: 'male'
            }

            const account1 = await request(app)
                .post('/user')
                .send(user1)
            access_token1 = account1._body.access_token

            const account2 = await request(app)
                .post('/user')
                .send(user2)
            access_token2 = account2._body.access_token

            const mockEvent = {
                title: 'Leave Event Testing',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 50000,
                limitParticipants: 6,
            }

            const response = await request(app)
                .post('/event')
                .send(mockEvent)
                .set('access_token', access_token1)

            eventId = response._body._id
            eventTitle = response._body.title

            const joinEvent = await request(app)
                .put(`/event/${eventId}`)
                .set('access_token', access_token2)
                .expect(200)

            const leaveEvent = await request(app)
                .put(`/event/${eventId}/leave`)
                .set('access_token', access_token2)

            expect(leaveEvent._body.message).toBe(`You have successfully leave ${eventTitle}`)
        })

        test('should return not found error leave event', async () => {
            let access_token1
            let access_token2
            let eventId = '647fce91cee5e16d9ab4a8999'
            let eventTitle;

            const user1 = {
                name: 'naruto',
                username: 'naruto',
                email: 'naruto@mail.com',
                password: '12345',
                gender: 'female'
            }

            const user2 = {
                name: 'sasuke',
                username: 'sasuke',
                email: 'sasuke@mail.com',
                password: '12345',
                gender: 'male'
            }

            const account1 = await request(app)
                .post('/user')
                .send(user1)
            access_token1 = account1._body.access_token

            const account2 = await request(app)
                .post('/user')
                .send(user2)
            access_token2 = account2._body.access_token

            // const mockEvent = {
            //     title: 'Leave Event Testing',
            //     location: 'Test Location',
            //     date: '2023-06-07',
            //     courtPrice: 50000,
            //     limitParticipants: 6,
            // }

            // const response = await request(app)
            //     .post('/event')
            //     .send(mockEvent)
            //     .set('access_token', access_token1)

            // eventId = response._body._id
            // eventTitle = response._body.title

            // const joinEvent = await request(app)
            //     .put(`/event/${eventId}`)
            //     .set('access_token', access_token2)
            //     .expect(200)

            const leaveEvent = await request(app)
                .put(`/event/${eventId}/leave`)
                .set('access_token', access_token2)
            expect(leaveEvent.status).toBe(500)
            expect(leaveEvent._body.message).toBe('Something happened. Please try again later.')
        })

        test('Should return NO ACCESS', async () => {
            // jest.spyOn(Event, "findByIdAndUpdate").mockRejectedValue("Error");
            const response = await request(app)
                .put(`/event/${eventId}/leave`)
                .set('access_token', access_token)

            expect(response.body.message).toBe("We're sorry, but you don't have access.")

            console.log(response.body)
        })

        test('Should return internal server error', async () => {

            const heheUser = await User.create({
                name: 'lol',
                username: 'lol',
                email: 'lol@mail.com',
                password: '12345',
                gender: 'male'
            })

            const access_tokenhehe = signToken(
                {
                    id: heheUser._id,
                    email: "lol@mail.com",
                }
            )

            const heheEvent = await Event.create({
                title: 'HEHE EVENT',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 100000,
                limitParticipants: 8,
                creator: heheUser._id,
                participants: [
                    {
                        user: heheUser
                    }
                ]
            })

            jest.spyOn(Event, "findOneAndUpdate").mockRejectedValue("Error");
            
            const leaveEvent = await request(app)
                .put(`/event/${heheEvent._id}/leave`)
                .set('access_token', access_tokenhehe)

                expect(leaveEvent.status).toBe(500)
                expect(leaveEvent.body.message).toBe('Something happened. Please try again later.')

        })
    })

    describe('Start Event', () => {
        test('Should start the event (ONGOING STATUS)', async () => {
            const response = await request(app)
                .patch(`/event/${eventId2}/start`)
                .set('access_token', access_token2)

            expect(response.status).toBe(200)
        })

        test('Should return event already close', async () => {

            let access_tokenDummy;
            let eventDummyId;

            const dummyUser = {
                name: 'ross',
                username: 'ross',
                email: 'ross@mail.com',
                password: '12345',
                gender: 'female'
            }

            const dummyAccount = await request(app)
                .post('/user')
                .send(dummyUser)
            access_tokenDummy = dummyAccount._body.access_token

            const dummyEventData = {
                title: 'This is global state event',
                location: 'Test Location',
                date: '2023-06-07',
                courtPrice: 100000,
                limitParticipants: 8,
                creator: dummyAccount._id,
            }
            const dummyEvent = await request(app)
                .post('/event')
                .send(dummyEventData)
                .set('access_token', access_tokenDummy)

            eventDummyId = dummyEvent.body._id

            const closeEvent = await request(app)
                .patch(`/event/${eventDummyId}`)
                .set("access_token", access_tokenDummy)


            const startEvent = await request(app)
                .patch(`/event/${eventDummyId}/start`)
                .set('access_token', access_tokenDummy)

            expect(startEvent.body.message).toBe("Event has finished already.")
            // console.log(startEvent.body.message)
            // console.log(startEvent)

        })
    })
})