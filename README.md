# Chat-app
chat app a Node.js application

<hr>

## server (emit) -> client(receive)
<pre>
	socket.emit 			[ Which sends an event to a specific client ] <br>
	io.emit 			[ Which sends an event to every connected client ] <br>
	socket.broadcast.emit 		[ Which sends an event to every connected client except for that client ] <br>
</pre>
<hr>
		
## setup emitting messages for rooms
<pre>
	[ "to" is indeed a function, we have pass the string name of the room ]

	io.to().emit 			[ Which sends an event to everybody in a specific room ] <br>
	socket.broadcast.to().emit 	[ Which sends an event to everybody in a specific room except for that client ] <br>
</pre>
