const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tasks', auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id })
    await req.user.populate('tasks').execPopulate()
    res.send(req.user.tasks)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if(!task) return res.status(404).send("Task not found by id:" + req.params.id)
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const availableFields = ['description', 'completed']
  if(!Object.keys(req.body).every(x=> availableFields.includes(x))) {
    return res.status(400).send("Invalid update fields")
  }
  
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if(!task) return res.status(404).send()
    
    availableFields.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id  })
    if(!task) return res.status(404).send()
    res.send(task)  
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
