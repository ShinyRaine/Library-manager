const mongoose = require( 'mongoose')

const outUserSchema = require('../schema/outUserSchema')
const OutUser = mongoose.model('OutUser', outUserSchema)
module.exports = OutUser
