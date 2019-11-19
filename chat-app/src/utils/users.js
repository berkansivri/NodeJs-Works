const users = []

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  if (!username || !room) {
    return {
      error: 'username and room are required!'
    }
  }
  const existingUser = users.find(u => u.room === room && u.username === username)
  if (existingUser) {
    return {
      error: 'username existing in this room!'
    }
  }

  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex(u => u.id === id)
  if(index > -1) return users.splice(index, 1)[0]
}

const getUser = (id) => {
  return users.find(u => u.id === id)
}

const getUsersInRoom = (room) => {
  return users.filter(u => u.room === room)
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}