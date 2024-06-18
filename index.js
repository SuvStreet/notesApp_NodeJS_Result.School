const yargs = require('yargs')
const pkg = require('./package.json')
const { addNote, printNotes, removeNote } = require('./notes.controller')

yargs.version(pkg.version)

yargs.command({
  command: 'add',
  describe: 'Добавить новую заметку',
  builder: {
    title: {
      type: 'string',
      describe: 'Заголовок заметки',
      demandOption: true,
    },
  },
  handler({ title }) {
    addNote(title)
  },
})

yargs.command({
  command: 'list',
  describe: 'Показать все заметки',
  handler() {
    printNotes()
  },
})

yargs.command({
  command: 'remove',
  describe: 'Удалить заметку',
  builder: {
    id: {
      type: 'string',
      describe: 'Идентификатор заметки',
      demandOption: true,
    },
  },
  handler({ id }) {
    removeNote(id)
  },
})

yargs.parse()
