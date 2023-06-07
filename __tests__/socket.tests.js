const app = require('../app')
const request = require('supertest')
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");


describe("Socket Testing", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("handle message-received event", (done) => {
    // clientSocket.on("message-received", (arg) => {
      const eventData= {
        eventId: 'event1',
        userEmail: 'user@mail.com',
        message: "this is my message"
      }
      // expect(arg).toBe(eventData);
      // done();
    // });
    io.emit("message-received", eventData);

    io.on("message-stored", (message) => {
      expect(message).toEqual(eventData.message)
      done()
    })
  });

  test("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });
});
