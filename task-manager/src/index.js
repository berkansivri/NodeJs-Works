const express = require('express')
require('./db/mongoose') //file runs and connect database
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000
  
//automaticly parse to json request bodies
app.use(express.json())

app.post('/users', (req, res) => {
  const user = new User(req.body)
  user.save().then(() => {
    res.status(201).send(user)
  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.get('/users', (req, res) => {
  User.find({}).then((users) => {
    res.send(users)
  }).catch((e) => {
    res.status(500).send(e)
  })
})

app.get('/users/:id', (req, res) => {
  User.findById(req.params.id).then((user) => {
    if(!user) res.status(404).send("User not found by id:" + req.params.id)
    res.send(user)
  }).catch((e) => {
    res.status(500).send(e)
  })
})

app.post('/tasks', (req, res) => {
  const task = new Task(req.body)
  task.save().then(() => {
    res.status(201).send(task)
  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.get('/tasks', (req, res) => {
  Task.find({}).then((tasks) => {
    res.send(tasks)
  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.get('/tasks/:id', (req, res) => {
  Task.findById(req.params.id).then((task) => {
    console.log(task);
    if(!task) res.status(404).send("Task not found by id:" + req.params.id)
    res.send(task)
  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.listen(port, () => {
  console.log("Server is up! :", port);
})
