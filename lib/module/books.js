const mongoose = require( 'mongoose')
const bookSchema = require('../schema/books')

const Books = mongoose.model('Books', bookSchema)

module.exports = Books
