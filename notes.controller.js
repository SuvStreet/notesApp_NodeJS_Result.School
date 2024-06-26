const fs = require('fs/promises')
const path = require('path')
const chalk = require('chalk')

const notesPath = path.join(__dirname, 'db.json')

async function addNote(title) {
  // const notes = require('./db.json')
  // const notes = Buffer.from(buffer).toString('utf-8')

  const notes = await getNotes()

  const note = {
    title,
    id: Date.now().toString(),
  }

  notes.push(note)

  await fs.writeFile(notesPath, JSON.stringify(notes))
  console.log(chalk.bgGreen('Заметка была добавлена!'))
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: 'utf-8' })
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : []
}

async function printNotes() {
  const notes = await getNotes()

  console.log(chalk.bgBlue('Ваши заметки:'))
  notes.forEach(({id, title}) => {
    console.log('id:', chalk.yellow(id), 'title:', chalk.blue(title))
  })
}

async function removeNote(id) {
  const notes = await getNotes()

  const newNotesList = notes.filter((note) => note.id !== id)
  await fs.writeFile(notesPath, JSON.stringify(newNotesList))
  console.log(chalk.bgRed(`Заметка под номером ${id} была удалена!`))
}

async function editNote(id, title) {
  const notes = await getNotes()
  const note = notes.find((note) => note.id === id)
  note.title = title
  await fs.writeFile(notesPath, JSON.stringify(notes))
  console.log(chalk.bgYellow(`Заметка под номером ${id} была изменена!`))
}

module.exports = {
  addNote,
  printNotes,
  removeNote,
  editNote,
}
