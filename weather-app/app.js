 const request = require('request')
 const geocode = require('./utils/geocode')
 const forecast = require('./utils/forecast')

 console.log(process.argv);

 const address = process.argv[2]

 if(!address) {
   console.log("Please provide an address");
 } else {
  geocode(process.argv[2] , (error, { latitude, longitude, location } = {}) => {
    if(error) {
      console.log("Error : ", error);
    } else {
      console.log("Location :   ", location, latitude, longitude);
      forecast(latitude, longitude, (error, { summary } = {}) => {
        if(error) {
          console.log("Error : ", error);
        } else {
          console.log("Weather : ", summary);
        }
      })
    }
  })
 }