const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  name: String,
  password: String,
  manage: {type: Number, default: 0}, // 权限：普通用户 0 管理员 1
  books: Array
})
module.exports = userSchema
