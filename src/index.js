const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUserInRoom }= require('./utils/users')
const { getActiveRooms } = require('./utils/rooms')

const app = express()
// Now if I don't do this express library does this behind the scenes anyways. I'm not changing the behavior. I'm just doing a little bit of refactoring.
const server = http.createServer(app)
// socketIo expects it to called with the raw http server (I have that in the server veriable). Now express creates that behind the scenes I don't have access to it to pass it, That's why I created it on my own.
const io = socketio(server)

const port = process.env.PORT || 5000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connetion');


    socket.on('join', ({ username, room }, callback) => {

        const { error, user } = addUser({ id:socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Chat app', `Welcome ${user.username}!`)) 
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room:user.room,
            users:getUserInRoom(user.room)
        })

        io.emit('roomList', getActiveRooms(io))
        
        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, msg))
        callback()
    })

    socket.on('sendLocation', ({ latitude, longitude }, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is live on port ${port}`);
})