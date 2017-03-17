const mongoose = require('mongoose')

let bookTypeSchema = new mongoose.Schema({
  key: String,
  name: String,
  books: Array,
  son: Array,
  father: String
})
module.exports = bookTypeSchema
