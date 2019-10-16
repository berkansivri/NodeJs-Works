const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOne, setupDatabase, userTwo, taskOne } = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create task for user', async () => {
  const response = await request(app).post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test'
    })
    .expect(201)
  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task).toMatchObject({
    description: 'From my test',
    completed: false
  })
})

test('should get user tasks', async () => {
  const response = await request(app).get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    
  expect(response.body).toHaveLength(2)
})

test('should not delete other users tasks', async () => {
  await request(app).delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

  const task = Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks