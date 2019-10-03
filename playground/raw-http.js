const https = require('https')

const url = `https://api.darksky.net/forecast/dd066071def900a39ecca2eea88478f1/40,-75`

const request = https.request(url, (response) => {
  
  let data = ''

  response.on('data', (chunk) => {
    data += chunk.toString()
  })

  response.on('end', () => {
    const body = JSON.parse(data)
    console.log(body.currently.summary);
  })

})

request.on('error', (error) => {
  console.log("Error : ", error.message);
})

request.end()