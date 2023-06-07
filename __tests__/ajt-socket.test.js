const io = require("socket.io-client");
const { io: server } = require("../app");
const Discussion = require("../models/Discussion");
const Message = require("../models/Message");
const User = require("../models/User");

//jest.setTimeout(100000);
describe("Suite of unit tests", function () {
  server.attach(3010);
  let socket;

  beforeEach(function (done) {
    // Setup
    socket = io("http://localhost:3010");

    socket.on("connect", function () {
      console.log("worked...");
      done();
    });

    socket.on("disconnect", function () {
      console.log("disconnected...");
    });

    jest.restoreAllMocks();
  });

  afterEach(function (done) {
    // Cleanup
    if (socket.connected) {
      console.log("disconnecting...");
      socket.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log("no connection to break...");
    }
    done();
  });

  afterAll(function (done) {
    socket.disconnect();
    server.close();
    done();
  });

  describe("Chat tests", function () {
    test("should work", (done) => {
      socket.emit("message:send", {
        name: "Udin",
        message: "Hello world",
      });

      socket.on("message:send", (payload) => {
        try {
          expect(payload).toHaveProperty("name");
          expect(payload).toHaveProperty("message");
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe("message-received", () => {
    test("message-received", (done) => {
      // karena konek ke mongo db atlas jadi perlu mocking agar proses test tidak timeout
      jest
        .spyOn(User, "find")
        .mockResolvedValue([{ _id: "64802b3bfc7e69b1a47bd75e" }]);
      jest
        .spyOn(Discussion, "find")
        .mockResolvedValue([{ _id: "64805a41bde2cb62f8424995" }]);
      jest
        .spyOn(Message, "create")
        .mockResolvedValue({ _id: "64805a42bde2cb62f8424997" });
      jest
        .spyOn(Discussion, "create")
        .mockResolvedValue({ _id: "64805a41bde2cb62f8424995" });

      socket.emit("message-received", {
        eventId: "647ebbb55a3c4a6ae11fcf34",
        userEmail: "benita@mail.com",
        message: "Hello",
      });

      socket.on("message-stored", (payload) => {
        try {
          console.log(payload, "payload");
          expect(payload).toEqual(expect.any(String));
          expect(payload).toBe("Hello");
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
