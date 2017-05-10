const mongoose = require( 'mongoose')
const bookSchema = require('../schema/book')
const Book = mongoose.model('Book', bookSchema)

module.exports = Book
