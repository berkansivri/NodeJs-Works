const socket = io()
// Elements
const $messageForm = document.querySelector('#frmMessage')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector("#send-location")
const $messages = document.querySelector('#messages')
const $sideBar = document.querySelector('#sidebar')
// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
  const $newMessage = $messages.lastElementChild
  
  // height of new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // visible height
  const visibleHeight = $messages.offsetHeight

  // height of messages container
  const containerHeight = $messages.scrollHeight

  // how far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = containerHeight
  }
}

socket.on('locationMessage', (message) => {
  const html = Mustache.render(urlTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML("beforeend", html)
  autoscroll()
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  $sideBar.innerHTML = html
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