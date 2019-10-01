const notes = require('./notes')
const yargs = require('yargs')
const chalk = require('chalk')

yargs.version("1.1.0")

yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string'
    }
  },
  handler({title, body}) {
    notes.addNote(title, body)
  } 
})

yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    title: { 
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    }
  },
  handler({ title }) {
    notes.removeNote(title)
  }
})

yargs.command({
  command: 'list',
  describe: 'List notes',
  handler() {
    notes.listNotes()
  }
})

yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    }
  },
  handler({ title }) {
    notes.readNote(title)
  }
})

yargs.parse()
