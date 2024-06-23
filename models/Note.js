const mongoose = require('mongoose')

const NotesSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  }
})

const Note = mongoose.model('Note', NotesSchema)

module.exports = Note
