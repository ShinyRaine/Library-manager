const mongoose = require( 'mongoose')

const userSchema = require('../schema/user')
const User = mongoose.model('User', userSchema)
module.exports = User
