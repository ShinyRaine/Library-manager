const mongoose = require('mongoose')

let bookTypeSchema = new mongoose.Schema({
  key: String,
  name: String,
  books: {type: Array, default: []},
  son: {type: Array, default: []},
  father: {type: String, default: ''}
})
module.exports = bookTypeSchema
