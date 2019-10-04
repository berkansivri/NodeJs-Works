const getWeather = (address) => {
  return fetch(`/weather?address=${address}`).then((response) => {
    return response.json().then((data) => {
      if (data.error) {
        console.error(data.error)
      } else {
        console.log(data);
      }
      return data
    })
  })
}

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-one')
const messageTwo = document.querySelector('#message-two')

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const location = search.value
  getWeather(location).then((data) => {
    if (data.error) {
      messageOne.textContent = data.error
    } else {
      messageOne.textContent = data.location
      messageTwo.textContent = data.forecast
    }
  })
})