const socket = io()

// receiving the event that the server is sending to client
socket.on('countUpdated', (count) => {

    console.log('The count has been updated!', count);
})