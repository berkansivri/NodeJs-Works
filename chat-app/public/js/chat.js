const socket = io()

// Elements
const $messageForm = document.querySelector('#frmMessage')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector("#send-location")
const $messages = document.querySelector('#messages')

// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $urlTemplate = document.querySelector('#url-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('locationMessage', (message) => {
  const html = Mustache.render($urlTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('message', (message) => {
  const html = Mustache.render($messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML("beforeend", html)
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  $messageFormButton.setAttribute('disabled', 'disabled')
  const message = e.target.elements.message.value
  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if(error) {
      return console.log(error)
    } else {
      console.log("Message Delivered")
    }
  })
})

document.querySelector('#send-location').addEventListener('click', () => {
  if(!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  }
  
  $sendLocationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', { 
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
        $sendLocationButton.removeAttribute('disabled')
      console.log("Location shared") 
    })
  })
})

socket.emit('join', { username, room }, (error) => {
  if(error) {
    alert(error)
    location.href = '/'
  }
})