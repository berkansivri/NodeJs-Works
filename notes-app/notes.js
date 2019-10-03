const fs = require('fs')
const chalk = require('chalk')

const listNotes = () => {
  const notes = loadNotes()
  console.log(chalk.blue.inverse("your notes"))
  notes.forEach(n => console.log(n.title))
}

const addNote = (title, body) => {
  const notes = loadNotes()
  if(!notes.some(n => n.title === title)) {
    notes.push({ title, body })
    saveNotes(notes)
    console.log(chalk.green.inverse("new note added"))
  } else {
    console.log(chalk.red.inverse("note title taken"))
  }
}
 
const removeNote = (title) => {
  const notes = loadNotes()
  const newNotes = notes.filter(n => n.title !== title)
  if(notes.length > newNotes.length) {
    saveNotes(newNotes)
    console.log(chalk.green.inverse("note removed"))
  } else {
    console.log(chalk.red.inverse("note not found"))
  }
}

const readNote = (title) => {
  const notes = loadNotes()
  debugger
  const note = notes.find(n => n.title === title)
  if(note) {
    console.log(chalk.blue.inverse(note.title))
    console.log(note.body)
  } else {
    console.log(chalk.red.inverse("note not found"))
  }
}


const loadNotes = () => {
  try {
    return JSON.parse(fs.readFileSync("notes.json").toString())
  } catch (error) {
     return []
  }
}

const saveNotes = (notes) => {
  const data = JSON.stringify(notes)
  fs.writeFileSync("notes.json", data)
}

module.exports = {
  addNote,
  removeNote,
  listNotes,
  readNote
}