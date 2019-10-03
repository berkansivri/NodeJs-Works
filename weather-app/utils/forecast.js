const request = require('request')

const forecast = (lat, long, callback) => {
    const url = `https://api.darksky.net/forecast/dd066071def900a39ecca2eea88478f1/${lat},${long}`

  request({ url, json: true }, (error, response, body) => {
    if (error) {
      callback("Unable to connect to weather service");
    } else if (body.error) {
      callback(body.error);
    } else {
      const summary = body.daily.data[0].summary
      callback(undefined, { summary });
    }
  })
}

module.exports = forecast