const mongoose = require( 'mongoose')
const bookTypeSchema = require('../schema/bookType')

const Type = mongoose.model('Type', bookTypeSchema)

module.exports = Type
