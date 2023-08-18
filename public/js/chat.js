const socket = io()

// receiving the event that the server is sending to client.
socket.on('message', (msg) => {
    console.log(msg);
})

document.querySelector('#msg-form').addEventListener('submit', (e) => {
    e.preventDefault()

    // Target represents the target that I'm listening for the event on and in this case that's form('#msg-form')
    // (e.target.elements.message) = that "message" input.
    const MSG = e.target.elements.message.value
    
    socket.emit('sendMessage', MSG)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        })
    })
})