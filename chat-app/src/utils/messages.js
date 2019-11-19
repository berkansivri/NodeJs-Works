const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime()
  }
}

const generateLocationMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime()
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage
}