// CRUD

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    console.log('Unable to connect to database!')
    return
  }

  const db = client.db(databaseName)
  db.collection('users').insertOne({
    name: 'Berkan',
    age: 25
  })
  
  console.log('Connected to database!');
})