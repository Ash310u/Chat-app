const socket = io()

const $room = document.querySelector('#rooms')

const availableroomsTemplate = document.querySelector('#available-rooms').innerHTML


socket.on('roomList', ([...rooms]) => {
    // console.log([rooms]);
    const html = Mustache.render(availableroomsTemplate, {
        rooms
    })
    $room.innerHTML = html
})