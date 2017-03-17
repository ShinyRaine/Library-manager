const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  name: String,
  password: String,
  manage: Number, // 权限：普通用户 0 管理员 1
  books: Array
})
bookSchema.statics = {
  findBooks: function(id, cb) {
    return this.books
  }
}
module.exports = userSchema
