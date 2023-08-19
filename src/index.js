const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
// Now if I don't do this express library does this behind the scenes anyways. I'm not changing the behavior. I'm just doing a little bit of refactoring.
const server = http.createServer(app)
// socketIo expects it to called with the raw http server (I have that in the server veriable). Now express creates that behind the scenes I don't have access to it to pass it, That's why I created it on my own.
const io = socketio(server)

const port = process.env.PORT || 5000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


// server (emit) -> client(receive) - acknowledgement--> server
// client (emit) -> server(receive) - acknowledgement--> client


// printing a msg when new client connects
io.on('connection', (socket) => {
    console.log('New WebSocket connetion');

    // by calling socket.emit i can emitting the event to a particular connection in this case
    socket.emit('message', generateMessage('Welcome!') ) 
    // broadcast.emit helps to emit it to everybody except that particular connection
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))
                                // we have to set up a another parameter for the callback function, by calling the callback function we can anknowledge the event
    socket.on('sendMessage', (msg, callback) => {

        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!')
        }

        // by calling io.emit, this is going to emit the event to every single connection that's curretly available
        io.emit('message', generateMessage(msg))
        callback()
    })

    socket.on('sendLocation', ({latitude,longitude}, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`))
        callback()
    })

    // web socket provide a disconnect event, there's no need to emit either the connection event or the disconnect event from the client.
    // These are built in events. All I have to do is setup the listener.
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A User is offline'))
    })
})

server.listen(port, () => {
    console.log(`Server is live on port ${port}`);
})