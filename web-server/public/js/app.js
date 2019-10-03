console.log("started");

fetch('http://localhost:3000/weather?address=istanbul').then((response) => {
  response.json().then((data) => {
    if(data.error) {
      console.error(data.error);
    } else {
      console.log(data);
    }
  })
})
