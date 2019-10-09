const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if(!task) return res.status(404).send("Task not found by id:" + req.params.id)
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const availableFields = ['description', 'completed']
  if(!Object.keys(req.body).every(x=> availableFields.includes(x))) {
    return res.status(400).send("Invalid update fields")
  }
  
  try {
    // const task = await Task.findByIdAndUpdate(req .params.id, req.body, { new: true, runValidators: true })
    const task = await Task.findById(req.params.id)
    availableFields.forEach(update => task[update] = req.body[update])
    await task.save()

    if(!task) return res.status(404).send()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if(!task) return res.status(404).send()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
