const socket = io()

socket.on('message', (msg) => {
    console.log(msg);
})

document.querySelector('#msg-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const MSG = document.querySelector('input').value
    socket.emit('sendMessage', MSG)
})


// // receiving the event that the server is sending to client
// socket.on('countUpdated', (count) => {

//     console.log('The count has been updated!', count);
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked');
//     socket.emit('increment')
// })