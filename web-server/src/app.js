const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//setup handlebars engine and views and partials folder
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))
//setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Berkan Sivri'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Page',
    name: 'Berkan Sivri'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help Page',
    helpText: 'sample text',
    name: 'Berkan Sivri'
  })
})

app.get('/weather', (req, res) => {
  if(!req.query.address){
    return res.send({
      error: 'you must provide an address'
    })
  }
  
  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
      if(error) {
        return res.send({ error })
      }
    forecast(latitude, longitude, (error, { summary, temperature } = {}) => {
      if(error) {
        return res.send({ error })
      }

      res.send({
        forecast: summary + " " + temperature,
        location,
        address: req.query.address
      })
    })
  })

})

app.get('/products', (req, res) => {
  if(!req.query.search) {
     return res.send({
       error: 'you must provide a search term'
     })
  }
  console.log(req.query);
  res.send({
    products: [],
  })
})

app.get('/help/*', (req, res) => {
  res.render('notfound', {
    title: "404",
    message: 'Help article not found',
    name: 'Berkan Sivri'
  })
})

app.get('*', (req, res) => {
  res.render('notfound', {
    title: "404",
    message: '404! Not Found',
    name: 'Berkan Sivri'
  })
})

app.listen(port, () => {
  console.log("Server is up on port " +  port);
})
