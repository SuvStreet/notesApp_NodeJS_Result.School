const chalk = require('chalk')
const Note = require('./models/Note')

async function addNote(title, owner) {
  await Note.create({ title, owner })

  console.log(chalk.bgGreen('Заметка была добавлена!'))
}

async function getNotes() {
  const notes = await Note.find()
  return notes
}

async function removeNote(id, owner) {
  const result = await Note.deleteOne({ _id: id, owner })

  if(result.matchedCount === 0) {
    console.log(chalk.bgRed('Заметка не была удалена!'))
    throw new Error('Заметка не была удалена!')
  }

  console.log(chalk.bgRed(`Заметка под номером ${id} была успешно удалена!`))
}

async function editNote(noteData, owner) {
  const result = await Note.updateOne({ _id: noteData.id, owner }, { title: noteData.title })

  if(result.matchedCount === 0) {
    console.log(chalk.bgRed('Заметка не была изменена!'))
    throw new Error('Заметка не была изменена!')
  }

  console.log(chalk.bgBlue(`Заметка под номером ${noteData.id} была успешно изменена!`))
}

module.exports = {
  addNote,
  getNotes,
  removeNote,
  editNote,
}
