const mongoose = require( 'mongoose')
const bookSchema = require('../schema/books')

const Books = mongoose.model('books', bookSchema)
module.exports = Books
