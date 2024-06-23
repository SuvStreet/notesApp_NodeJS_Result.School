const chalk = require('chalk')
const Note = require('./models/Note')

async function addNote(title) {
  await Note.create({ title })

  console.log(chalk.bgGreen('Заметка была добавлена!'))
}

async function getNotes() {
  const notes = await Note.find()
  return notes
}

async function removeNote(id) {
  await Note.deleteOne({ _id: id })
  console.log(chalk.bgRed(`Заметка под номером ${id} была успешно удалена!`))
}

async function editNote(noteData) {
  await Note.updateOne({ _id: noteData.id }, { title: noteData.title })

  console.log(chalk.bgBlue(`Заметка под номером ${noteData.id} была успешно изменена!`))
}

module.exports = {
  addNote,
  getNotes,
  removeNote,
  editNote,
}
