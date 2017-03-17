const mongoose = require( 'mongoose')
const bookTypeSchema = require('../schema/bookType')

const Type = mongoose.model('Books', bookTypeSchema)

module.exports = Type
