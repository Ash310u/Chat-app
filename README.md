# Chat-app
chat app a Node.js application

<hr>

## server (emit) -> client(receive)

socket.emit <!-- Which sends an event to a specific client --> <br>
io.emit <!-- Which sends an event to every connected client --> <br>
socket.broadcast.emit <!-- Which sends an event to every connected client except for that client --> <br>

<hr>

## setup emitting messages for rooms
<!-- "to" is indeed a function --> 

io.to().emit <!-- Which sends an event to everybody in a specific room --> <br>
socket.broadcast.to().emit <!-- Which sends an event to everybody in a specific room except for that client --> <br>
