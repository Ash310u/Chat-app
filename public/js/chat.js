const socket = io()

// Elements

const $messageForm = document.querySelector('#msg-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

// Options
// Using qs.min.js library for parse the query string.  // For ignoring the "?" prefix by setting "ignoreQueryPrefix: true"
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// receiving the event that the server is sending to client.
socket.on('message', (msg) => {
    console.log(msg);

    // Rendering the data to the template.     // Providing data for the template as the second argument to render.
    const html = Mustache.render(messageTemplate, {
        msg: msg.text,
        // using moment js library
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (msg) => {
    console.log(msg);

    const html = Mustache.render(locationTemplate, {
        url: msg.url,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Disabled until message is sent, for next msg to be send
    $messageFormButton.setAttribute('disabled', 'disabled')

    // Target represents the target that I'm listening for the event on and in this case that's form('#msg-form')
    // (e.target.elements.message) = that "message" input.
    const MSG = $messageFormInput.value
    // Last argument on emit a callback function for acknowledgement.
    socket.emit('sendMessage', MSG, (error) => {

        // Waiting for message to be sent
        $messageFormButton.removeAttribute('disabled')

        // Clearing input after sending message
        $messageFormInput.value = ''

        // focus back the input
        $messageFormInput.focus()

        if (error) {
            return console.log(error);
        }

        console.log('Message delivered!');
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!');
        })
    })
})

// For rooms
socket.emit('join', { username, room })