const mongoose = require('mongoose')

let outUserSchema = new mongoose.Schema({
  name: String
})
module.exports = outUserSchema
