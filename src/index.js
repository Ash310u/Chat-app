const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
// Now if I don't do this express library does this behind the scenes anyways. I'm not changing the behavior. I'm just doing a little bit of refactoring.
const server = http.createServer(app)
// socketIo expects it to called with the raw http server (I have that in the server veriable). Now express creates that behind the scenes I don't have access to it to pass it, That's why I created it on my own.
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

// printing a msg when new client connects
io.on('connection', (socket) => {
    console.log('New WebSocket connetion');

    // sending an event from the server and receiving that event on the clients(chat.js)
    socket.emit('countUpdated', count)

    // listening increment event from chat.js
    socket.on('increment', () => {
        count++
        socket.emit('countUpdated', count)
    })
})

server.listen(port, () => {
    console.log(`Server is live on port ${port}`);
})