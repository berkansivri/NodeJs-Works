const express = require('express')
require('./db/mongoose') //file runs and connect database
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000
  
//automaticly parse to json request bodies
app.use(express.json())

app.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch (error) {
      res.status(400).send(error)
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if(!user) res.status(404).send()
    else res.send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if(!task) res.status(404).send("Task not found by id:" + req.params.id)
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.listen(port, () => {
  console.log("Server is up! :", port);
})
