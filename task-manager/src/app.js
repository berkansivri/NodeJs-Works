const express = require('express')
require('./db/mongoose') //file runs and connect database
const userRouter = require('./routers/user') 
const taskRouter = require('./routers/task') 

const app = express()
 
//automaticly parse to json request bodies
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app
