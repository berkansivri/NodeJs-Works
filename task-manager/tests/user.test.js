const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

afterAll(async () => {
  await mongoose.disconnect()
})

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Berkan',
    email: 'berkan@test.com',
    password: 'testpass111'
  }).expect(201)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: {
      name: 'Berkan',
      email: 'berkan@test.com'
    },
    token: user.tokens[0].token
  })

  expect(user.password).not.toBe('testpass111')
})

test('should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(response.body.user._id)
  expect(user.tokens[1].token).toBe(response.body.token)
})

test('should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: "nonexistentpass"
  }).expect(400)
})

test('should get profile for user', async () => {
  await request(app).get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me')
    .send()
    .expect(401)
})

test('should delete account for user', async () => {
  await request(app).delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('should not delete account for unauthenticated user', async () => {
  await request(app).delete('/users/me')
    .send()
    .expect(401)
})

test('should upload avatar image', async () => {
  await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
  const updateObject = {
    name: "updatedName"
  }
  await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send(updateObject)
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toEqual('updatedName')
})

test('should not update invalid user fields', async () => {
  await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Istanbul"
    })
    .expect(400)
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated
