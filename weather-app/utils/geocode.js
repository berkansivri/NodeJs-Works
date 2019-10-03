const request = require('request')

const geocode = (address, callback) => {
  const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiYmVya2Fuc2l2cmkiLCJhIjoiY2sxOTlkOTFqMTA5ajNibXJ3NGppZ3pkayJ9.CyW2gFgpppFTTIl6PyqGuA&limit=1`

  request({ url: geocodeURL, json: true }, (error, response, body) => {

    if (error) {
      callback("Unable to connect to location service");
    } else if (body.features.length === 0) {
      callback("Unable to find location");
    } else {
      const [longitude, latitude] = body.features[0].center
      const location = body.features[0].place_name
      callback(undefined, { latitude, longitude, location })
    }
  })
 }

 module.exports = geocode