const io = require('socket.io-client')
const {io: server} = require('../app')
describe("socket test", () => {
    server.attach(3010)
    let socket
    
    beforeEach(function(done) {
        socket = io('http://localhost:3010')
        socket.on("connect", () => {
            console.log("connected")
            done()
        })
        socket.on("disconnect", () => {
            console.log("disconnect")
        }) 
    })

    afterEach(function(done) {
        if(socket.connected){
            console.log("disconnecting")
            socket.disconnect()
        } else {
            console.log("")
        }
        done()
    })

    afterAll(function(done) {
        socket.disconnect()
        server.close()
        done()
    })

    describe("socket test trial", () => {
        test("message-received", (done) => {
            const eventData = {
                eventId: "647ebbb55a3c4a6ae11fcf34",
                userEmail: "benita@mail.com",
                message: "this is a message"
            }
            // socket.emit("test", eventData)
            socket.on("message-received", (eventData) => {
                console.log(eventData)
            })
    
            // socket.on("message-stored", (payload) => {
            //     try {
            //         console.log(payload, "message")
            //         done()
            //     }catch(err){
                   
            //         console.log(err)
            //         done(err)
            //     }
               
            // })
            done()
        })
    })
})

